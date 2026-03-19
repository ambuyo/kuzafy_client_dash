/* ─── Contacts ───────────────────────────────────────────────────────── */

export type LifecycleStage = 'Lead' | 'Qualified' | 'Customer' | 'Repeat' | 'VIP' | 'Churned';
export type Channel = 'whatsapp' | 'sms';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  lifecycle: LifecycleStage;
  ltv: number;          // KES
  orderCount: number;
  avgOrder: number;     // KES
  lastContact: string;  // ISO date
  optedIn: boolean;
  language: 'en' | 'sw';
  leadScore: number;
  outstandingBalance: number; // KES
}

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Grace Mwangi',   phone: '+254712345678', email: 'grace@gmail.com',   tags: ['vip','fashion','repeat_buyer'],  lifecycle: 'VIP',       ltv: 145600, orderCount: 32, avgOrder: 4550,  lastContact: '2026-03-17', optedIn: true,  language: 'en', leadScore: 95, outstandingBalance: 0 },
  { id: 'c2', name: 'John Kamau',     phone: '+254722123456',                              tags: ['new_lead'],                      lifecycle: 'Lead',      ltv: 0,      orderCount: 0,  avgOrder: 0,     lastContact: '2026-03-19', optedIn: true,  language: 'sw', leadScore: 30, outstandingBalance: 0 },
  { id: 'c3', name: 'Mercy Njoroge',  phone: '+254733987654', email: 'mercy@salon.co.ke', tags: ['salon','repeat_buyer'],          lifecycle: 'Repeat',    ltv: 87200,  orderCount: 18, avgOrder: 4844,  lastContact: '2026-03-15', optedIn: true,  language: 'sw', leadScore: 80, outstandingBalance: 12500 },
  { id: 'c4', name: 'David Ochieng',  phone: '+254701234567',                              tags: ['b2b','fmcg'],                    lifecycle: 'Customer',  ltv: 230000, orderCount: 7,  avgOrder: 32857, lastContact: '2026-03-10', optedIn: true,  language: 'en', leadScore: 72, outstandingBalance: 45000 },
  { id: 'c5', name: 'Sarah Wanjiku',  phone: '+254755321098', email: 'sarah@kitch.co.ke', tags: ['food','delivery'],               lifecycle: 'Customer',  ltv: 52400,  orderCount: 21, avgOrder: 2495,  lastContact: '2026-03-18', optedIn: true,  language: 'en', leadScore: 68, outstandingBalance: 0 },
  { id: 'c6', name: 'James Mutua',    phone: '+254788456789',                              tags: ['inactive'],                      lifecycle: 'Churned',   ltv: 18900,  orderCount: 4,  avgOrder: 4725,  lastContact: '2026-01-05', optedIn: false, language: 'sw', leadScore: 15, outstandingBalance: 0 },
  { id: 'c7', name: 'Fatuma Hassan',  phone: '+254700112233',                              tags: ['fashion','new_lead'],            lifecycle: 'Qualified', ltv: 3200,   orderCount: 1,  avgOrder: 3200,  lastContact: '2026-03-16', optedIn: true,  language: 'sw', leadScore: 45, outstandingBalance: 3200 },
  { id: 'c8', name: 'Peter Njuguna',  phone: '+254744556677', email: 'peter@corp.co.ke',  tags: ['b2b','vip'],                     lifecycle: 'VIP',       ltv: 312000, orderCount: 14, avgOrder: 22285, lastContact: '2026-03-14', optedIn: true,  language: 'en', leadScore: 91, outstandingBalance: 0 },
  { id: 'c9', name: 'Aisha Abdullahi',phone: '+254711889900',                              tags: ['fashion','repeat_buyer'],        lifecycle: 'Repeat',    ltv: 41600,  orderCount: 11, avgOrder: 3781,  lastContact: '2026-03-12', optedIn: true,  language: 'sw', leadScore: 77, outstandingBalance: 5800 },
  { id:'c10', name: 'Kevin Otieno',   phone: '+254766334455',                              tags: ['new_lead'],                      lifecycle: 'Lead',      ltv: 0,      orderCount: 0,  avgOrder: 0,     lastContact: '2026-03-19', optedIn: true,  language: 'en', leadScore: 22, outstandingBalance: 0 },
];

/* ─── Conversations ──────────────────────────────────────────────────── */

export type ConvStatus = 'open' | 'bot' | 'escalated' | 'resolved';

export interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  isBot?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  channel: Channel;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: ConvStatus;
  assignedTo?: string;
  messages: Message[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1', contactId: 'c1', contactName: 'Grace Mwangi', contactPhone: '+254712345678',
    channel: 'whatsapp', lastMessage: 'Bei gani ya dress ile?', lastTime: '2m', unread: 2, status: 'open',
    messages: [
      { id: 'm1', direction: 'inbound',  text: 'Hi, mambo?',                                         time: '10:01 AM' },
      { id: 'm2', direction: 'outbound', text: 'Poa sana! Karibu Kuzafy Fashion. Naweza kukusaidia?',  time: '10:01 AM', status: 'read', isBot: true },
      { id: 'm3', direction: 'inbound',  text: 'Bei gani ya dress ile nyekundu?',                     time: '10:03 AM' },
      { id: 'm4', direction: 'outbound', text: 'Dress nyekundu inauzwa KES 3,500. Una size gani?',    time: '10:03 AM', status: 'delivered', isBot: true },
      { id: 'm5', direction: 'inbound',  text: 'Bei gani ya dress ile?',                              time: '10:05 AM' },
    ],
  },
  {
    id: 'conv2', contactId: 'c2', contactName: 'John Kamau', contactPhone: '+254722123456',
    channel: 'whatsapp', lastMessage: 'My order is late, please check', lastTime: '5m', unread: 1, status: 'escalated', assignedTo: 'Agent A',
    messages: [
      { id: 'm1', direction: 'inbound',  text: 'Hello, I placed an order 3 days ago ORD-2026-000041', time: '9:45 AM' },
      { id: 'm2', direction: 'outbound', text: 'Hi John! Let me check your order status right away.', time: '9:46 AM', status: 'read', isBot: true },
      { id: 'm3', direction: 'inbound',  text: 'My order is late, please check',                     time: '9:50 AM' },
    ],
  },
  {
    id: 'conv3', contactId: 'c3', contactName: 'Mercy Njoroge', contactPhone: '+254733987654',
    channel: 'whatsapp', lastMessage: 'Nataka appointment kesho', lastTime: '1h', unread: 0, status: 'bot',
    messages: [
      { id: 'm1', direction: 'inbound',  text: 'Habari. Nataka book appointment',                      time: 'Yesterday 3:00 PM' },
      { id: 'm2', direction: 'outbound', text: 'Karibu! Tunapatikana Jumatano na Alhamisi. Unapenda saa ngapi?', time: 'Yesterday 3:00 PM', status: 'read', isBot: true },
      { id: 'm3', direction: 'inbound',  text: 'Nataka appointment kesho',                             time: 'Yesterday 3:05 PM' },
    ],
  },
  {
    id: 'conv4', contactId: 'c5', contactName: 'Sarah Wanjiku', contactPhone: '+254755321098',
    channel: 'whatsapp', lastMessage: 'Payment confirmed, asante!', lastTime: '3h', unread: 0, status: 'resolved',
    messages: [
      { id: 'm1', direction: 'outbound', text: 'Hi Sarah, your invoice INV-2026-000118 of KES 4,500 is due today.', time: '8:00 AM', status: 'read', isBot: true },
      { id: 'm2', direction: 'inbound',  text: 'Nimepay via M-Pesa. Receipt: QFH12X',                 time: '8:15 AM' },
      { id: 'm3', direction: 'outbound', text: '✅ Payment received! KES 4,500. Receipt RCT-2026-000098 sent.',   time: '8:15 AM', status: 'read', isBot: true },
      { id: 'm4', direction: 'inbound',  text: 'Payment confirmed, asante!',                          time: '8:16 AM' },
    ],
  },
  {
    id: 'conv5', contactId: 'c7', contactName: 'Fatuma Hassan', contactPhone: '+254700112233',
    channel: 'sms', lastMessage: 'OK ntafika', lastTime: '2h', unread: 0, status: 'open',
    messages: [
      { id: 'm1', direction: 'outbound', text: 'Hi Fatuma, your order is ready for pickup at our Westlands store.', time: '7:30 AM', status: 'delivered', isBot: true },
      { id: 'm2', direction: 'inbound',  text: 'OK ntafika',                                          time: '7:45 AM' },
    ],
  },
  {
    id: 'conv6', contactId: 'c9', contactName: 'Aisha Abdullahi', contactPhone: '+254711889900',
    channel: 'whatsapp', lastMessage: 'Nipe bei ya bundle', lastTime: '4h', unread: 3, status: 'open',
    messages: [
      { id: 'm1', direction: 'inbound',  text: 'Habari yako',                                         time: '6:00 AM' },
      { id: 'm2', direction: 'outbound', text: 'Habari! Karibu. Naweza kukusaidia na nini leo?',       time: '6:00 AM', status: 'read', isBot: true },
      { id: 'm3', direction: 'inbound',  text: 'Nipe bei ya bundle ya dresses 3',                     time: '6:05 AM' },
      { id: 'm4', direction: 'inbound',  text: 'Nipe bei ya bundle',                                  time: '6:10 AM' },
    ],
  },
];

/* ─── Invoices ───────────────────────────────────────────────────────── */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'disputed';

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number; // KES
  vatApplicable: boolean;
}

export interface Invoice {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  paid: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  mpesaReceipt?: string;
  notes?: string;
}

export const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-000123', contactId: 'c1', contactName: 'Grace Mwangi', contactPhone: '+254712345678',
    lineItems: [{ description: 'Fashion Boutique Setup Package', qty: 1, unitPrice: 45000, vatApplicable: true }],
    subtotal: 45000, vatAmount: 7200, total: 52200, paid: 0,
    status: 'overdue', dueDate: '2026-03-10', createdAt: '2026-03-03',
  },
  {
    id: 'INV-2026-000122', contactId: 'c2', contactName: 'John Kamau', contactPhone: '+254722123456',
    lineItems: [{ description: 'Sneakers — Nike Air Max', qty: 2, unitPrice: 6000, vatApplicable: false }],
    subtotal: 12000, vatAmount: 0, total: 12000, paid: 12000,
    status: 'paid', dueDate: '2026-03-12', createdAt: '2026-03-05', mpesaReceipt: 'QFH9823KL',
  },
  {
    id: 'INV-2026-000121', contactId: 'c4', contactName: 'David Ochieng', contactPhone: '+254701234567',
    lineItems: [
      { description: 'FMCG Supply — Maize Flour 50kg x 20', qty: 20, unitPrice: 4200, vatApplicable: false },
      { description: 'Delivery fee', qty: 1, unitPrice: 1500, vatApplicable: false },
    ],
    subtotal: 85500, vatAmount: 0, total: 85500, paid: 40500,
    status: 'sent', dueDate: '2026-03-25', createdAt: '2026-03-18',
  },
  {
    id: 'INV-2026-000120', contactId: 'c5', contactName: 'Sarah Wanjiku', contactPhone: '+254755321098',
    lineItems: [{ description: 'Weekly Catering — Corporate Box (20 pax)', qty: 1, unitPrice: 4500, vatApplicable: true }],
    subtotal: 4500, vatAmount: 720, total: 5220, paid: 5220,
    status: 'paid', dueDate: '2026-03-15', createdAt: '2026-03-08', mpesaReceipt: 'QFH12XYZ',
  },
  {
    id: 'INV-2026-000119', contactId: 'c9', contactName: 'Aisha Abdullahi', contactPhone: '+254711889900',
    lineItems: [{ description: 'Dress Bundle x3 — Mixed styles', qty: 3, unitPrice: 2800, vatApplicable: false }],
    subtotal: 8400, vatAmount: 0, total: 8400, paid: 0,
    status: 'overdue', dueDate: '2026-03-08', createdAt: '2026-03-01',
  },
  {
    id: 'INV-2026-000118', contactId: 'c7', contactName: 'Fatuma Hassan', contactPhone: '+254700112233',
    lineItems: [{ description: 'Floral Maxi Dress — Size M', qty: 1, unitPrice: 3800, vatApplicable: false }],
    subtotal: 3800, vatAmount: 0, total: 3800, paid: 0,
    status: 'sent', dueDate: '2026-03-22', createdAt: '2026-03-15',
  },
  {
    id: 'INV-2026-000117', contactId: 'c3', contactName: 'Mercy Njoroge', contactPhone: '+254733987654',
    lineItems: [{ description: 'Salon Monthly Subscription — March', qty: 1, unitPrice: 12500, vatApplicable: true }],
    subtotal: 12500, vatAmount: 2000, total: 14500, paid: 0,
    status: 'overdue', dueDate: '2026-03-05', createdAt: '2026-02-28',
  },
  {
    id: 'INV-2026-000116', contactId: 'c8', contactName: 'Peter Njuguna', contactPhone: '+254744556677',
    lineItems: [
      { description: 'Enterprise Automation Setup', qty: 1, unitPrice: 85000, vatApplicable: true },
      { description: 'Monthly SLA Support', qty: 3, unitPrice: 15000, vatApplicable: true },
    ],
    subtotal: 130000, vatAmount: 20800, total: 150800, paid: 150800,
    status: 'paid', dueDate: '2026-02-28', createdAt: '2026-02-14', mpesaReceipt: 'PKJ88901',
  },
];

/* ─── Campaigns ─────────────────────────────────────────────────────── */

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
export type CampaignType = 'broadcast' | 'drip' | 'automated';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audience: string;
  audienceCount: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  converted: number;
  revenueAttributed: number; // KES
  scheduledAt?: string;
  createdAt: string;
}

export const CAMPAIGNS: Campaign[] = [
  { id: 'camp1', name: 'March Fashion Sale', type: 'broadcast', status: 'completed', audience: 'VIP + Repeat Buyers', audienceCount: 243, sent: 243, delivered: 239, read: 198, replied: 42, converted: 31, revenueAttributed: 87400, scheduledAt: '2026-03-01 09:00', createdAt: '2026-02-27' },
  { id: 'camp2', name: 'New Customer Welcome Drip', type: 'drip', status: 'running', audience: 'New Leads (last 30d)', audienceCount: 118, sent: 118, delivered: 115, read: 89, replied: 22, converted: 8, revenueAttributed: 23600, createdAt: '2026-02-15' },
  { id: 'camp3', name: 'Overdue Payment Reminder', type: 'automated', status: 'running', audience: 'Overdue invoices', audienceCount: 14, sent: 14, delivered: 14, read: 11, replied: 5, converted: 3, revenueAttributed: 41200, createdAt: '2026-03-01' },
  { id: 'camp4', name: 'Re-engagement — 60 day inactive', type: 'automated', status: 'running', audience: '#inactive tag', audienceCount: 38, sent: 38, delivered: 36, read: 19, replied: 4, converted: 1, revenueAttributed: 4800, createdAt: '2026-02-01' },
  { id: 'camp5', name: 'Easter Promo 2026', type: 'broadcast', status: 'scheduled', audience: 'All opted-in contacts', audienceCount: 892, sent: 0, delivered: 0, read: 0, replied: 0, converted: 0, revenueAttributed: 0, scheduledAt: '2026-04-18 08:00', createdAt: '2026-03-19' },
  { id: 'camp6', name: 'Birthday Greetings', type: 'automated', status: 'paused', audience: 'Birthday this month', audienceCount: 7, sent: 3, delivered: 3, read: 3, replied: 1, converted: 1, revenueAttributed: 3200, createdAt: '2026-01-01' },
];

/* ─── Auto-reply rules ───────────────────────────────────────────────── */

export interface AutoReply {
  id: string;
  name: string;
  trigger: string;
  response: string;
  active: boolean;
  triggerCount: number;
}

export const AUTO_REPLIES: AutoReply[] = [
  { id: 'ar1', name: 'Pricing Inquiry',   trigger: 'price, cost, bei gani, ngapi',      response: '"Pricing Info" template',              active: true,  triggerCount: 342 },
  { id: 'ar2', name: 'Off-Hours',         trigger: 'After 6 PM, Before 8 AM (EAT)',     response: '"We\'ll respond by 8 AM" template',   active: true,  triggerCount: 89  },
  { id: 'ar3', name: 'Greeting',          trigger: 'hi, hello, habari, mambo, sasa',    response: '"Welcome" template + menu',            active: true,  triggerCount: 1204 },
  { id: 'ar4', name: 'Order Inquiry',     trigger: 'order, oda, track, wapi',           response: '"Order Status" template',              active: true,  triggerCount: 167 },
  { id: 'ar5', name: 'All Agents Busy',   trigger: 'Queue > 10 conversations',          response: '"Queue position" template',            active: false, triggerCount: 12  },
  { id: 'ar6', name: 'Opt-out',           trigger: 'STOP, UNSUBSCRIBE, CANCEL, ACHA',  response: 'Unsubscribe confirmation + log',       active: true,  triggerCount: 8   },
];

/* ─── Analytics ──────────────────────────────────────────────────────── */

export const REVENUE_CHART = [
  { date: 'Mar 13', revenue: 34200, conversations: 38 },
  { date: 'Mar 14', revenue: 28900, conversations: 31 },
  { date: 'Mar 15', revenue: 52400, conversations: 54 },
  { date: 'Mar 16', revenue: 41800, conversations: 46 },
  { date: 'Mar 17', revenue: 67300, conversations: 71 },
  { date: 'Mar 18', revenue: 45600, conversations: 49 },
  { date: 'Mar 19', revenue: 38500, conversations: 42 },
];

export const FUNNEL = [
  { stage: 'Conversations', count: 892 },
  { stage: 'Quotes Sent',   count: 187 },
  { stage: 'Accepted',      count: 112 },
  { stage: 'Invoiced',      count: 108 },
  { stage: 'Paid',          count: 89  },
];

export const TEAM_PERFORMANCE = [
  { agent: 'Grace M.',    conversations: 34, avgResponseMins: 3.2, csat: 4.8 },
  { agent: 'David O.',    conversations: 28, avgResponseMins: 4.5, csat: 4.6 },
  { agent: 'Sarah W.',    conversations: 21, avgResponseMins: 2.9, csat: 4.9 },
  { agent: 'Bot (auto)',  conversations: 289, avgResponseMins: 0.2, csat: 4.4 },
];

/* ─── Appointments ───────────────────────────────────────────────────── */

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'no_show' | 'cancelled';

export interface Appointment {
  id: string;
  contactName: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  depositPaid: boolean;
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'apt1', contactName: 'Mercy Njoroge',  service: 'Hair Treatment',        staff: 'Mary K.',   date: '2026-03-20', time: '10:00 AM', status: 'confirmed',  depositPaid: true  },
  { id: 'apt2', contactName: 'Aisha Abdullahi',service: 'Manicure + Pedicure',   staff: 'Joy A.',    date: '2026-03-20', time: '2:00 PM',  status: 'pending',    depositPaid: false },
  { id: 'apt3', contactName: 'Grace Mwangi',   service: 'Facial + Massage',      staff: 'Mary K.',   date: '2026-03-21', time: '11:00 AM', status: 'confirmed',  depositPaid: true  },
  { id: 'apt4', contactName: 'Fatuma Hassan',  service: 'Hair Braiding',         staff: 'Joy A.',    date: '2026-03-22', time: '9:00 AM',  status: 'pending',    depositPaid: false },
  { id: 'apt5', contactName: 'John Kamau',     service: 'Barber — Full Cut',     staff: 'Peter M.',  date: '2026-03-19', time: '3:00 PM',  status: 'completed',  depositPaid: false },
];

/* ─── Orders ─────────────────────────────────────────────────────────── */

export type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  contactName: string;
  contactPhone: string;
  items: string;
  total: number;
  status: OrderStatus;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
}

export const ORDERS: Order[] = [
  { id: 'ORD-2026-000051', contactName: 'Grace Mwangi',   contactPhone: '+254712345678', items: 'Floral Dress x2, Blouse x1', total: 10500, status: 'shipped',    courier: 'Sendy',  trackingNumber: 'SND-88123', createdAt: '2026-03-17' },
  { id: 'ORD-2026-000050', contactName: 'Sarah Wanjiku',  contactPhone: '+254755321098', items: 'Catering Box x10',            total: 22500, status: 'delivered',  createdAt: '2026-03-14' },
  { id: 'ORD-2026-000049', contactName: 'John Kamau',     contactPhone: '+254722123456', items: 'Nike Air Max x2',             total: 12000, status: 'processing', createdAt: '2026-03-16' },
  { id: 'ORD-2026-000048', contactName: 'Aisha Abdullahi',contactPhone: '+254711889900', items: 'Dress Bundle x3',             total: 8400,  status: 'confirmed',  createdAt: '2026-03-18' },
  { id: 'ORD-2026-000047', contactName: 'Fatuma Hassan',  contactPhone: '+254700112233', items: 'Maxi Dress x1',               total: 3800,  status: 'delivered',  createdAt: '2026-03-13' },
];

/* ─── KPI Summary (today) ─────────────────────────────────────────────── */

export const TODAY_STATS = {
  conversations: { value: 45, change: 12, vsYesterday: true  },
  revenue:        { value: 156400, change: 8, vsYesterday: true  },
  quotesAccepted: { value: 9, rate: 39, change: 5, vsYesterday: true  },
  csat:           { value: 4.6, change: 0.2, vsYesterday: false },
};

export const ALERTS = [
  { type: 'overdue',      message: '5 invoices overdue',                     href: '/dashboard/invoices?status=overdue' },
  { type: 'appointment',  message: '2 appointments need confirmation',       href: '/dashboard/appointments' },
  { type: 'template',     message: '1 WhatsApp template pending approval',   href: '/dashboard/automations' },
];

/* ─── Products ───────────────────────────────────────────────────────── */

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;          // KES selling price
  comparePrice?: number;  // KES compare-at (shows strikethrough)
  costPrice?: number;     // KES cost (for margin calc)
  stock: number;
  lowStockThreshold: number;
  trackStock: boolean;
  status: ProductStatus;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // tailwind bg class for the swatch
  createdAt: string;
}

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Dresses',     slug: 'dresses',     description: 'Maxi, midi, mini and occasion dresses.',          color: '#f43f5e', createdAt: '2026-01-01' },
  { id: 'cat2', name: 'Tops',        slug: 'tops',         description: 'Blouses, shirts, crop tops and off-shoulders.',    color: '#a855f7', createdAt: '2026-01-01' },
  { id: 'cat3', name: 'Bottoms',     slug: 'bottoms',      description: 'Jeans, skirts, trousers and shorts.',             color: '#3b82f6', createdAt: '2026-01-01' },
  { id: 'cat4', name: 'Accessories', slug: 'accessories',  description: 'Jewellery, bags, belts and scarves.',             color: '#f59e0b', createdAt: '2026-01-01' },
  { id: 'cat5', name: 'Footwear',    slug: 'footwear',     description: 'Heels, flats, sandals and sneakers.',             color: '#14b8a6', createdAt: '2026-01-01' },
  { id: 'cat6', name: 'Kids',        slug: 'kids',         description: 'Clothing and accessories for children aged 0–12.',color: '#22c55e', createdAt: '2026-01-01' },
];

// Derived string list — kept for backward compat with Product.category field
export const PRODUCT_CATEGORIES = CATEGORIES.map((c) => c.name);

export const PRODUCTS: Product[] = [
  { id: 'prod1',  name: 'Floral Maxi Dress',       sku: 'KF-DRS-001', category: 'Dresses',     description: 'Elegant floral maxi dress, perfect for events and casual outings.', price: 3800, comparePrice: 4500, costPrice: 1800, stock: 14, lowStockThreshold: 5,  trackStock: true,  status: 'active',   tags: ['summer','floral','bestseller'],      createdAt: '2026-01-10' },
  { id: 'prod2',  name: 'Bodycon Dress — Solid',   sku: 'KF-DRS-002', category: 'Dresses',     description: 'Figure-hugging bodycon dress available in multiple colours.',         price: 2500,                    costPrice:  900, stock:  3, lowStockThreshold: 5,  trackStock: true,  status: 'active',   tags: ['party','evening'],                  createdAt: '2026-01-15' },
  { id: 'prod3',  name: 'Ankara Print Dress',       sku: 'KF-DRS-003', category: 'Dresses',     description: 'Vibrant Ankara print, knee-length, custom made.',                     price: 4200,                    costPrice: 1600, stock:  0, lowStockThreshold: 3,  trackStock: true,  status: 'active',   tags: ['ankara','african'],                 createdAt: '2026-01-20' },
  { id: 'prod4',  name: 'Linen Blouse — White',    sku: 'KF-TOP-001', category: 'Tops',        description: 'Breathable linen blouse, office-ready styling.',                      price: 1800, comparePrice: 2200, costPrice:  700, stock: 22, lowStockThreshold: 8,  trackStock: true,  status: 'active',   tags: ['office','casual','linen'],          createdAt: '2026-01-25' },
  { id: 'prod5',  name: 'Off-Shoulder Top',         sku: 'KF-TOP-002', category: 'Tops',        description: 'Trendy off-shoulder crop top, various colors available.',              price: 1200,                    costPrice:  450, stock:  9, lowStockThreshold: 5,  trackStock: true,  status: 'active',   tags: ['casual','trendy'],                  createdAt: '2026-02-01' },
  { id: 'prod6',  name: 'High-Waist Jeans',         sku: 'KF-BOT-001', category: 'Bottoms',     description: 'Slim-fit high-waist jeans, sizes 6–18.',                              price: 3200, comparePrice: 3800, costPrice: 1400, stock: 18, lowStockThreshold: 6,  trackStock: true,  status: 'active',   tags: ['denim','jeans','bestseller'],       createdAt: '2026-02-05' },
  { id: 'prod7',  name: 'Pleated Midi Skirt',       sku: 'KF-BOT-002', category: 'Bottoms',     description: 'Elegant pleated midi skirt in satin finish.',                          price: 2200,                    costPrice:  800, stock:  7, lowStockThreshold: 5,  trackStock: true,  status: 'active',   tags: ['office','elegant'],                 createdAt: '2026-02-10' },
  { id: 'prod8',  name: 'Pearl Necklace Set',       sku: 'KF-ACC-001', category: 'Accessories', description: 'Faux pearl necklace & earring set. Bridal-ready.',                    price:  950,                    costPrice:  300, stock: 31, lowStockThreshold: 10, trackStock: true,  status: 'active',   tags: ['jewellery','bridal'],               createdAt: '2026-02-12' },
  { id: 'prod9',  name: 'Leather Tote Bag',         sku: 'KF-ACC-002', category: 'Accessories', description: 'Spacious faux-leather tote, laptop-friendly.',                         price: 2800, comparePrice: 3500, costPrice: 1100, stock:  2, lowStockThreshold: 4,  trackStock: true,  status: 'active',   tags: ['bag','office'],                     createdAt: '2026-02-14' },
  { id: 'prod10', name: 'Block Heel Sandals',        sku: 'KF-FTW-001', category: 'Footwear',    description: 'Comfortable block heels, sizes 36–42.',                                price: 3500,                    costPrice: 1500, stock:  5, lowStockThreshold: 5,  trackStock: true,  status: 'active',   tags: ['shoes','heels'],                    createdAt: '2026-02-18' },
  { id: 'prod11', name: 'Kids Ankara Dress',         sku: 'KF-KID-001', category: 'Kids',        description: 'Colourful Ankara dress for girls aged 3–12.',                          price: 1600,                    costPrice:  600, stock: 11, lowStockThreshold: 5,  trackStock: true,  status: 'draft',    tags: ['kids','ankara'],                    createdAt: '2026-02-20' },
  { id: 'prod12', name: 'Satin Wrap Dress',          sku: 'KF-DRS-004', category: 'Dresses',     description: 'Luxurious satin wrap dress for special occasions.',                    price: 5500, comparePrice: 6500, costPrice: 2200, stock:  6, lowStockThreshold: 3,  trackStock: true,  status: 'active',   tags: ['special','luxury','occasion'],      createdAt: '2026-02-25' },
];

/* ─── Abandoned Carts ────────────────────────────────────────────────── */

export type CartRecoveryStatus = 'none' | 'reminded' | 'recovered' | 'lost';

export interface CartLineItem {
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface AbandonedCart {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  channel: 'whatsapp' | 'sms';
  items: CartLineItem[];
  total: number;
  abandonedAt: string; // ISO datetime
  recoveryStatus: CartRecoveryStatus;
  reminderSentAt?: string;
  recoveredAt?: string;
}

export const ABANDONED_CARTS: AbandonedCart[] = [
  { id: 'cart1', contactId: 'c1',  contactName: 'Grace Mwangi',    contactPhone: '+254712345678', channel: 'whatsapp', items: [{ productName: 'Floral Maxi Dress', sku: 'KF-DRS-001', qty: 2, unitPrice: 3800 }, { productName: 'Pearl Necklace Set', sku: 'KF-ACC-001', qty: 1, unitPrice: 950 }],                               total:  8550, abandonedAt: '2026-03-19T08:23:00', recoveryStatus: 'none' },
  { id: 'cart2', contactId: 'c9',  contactName: 'Aisha Abdullahi', contactPhone: '+254711889900', channel: 'whatsapp', items: [{ productName: 'Bodycon Dress — Solid', sku: 'KF-DRS-002', qty: 1, unitPrice: 2500 }, { productName: 'Off-Shoulder Top', sku: 'KF-TOP-002', qty: 2, unitPrice: 1200 }],                              total:  4900, abandonedAt: '2026-03-19T06:12:00', recoveryStatus: 'none' },
  { id: 'cart3', contactId: 'c7',  contactName: 'Fatuma Hassan',   contactPhone: '+254700112233', channel: 'whatsapp', items: [{ productName: 'Satin Wrap Dress', sku: 'KF-DRS-004', qty: 1, unitPrice: 5500 }],                                                                                                                     total:  5500, abandonedAt: '2026-03-18T14:45:00', recoveryStatus: 'reminded', reminderSentAt: '2026-03-18T17:00:00' },
  { id: 'cart4', contactId: 'c3',  contactName: 'Mercy Njoroge',   contactPhone: '+254733987654', channel: 'whatsapp', items: [{ productName: 'High-Waist Jeans', sku: 'KF-BOT-001', qty: 1, unitPrice: 3200 }, { productName: 'Linen Blouse — White', sku: 'KF-TOP-001', qty: 2, unitPrice: 1800 }],                             total:  6800, abandonedAt: '2026-03-18T09:30:00', recoveryStatus: 'reminded', reminderSentAt: '2026-03-18T12:00:00' },
  { id: 'cart5', contactId: 'c5',  contactName: 'Sarah Wanjiku',   contactPhone: '+254755321098', channel: 'sms',       items: [{ productName: 'Pleated Midi Skirt', sku: 'KF-BOT-002', qty: 1, unitPrice: 2200 }, { productName: 'Pearl Necklace Set', sku: 'KF-ACC-001', qty: 2, unitPrice: 950 }],                               total:  4100, abandonedAt: '2026-03-17T16:20:00', recoveryStatus: 'recovered', reminderSentAt: '2026-03-17T18:00:00', recoveredAt: '2026-03-18T09:15:00' },
  { id: 'cart6', contactId: 'c10', contactName: 'Kevin Otieno',    contactPhone: '+254766334455', channel: 'whatsapp', items: [{ productName: 'Block Heel Sandals', sku: 'KF-FTW-001', qty: 1, unitPrice: 3500 }, { productName: 'Leather Tote Bag', sku: 'KF-ACC-002', qty: 1, unitPrice: 2800 }],                                total:  6300, abandonedAt: '2026-03-17T11:05:00', recoveryStatus: 'recovered', reminderSentAt: '2026-03-17T14:00:00', recoveredAt: '2026-03-17T19:30:00' },
  { id: 'cart7', contactId: 'c6',  contactName: 'James Mutua',     contactPhone: '+254788456789', channel: 'sms',       items: [{ productName: 'Ankara Print Dress', sku: 'KF-DRS-003', qty: 1, unitPrice: 4200 }],                                                                                                                    total:  4200, abandonedAt: '2026-03-16T13:40:00', recoveryStatus: 'lost',      reminderSentAt: '2026-03-16T16:00:00' },
  { id: 'cart8', contactId: 'c2',  contactName: 'John Kamau',      contactPhone: '+254722123456', channel: 'whatsapp', items: [{ productName: 'High-Waist Jeans', sku: 'KF-BOT-001', qty: 2, unitPrice: 3200 }, { productName: 'Off-Shoulder Top', sku: 'KF-TOP-002', qty: 1, unitPrice: 1200 }],                                total:  7600, abandonedAt: '2026-03-15T10:15:00', recoveryStatus: 'none' },
];

/* ─── Daily Reports ──────────────────────────────────────────────────── */

export interface DailyReport {
  date: string;       // YYYY-MM-DD
  revenue: number;    // KES
  orders: number;
  avgOrderValue: number; // KES
  newCustomers: number;
  conversations: number;
  topProduct: string;
}

export const DAILY_REPORTS: DailyReport[] = [
  { date: '2026-02-18', revenue: 41200, orders: 11, avgOrderValue: 3745, newCustomers: 2, conversations: 38, topProduct: 'Linen Blouse — White' },
  { date: '2026-02-19', revenue: 38600, orders:  9, avgOrderValue: 4289, newCustomers: 1, conversations: 32, topProduct: 'Floral Maxi Dress' },
  { date: '2026-02-20', revenue: 56800, orders: 14, avgOrderValue: 4057, newCustomers: 4, conversations: 51, topProduct: 'High-Waist Jeans' },
  { date: '2026-02-21', revenue: 62400, orders: 15, avgOrderValue: 4160, newCustomers: 3, conversations: 58, topProduct: 'Satin Wrap Dress' },
  { date: '2026-02-22', revenue: 44100, orders: 11, avgOrderValue: 4009, newCustomers: 2, conversations: 43, topProduct: 'Floral Maxi Dress' },
  { date: '2026-02-23', revenue: 29800, orders:  8, avgOrderValue: 3725, newCustomers: 1, conversations: 27, topProduct: 'Pearl Necklace Set' },
  { date: '2026-02-24', revenue: 18400, orders:  6, avgOrderValue: 3067, newCustomers: 0, conversations: 19, topProduct: 'Off-Shoulder Top' },
  { date: '2026-02-25', revenue: 47200, orders: 12, avgOrderValue: 3933, newCustomers: 3, conversations: 44, topProduct: 'High-Waist Jeans' },
  { date: '2026-02-26', revenue: 53600, orders: 13, avgOrderValue: 4123, newCustomers: 2, conversations: 49, topProduct: 'Satin Wrap Dress' },
  { date: '2026-02-27', revenue: 61000, orders: 15, avgOrderValue: 4067, newCustomers: 5, conversations: 57, topProduct: 'Floral Maxi Dress' },
  { date: '2026-02-28', revenue: 72400, orders: 18, avgOrderValue: 4022, newCustomers: 4, conversations: 66, topProduct: 'High-Waist Jeans' },
  { date: '2026-03-01', revenue: 48900, orders: 12, avgOrderValue: 4075, newCustomers: 3, conversations: 47, topProduct: 'Linen Blouse — White' },
  { date: '2026-03-02', revenue: 33200, orders:  9, avgOrderValue: 3689, newCustomers: 2, conversations: 31, topProduct: 'Bodycon Dress — Solid' },
  { date: '2026-03-03', revenue: 22100, orders:  7, avgOrderValue: 3157, newCustomers: 1, conversations: 23, topProduct: 'Pearl Necklace Set' },
  { date: '2026-03-04', revenue: 54300, orders: 13, avgOrderValue: 4177, newCustomers: 4, conversations: 51, topProduct: 'Floral Maxi Dress' },
  { date: '2026-03-05', revenue: 67800, orders: 16, avgOrderValue: 4238, newCustomers: 5, conversations: 62, topProduct: 'Satin Wrap Dress' },
  { date: '2026-03-06', revenue: 71200, orders: 17, avgOrderValue: 4188, newCustomers: 3, conversations: 68, topProduct: 'High-Waist Jeans' },
  { date: '2026-03-07', revenue: 58400, orders: 14, avgOrderValue: 4171, newCustomers: 2, conversations: 55, topProduct: 'Floral Maxi Dress' },
  { date: '2026-03-08', revenue: 43600, orders: 11, avgOrderValue: 3964, newCustomers: 1, conversations: 41, topProduct: 'Pleated Midi Skirt' },
  { date: '2026-03-09', revenue: 29100, orders:  8, avgOrderValue: 3638, newCustomers: 2, conversations: 29, topProduct: 'Off-Shoulder Top' },
  { date: '2026-03-10', revenue: 19800, orders:  6, avgOrderValue: 3300, newCustomers: 0, conversations: 21, topProduct: 'Pearl Necklace Set' },
  { date: '2026-03-11', revenue: 52400, orders: 13, avgOrderValue: 4031, newCustomers: 3, conversations: 49, topProduct: 'High-Waist Jeans' },
  { date: '2026-03-12', revenue: 61700, orders: 15, avgOrderValue: 4113, newCustomers: 4, conversations: 58, topProduct: 'Floral Maxi Dress' },
  { date: '2026-03-13', revenue: 34200, orders:  9, avgOrderValue: 3800, newCustomers: 2, conversations: 38, topProduct: 'Linen Blouse — White' },
  { date: '2026-03-14', revenue: 28900, orders:  8, avgOrderValue: 3613, newCustomers: 1, conversations: 31, topProduct: 'Bodycon Dress — Solid' },
  { date: '2026-03-15', revenue: 52400, orders: 13, avgOrderValue: 4031, newCustomers: 3, conversations: 54, topProduct: 'Satin Wrap Dress' },
  { date: '2026-03-16', revenue: 41800, orders: 10, avgOrderValue: 4180, newCustomers: 2, conversations: 46, topProduct: 'High-Waist Jeans' },
  { date: '2026-03-17', revenue: 67300, orders: 16, avgOrderValue: 4206, newCustomers: 5, conversations: 71, topProduct: 'Floral Maxi Dress' },
  { date: '2026-03-18', revenue: 45600, orders: 11, avgOrderValue: 4145, newCustomers: 2, conversations: 49, topProduct: 'Ankara Print Dress' },
  { date: '2026-03-19', revenue: 38500, orders: 10, avgOrderValue: 3850, newCustomers: 2, conversations: 42, topProduct: 'High-Waist Jeans' },
];
