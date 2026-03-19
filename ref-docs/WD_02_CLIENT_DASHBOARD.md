# WD-02: Client Dashboard
> **Working Document** | Kuzafy Platform | Version: 1.0 | Status: [PLANNED]
> Part of: Kuzafy Product Structure | Related: WD-01 (WhatsApp Chatbot), WD-03 (Admin Dashboard)

---

## 1. PURPOSE & SCOPE

This document scopes the Kuzafy **Client Dashboard** — the web application used by Kuzafy's SME clients (Grace, Mercy, David, James, Sarah) to manage their business operations. This is the primary product interface for paying customers.

**Who uses this:**
- Business owners (Owner role) — full access
- Team members / agents (Agent role) — inbox + CRM only
- Accountants (Accountant role) — invoices + reports only

**What this is NOT:**
- The chatbot itself (WD-01)
- The Kuzafy internal admin panel (WD-03)
- A mobile app (web-responsive first; native app is deferred)

**Design Principle:** Mobile-first, Swahili/English toggle, works well on a 4G connection in Nairobi.

---

## 2. USER ROLES & PERMISSIONS

| Permission | Owner | Admin | Agent | Accountant |
|------------|-------|-------|-------|------------|
| View inbox & reply | ✅ | ✅ | ✅ | ❌ |
| Create/send invoices | ✅ | ✅ | ✅ | ✅ |
| View all invoices | ✅ | ✅ | ❌ (own) | ✅ |
| Create/edit contacts | ✅ | ✅ | ✅ | ❌ |
| Export contacts | ✅ | ✅ | ❌ | ✅ |
| Send broadcast campaigns | ✅ | ✅ | ❌ | ❌ |
| View analytics dashboard | ✅ | ✅ | ❌ | ✅ |
| Manage automations | ✅ | ✅ | ❌ | ❌ |
| Manage team members | ✅ | ✅ | ❌ | ❌ |
| Connect WhatsApp/M-Pesa | ✅ | ❌ | ❌ | ❌ |
| Billing & subscription | ✅ | ❌ | ❌ | ❌ |

---

## 3. NAVIGATION STRUCTURE

```
Kuzafy Client Dashboard
│
├── 💬  Inbox                   ← Unified conversation inbox
├── 👥  Contacts                ← CRM, segments, tags
├── 📋  Quotes & Invoices       ← Full financial workflow
├── 📅  Appointments            ← Booking calendar (Growth+ tier)
├── 📦  Orders                  ← Order tracking (if applicable)
├── 📢  Campaigns               ← Broadcasts, drip sequences
├── 🤖  Automations             ← Bot flows, auto-replies, templates
├── 📊  Analytics               ← Dashboard, reports
└── ⚙️  Settings
     ├── Business Profile
     ├── WhatsApp Connection
     ├── M-Pesa Setup
     ├── Team Members
     ├── Subscription & Billing
     └── Integrations
```

---

## 4. MODULE SPECIFICATIONS

---

### 4.1 Inbox

**Purpose:** Unified view of all customer conversations across WhatsApp and SMS. The agent's primary workspace.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search conversations...          [Filters ▼] [+ New]   │
├──────────────────────┬──────────────────────────────────────┤
│  CONVERSATION LIST   │  CONVERSATION VIEW                   │
│                      │                                      │
│  ● Grace Mwangi      │  Grace Mwangi  +254712345678        │
│    "Bei gani?"  2m   │  📱 WhatsApp  │  🏷 #new_lead       │
│                      │  ─────────────────────────────────  │
│  ● John Kamau        │  [Chat messages timeline]            │
│    "My order..."  5m │                                      │
│                      │  [Contact sidebar]                   │
│  ○ Mercy Salon  1h   │   Name, Phone, Tags, LTV,           │
│    "Appointment?"    │   Last purchase, Open invoices       │
│                      │                                      │
│  [Load more...]      │  [Type a message...]    [Send ▶]    │
└──────────────────────┴──────────────────────────────────────┘
```

**Conversation List Features:**
- Filter by: All, Unread, Assigned to me, Bot-handled, Escalated, Resolved
- Filter by channel: WhatsApp, SMS
- Sort by: Latest activity, Oldest, Priority
- Search: by contact name, phone, or message content
- Unread count badge per conversation
- Agent assignment indicator

**Conversation View Features:**
- Full message history (WhatsApp + SMS interleaved if same contact)
- Message delivery status (sent ✓, delivered ✓✓, read ✓✓ blue)
- Send text, images, PDFs, voice notes (where supported by channel)
- Quick replies (saved response library)
- Assign conversation to agent
- Add internal notes (not visible to customer)
- Tag conversation
- View contact mini-profile in sidebar
- Take over from bot (one click)
- Send invoice / quote directly from inbox
- Trigger M-Pesa payment from inbox

**Contact Sidebar (in Conversation View):**
```
Grace Mwangi
+254 712 345 678
📱 WhatsApp  🟢 Opted in

Lifecycle: Customer
LTV: KES 45,600
Orders: 12
Last purchase: Jan 25, 2026

Tags: #vip #fashion #repeat_buyer

[View Full Profile]  [Create Invoice]
```

**Bot / Agent Handover Indicator:**
- 🤖 Bot icon when bot is handling
- 👤 Agent icon when agent is active
- "Bot paused — you're in control" banner when agent takes over
- "Resume bot" button to hand back to automation

**[TODO]** — Define conversation SLA indicators (e.g., red highlight if no reply in 1h)

---

### 4.2 Contacts (CRM)

**Purpose:** Central database of all customers. The business's most valuable asset.

**Contacts List View:**
```
┌──────────────────────────────────────────────────────────────┐
│  👥 Contacts (1,847)          [+ Import] [Export] [+ New]   │
│  🔍 Search...    [Filter by tag ▼] [Lifecycle ▼] [Sort ▼]  │
├──────────────────────────────────────────────────────────────┤
│  ☐  Name           Phone          Tags          LTV    Last  │
│  ☐  Grace Mwangi  +254712345678  #vip #fashion  45,600  2d  │
│  ☐  John Kamau    +254722123456  #new_lead       0      1h   │
│  ...                                                         │
│  [Bulk actions: Tag, Export, Send campaign, Delete]          │
└──────────────────────────────────────────────────────────────┘
```

**Contact Profile View:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Contacts                                         │
│                                                             │
│  Grace Mwangi                          [Edit] [Message]    │
│  +254 712 345 678  •  grace@email.com                      │
│  Language: English  •  Opted in: Dec 1, 2025               │
│  Tags: #vip #fashion #repeat_buyer  [+ Add tag]            │
│  Lifecycle: Customer  •  Lead score: 85                     │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  [Overview] [Conversations] [Invoices] [Appointments]       │
│                                                             │
│  OVERVIEW                                                   │
│  Lifetime Value: KES 45,600                                │
│  Orders: 12  •  Avg order: KES 3,800                       │
│  Last purchase: Jan 25, 2026                               │
│  Outstanding balance: KES 0                                 │
│                                                             │
│  Custom fields:                                             │
│  Size: M  •  Preferred category: Dresses                   │
│  Birthday: May 15                                           │
└─────────────────────────────────────────────────────────────┘
```

**Segments View:**
- List of all saved segments with contact count
- Create new segment (dynamic or static)
- Segment builder: filter by any contact field, tag, transaction history
- Real-time contact count preview as filters are applied
- Actions per segment: Send campaign, Export, Apply tags

**Import / Export:**
- Import: CSV or Excel upload, field mapping UI, duplicate handling options
- Export: Select fields, filter by segment, download CSV
- Phone number auto-normalised to E.164 on import
- Validation errors shown before import completes (not after)

**[TODO]** — Custom fields builder (Owner can define their own contact fields per business type)

---

### 4.3 Quotes & Invoices

**Purpose:** Full financial workflow from quote to payment to receipt.

**List View:**
```
┌──────────────────────────────────────────────────────────────┐
│  📋 Invoices            [+ New Invoice]  [+ New Quote]      │
│  [All] [Draft] [Sent] [Paid] [Overdue] [Disputed]           │
├──────────────────────────────────────────────────────────────┤
│  INV-2026-000123  Grace Mwangi   KES 49,590  ⚠️ Overdue     │
│  INV-2026-000122  John Kamau     KES 12,000  ✅ Paid         │
│  QT-2026-000045   Mercy Salon    KES 85,000  ⏳ Pending      │
│                                                             │
│  Outstanding total: KES 67,890                              │
└──────────────────────────────────────────────────────────────┘
```

**Invoice Creation Flow:**
1. Select contact (or create new)
2. Add line items from catalog or custom
3. System auto-calculates subtotal, VAT (16% or exempt), total
4. Set due date and payment terms
5. Preview → Send via WhatsApp (primary), SMS (fallback), or Email
6. Invoice includes [PAY KES X] button that triggers M-Pesa STK Push

**Invoice Detail View:**
```
INV-2026-000123
Status: OVERDUE  (7 days)
Contact: Grace Mwangi  +254712345678

[Send Reminder] [Record Manual Payment] [Mark as Paid] [Void]

Items:
  Fashion Boutique Setup    1 × KES 45,000 = KES 45,000
  
Subtotal: KES 45,000
VAT (16%): KES 7,200
Total: KES 52,200
Paid: KES 0
Balance: KES 52,200

Payment history: (none)

[Download PDF]  [Send via WhatsApp]
```

**Payment Reminder Schedule (configurable):**
- Day -3: Friendly advance reminder
- Day 0: Due today
- Day +3: Polite overdue
- Day +7: Firmer overdue
- Day +14: Final notice / flag for agent

**Quote Workflow:**
- Create quote → Send to customer via WhatsApp
- Customer actions: Accept ✅ / Request Changes 📝 / Ask Questions ❓
- Accept → auto-generate deposit invoice
- Changes → agent notified, revise and resend
- Expiry: auto-expire after set days (default 7), send reminder at -24h

**Reconciliation Panel:**
- Auto-matched payments (green)
- Needs review (yellow) — wrong amount, no matching invoice
- Failed (red) — duplicate or error
- Pending callbacks (grey)
- Manual match interface for unmatched M-Pesa payments

---

### 4.4 Appointments (Growth+ Tier)

**Purpose:** Booking calendar for service businesses (salons, clinics, repair shops).

**Calendar View:**
- Week and day view
- Staff filter (show one or all staff calendars)
- Colour-coded by service type
- Click slot → create booking
- Click booking → view details, reschedule, cancel, mark complete

**Booking Management:**
- Upcoming appointments list
- Reminder status per booking (sent / delivered / confirmed)
- No-show tracking per customer
- Post-visit feedback scores

**Service & Staff Configuration (in Settings):**
- Define services: name, duration, price, deposit required (yes/no, amount)
- Define staff: name, photo, available hours per day
- Break times and blocked dates
- Multi-location support (Growth+ tier): assign services per location

**[TODO]** — Google Calendar two-way sync option

---

### 4.5 Orders

**Purpose:** Order tracking for product-based businesses (fashion, food delivery).

**Order List:**
- Filter: All, Pending, Processing, Shipped, Delivered, Cancelled
- Bulk actions: Update status, assign courier, export
- Search by order number, customer name, phone

**Order Detail:**
- Customer info + delivery address
- Line items
- Order timeline (confirmed → processing → shipped → delivered)
- Courier and tracking number fields
- Internal notes for team
- Status update triggers WhatsApp notification to customer automatically

**[TODO]** — Courier API integrations (Sendy, Fargo, DHL Kenya)

---

### 4.6 Campaigns

**Purpose:** Send marketing broadcasts and automated drip sequences.

**Campaign Types:**
1. **One-Time Broadcast** — Send to a segment now or at a scheduled time
2. **Drip Sequence** — Multi-step automated sequence triggered by an event
3. **Automated Campaign** — Rule-based (e.g., birthday greetings, re-engagement)

**Broadcast Creation Flow:**
```
1. Select audience (segment or tag filter) → see contact count
2. Select or create template
3. Personalise variables (preview with sample contact)
4. Schedule: Send now OR pick date/time (EAT timezone)
5. Confirm: "You are about to send to 487 contacts."
6. Launch → real-time send progress bar
7. Results: sent, delivered, read, replied, converted (clicked payment link)
```

**Drip Sequence Builder:**
```
TRIGGER: [Customer opts in ▼]
  │
  ├─ Step 1: Send immediately — "Welcome" template
  ├─ Wait: 2 days
  ├─ Step 2: Send — "About our products" template
  ├─ Wait: 2 days
  ├─ Condition: [Has not made a purchase]
  │   ├─ YES → Step 3: Send — "Special offer 10% off" template
  │   └─ NO  → Step 3: Send — "Thank you for your order" template
  └─ Exit: [When customer makes purchase]
```

**Campaign Analytics:**
- Per campaign: sent, delivered, read (%), replied (%), converted (%)
- Revenue attributed to campaign (M-Pesa payments within 48h of receiving campaign)
- Unsubscribes triggered by campaign

**[TODO]** — A/B testing (post-MVP, Phase 4+)

---

### 4.7 Automations

**Purpose:** Configure the chatbot behaviour, auto-replies, and workflow triggers without code.

**Auto-Reply Rules:**
```
┌─────────────────────────────────────────────────────────────┐
│  AUTO-REPLIES                              [+ New Rule]     │
├─────────────────────────────────────────────────────────────┤
│  🟢  Pricing Inquiry   Keywords: price, cost, bei gani      │
│      Reply: "Pricing Info" template  •  Tag: #pricing       │
│                                                             │
│  🟢  Off-Hours         After: 6 PM, Before: 8 AM           │
│      Reply: "We'll respond by 8 AM" template               │
│                                                             │
│  🔴  All Agents Busy   Trigger: Queue > 10 conversations   │
│      Reply: "Queue position" template   [Edit] [Delete]    │
└─────────────────────────────────────────────────────────────┘
```

**Bot Flow Builder:**
- Visual flow builder (drag-and-drop nodes)
- Node types: Send message, Ask question, Condition (if/else), Wait, Tag contact, Assign to agent, Trigger payment
- Test mode: simulate a conversation before activating
- Enable / disable individual flows without deleting them

**Template Manager:**
- Create and manage all message templates
- Submit WhatsApp templates for Meta approval (status tracking)
- Swahili / English versions side by side
- Variable placeholder highlighting
- Preview with sample contact data

---

### 4.8 Analytics

**Purpose:** Business intelligence for the SME owner.

**Home Dashboard (always-visible summary):**
```
┌────────────────────────────────────────────────────────────┐
│  Good morning, Grace! ☀️  Today is Wednesday, Jan 30       │
├──────────────┬──────────────┬──────────────┬──────────────┤
│  💬 Convos   │  💰 Revenue  │  📋 Quotes   │  ⭐ CSAT     │
│  45 today    │  KES 156,400 │  9 accepted  │  4.6/5       │
│  ↑ 12% vs   │  ↑ 8%        │  39% rate    │  ↑ 0.2       │
│  yesterday   │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘

⚠️ Alerts: 5 invoices overdue • 2 appointments need confirmation

[View full dashboard]
```

**Full Analytics Views:**
- Revenue over time (daily/weekly/monthly chart)
- Conversation volume and response time trends
- Conversion funnel: Lead → Quote → Invoice → Paid
- Top products / services by revenue
- Customer growth and churn
- Campaign performance comparison
- Team performance (per agent: conversations handled, response time, CSAT)
- Payment method breakdown (M-Pesa vs. card vs. cash vs. bank transfer)

**Reports:**
- Weekly summary (auto-sent every Monday 8am via WhatsApp to owner)
- Monthly revenue report
- Accounts receivable aging (overdue invoices by days)
- Export all reports to CSV / Excel

---

### 4.9 Settings

**Business Profile:**
- Business name, logo, description
- Operating hours (per day of week)
- Business address
- WhatsApp Business display name
- M-Pesa PayBill / Till number
- KRA PIN (for VAT-registered businesses)
- VAT registration status
- Language preference (EN / SW)

**WhatsApp Connection:**
- Client clicks "Connect WhatsApp" → Meta Embedded Signup popup launches inside Kuzafy UI
- Client logs into their Facebook Business account and creates/selects their Business Portfolio
- Kuzafy auto-provisions a new Kenyan WhatsApp number for them (no number porting)
- Connection completes in < 5 minutes
- Status: Connected ✅ / Disconnected ⚠️ / Pending verification ⏳
- Webhook health indicator (last message received: X minutes ago)
- Template submission status board

**M-Pesa Setup:**
- Input Daraja API credentials
- Test connection button
- PayBill / Till number configuration
- Callback URL display (pre-configured)

**Team Members:**
- Invite by phone number (they receive WhatsApp invite)
- Assign role: Admin / Agent / Accountant
- Deactivate / remove team members
- View login history

**Subscription & Billing:**
- Current plan (Starter / Growth / Scale)
- Next billing date
- Pay subscription via M-Pesa (Paybill)
- Upgrade / downgrade plan
- Invoice history for subscription payments

**Integrations:**
- Xero (Scale tier only)
- QuickBooks (Scale tier only)
- Zapier / Make webhook
- API keys management

---

## 5. ONBOARDING FLOW

**New client onboarding (the "Concierge" flow from GTM strategy):**

```
Step 1: Create account
  → Enter business name, phone number
  → Verify phone via WhatsApp OTP

Step 2: Business profile
  → Upload logo, set hours, set address
  → Enter KRA PIN (optional at this stage)

Step 3: Connect WhatsApp
  → Guided WhatsApp Business API connection
  → Or: "Set up for me" (request Kuzafy concierge setup)

Step 4: Connect M-Pesa
  → Enter Daraja credentials
  → Or: "I need help" → concierge support ticket

Step 5: Add first product/service
  → Simple catalog builder or import from CSV

Step 6: Test your bot
  → Send a test message to your own WhatsApp number
  → See it processed by Kuzafy

Step 7: Invite first team member (optional)

Step 8: Launch! 🎉
  → "Your bot is live. Share this link to start getting customers."
```

**Onboarding Progress Bar:** Always visible in header until complete.

---

## 6. TIER FEATURE GATING

| Feature | Starter | Growth | Scale |
|---------|---------|--------|-------|
| Inbox (conversations) | ✅ 1 agent | ✅ 5 agents | ✅ Unlimited |
| Contacts | ✅ 500 | ✅ 5,000 | ✅ Unlimited |
| Invoices/month | ✅ 50 | ✅ 500 | ✅ Unlimited |
| M-Pesa integration | ✅ | ✅ | ✅ |
| Broadcast campaigns | ❌ | ✅ 5/mo | ✅ Unlimited |
| Appointments | ❌ | ✅ | ✅ |
| Drip sequences | ❌ | ✅ 3 | ✅ Unlimited |
| CRM segments | Basic tags | ✅ | ✅ Advanced |
| Analytics | Basic | ✅ Full | ✅ Full + Custom |
| Xero/QuickBooks | ❌ | ❌ | ✅ |
| API access | ❌ | ❌ | ✅ |
| Dedicated account manager | ❌ | ❌ | ✅ |

**Upsell Prompts:**
- When a Starter user tries to access a Growth feature: show upgrade modal with clear benefit messaging
- Do NOT block access abruptly — show value, then ask to upgrade

---

## 7. TECH STACK (This Module)

| Component | Choice | Notes |
|-----------|--------|-------|
| Frontend framework | React + TypeScript | Component-based, fast iteration |
| Styling | Tailwind CSS | Utility-first, consistent design |
| State management | Zustand + React Query | Server state: React Query; UI state: Zustand |
| Real-time updates | WebSockets (Socket.io) | Live inbox updates, conversation typing indicators |
| Charts | Recharts or Chart.js | Analytics dashboards |
| Date/time | date-fns | Lightweight, EAT timezone support |
| Forms | React Hook Form + Zod | Validation |
| Auth | JWT + refresh tokens | Stored in httpOnly cookie |
| i18n | i18next | EN/SW toggle |
| File uploads | AWS S3 (pre-signed URLs) | Client uploads logos, product images, docs |
| Media display | AWS S3 signed URLs | Customer-sent images/files in inbox |

---

## 8. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Dashboard load time | < 2 seconds |
| Inbox message delivery (live) | < 1 second (WebSocket) |
| Contact search results | < 500ms |
| Report generation | < 10 seconds |
| Works on 3G connection | ✅ Must pass |
| Mobile-responsive | ✅ Must pass |

---

## 9. OPEN QUESTIONS & DECISIONS NEEDED

- [x] ~~**Real-time inbox:** WebSockets vs. polling?~~ **DECIDED: WebSockets (Socket.io)**
- [x] ~~**WhatsApp for team comms:** Can agents receive alerts via WhatsApp?~~ **DECIDED: Web dashboard notifications first; WhatsApp agent alerts are a Growth+ feature.**
- [ ] **Offline support:** Do we need offline mode for agents on poor connectivity? (Consider progressive web app / service worker)
- [ ] **Mobile app:** At what MRR/user count do we invest in native Android app?
- [ ] **Dashboard language:** Do we fully translate the dashboard UI to Swahili, or just customer-facing messages? (Recommend: EN dashboard, SW customer templates for MVP)
- [ ] **Dashboard per tier:** One codebase with feature flags (recommended) or separate builds?

---

## 10. CHANGELOG

| Date | Version | Change |
|------|---------|--------|
| 2026-01-30 | 1.0 | Initial scope created |
| 2026-03-18 | 1.1 | Decisions: Meta Cloud API direct; Gemini Flash NLP (cost-optimized); Sheng research findings; AWS S3 media; per-client number provisioning; multitenancy via Embedded Signup + WABA pool |
