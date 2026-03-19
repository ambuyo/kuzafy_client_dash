# WD-01: WhatsApp Chatbot
> **Working Document** | Kuzafy Platform | Version: 1.0 | Status: [PLANNED]
> Part of: Kuzafy Product Structure | Related: WD-02 (Client Dashboard), WD-03 (Admin Dashboard)

---

## 1. PURPOSE & SCOPE

This document scopes the Kuzafy WhatsApp Chatbot — the customer-facing conversational layer that runs inside WhatsApp (and SMS as fallback). This is the product that end-customers of Kuzafy's SME clients interact with directly.

**This is NOT the agent inbox UI** (that lives in WD-02: Client Dashboard). This document covers:
- The bot logic, flows, and NLP engine
- The infrastructure connecting Meta (WhatsApp Business API) and Twilio (SMS fallback)
- The message templates, auto-replies, and conversation state machine
- The M-Pesa payment trigger layer embedded in chat

**Users of this system:**
- **Primary:** Customers of Kuzafy's SME clients (e.g., Grace's boutique customers)
- **Secondary:** Kuzafy's SME clients themselves (when they message their own bot to test/manage)

---

## 2. CHANNEL INFRASTRUCTURE

### 2.1 WhatsApp — Meta Cloud API Direct (Primary Channel)

**Decision: Meta Cloud API direct — no BSP.**

We integrate directly with Meta Cloud API. No Business Solution Provider (BSP) middleman. This means:
- No BSP markup on messaging costs (clients pay Meta rates directly)
- Full control over webhook routing, token management, and rate limits
- We become the Tech Provider — Kuzafy manages the WABA layer for all clients

| Property | Detail |
|----------|--------|
| Integration | **Meta Cloud API (direct)** — `graph.facebook.com/v19.0` |
| Auth | System User Token per client WABA (stored encrypted in secrets manager) |
| Webhook | Single Kuzafy webhook endpoint — routes by `phone_number_id` to correct client |
| Message Window | 24-hour user-initiated window (service conversations now free per Meta Nov 2024) |
| Template Types | Marketing, Utility, Authentication |
| Media Support | Images, PDFs, audio, video — stored in **AWS S3** |
| Rate Limits | Per WABA: 1,000 msgs/sec at Tier 1, scales with quality rating |

**Multi-Tenancy Architecture — Shared App, Per-Client WABA:**

Kuzafy registers as a **Meta Tech Provider** with a single Meta App. Each client gets their own:
- WhatsApp Business Account (WABA)
- Phone Number ID (new Kenyan number provisioned for them)
- System User Token (scoped to their WABA only)

All webhooks flow to one Kuzafy endpoint, routed internally by `phone_number_id`:

```
Meta Cloud API
    │
    ▼ (all webhooks → one URL)
POST /webhooks/whatsapp
    │
    ├─ Extract: phone_number_id from payload
    ├─ Lookup: business_id from phone_number_id map (Redis cache)
    └─ Route: to correct client's conversation handler
```

**Client Onboarding via Embedded Signup:**
Clients connect their WABA inside the Kuzafy dashboard using Meta's Embedded Signup flow — no external Meta portal required:
1. Client clicks "Connect WhatsApp" in Kuzafy Client Dashboard
2. Meta OAuth popup opens (embedded in Kuzafy UI)
3. Client creates/selects Meta Business Portfolio
4. Kuzafy provisions a new Kenyan phone number for them (see §2.4)
5. WABA and Phone Number ID stored in Kuzafy DB
6. System User Token generated and stored encrypted in AWS Secrets Manager
7. Client is live

**Kuzafy Meta App Setup (one-time):**
- [ ] Register Kuzafy as Meta Tech Provider
- [ ] Create Meta App (Business type) with WhatsApp product
- [ ] Configure Embedded Signup with Kuzafy's `solution_id`
- [ ] Register single webhook URL for all client WABAs
- [ ] Business verification for production access
- [ ] Submit display name policy acknowledgment

**Meta Setup Per Client (automated via Embedded Signup):**
- [ ] WABA created under Kuzafy's Tech Provider umbrella
- [ ] Phone number registered (Kenyan number — see §2.4)
- [ ] Display name submitted and approved
- [ ] Webhook subscription registered for this WABA
- [ ] Default templates submitted for approval (from Kuzafy template library)

**Webhook Events to Handle:**
```
messages          → Incoming customer message
message_status    → Delivery/read receipts (sent, delivered, read, failed)
template_status   → Template approval/rejection updates
```

### 2.2 Twilio (SMS Fallback + Secondary Channel)

| Property | Detail |
|----------|--------|
| Use Case | SMS fallback when WhatsApp unavailable; customers on feature phones |
| Integration | Twilio Programmable SMS API |
| Webhook | POST `/webhooks/sms` |
| Sender ID | Business name (where Twilio supports alphanumeric) |
| Character Limit | 160 chars = 1 SMS; auto-split for longer |
| Encoding | GSM-7 (cost-optimized) |

**Twilio Setup Checklist:**
- [ ] Twilio account configured
- [ ] Kenya phone number / short code provisioned
- [ ] Sender ID registered (alphanumeric for Kenya)
- [ ] Webhook URL set for inbound SMS
- [ ] Delivery receipt webhook configured

**Africa's Talking Note:**
> Africa's Talking remains the **preferred SMS provider for Kenya** (lower cost, better local delivery rates). Twilio is the fallback. The channel adapter layer abstracts both — swapping providers requires only config changes, not code changes.

### 2.4 Phone Number Provisioning Per Client

**Decision: Kuzafy provisions a new Kenyan number for each client.**

Every new Kuzafy client gets a fresh, dedicated Kenyan WhatsApp Business number. No number sharing, no number porting complexity at onboarding.

**Provisioning Flow:**
```
Client completes Embedded Signup
  ↓
Kuzafy system auto-provisions a Kenyan number from number pool
  (acquired in bulk from a Kenyan telco / Twilio Kenya / AT)
  ↓
Number registered on client's WABA via Meta Cloud API
  ↓
OTP verification handled automatically (Kuzafy intercepts OTP via SMS)
  ↓
Phone Number ID stored in Kuzafy DB → client is live in minutes
```

**Number Management (Admin Dashboard):**
- Pool of pre-purchased Kenyan numbers ready for instant assignment
- Each number tagged: available / assigned / suspended / decommissioned
- On client churn: number enters 90-day quarantine before returning to pool
- Number quality rating tracked per WABA (Meta's messaging limit tiers)

**Scaling Note:**
- 500 clients = 500 numbers. Budget for bulk number acquisition in advance.
- Meta limits: each WABA starts at Tier 1 (1,000 msgs/day). Quality rating upgrades tiers automatically.
- Maintain a buffer of 20% spare numbers in pool at all times.

### 2.3 Channel Adapter Layer

All channels normalize to a single internal message format before hitting the bot engine:

```typescript
interface InternalMessage {
  id: string;                          // Internal message ID
  externalId: string;                  // WhatsApp/SMS message ID
  channel: 'whatsapp' | 'sms' | 'web';
  direction: 'inbound' | 'outbound';
  contactPhone: string;                // E.164 format: +254XXXXXXXXX
  businessId: string;                  // Kuzafy client ID
  content: {
    type: 'text' | 'image' | 'audio' | 'document' | 'button_reply' | 'list_reply';
    text?: string;
    mediaUrl?: string;
    buttonPayload?: string;
  };
  timestamp: string;                   // UTC ISO 8601
  metadata: Record<string, unknown>;   // Channel-specific extras
}
```

**Adapter Responsibilities:**
- Parse channel-specific webhook payload → `InternalMessage`
- Format `InternalMessage` → channel-specific outbound payload
- Handle media upload/download per channel
- Track delivery status per channel
- Implement retry logic for failed sends

---

## 3. CONVERSATION STATE MACHINE

Every conversation has a **session** (Redis, 30-min TTL) and a **state**. The bot always knows where a customer is in a flow.

### 3.1 Top-Level States

```
IDLE                → No active session
GREETING            → Welcome message sent, awaiting intent
BROWSING            → Customer exploring catalog/services
QUOTING             → Quote being built or sent
AWAITING_PAYMENT    → Invoice sent, payment pending
BOOKING             → Appointment flow in progress
TRACKING            → Order status lookup
SUPPORT             → Escalated to human agent
OPT_OUT             → Customer has unsubscribed
```

### 3.2 Session Object (Redis)

```typescript
interface ConversationSession {
  sessionId: string;
  contactPhone: string;
  businessId: string;
  channel: string;
  state: ConversationState;
  language: 'en' | 'sw';
  collectedData: {
    name?: string;
    email?: string;
    serviceSelected?: string;
    staffSelected?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    cartItems?: CartItem[];
    quoteId?: string;
    invoiceId?: string;
  };
  lastActivity: string;               // UTC timestamp
  agentId?: string;                   // Set when agent takes over
  isAgentActive: boolean;
  messageHistory: MessageSummary[];   // Last 10 messages for context
  createdAt: string;
}
```

### 3.3 State Transition Rules

```
IDLE → GREETING           : Any inbound message on new/expired session
GREETING → BROWSING       : Customer selects "Browse products"
GREETING → QUOTING        : Customer selects "Get a quote"
GREETING → TRACKING       : Customer selects "Track my order"
GREETING → SUPPORT        : Customer selects "Speak to agent" OR confidence < 0.7
BROWSING → QUOTING        : Customer selects a product/service
QUOTING → AWAITING_PAYMENT: Quote accepted, invoice sent
AWAITING_PAYMENT → IDLE   : Payment confirmed (M-Pesa callback received)
BOOKING → AWAITING_PAYMENT: Deposit required for appointment
ANY → SUPPORT             : Escalation keywords detected OR agent manually takes over
ANY → OPT_OUT             : STOP / UNSUBSCRIBE / CANCEL / END received
SUPPORT → ANY             : Agent marks conversation resolved
```

---

## 4. NLP ENGINE

### 4.0 NLP Strategy — Cost-Optimized

**Decision: LLM-based NLP, optimized for cost. No custom Rasa/spaCy training.**

Instead of building and hosting a custom NLP model, we use a **tiered LLM-as-NLP** approach. This eliminates the cost of training infrastructure, Swahili corpus sourcing, and model maintenance — while delivering better language understanding out of the box.

**Tiered Processing Model:**

```
Inbound Message
    │
    ├─ Step 1: Keyword/Regex Pre-filter (FREE, < 1ms)
    │   Match: STOP, START, TRACK, CONFIRM, CANCEL, RESCHEDULE
    │   Match: Order numbers (ORD-XXXXX), Invoice numbers (INV-XXXXX)
    │   → If matched: handle directly, skip LLM
    │
    ├─ Step 2: LLM Intent Classification (PAID, called only if Step 1 fails)
    │   Model: Gemini 2.0 Flash (cheapest capable model for multilingual)
    │   Input: last 3 messages + system prompt (intent list + business context)
    │   Output: { intent, entities, language, confidence }
    │   Cost: ~$0.075 per 1M input tokens (Gemini Flash pricing)
    │
    └─ Step 3: Response Generation (PAID, only for open-ended messages)
        Model: Gemini 2.0 Flash or Claude Haiku (whichever cheaper at time)
        Used for: FAQ answers, product descriptions, custom responses
        Caching: Prompt caching for static system prompts (save ~70%)
```

**Why Gemini Flash over GPT-4o-mini or Claude Haiku for this:**
- Gemini 2.0 Flash achieves 250+ tokens per second with 0.25-second time-to-first-token — critical for chat responsiveness
- Gemini Flash pricing at $0.075/1M input tokens is the most cost-efficient for high-volume classification
- Gemini 3 supports 140+ languages natively — best Swahili coverage of any frontier model
- Fallback: Claude Haiku as backup (better instruction following if Gemini misclassifies)

**Cost Estimate at Scale:**
```
500 clients × avg 50 conversations/day × 30% need LLM (rest caught by regex)
= 7,500 LLM calls/day
= ~2,250,000 LLM calls/month
At ~200 tokens avg input = 450M tokens/month
At $0.075/1M = ~$34/month for NLP at 500 clients
```
This is negligible. Cache static system prompts to cut this further by ~60%.

### 4.1 Intent Classification (Same as before — now LLM-powered)

**System Prompt for Intent Detection:**
```
You are a Kenyan business assistant for {business_name}.
Classify this message into ONE intent. Respond ONLY with JSON.

Intents: greeting | price_request | order_inquiry | booking_request | 
         payment_issue | product_question | complaint | opt_out | unknown

Also extract: entities (order_number, date, time, amount, product_name)
Also detect: language (en | sw | sheng | mixed)

Message: "{customer_message}"
Previous context: "{last_2_messages}"

Respond: {"intent": "...", "confidence": 0.0-1.0, "entities": {}, "language": "..."}
```

| Intent | Example Triggers (EN) | Example Triggers (SW) | Auto-Response? |
|--------|----------------------|----------------------|----------------|
| `greeting` | "Hi", "Hello", "Good morning" | "Habari", "Mambo", "Sasa" | ✅ Yes |
| `price_request` | "How much?", "What's the price?" | "Bei gani?", "Nataka bei" | ✅ Yes |
| `order_inquiry` | "Where is my order?", "Track my package" | "Oda yangu iko wapi?" | ✅ Yes |
| `booking_request` | "I want to book", "Schedule appointment" | "Nataka miadi", "Book" | ✅ Yes |
| `payment_issue` | "Payment failed", "I can't pay" | "Malipo hayafanyi kazi" | ✅ Partial |
| `product_question` | "Do you have X in stock?" | "Mna X?" | ✅ Yes |
| `complaint` | "I'm angry", "This is wrong", "Refund" | "Nataka kurudishiwa pesa" | ❌ → Agent |
| `opt_out` | "Stop", "Unsubscribe" | "Acha", "Simama" | ✅ Immediate |
| `unknown` | Anything below 0.7 confidence | — | ❌ → Agent |

### 4.2 Entity Extraction

| Entity | Example | Extraction Method |
|--------|---------|------------------|
| `order_number` | "ORD-12345", "my order 12345" | Regex first, LLM fallback |
| `date` | "tomorrow", "next Monday", "15th Feb" | LLM (handles Swahili dates naturally) |
| `time` | "2pm", "3:30", "morning", "asubuhi" | LLM |
| `amount` | "5000 shillings", "KES 10,000", "elfu tano" | Regex + LLM |
| `phone_number` | "0712 345 678" | Regex → E.164 normalize |
| `product_name` | From business catalog | Fuzzy match against catalog |

### 4.3 Sheng — The Real Picture

**Research finding: No existing LLM natively supports Sheng well.**

Grok attempts to translate Sheng but the results are often unintentionally hilarious and sometimes painfully wrong — it matches Sheng to the closest supported language in its catalogue, losing cultural nuance entirely.

Microsoft Research Africa is currently evaluating leading LLMs including OpenAI's GPT series, Meta's LLMs, Mistral AI, and Google, using a WhatsApp dataset with multilingual conversations in English, Swahili, Sheng and code-mixing among young people in Nairobi — but this research is ongoing.

**What this means for Kuzafy:**

Sheng is not a stable language — it features rapid lexical evolution to maintain exclusivity, with new variants like Shembeteng emerging from specific Nairobi neighbourhoods and spreading via social media. No LLM can be "trained on Sheng" in a durable way because the vocabulary changes faster than training cycles.

**Our approach — Sheng Pragmatism:**

```
Sheng message arrives
    │
    ├─ Regex catches known Sheng commerce keywords
    │  (slay, pesa, bei, mtu, fiti, poa, sawa, mambo, etc.)
    │  → classify as likely Swahili-adjacent, respond in Swahili
    │
    ├─ If Gemini Flash detects code-switching with high confidence
    │  → respond in the dominant language (usually SW or EN)
    │
    └─ If genuinely ambiguous (confidence < 0.7)
       → escalate to human agent
       → agent response trains our Sheng keyword list over time
```

**Sheng Keyword Library (living document — update continuously):**
- Commerce: bei (price), pesa (money), nunua (buy), uza (sell), delivery, fasta (fast)
- Affirmation: sawa, poa, fiti, safi, mzuri, niko
- Negation: hapana, bado, si hivyo, mbaya
- Greetings: mambo, vipi, sema, niaje, wazee
- [TODO] — Crowdsource from pilot SME conversations, update monthly

**Bottom Line on Grok:**
Grok does not support Sheng. As of March 2026, xAI's Grok handles English and some Swahili but fails on Sheng specifically. Do not rely on Grok for Swahili/Sheng NLP.

### 4.4 Language Detection & Switching

- Gemini Flash handles language detection natively — no separate library needed
- Store language preference per contact after first detection
- All critical response templates available in EN + SW
- Sheng: respond in Swahili (closest formal equivalent)
- Currency always: `KES` regardless of language

### 4.5 Confidence Thresholds

```
>= 0.85  → Auto-respond
0.70–0.84 → Auto-respond + flag for review in Admin Dashboard
< 0.70   → "Naomba uniruhusu nikuunganishe na mtu wetu... " → escalate to agent
```

---

## 5. CONVERSATION FLOWS

### 5.1 Flow 1: Inbound Lead Capture (Universal Entry)

```
Customer sends any message
  ↓
[Check: existing contact?]
  ├─ YES → Load contact, restore language pref, skip name collection
  └─ NO  → Create contact record, trigger welcome flow

[Send Welcome Template]
  "Hello! 👋 Welcome to {business_name}.
   What can I help you with today?
   1️⃣ Browse products/services
   2️⃣ Get a quote
   3️⃣ Track my order
   4️⃣ Speak with an agent"

[Customer selects option → route to appropriate flow]
[No response in 2 hours → send gentle nudge once]
[No response in 24 hours → close session, tag #cold_lead]
```

### 5.2 Flow 2: Quote & Payment

```
[Quote Request Received]
  ↓
[Agent notified OR auto-quote if catalog configured]
  ↓
[Send Quote Message with Accept/Reject/Questions buttons]
  ↓
ACCEPT → Generate invoice → Send with [PAY KES X] button
          → Trigger M-Pesa STK Push
          → Await Daraja callback
          → On success: mark paid, send receipt, update CRM
          → On failure: see M-Pesa error handling (WD-01 §6)

REJECT / REQUEST CHANGES → Notify agent → Agent sends revised quote

QUESTIONS → Route to agent
```

### 5.3 Flow 3: Appointment Booking

```
[Booking intent detected]
  ↓
[Show service menu] → [Customer selects service]
  ↓
[Show staff options (if configured)] → [Customer selects]
  ↓
[Show available dates] → [Customer selects date]
  ↓
[Show available time slots] → [Customer selects time]
  ↓
[Confirm booking details] → [Send confirmation with APT-XXXXX code]
  ↓
[Reminder at T-24h] → Customer replies CONFIRM / RESCHEDULE / CANCEL
[Reminder at T-2h]
[Post-visit at T+2h] → Feedback request (1–5 stars)
```

### 5.4 Flow 4: Order Tracking

```
[Tracking intent detected]
  ↓
"Please share your order number (e.g. ORD-12345)
 or the phone number used to place the order."
  ↓
[Look up order] → [Send status update with timeline]
  ↓
[If order delayed/issue detected] → Auto-escalate to agent
[If customer uses complaint keywords] → Immediate agent escalation
```

### 5.5 Flow 5: Agent Handover

```
[Escalation triggered]
  ↓
"Connecting you to a team member... ⏳
 Your chat history has been shared with {agent_name}.
 Expected wait: < 5 minutes."
  ↓
[Agent receives full session context in Client Dashboard]
[Agent can see: contact info, conversation history, order/invoice details, flagged keywords]
  ↓
[Agent resolves → marks conversation complete]
[Bot resumes automated responses for future messages]
```

---

## 6. M-PESA INTEGRATION IN CHAT

### 6.1 Payment Trigger Flow

```
Invoice sent via WhatsApp
  ↓
Customer taps [PAY KES {amount}]
  ↓
POST /api/payments/mpesa/stk-push
  Body: { invoiceId, contactPhone, amount, businessShortcode }
  ↓
Daraja API: /mpesa/stkpush/v1/processrequest
  ↓
Customer receives PIN prompt on their phone
  ↓
[TIMEOUT: 60 seconds]
  ├─ Customer enters PIN → Daraja callback to /webhooks/mpesa
  └─ No response → Send reminder: "Complete your M-Pesa payment: [RETRY]"

On callback received:
  ↓
Validate: checksum, IP whitelist, duplicate receipt check
  ↓
Match to invoice (exact → fuzzy → manual queue)
  ↓
Send receipt via WhatsApp (< 30 seconds)
Update invoice, CRM, dashboard
```

### 6.2 M-Pesa Error Responses in Chat

| Error Code | Customer Message | Agent Action |
|------------|-----------------|--------------|
| 1032 (cancelled) | "Looks like the payment was cancelled. Tap [RETRY] when ready." | None |
| 1 (insufficient funds) | "Payment couldn't go through. Please check your M-Pesa balance and try again." | None |
| 26 (system busy) | "M-Pesa is a bit busy right now. We'll retry in a moment..." | Auto-retry x2 |
| 1019 (expired) | "Your payment session expired. Here's a fresh link: [PAY KES X]" | None |
| Unknown | "Something went wrong with the payment. Our team has been notified." | Alert agent |

---

## 7. TEMPLATE LIBRARY

All templates exist in **English and Swahili**. Templates sent as business-initiated messages require Meta approval.

### 7.1 Utility Templates (Meta approval required)

| Template Name | Trigger | Variables |
|---------------|---------|-----------|
| `welcome_new_contact` | First message from new contact | `{{business_name}}` |
| `order_confirmed` | Order placed | `{{customer_name}}`, `{{order_number}}`, `{{total}}`, `{{delivery_date}}` |
| `invoice_sent` | Invoice generated | `{{customer_name}}`, `{{invoice_number}}`, `{{amount}}`, `{{due_date}}` |
| `payment_received` | M-Pesa callback success | `{{customer_name}}`, `{{amount}}`, `{{mpesa_receipt}}`, `{{invoice_number}}` |
| `appointment_confirmed` | Booking created | `{{customer_name}}`, `{{service}}`, `{{date}}`, `{{time}}`, `{{staff}}` |
| `appointment_reminder_24h` | 24h before appointment | `{{customer_name}}`, `{{service}}`, `{{date}}`, `{{time}}` |
| `payment_reminder_due` | Invoice due today | `{{customer_name}}`, `{{invoice_number}}`, `{{amount}}` |
| `payment_overdue_7d` | 7 days overdue | `{{customer_name}}`, `{{invoice_number}}`, `{{amount}}`, `{{balance}}` |
| `order_shipped` | Order dispatched | `{{customer_name}}`, `{{order_number}}`, `{{tracking_number}}`, `{{courier}}` |
| `order_delivered` | Order delivered | `{{customer_name}}`, `{{order_number}}` |

### 7.2 Marketing Templates (Meta approval required)

| Template Name | Use Case | Variables |
|---------------|----------|-----------|
| `broadcast_promotion` | General sale/offer | `{{customer_name}}`, `{{offer_details}}`, `{{expiry_date}}` |
| `reengagement_60d` | Inactive 60+ days | `{{customer_name}}`, `{{business_name}}` |
| `post_purchase_followup` | 3 days after purchase | `{{customer_name}}`, `{{product_name}}` |
| `birthday_greeting` | Customer birthday | `{{customer_name}}`, `{{offer_code}}` |

### 7.3 Template Variables Reference

```
{{customer_name}}     → Contact first name, fallback: "Valued Customer" / "Mteja Wetu"
{{business_name}}     → Kuzafy client business display name
{{invoice_number}}    → INV-YYYY-NNNNNN
{{receipt_number}}    → RCT-YYYY-NNNNNN
{{order_number}}      → ORD-YYYY-NNNNNN
{{appointment_code}}  → APT-NNNNN
{{amount}}            → KES formatted (e.g., "KES 1,500")
{{mpesa_receipt}}     → Safaricom transaction reference
{{due_date}}          → DD Month YYYY
{{date}}              → DD Month YYYY
{{time}}              → 12-hour format with AM/PM
```

---

## 8. OPT-IN / OPT-OUT

### 8.1 Opt-In Methods

| Method | Flow | Compliance |
|--------|------|------------|
| Conversational (WhatsApp) | Welcome message + reply YES | ✅ KDPA compliant |
| QR Code | Scan → pre-filled WhatsApp message → auto-confirmation | ✅ |
| Web widget checkbox | Checkbox on business website | ✅ |
| SMS keyword | Send YES to {shortcode} | ✅ |

### 8.2 Opt-Out Handling

**Trigger keywords:** STOP, UNSUBSCRIBE, CANCEL, END, ACHA, SIMAMA

**Response:**
```
"You've been unsubscribed from {business_name} marketing messages.
You'll still receive important updates like receipts and order confirmations.
To re-subscribe anytime, reply START."
```

**Rules:**
- Opt-out processed within 60 seconds
- Marketing messages stop immediately
- Transactional messages (receipts, order updates, appointment confirmations) continue
- Re-opt-in via START keyword or new opt-in flow
- All opt-out events logged with timestamp

---

## 9. ERROR HANDLING & FALLBACKS

| Scenario | Handling |
|----------|---------|
| WhatsApp API down | Queue messages in Redis, retry with exponential backoff, notify admin |
| Customer sends media when bot expects text | "Thanks for the file! To help you better, could you tell me what you need?" |
| Gibberish / unrecognised message | "I didn't quite catch that. Try: 1️⃣ Browse 2️⃣ Quote 3️⃣ Track 4️⃣ Agent" |
| Message outside business hours | Off-hours template + promise to respond, create ticket |
| All agents busy | Queue position + ETA + option to leave message |
| Customer opts out mid-flow | Immediate opt-out, cancel any pending flows, log |
| Duplicate inbound message (webhook retry) | Idempotency check on `externalId`, skip if already processed |
| Session expired mid-flow | Resume: "Welcome back! We were in the middle of {context}. Continue?" |

---

## 10. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Inbound message → bot response latency | < 2 seconds |
| WhatsApp message delivery rate | > 98% |
| SMS delivery rate (Kenya) | > 95% |
| Intent detection accuracy | > 85% |
| M-Pesa STK Push success rate | > 85% |
| Receipt delivery after payment | < 30 seconds |
| Session restore after disconnect | < 5 seconds |
| Webhook processing time | < 500ms (p95) |

---

## 11. TECH STACK (This Module)

| Component | Choice | Notes |
|-----------|--------|-------|
| Runtime | Node.js (Express) | Async webhook handling |
| WhatsApp | **Meta Cloud API (direct)** | No BSP — Kuzafy is the Tech Provider |
| SMS | Africa's Talking SDK (primary), Twilio SDK (fallback) | Abstracted via adapter |
| NLP / Intent | **Gemini 2.0 Flash** (primary), Claude Haiku (fallback) | LLM-as-NLP, cost-optimized |
| Intent Pre-filter | Regex + keyword matching | Free, catches ~70% of messages |
| Session Store | Redis | 30-min TTL, in-memory speed |
| Message Queue | Bull (Redis-backed) | Scheduled messages, retry logic |
| Media Storage | **AWS S3** | All WhatsApp media (images, PDFs, audio) |
| Secrets | AWS Secrets Manager | Per-client WABA tokens, Daraja credentials |
| Webhook Security | HTTPS + Meta signature validation + IP allowlist | Meta signs all webhook payloads |
| Template Engine | Handlebars | Variable substitution in messages |
| Number Pool | Kenyan numbers (bulk-acquired) | New number provisioned per client |

---

## 12. OPEN QUESTIONS & DECISIONS NEEDED

- [x] ~~**BSP vs Direct:** Use Meta Cloud API directly or go through a BSP?~~ **DECIDED: Direct Meta Cloud API. Kuzafy registers as Tech Provider.**
- [x] ~~**NLP Hosting:** Run Rasa as internal microservice or use a hosted NLP API?~~ **DECIDED: Gemini Flash as LLM-based NLP. No custom model training.**
- [x] ~~**Multi-tenancy:** How do we manage 500 phone numbers at scale?~~ **DECIDED: See §2.4 — shared Meta App, per-client WABA, number pool.**
- [x] ~~**Sheng Training Data:** Where do we source Sheng data?~~ **DECIDED: No LLM supports Sheng natively. Use keyword library + SW fallback.**
- [x] ~~**Media Storage:** S3 or local?~~ **DECIDED: AWS S3.**
- [x] ~~**WhatsApp Number per Client:** Connect existing or provision new?~~ **DECIDED: Kuzafy provisions a new Kenyan number for every client.**
- [ ] **Number Acquisition:** Which Kenyan telco / aggregator to bulk-acquire numbers from? (Africa's Talking, Safaricom reseller, or Twilio Kenya?)
- [ ] **Grok future:** Monitor xAI's Swahili/Sheng support roadmap. If Grok adds native Swahili, re-evaluate NLP provider stack.
- [ ] **Number quarantine period:** Is 90 days sufficient before recycling churned client numbers?
- [ ] **Meta Tech Provider registration:** How long does Meta's review process take? Start this immediately — it's on the critical path.

---

## 13. CHANGELOG

| Date | Version | Change |
|------|---------|--------|
| 2026-01-30 | 1.0 | Initial scope created |
| 2026-03-18 | 1.1 | Decisions: Meta Cloud API direct; Gemini Flash NLP (cost-optimized); Sheng research findings; AWS S3 media; per-client number provisioning; multitenancy via Embedded Signup + WABA pool |
