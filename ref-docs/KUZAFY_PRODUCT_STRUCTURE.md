# KUZAFY — Product Structure Guide for Claude Code
> **Living Document** | Version: 1.0 | Status: Discovery & Planning | Last Updated: 2026-01-30
> This document is auto-populated progressively. Each section marked `[TODO]` is a placeholder for future population.

---

## 0. HOW TO USE THIS DOCUMENT

This file is the **single source of truth** for Claude Code when building, extending, or debugging Kuzafy. Before writing any code:

1. Read the relevant section for context
2. Follow the stack decisions documented here — do not introduce new dependencies without updating this doc
3. Check `[STATUS]` tags to know what is built, in progress, or planned
4. Update `[TODO]` sections as features are scoped and built

**Status Tags Used Throughout:**
- `[BUILT]` — Implemented and tested
- `[IN PROGRESS]` — Currently being developed
- `[PLANNED]` — Scoped, not yet started
- `[TODO]` — Placeholder — needs scoping
- `[DEFERRED]` — Intentionally postponed

---

## 1. PRODUCT VISION & NORTH STAR

**One-Line:** "Shopify meets WhatsApp meets M-Pesa — built for Kenya."

**What Kuzafy Does:**
Kuzafy turns WhatsApp (and SMS) into a full business operating system for Kenyan SMEs. It combines:
- Conversational AI (auto-replies, NLP bots in English, Swahili, Sheng)
- Local Payments (M-Pesa STK Push, PayBill, reconciliation)
- Business Operations (invoicing, CRM, appointments, order tracking)
- Marketing (broadcasts, drip sequences, segmentation)

**What Kuzafy Does NOT Do (MVP Scope):**
- No USSD support (deferred)
- No native mobile app for agents (deferred — web-first)
- No AI product recommendations (deferred — rule-based first)
- No multi-currency (KES only at launch)

**Target Personas (in priority order):**
1. **Grace** — Solo digital micro-retailer (fashion/beauty). Budget: KES 2–5k/mo.
2. **David** — Small service business (3–5 staff). Budget: KES 10–20k/mo.
3. **Mercy** — Established salon/spa, multi-location. Budget: KES 25–50k/mo.
4. **James** — B2B FMCG distributor. Budget: KES 40–80k/mo.
5. **Sarah** — Cloud kitchen with delivery. Budget: KES 8–15k/mo.

---

## 2. BUSINESS MODEL

### Pricing Tiers

| Tier | Name | Target | Price | Key Features |
|------|------|--------|-------|--------------|
| 1 | **Starter** ("Grace Plan") | Solo entrepreneurs | KES 2,500/mo | Single inbox, Basic auto-replies, M-Pesa STK Push, Digital receipts |
| 2 | **Growth** ("Mercy Plan") | Small teams (2–10 staff) | KES 10,000/mo | Multi-agent inbox, Appointments, Broadcasts, CRM, Reporting |
| 3 | **Scale** ("James Plan") | Established SMEs / B2B | KES 25,000+/mo | API access, Xero integration, Advanced analytics, Dedicated AM |

### Revenue Streams
- Monthly SaaS subscriptions (primary)
- Transaction fees on card payments (Flutterwave/Stripe)
- Premium add-ons: API access, custom workflows, white-glove setup

### Key Business Metrics (12-Month Targets)
| Metric | Target | Timeline |
|--------|--------|----------|
| Active paying customers | 500 SMEs | Month 12 |
| MRR | KES 5,000,000 | Month 12 |
| CAC | < KES 15,000 | Month 6 |
| LTV | > KES 50,000 | Month 12 |
| Churn Rate | < 5% monthly | Month 9 |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT CHANNELS                      │
│  WhatsApp Business API │ SMS (Africa's Talking) │ Web   │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
        ┌───────▼─────────────────────▼───────┐
        │         CHANNEL ADAPTER LAYER        │
        │  (Normalises all messages to         │
        │   internal format, preserves         │
        │   channel metadata)                  │
        └───────────────┬─────────────────────┘
                        │
        ┌───────────────▼─────────────────────┐
        │         CORE PLATFORM ENGINE         │
        │                                      │
        │  ┌──────────┐  ┌──────────────────┐ │
        │  │  NLP /   │  │  Workflow /       │ │
        │  │  Intent  │  │  Automation       │ │
        │  │  Engine  │  │  Engine           │ │
        │  └──────────┘  └──────────────────┘ │
        │                                      │
        │  ┌──────────┐  ┌──────────────────┐ │
        │  │  Session │  │  Template         │ │
        │  │  Manager │  │  Engine           │ │
        │  └──────────┘  └──────────────────┘ │
        └───────────────┬─────────────────────┘
                        │
        ┌───────────────▼─────────────────────┐
        │           SERVICES LAYER             │
        │                                      │
        │  Payments  │  CRM  │  Invoicing  │   │
        │  (M-Pesa)  │       │  (KRA tax)  │   │
        └───────────────┬─────────────────────┘
                        │
        ┌───────────────▼─────────────────────┐
        │           DATA LAYER                 │
        │  PostgreSQL │ Redis │ Elasticsearch  │
        └─────────────────────────────────────┘
```

### 3.2 Technology Stack

> **[TODO]** — Finalize stack choices with CTO. Below are recommended defaults based on PRD.

| Layer | Recommended Choice | Notes |
|-------|-------------------|-------|
| Backend | Node.js (Express) or Python (FastAPI) | Node preferred for real-time webhook handling |
| Database | PostgreSQL (primary) | Contact records, transactions, invoices |
| Cache / Sessions | Redis | Active conversation sessions (30-min TTL) |
| Search | Elasticsearch | Fast contact/conversation search |
| Job Queue | Bull (Node) or Celery (Python) | Scheduled messages, drip sequences |
| WhatsApp BSP | Meta Cloud API or WATI | Use Africa-based BSP for lower latency |
| SMS | Africa's Talking (primary), Twilio (fallback) | Africa's Talking preferred for Kenya |
| Payments | Safaricom Daraja API v2 | M-Pesa STK Push + C2B + B2C |
| Card Payments | Flutterwave (primary), Stripe (international) | Flutterwave lower fees for African cards |
| NLP | spaCy / Rasa NLU (custom-trained) | Must train on Swahili + Kenyan English corpus |
| PDF Generation | wkhtmltopdf or Puppeteer | Invoices and receipts |
| Frontend (Dashboard) | React + Tailwind | Web-first; mobile-responsive |
| Hosting | [TODO] | Prefer hosting in Kenya/Africa region |

### 3.3 Key Integrations

| Integration | Priority | Status | Notes |
|-------------|----------|--------|-------|
| WhatsApp Business API | MUST | [TODO] | Critical path item |
| Safaricom Daraja API v2 (M-Pesa) | MUST | [TODO] | STK Push + callbacks |
| Africa's Talking (SMS) | MUST | [TODO] | SMS channel + OTP |
| KRA eTIMS (Tax compliance) | MUST | [TODO] | Invoice PIN validation |
| Xero (Accounting) | SHOULD | [TODO] | Scale tier only |
| QuickBooks | SHOULD | [TODO] | Scale tier only |
| Flutterwave (Card payments) | SHOULD | [TODO] | Growth/Scale tiers |
| Google Calendar | COULD | [TODO] | Appointment sync |
| Zapier / Make | COULD | [TODO] | Extensibility |

---

## 4. FEATURE MODULES

Each module maps to a directory in the codebase. All modules must be built mobile-first.

### 4.1 Conversational Engine [STATUS: PLANNED]

**What it does:** Routes messages from all channels into a unified inbox, understands intent, manages session context, and triggers the right automated response or escalates to a human agent.

**Critical Path Features (build these first):**
- [ ] WhatsApp Business API connection + webhook receiver
- [ ] Unified inbox (all channels, one view)
- [ ] Session management (Redis, 30-min TTL, context preservation)
- [ ] Keyword-based auto-replies (before NLP)
- [ ] Off-hours auto-reply
- [ ] Agent handover (human takeover of bot conversation)

**NLP Requirements:**
- Intent detection accuracy > 85% on test set
- Must handle: English, Swahili, and code-switching (Sheng)
- Confidence threshold: > 0.7 for auto-response; fallback to agent below that
- Key intents: `order_inquiry`, `price_request`, `booking_request`, `payment_issue`, `greeting`, `opt_out`

**Session Rules:**
- New session after 24 hours of inactivity
- Timeout after 30 minutes of inactivity (clear context)
- Full context handed to agent on escalation
- Session metrics tracked per conversation

**[TODO]** — Add conversation routing logic (rule-based vs. load-balanced)

---

### 4.2 M-Pesa Payments [STATUS: PLANNED]

> **This is the #1 differentiator.** Build this before anything else after WhatsApp connection.

**Daraja API Endpoints to Implement:**
- `/mpesa/stkpush/v1/processrequest` — Initiate STK Push
- `/mpesa/stkpushquery/v1/query` — Check transaction status
- `/mpesa/c2b/v1/registerurl` — Register callback URLs
- `/mpesa/b2c/v1/paymentrequest` — Initiate refunds

**Payment Flow (Happy Path):**
```
Customer receives invoice via WhatsApp
  → Clicks "Pay with M-Pesa" button
  → Kuzafy triggers STK Push via Daraja API
  → Customer receives M-Pesa PIN prompt on phone
  → Customer enters PIN
  → M-Pesa processes payment
  → Daraja sends callback to Kuzafy webhook
  → Kuzafy validates and reconciles payment
  → Invoice marked as "Paid"
  → Receipt sent to customer via WhatsApp (< 30 seconds)
```

**M-Pesa Error Codes to Handle:**
| Code | Meaning | Handling |
|------|---------|---------|
| 0 | Success | Mark paid, send receipt |
| 1032 | Cancelled by user | Notify agent, offer retry |
| 1 | Insufficient funds | Send gentle notification, offer alternative |
| 17 | Invalid phone number | Prompt correction |
| 26 | System busy | Auto-retry with backoff |
| 2001 | Wrong PIN | Let M-Pesa handle, monitor for 3+ fails |
| 1019 | Transaction expired | Send new payment link |

**Reconciliation Logic:**
1. Auto-match: M-Pesa callback → extract invoice number from account reference → match amount (within KES 5 tolerance)
2. Fuzzy match: amount within 2% + customer phone matches + invoice within 7 days
3. Manual match: Admin dashboard for unmatched payments

**Security Requirements:**
- HTTPS only for all Daraja endpoints
- IP whitelisting for Safaricom callback IPs
- Payload validation on every callback
- Idempotency: detect duplicate M-Pesa receipt numbers

**[TODO]** — Add PayBill/Till number setup instructions for different business types

---

### 4.3 Invoicing & Receipts [STATUS: PLANNED]

**Invoice Requirements (KRA-compliant):**
- Unique sequential invoice number: `INV-YYYY-NNNNNN` (no gaps — audit requirement)
- Business name, KRA PIN, address
- Customer details (name, phone, email optional)
- Line items with description, quantity, unit price
- Subtotal, VAT (16% or exempt), Total
- Due date + payment instructions

**VAT Handling:**
- VAT-registered businesses: show 16% breakdown, include KRA PIN
- Non-VAT businesses: no VAT line; VAT-inclusive pricing only
- Mixed items: line-level VAT flag (exempt vs. taxable)

**Receipt Requirements:**
- Auto-generated on M-Pesa callback within 30 seconds
- Unique receipt number: `RCT-YYYY-NNNNNN`
- Delivery order: WhatsApp → SMS → Email
- Must include M-Pesa transaction reference number
- PDF attachment optional (configurable per business)

**[TODO]** — eTIMS integration details (KRA's electronic tax invoice management system)

---

### 4.4 CRM & Contact Management [STATUS: PLANNED]

**Primary Key:** Phone number in E.164 format (`+254XXXXXXXXX`)

**Contact Lifecycle Stages:**
`Lead` → `Qualified` → `Customer` → `Repeat` → `VIP` | `Churned`

**Auto-Tagging Rules to Implement:**
```
IF total_spent > 50000 → add #vip
IF last_contact > 60 days → add #inactive
IF order_count > 5 AND active in 30 days → add #repeat_buyer
IF campaign_link clicked → add #engaged
```

**Segmentation Types:**
- Dynamic (auto-updating based on rules)
- Static (fixed list, one-time import)
- Tag-based (AND/OR logic on tags)

**Key Segments to Pre-build:**
- High-value customers (LTV > KES 50k, active in 30 days)
- At-risk customers (customer stage, no contact 60+ days)
- New leads (created in last 7 days, no purchases)
- VIP (top 20% by revenue)

**[TODO]** — Define custom fields per persona (Grace needs size/style preferences; James needs credit limit field)

---

### 4.5 Appointment Booking [STATUS: PLANNED]

**Target Personas:** Mercy (salon), David (home services)

**Booking Flow:**
```
Customer initiates → Service selection → Staff selection (optional)
→ Date selection → Time slot selection → Confirmation
→ Reminder sequence (24hr, 2hr before) → Post-visit feedback
```

**Reminder Sequence:**
- T-24h: Confirmation request (reply CONFIRM / RESCHEDULE / CANCEL)
- T-2h: "Starting soon" notification
- T+2h: Feedback request (1–5 star rating)

**No-Show Handling:**
- Track no-show rate per customer
- Flag repeat no-shows
- Collect deposit for high-risk bookings

**[TODO]** — Calendar integration options (internal calendar vs. Google Calendar sync)

---

### 4.6 Order Tracking [STATUS: PLANNED]

**Target Personas:** Sarah (cloud kitchen), Grace (fashion/delivery)

**Status States:**
`Order Confirmed` → `Processing` → `Shipped` / `Out for Delivery` → `Delivered`

**Escalation Keywords (trigger agent handover):**
`problem`, `issue`, `complaint`, `refund`, `broken`, `wrong item`, `not received`, `damaged`, `late`, `angry`, `frustrated`

**[TODO]** — Courier API integrations (local: Sendy, Fargo Courier, etc.)

---

### 4.7 Broadcast Campaigns [STATUS: PLANNED]

**WhatsApp Compliance:**
- Explicit opt-in required before marketing messages
- Opt-out keywords: STOP, UNSUBSCRIBE, CANCEL, END
- Opt-out must process within 1 minute
- Transactional messages (receipts, order updates) still send to opted-out contacts

**Kenya Data Protection Act (KDPA) Requirements:**
- Record opt-in: timestamp, method, message shown
- Honor data access requests
- Data residency: prefer Kenya/Africa region hosting

**Broadcast Types:**
- One-time campaigns (segment targeting)
- Scheduled campaigns (time-zone aware, EAT default)
- Drip sequences (event-triggered, multi-step)

**[TODO]** — A/B testing for campaigns (post-MVP)

---

### 4.8 Analytics & Reporting [STATUS: PLANNED]

**Real-Time Dashboard Metrics:**
- Conversations today (active, new, response rate, avg response time)
- Revenue today (transactions, total, M-Pesa %, pending)
- Quotes & Orders (sent, accepted rate, pending, completed)
- Team performance (active agents, handle time, CSAT)
- Alerts (overdue invoices, pending confirmations, template approvals)

**Weekly Report (auto-email/WhatsApp):**
- Revenue vs. prior week
- Conversation volume and conversion rate
- Top products/services by revenue
- Campaign performance (sent, opened, clicked, converted)
- Action items (overdue invoices, inactive customers, upcoming appointments)

**KPIs to Track:**
| KPI | Target |
|-----|--------|
| Conversation-to-quote conversion | > 15% |
| Quote-to-payment conversion | > 40% |
| M-Pesa payment completion rate | > 85% |
| Message delivery rate | > 98% |
| Average response time (automated) | < 2 min |
| Average response time (agent) | < 5 min |
| DAU/MAU ratio | > 40% |

---

## 5. API DESIGN PRINCIPLES

- RESTful JSON API for all internal services
- Webhook-first for all external callbacks (M-Pesa, WhatsApp, Africa's Talking)
- All endpoints require authentication (JWT)
- Rate limiting on all public-facing endpoints
- Idempotency keys on payment endpoints
- All monetary values stored and transmitted in **KES cents** (integer), displayed as KES decimal
- Timestamps in UTC, displayed in EAT (UTC+3) to users

**[TODO]** — Full API endpoint specification (to be added per module as built)

---

## 6. DATA MODELS

### 6.1 Contact

```json
{
  "id": "cust_abc123",
  "phone": "+254712345678",
  "name": "Grace Mwangi",
  "email": "grace@example.com",
  "language": "en",
  "tags": ["vip", "repeat_customer", "fashion"],
  "custom_fields": {},
  "first_contact": "2025-12-01T10:30:00Z",
  "last_contact": "2026-01-28T14:22:00Z",
  "opt_in": true,
  "opt_in_date": "2025-12-01T10:32:00Z",
  "opt_in_method": "whatsapp_conversation",
  "lifecycle_stage": "customer",
  "lifetime_value": 45600,
  "order_count": 12,
  "avg_order_value": 3800,
  "lead_score": 85
}
```

### 6.2 Invoice

```json
{
  "id": "INV-2026-000123",
  "business_id": "biz_xyz",
  "contact_id": "cust_abc123",
  "line_items": [
    { "description": "Service name", "qty": 1, "unit_price": 50000, "vat_applicable": true }
  ],
  "subtotal": 50000,
  "vat_amount": 8000,
  "total": 58000,
  "currency": "KES",
  "status": "pending",
  "due_date": "2026-02-15",
  "created_at": "2026-01-30T10:00:00Z"
}
```

### 6.3 Transaction

```json
{
  "id": "txn_001",
  "invoice_id": "INV-2026-000123",
  "contact_id": "cust_abc123",
  "amount": 58000,
  "method": "mpesa",
  "mpesa_receipt": "QRT12XY89Z",
  "mpesa_phone": "+254712345678",
  "status": "completed",
  "reconciled": true,
  "timestamp": "2026-01-30T11:32:00Z"
}
```

**[TODO]** — Add models for: Session, Appointment, Campaign, Template, Automation

---

## 7. MULTI-LANGUAGE SUPPORT

**Languages:** English (default), Swahili, code-switching (Sheng detection)

**Rules:**
- Auto-detect language from first message (target > 85% accuracy)
- Store language preference per contact
- All critical templates must exist in both EN and SW
- Currency always displayed as `KES` regardless of language
- Dates in `DD Month YYYY` format (e.g., `30 Januari 2026`)
- Use i18n framework (e.g., i18next for Node.js)

**NLP Training Data Needed:**
- Kenyan English variations (e.g., "Bei gani?", "Nipigie")
- Swahili business phrases
- Sheng common terms in commerce context
- Code-switching sentences

**[TODO]** — Swahili corpus sources and NLP training pipeline

---

## 8. SECURITY & COMPLIANCE

**Kenya Data Protection Act (KDPA) Requirements:**
- Explicit consent before data collection
- Right to data access (respond within 72 hours)
- Right to deletion
- Data breach notification within 72 hours
- Data Processing Agreement (DPA) with all sub-processors

**Payment Security:**
- Never store raw M-Pesa PINs
- PCI DSS compliance handled by Flutterwave/Stripe (do not store card data)
- All Daraja callbacks validated (IP whitelist + payload signature)
- Audit log for all financial transactions (immutable)

**Authentication:**
- JWT tokens with refresh rotation
- Role-based access: Owner, Admin, Agent, Billing, Accountant (read-only)
- 2FA for Owner and Admin roles (recommended)

**[TODO]** — Security audit checklist before launch

---

## 9. GO-TO-MARKET PHASES (Technical Milestones)

### Phase 1: "Friendly 5" (February 2026)
**Technical Goal: Working MVP**
- [ ] WhatsApp Business API connection
- [ ] M-Pesa STK Push + callback handling
- [ ] Basic auto-reply (keyword-based, no NLP yet)
- [ ] Manual invoice creation + send via WhatsApp
- [ ] Receipt generation on payment
- [ ] Internal QA: M-Pesa failure scenarios + bad network handling

### Phase 2: "Beta 20" (March 2026)
**Technical Goal: Stability + Swahili polish**
- [ ] Bug fixes from Phase 1 feedback
- [ ] Swahili templates for top 3 business types (Fashion, Salons, General Retail)
- [ ] Template library (pre-loaded per category)
- [ ] Basic contact CRM (store conversation history)
- [ ] Simple dashboard (conversations today, revenue today)

### Phase 3: "Sprint to 50" (April 2026)
**Technical Goal: Self-service onboarding**
- [ ] Self-service sign-up flow (no manual setup required)
- [ ] M-Pesa subscription billing (pay for Kuzafy via M-Pesa)
- [ ] Referral trigger (after 10 invoices sent, prompt referral)
- [ ] Broadcast campaigns (WhatsApp)
- [ ] Case study data collection (usage metrics per business)

**[TODO]** — Post-Phase 3 roadmap (NLP, appointments, advanced CRM)

---

## 10. ENVIRONMENT & CONFIGURATION

**Environment Variables Required:**

```env
# WhatsApp
WHATSAPP_BSP_URL=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=

# M-Pesa / Daraja
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=
MPESA_ENV=sandbox|production

# Africa's Talking (SMS)
AT_API_KEY=
AT_USERNAME=
AT_SENDER_ID=

# Database
DATABASE_URL=
REDIS_URL=

# App
JWT_SECRET=
APP_ENV=development|production
BASE_URL=
DEFAULT_TIMEZONE=Africa/Nairobi
DEFAULT_CURRENCY=KES
DEFAULT_LANGUAGE=en
```

**[TODO]** — Add Flutterwave, Xero, and email SMTP env vars when those modules are built

---

## 11. TESTING STRATEGY

**M-Pesa Sandbox Testing:**
- Use Safaricom Daraja sandbox for all payment tests
- Test all error codes (see Section 4.2)
- Simulate: timeout, wrong amount, duplicate payment, network failure
- Reconciliation accuracy must be 100% before going live

**WhatsApp Testing:**
- Use Meta's test phone numbers in sandbox mode
- Test message delivery, template approval, media attachments
- Test opt-in / opt-out flows

**Load Testing Targets:**
- Platform uptime: 99.9% (core messaging)
- M-Pesa transaction success: > 95%
- API latency (p95): < 500ms
- Message delivery: > 98%

**[TODO]** — Add unit test and integration test setup instructions

---

## 12. COMPETITIVE CONTEXT

| Feature | WATI (Global) | Hello Charles (Global) | **Kuzafy** |
|---------|--------------|----------------------|------------|
| WhatsApp API | ✅ | ✅ | ✅ |
| M-Pesa STK Push | ❌ | ❌ | ✅ |
| Swahili NLP | ❌ | ❌ | ✅ |
| KRA-compliant invoicing | ❌ | ❌ | ✅ |
| SMS (Africa's Talking) | Partial | ❌ | ✅ |
| KES pricing | ❌ (USD) | ❌ (EUR) | ✅ |
| Appointment booking | Partial | ❌ | ✅ |
| Built-in CRM | Partial | ✅ | ✅ |
| Local banking partners | ❌ | ❌ | 🔄 [PLANNED] |

**Moat:** Deep M-Pesa integration + Swahili NLP + KRA tax compliance + KES pricing. Global players cannot replicate this without significant local investment.

---

## 13. CHANGELOG

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-30 | 1.0 | Initial document created from PRD, Pitch Deck, Business Vision, and 90-Day GTM | Claude |

---

> **Next Action for Claude Code:** Start with Section 4.2 (M-Pesa) and Section 4.1 (WhatsApp connection). These are the critical path. Do not build the dashboard or CRM until payments work end-to-end. Update `[STATUS]` tags in this document as each feature is completed.
