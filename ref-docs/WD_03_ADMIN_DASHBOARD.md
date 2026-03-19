# WD-03: Admin Dashboard
> **Working Document** | Kuzafy Platform | Version: 1.0 | Status: [PLANNED]
> Part of: Kuzafy Product Structure | Related: WD-01 (WhatsApp Chatbot), WD-02 (Client Dashboard)

---

## 1. PURPOSE & SCOPE

This document scopes the Kuzafy **Admin Dashboard** — the internal operations panel used exclusively by the Kuzafy team to manage clients, monitor platform health, handle billing, debug issues, and run the business.

**Who uses this:**
- Kuzafy Founders / CEO
- Customer Success team (concierge onboarding, support)
- Engineering team (debugging, monitoring)
- Finance (billing, invoicing, revenue tracking)

**What this is NOT:**
- Accessible to any Kuzafy client (completely separate app)
- The chatbot (WD-01)
- The client-facing product (WD-02)

**Access:** Internal URL only. Protected by strong auth + IP allowlist. No public exposure.

---

## 2. USER ROLES (Kuzafy Internal)

| Role | Access Level |
|------|-------------|
| **Super Admin** (Founders) | Full access to everything |
| **Customer Success** | Client management, onboarding, support tickets, no billing |
| **Engineering** | Platform health, logs, debugging, feature flags — no billing or client PII beyond what's needed |
| **Finance** | Billing, revenue, payouts, subscription management — no conversation data |

---

## 3. NAVIGATION STRUCTURE

```
Kuzafy Admin Dashboard
│
├── 🏠  Overview                  ← Platform-wide health + KPIs
├── 🏢  Clients                   ← All Kuzafy client accounts
│    ├── Client List
│    ├── Client Detail
│    ├── Onboarding Pipeline
│    └── Churn Risk
├── 💰  Revenue & Billing         ← Subscriptions, MRR, payments
│    ├── MRR Dashboard
│    ├── Subscriptions
│    ├── Invoices (Kuzafy → clients)
│    └── Payouts
├── 📊  Platform Analytics        ← Usage metrics across all clients
├── 🛠️  Platform Health           ← Uptime, APIs, queues, errors
│    ├── System Status
│    ├── API Health
│    ├── WhatsApp / M-Pesa Status
│    └── Error Logs
├── 🎛️  Feature Flags             ← Toggle features per client or globally
├── 🎫  Support Tickets           ← Client support requests
├── 📣  Broadcasts (Internal)     ← Send announcements to clients
├── 👥  Admin Users               ← Manage Kuzafy internal team
└── ⚙️  Platform Settings
     ├── Pricing Configuration
     ├── Template Management (global)
     ├── WhatsApp BSP Settings
     ├── M-Pesa Global Config
     └── Compliance & Legal
```

---

## 4. MODULE SPECIFICATIONS

---

### 4.1 Overview (Platform Command Centre)

**Purpose:** The first screen any Kuzafy team member sees. Real-time platform health + business KPIs at a glance.

**Layout:**

```
┌────────────────────────────────────────────────────────────────────┐
│  KUZAFY ADMIN  •  Platform Overview           Wed, Jan 30, 2026   │
├───────────────────────────────────────────────────────────────────┤
│  🟢 All systems operational               Last updated: 30s ago   │
├──────────────┬──────────────┬──────────────┬───────────────────────┤
│  CLIENTS     │  MRR         │  MESSAGES    │  M-PESA               │
│  127 active  │  KES 892,500 │  48,291 today│  KES 4.2M processed  │
│  ↑ 8 new wk  │  ↑ 12% MoM  │  99.1% dlvrd │  today                │
│  3 at risk   │              │              │  98.3% success rate   │
├──────────────┴──────────────┴──────────────┴───────────────────────┤
│  🚨 ALERTS (3)                                                     │
│  ⚠️  M-Pesa callback latency elevated (avg 4.2s, threshold 2s)    │
│  ⚠️  Client "Mercy Salon" WhatsApp disconnected 2h ago            │
│  ℹ️  WhatsApp template "invoice_sent" pending approval 36h        │
├────────────────────────────────────────────────────────────────────┤
│  RECENT ACTIVITY                                                   │
│  09:41  New client signed up: "Wanjiku's Boutique" (Starter)      │
│  09:22  M-Pesa STK Push failure spike — 5 failures in 10 min     │
│  08:55  Client "James FMCG" upgraded: Starter → Scale            │
│  08:30  WhatsApp template "payment_received_sw" approved ✅        │
└────────────────────────────────────────────────────────────────────┘
```

**Key Metrics (real-time):**
- Total active clients (and weekly growth)
- MRR (and MoM growth)
- Messages sent today / delivery rate
- M-Pesa volume processed today / success rate
- Platform uptime (%)
- Active conversations right now (across all clients)
- Open support tickets

**Alert Types:**
- 🔴 Critical: API down, payment processing failure, data breach risk
- ⚠️ Warning: Elevated latency, WhatsApp disconnection, template stuck
- ℹ️ Info: New signup, upgrade, feature flag changed

---

### 4.2 Clients

#### 4.2.1 Client List

```
┌──────────────────────────────────────────────────────────────────────┐
│  🏢 Clients (127)          [+ Add Client]  [Export]                 │
│  🔍 Search...    [Plan ▼] [Status ▼] [Onboarding ▼] [Risk ▼]      │
├──────────────────────────────────────────────────────────────────────┤
│  Business Name      Plan      MRR         Status      Health       │
│  Grace's Boutique   Starter   KES 2,500   Active  ●   🟢 Good      │
│  Mercy Salon        Growth    KES 10,000  Active  ●   🟡 Warning    │
│  James FMCG         Scale     KES 25,000  Active  ●   🟢 Good      │
│  New Bakery         Starter   KES 2,500   Trial   ◐   ⚫ Setup     │
└──────────────────────────────────────────────────────────────────────┘
```

**Client Health Score (auto-calculated):**
- 🟢 Good: Active conversations, payments processing, recent logins
- 🟡 Warning: Declining activity, WhatsApp disconnected, overdue subscription
- 🔴 At Risk: No activity 14+ days, failed payments, high churn probability
- ⚫ Setup: Onboarding incomplete

#### 4.2.2 Client Detail View

Full view of a single client account — the CS team's primary tool.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Clients  /  Grace's Fashion Boutique                             │
│                                                                      │
│  Plan: Starter   Status: Active   Since: Dec 1, 2025               │
│  Owner: Grace Mwangi  •  +254 712 345 678  •  grace@email.com      │
│  Health: 🟢 Good   Churn risk: Low                                  │
│                                                                      │
│  [Impersonate Client]  [Send Message]  [Suspend]  [Delete Account]  │
├──────────────────────────────────────────────────────────────────────┤
│  [Overview] [Usage] [Billing] [Integrations] [Audit Log] [Support]  │
├──────────────────────────────────────────────────────────────────────┤
│  OVERVIEW                                                            │
│  Contacts: 234   Conversations (30d): 1,247   Invoices sent: 89    │
│  Revenue processed via Kuzafy (30d): KES 456,000                   │
│  WhatsApp: ✅ Connected  M-Pesa: ✅ Connected  Xero: ❌             │
│  Last login: Jan 30, 2026 09:12 AM                                  │
│                                                                      │
│  TEAM (3 users)                                                      │
│  Grace Mwangi — Owner                                               │
│  Sarah Otieno — Agent                                               │
│  John Kamau  — Agent                                                │
│                                                                      │
│  ONBOARDING CHECKLIST                                                │
│  ✅ Account created    ✅ WhatsApp connected    ✅ M-Pesa setup      │
│  ✅ First invoice sent  ✅ First payment received                    │
└──────────────────────────────────────────────────────────────────────┘
```

**Actions available per client:**
- **Impersonate:** Log in as this client (view their dashboard as they see it) — requires 2FA confirmation + audit log entry
- **Send Message:** Send WhatsApp or email message to the client owner
- **Upgrade/Downgrade Plan:** Override subscription tier
- **Add Free Credits:** Add free months or KES credit to account
- **Suspend Account:** Disable login, pause bot (for non-payment)
- **Delete Account:** Full GDPR/KDPA deletion with data export
- **Reset WhatsApp Connection:** Trigger reconnection flow
- **View Raw Logs:** Engineering access to raw API logs for this client

#### 4.2.3 Onboarding Pipeline

Kanban view of all clients in the onboarding process — the CS team's daily tracker.

```
┌──────────────┬──────────────┬──────────────┬──────────────┬───────────────┐
│  SIGNED UP   │  WA CONNECT  │  MPESA SETUP │  FIRST MSG   │  FIRST PAID   │
│  (12)        │  (8)         │  (5)         │  (3)         │  (2)          │
├──────────────┼──────────────┼──────────────┼──────────────┼───────────────┤
│  Wanjiku     │  Mercy Salon │  Bakery XYZ  │  Grace Co.   │  James FMCG   │
│  Boutique    │  (stuck 2d)  │              │  (stuck 1d)  │               │
│  2h ago      │  🚨          │  1d ago      │  ⚠️          │  Done! ✅      │
│              │              │              │              │               │
│  New Salon   │              │              │              │  Kiosk Ltd    │
│  1d ago      │              │              │              │  Done! ✅      │
└──────────────┴──────────────┴──────────────┴──────────────┴───────────────┘
```

- Cards show days stuck at each stage (warning at 1 day, alert at 2 days)
- CS team can click a card to view client detail and take action
- Auto-trigger: if client stuck at WA Connect for 24h → CS team WhatsApp notification

#### 4.2.4 Churn Risk

- List of clients with declining engagement
- Risk score (0–100) per client
- Risk factors shown: (no login 7d, dropping conversation volume, payment failed, WhatsApp disconnected)
- Quick action: "Send check-in WhatsApp" to client owner

---

### 4.3 Revenue & Billing

#### 4.3.1 MRR Dashboard

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Revenue Dashboard                        January 2026          │
├──────────────┬──────────────┬──────────────┬───────────────────────┤
│  MRR         │  New MRR     │  Churned MRR │  Net New MRR          │
│  KES 892,500 │  KES 52,500  │  KES 10,000  │  KES 42,500          │
├──────────────┴──────────────┴──────────────┴───────────────────────┤
│  [MRR chart — last 12 months]                                      │
├────────────────────────────────────────────────────────────────────┤
│  BY PLAN                                                           │
│  Starter (89 clients × KES 2,500)  = KES 222,500  (24.9%)        │
│  Growth  (31 clients × KES 10,000) = KES 310,000  (34.7%)        │
│  Scale   (7 clients  × custom)     = KES 360,000  (40.3%)        │
├────────────────────────────────────────────────────────────────────┤
│  TARGETS                                                           │
│  Month 12 target: KES 5,000,000                                   │
│  Current: KES 892,500  (17.9% of target)                          │
│  Projected at current growth rate: KES 4,100,000 ⚠️ Below target  │
└────────────────────────────────────────────────────────────────────┘
```

**Key Revenue Metrics:**
- MRR, ARR
- New MRR (new clients this month)
- Expansion MRR (upgrades)
- Churned MRR (cancellations + downgrades)
- Net Revenue Retention (NRR)
- Average Revenue Per Account (ARPA)
- CAC (from manual input or ad spend tracking)
- LTV per plan
- Months to payback CAC

#### 4.3.2 Subscriptions

- List of all active, trialling, paused, and cancelled subscriptions
- Filter by plan, status, billing date, payment method
- Actions: Upgrade/downgrade, add credit, cancel, pause, refund
- Failed payment queue: clients whose M-Pesa subscription payment failed → auto-retry log

#### 4.3.3 Kuzafy Invoices (Kuzafy → Clients)

- Auto-generated monthly subscription invoices
- Delivery: WhatsApp + email to client owner
- Payment: M-Pesa (primary) or bank transfer
- Overdue: suspend after 7 days (with 3-day grace + 2 reminder WhatsApp messages)
- Invoice history per client

#### 4.3.4 Transaction Fees (Future)

- Track card payment transaction fees collected per client (Flutterwave %)
- Monthly payout reconciliation
- **[TODO]** — Define transaction fee model once card payments launched

---

### 4.4 Platform Analytics

**Purpose:** Aggregate usage analytics across all clients — helps product decisions.

**Metrics tracked:**
- Total conversations per day (platform-wide)
- Total M-Pesa transactions processed (volume + value)
- WhatsApp message delivery rates (daily trend)
- NLP intent detection accuracy (weekly eval)
- Feature usage: which features are most/least used per tier
- Onboarding completion rates (by step)
- Bot vs. agent handled conversations (%)
- Average first response time (bot and agent separately)
- Most common intents triggered
- Most used templates

**Cohort Analysis:**
- Weekly signup cohorts — track retention over 12 weeks
- Activation cohort — of clients who signed up, % who reach "first paid invoice"
- Revenue cohort — MRR by signup month

**[TODO]** — Define product analytics event schema (what events to track, what properties)

---

### 4.5 Platform Health

**Purpose:** Engineering and operations monitoring. The system's vital signs.

#### 4.5.1 System Status

```
┌──────────────────────────────────────────────────────────────────────┐
│  🟢 PLATFORM STATUS — All systems operational                       │
│  Updated: 30 seconds ago                           [Refresh]        │
├──────────────────────────────────────────────────────────────────────┤
│  CORE SERVICES                                                       │
│  🟢 API Server              99.97% uptime (30d)    p95: 210ms       │
│  🟢 Message Processor       99.91% uptime          Queue: 12 msgs   │
│  🟢 Database (PostgreSQL)   99.99% uptime          Connections: 45  │
│  🟢 Redis (Sessions/Cache)  100% uptime            Memory: 34%      │
│  🟡 Job Queue (Bull)        98.2% success rate     Failed: 12/hr   │
│                                                                      │
│  EXTERNAL INTEGRATIONS                                               │
│  🟢 Meta WhatsApp API       Operational            Latency: 180ms   │
│  🟢 Africa's Talking (SMS)  Operational            Latency: 95ms    │
│  🟡 Safaricom Daraja        Elevated latency        Avg: 4.2s ⚠️    │
│  🟢 Flutterwave             Operational                             │
│  🟢 Twilio (SMS fallback)   Operational                             │
├──────────────────────────────────────────────────────────────────────┤
│  PERFORMANCE (last 1 hour)                                          │
│  Webhooks received: 4,821   Processed: 4,819  Failed: 2  (0.04%)   │
│  STK Push initiated: 234    Success: 215  Failed: 19  (8.1%)       │
│  Messages sent: 12,490      Delivered: 12,348  Failed: 142  (1.1%) │
└──────────────────────────────────────────────────────────────────────┘
```

#### 4.5.2 API Health

- Endpoint-by-endpoint response times (p50, p95, p99)
- Error rate per endpoint
- Request volume over time
- Slow query log (database queries > 500ms)
- Webhook processing time histogram

#### 4.5.3 WhatsApp / M-Pesa Status

**WhatsApp:**
- Connected phone numbers across all clients (how many, how many disconnected)
- Template approval status across all clients (pending, approved, rejected)
- Message delivery rates over time
- Rate limit proximity (Meta API rate limits)

**M-Pesa:**
- STK Push success rate (target > 85%)
- Average callback latency
- Unmatched payments queue (needs manual reconciliation)
- OAuth token expiry status (Daraja tokens expire every hour)
- Error code frequency breakdown

#### 4.5.4 Error Logs

- Real-time error feed with severity, client context, stack trace
- Filter by: severity, client, service, time range
- Group by: error type, endpoint, client
- One-click: create support ticket from error
- Alerts: PagerDuty/Slack integration for critical errors

**[TODO]** — Define error alerting thresholds and escalation paths

---

### 4.6 Feature Flags

**Purpose:** Control feature rollout without code deployments. Enable/disable features per client or globally.

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎛️ Feature Flags                              [+ New Flag]         │
├──────────────────────────────────────────────────────────────────────┤
│  Flag Name               Status    Rollout        Override Clients  │
│  appointments_module     🟡 Beta   Growth+ only   + Mercy Salon     │
│  xero_integration        🔴 Off    Scale only     (none)            │
│  nlp_v2_engine           🟡 Beta   10% of clients (none)            │
│  broadcast_campaigns     🟢 On     Growth+ only   (none)            │
│  card_payments           🔴 Off    0%             (none)            │
│  swahili_ui              🟡 Beta   All (opt-in)   (none)            │
└──────────────────────────────────────────────────────────────────────┘
```

**Flag controls:**
- Enable/disable globally
- Enable by plan tier (Starter / Growth / Scale)
- Enable for specific client IDs (override for pilots)
- Enable for percentage of clients (gradual rollout)
- Scheduled activation (e.g., "enable for all Growth clients on Feb 1")

---

### 4.7 Support Tickets

**Purpose:** Track and resolve client support requests.

**Ticket Sources:**
- Client sends WhatsApp message to Kuzafy support number
- Client clicks "Help" in Client Dashboard
- Auto-generated from platform errors (e.g., M-Pesa disconnect detected)
- CS team creates manually during onboarding

**Ticket Views:**
- All tickets (with SLA indicator — time since opened)
- My tickets (assigned to me)
- By priority: Critical (P1), High (P2), Normal (P3), Low (P4)
- By status: Open, In Progress, Waiting on Client, Resolved, Closed

**SLA Targets:**
| Priority | First Response | Resolution |
|----------|---------------|------------|
| P1 (Critical) | 30 minutes | 4 hours |
| P2 (High) | 2 hours | 24 hours |
| P3 (Normal) | 4 hours | 48 hours |
| P4 (Low) | 8 hours | 5 days |

**Ticket Detail:**
- Client info (linked to client detail view)
- Issue description
- Conversation history (the WhatsApp thread if ticket came from WA)
- Internal notes (CS team only)
- Resolution actions taken
- Link to related error logs
- Escalate to Engineering button

---

### 4.8 Broadcasts (Internal — Kuzafy → Clients)

**Purpose:** Send announcements, release notes, and important notices to all Kuzafy clients.

**Use cases:**
- New feature announcement
- Scheduled maintenance notice
- Billing changes
- Important compliance updates
- Tips / best practices (monthly)

**Channels:** WhatsApp (primary, to business owner number) + Email

**Targeting:**
- All active clients
- By plan tier
- By specific client IDs
- By onboarding status (e.g., "clients who haven't connected WhatsApp yet")

---

### 4.9 Admin Users

**Purpose:** Manage the Kuzafy internal team's access.

- List of all admin users (name, role, last login, 2FA status)
- Invite new admin user
- Assign / change role
- Deactivate access
- View audit log per admin user (who did what, when)
- Enforce 2FA for all admin accounts
- IP allowlist configuration (optional: restrict admin access to office IPs)

---

### 4.10 Platform Settings

**Pricing Configuration:**
- Manage tier prices (without code deploy)
- Configure promo codes / discounts
- Trial period settings (default: 14 days free)
- Grace period for failed payments (default: 7 days)

**Global Template Management:**
- Pre-built templates available to all clients by default
- Industry-specific template packs (Fashion, Salons, Food Delivery, FMCG)
- Submit and track WhatsApp Business Solution Provider templates that apply globally

**WhatsApp / Meta Cloud API Settings (Direct — No BSP):**
- Kuzafy Meta App credentials (single app, all clients under one Tech Provider umbrella)
- Per-client WABA registry: WABA ID, Phone Number ID, System User Token (encrypted), display name, tier, quality rating
- Embedded Signup configuration: `solution_id`, OAuth redirect URI, login config
- Webhook health: last received per WABA, delivery rate per WABA
- Rate limit tracker: Tier 1/2/3 per number, proximity to daily message cap
- Template submission queue across all clients (global pending/approved/rejected view)
- **Number Pool Management:**
  - Available numbers ready for assignment
  - Assigned numbers (with client mapping)
  - Quarantined numbers (post-churn, 90-day hold)
  - Decommissioned numbers
  - Low pool alert: trigger when < 20% spare capacity
- Meta Business Verification status (Kuzafy's own WABA health)

**M-Pesa Global Config:**
- Daraja OAuth token management (shared or per-client credentials)
- Callback URL management
- Safaricom IP whitelist sync

**Compliance & Legal:**
- KDPA data retention policies
- Data deletion request queue (DSAR — Data Subject Access Requests)
- Audit log download (for legal/regulatory requests)
- Privacy policy and terms of service version management

---

## 5. IMPERSONATION FEATURE

**When to use:** CS team needs to debug a client issue, or onboard a client concierge-style (the "do it for them" approach from the 90-Day GTM).

**How it works:**
1. CS team member clicks "Impersonate Client" on client detail page
2. 2FA confirmation required
3. Audit log entry created: `[Admin: John] impersonated [Client: Grace's Boutique] at 09:41 Jan 30`
4. Admin enters client's dashboard — yellow "IMPERSONATING" banner visible at all times
5. All actions taken are tagged as impersonation in the audit log
6. Exit impersonation via banner button or session timeout (30 min)

**Restrictions:**
- CS team cannot impersonate — only Super Admin and CS Lead role
- Cannot export raw contact data while impersonating
- Cannot change billing while impersonating

---

## 6. AUDIT LOG

Every sensitive action on the platform is logged immutably.

**Logged events:**
- Admin login / logout
- Impersonation start / end
- Client account changes (plan, suspension, deletion)
- Billing overrides
- Feature flag changes
- Support ticket status changes
- Data export / deletion (DSAR)
- Platform setting changes

**Audit log entry format:**
```
Timestamp (UTC)  |  Actor (admin user)  |  Action  |  Target (client/resource)  |  IP Address
```

**Retention:** 5 years (compliance requirement)
**Access:** Super Admin only for full log; CS and Engineering see their own relevant entries

---

## 7. TECH STACK (This Module)

| Component | Choice | Notes |
|-----------|--------|-------|
| Frontend | React + TypeScript | Separate app from Client Dashboard |
| Auth | JWT + 2FA (TOTP) | Admin-only, stricter than client auth |
| Charts | Recharts | Consistent with Client Dashboard |
| Real-time | WebSockets | Live platform health metrics |
| Log viewer | Custom or Grafana embed | Engineering logs |
| Media / Assets | AWS S3 | Client logos, invoice PDFs, all media |
| Secrets | AWS Secrets Manager | Per-client WABA tokens, Daraja keys |
| Hosting | Internal/private network | Not publicly routable |
| Access control | IP allowlist + VPN (optional) | Extra layer of protection |
| NLP Monitoring | Gemini Flash classification logs | Review low-confidence intents flagged by bot |

---

## 8. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Overview dashboard load | < 3 seconds |
| Client list search | < 500ms |
| Error log streaming | Real-time (< 2s delay) |
| Platform metrics refresh | Every 30 seconds |
| Audit log query (1 year) | < 5 seconds |

---

## 9. OPEN QUESTIONS & DECISIONS NEEDED

- [x] ~~**Separate app or sub-path?**~~ **DECIDED: `admin.kuzafy.com` — separate deployment, separate auth, not publicly routable.**
- [x] ~~**Impersonation audit — notify clients?**~~ **DECIDED: Disclose in Terms of Service. No real-time notification to client.**
- [ ] **Monitoring stack:** Build custom health dashboard or embed Grafana? (Recommend Grafana for engineering, custom for business metrics)
- [ ] **Support ticketing:** Build in-house or use Freshdesk/Intercom? (Recommend: build simple in-house for < 500 clients, migrate at scale)
- [ ] **Alerting:** PagerDuty for P1 alerts, or Slack channel enough at this stage? (Recommend: Slack now, PagerDuty when team > 5)
- [ ] **Finance access:** Does Finance role see client conversation data? (Recommend: no — firewall PII from Finance)
- [ ] **Meta Tech Provider registration:** Start immediately — Meta review can take 2–4 weeks and it's on the critical path for client onboarding.

---

## 10. CHANGELOG

| Date | Version | Change |
|------|---------|--------|
| 2026-01-30 | 1.0 | Initial scope created |
| 2026-03-18 | 1.1 | Decisions: Meta Cloud API direct; Gemini Flash NLP (cost-optimized); Sheng research findings; AWS S3 media; per-client number provisioning; multitenancy via Embedded Signup + WABA pool |
