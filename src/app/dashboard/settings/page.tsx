'use client';

import { useState } from 'react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineChat,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';
import { cn } from '@/lib/cn';

/* ─── Types ───────────────────────────────────────────────────────────── */

type SettingsTab = 'profile' | 'whatsapp' | 'mpesa' | 'team' | 'billing';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  role: 'Admin' | 'Agent' | 'Accountant';
  status: 'active' | 'invited' | 'deactivated';
  lastLogin?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'u1', name: 'Grace Mwangi',   phone: '+254712345678', role: 'Admin',     status: 'active',     lastLogin: '2026-03-19 08:12' },
  { id: 'u2', name: 'David Ochieng',  phone: '+254701234567', role: 'Agent',     status: 'active',     lastLogin: '2026-03-19 07:55' },
  { id: 'u3', name: 'Mary Kamau',     phone: '+254733111222', role: 'Agent',     status: 'invited'  },
  { id: 'u4', name: 'Peter Njuguna',  phone: '+254744556677', role: 'Accountant',status: 'active',     lastLogin: '2026-03-18 14:30' },
];

const ROLE_COLORS: Record<string, string> = {
  Admin:      'bg-orange-100 text-orange-700',
  Agent:      'bg-blue-100 text-blue-700',
  Accountant: 'bg-green-100 text-green-700',
};

/* ─── Settings section wrapper ────────────────────────────────────────── */

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 border-b border-gray-100 pb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-start">
      <label className="pt-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function TextInput({ defaultValue, placeholder, type = 'text' }: { defaultValue?: string; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
    />
  );
}

/* ─── Tabs ─────────────────────────────────────────────────────────────── */

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'profile',   label: 'Business profile',    icon: HiOutlineOfficeBuilding },
  { key: 'whatsapp',  label: 'WhatsApp',             icon: HiOutlineChat },
  { key: 'mpesa',     label: 'M-Pesa',               icon: HiOutlineCurrencyDollar },
  { key: 'team',      label: 'Team members',         icon: HiOutlineUsers },
  { key: 'billing',   label: 'Subscription',         icon: HiOutlineCreditCard },
];

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [tab, setTab]             = useState<SettingsTab>('profile');
  const [showSecret, setShowSecret] = useState(false);
  const [language, setLanguage]   = useState<'en' | 'sw'>('en');
  const [vatRegistered, setVatReg] = useState(true);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">Manage your business profile, integrations, and team</p>
      </div>

      {/* Tab strip */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              tab === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Business Profile ── */}
      {tab === 'profile' && (
        <div className="space-y-5">
          <Section title="Business details" description="This info appears on your invoices and WhatsApp business profile">
            <div className="space-y-4">
              <Field label="Business name"><TextInput defaultValue="Kuzafy Fashion KE" /></Field>
              <Field label="Description"><TextInput defaultValue="Affordable fashion for every Nairobi woman" /></Field>
              <Field label="Business address"><TextInput defaultValue="Westlands, Nairobi, Kenya" /></Field>
              <Field label="KRA PIN"><TextInput defaultValue="A012345678B" placeholder="A012345678B" /></Field>
              <Field label="VAT registered">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVatReg((v) => !v)}
                    className={cn('relative h-5 w-9 rounded-full transition-colors', vatRegistered ? 'bg-orange-500' : 'bg-gray-200')}
                  >
                    <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', vatRegistered ? 'translate-x-4' : 'translate-x-0')} />
                  </button>
                  <span className="text-sm text-gray-600">{vatRegistered ? 'Yes — 16% VAT applies' : 'No — VAT exempt'}</span>
                </div>
              </Field>
              <Field label="Dashboard language">
                <div className="flex gap-2">
                  {(['en', 'sw'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        'rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
                        language === lang
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',
                      )}
                    >
                      {lang === 'en' ? '🇬🇧 English' : '🇰🇪 Swahili'}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
              <button className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                Save changes
              </button>
            </div>
          </Section>

          <Section title="Operating hours" description="Used for off-hours auto-replies">
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-gray-700">{day}</span>
                  <input type="time" defaultValue={day === 'Sunday' ? '' : '08:00'} className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus:border-orange-300 focus:outline-none" />
                  <span className="text-gray-400 text-sm">—</span>
                  <input type="time" defaultValue={day === 'Sunday' ? '' : '18:00'} className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus:border-orange-300 focus:outline-none" />
                  {day === 'Sunday' && <span className="text-xs text-gray-400">Closed</span>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── WhatsApp ── */}
      {tab === 'whatsapp' && (
        <div className="space-y-5">
          <Section title="WhatsApp Business connection">
            <div className="flex items-center gap-4 rounded-xl bg-green-50 border border-green-200 p-4">
              <HiOutlineCheckCircle className="h-8 w-8 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-800">Connected</p>
                <p className="text-sm text-green-700">+254 720 123 456 · Kuzafy Fashion KE</p>
                <p className="text-xs text-green-600 mt-0.5">Last message received: 2 minutes ago · Quality: High ⭐</p>
              </div>
              <button className="rounded-xl border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors">
                Reconnect
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <Field label="Display name"><TextInput defaultValue="Kuzafy Fashion KE" /></Field>
              <Field label="Phone number"><TextInput defaultValue="+254720123456" /></Field>
              <Field label="Webhook health">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Healthy — last event 2m ago</span>
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Template submission status" description="Templates must be approved by Meta before they can be sent as business-initiated messages">
            <div className="space-y-2 text-sm">
              {[
                { name: 'welcome_new_contact',  status: 'approved' as const },
                { name: 'payment_received',     status: 'approved' as const },
                { name: 'payment_overdue_7d',   status: 'pending'  as const },
                { name: 'post_purchase_followup', status: 'pending' as const },
                { name: 'birthday_greeting',    status: 'rejected' as const },
              ].map((t) => {
                const Icon = t.status === 'approved' ? HiOutlineCheckCircle : t.status === 'pending' ? HiOutlineClock : HiOutlineExclamationCircle;
                const colors = { approved: 'text-green-600', pending: 'text-yellow-600', rejected: 'text-red-500' };
                return (
                  <div key={t.name} className="flex items-center gap-3">
                    <Icon className={cn('h-4 w-4 shrink-0', colors[t.status])} />
                    <code className="flex-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">{t.name}</code>
                    <span className={cn('text-xs font-medium capitalize', colors[t.status])}>{t.status}</span>
                    {t.status === 'rejected' && (
                      <button className="rounded-lg bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 hover:bg-orange-100 transition-colors">
                        Resubmit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── M-Pesa ── */}
      {tab === 'mpesa' && (
        <div className="space-y-5">
          <Section title="Daraja API credentials" description="Used to initiate STK Push payments and receive callbacks">
            <div className="space-y-4">
              <Field label="Consumer key">
                <div className="flex items-center gap-2">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    defaultValue="abc123xyz789daraja"
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                  <button onClick={() => setShowSecret((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showSecret ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>
              <Field label="Consumer secret">
                <input
                  type={showSecret ? 'text' : 'password'}
                  defaultValue="secret_key_example"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </Field>
              <Field label="PayBill / Till number"><TextInput defaultValue="522533" /></Field>
              <Field label="Account reference"><TextInput defaultValue="KuzafyFashion" placeholder="Appears on customer M-Pesa prompt" /></Field>
              <Field label="Callback URL">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500">
                  <span className="flex-1 font-mono text-xs">https://api.kuzafy.co.ke/webhooks/mpesa</span>
                  <span className="text-green-500 text-xs font-medium">✓ Pre-configured</span>
                </div>
              </Field>
              <Field label="Environment">
                <div className="flex gap-2">
                  {(['sandbox', 'production'] as const).map((env) => (
                    <button
                      key={env}
                      className={cn(
                        'rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-colors',
                        env === 'production'
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500',
                      )}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <HiOutlineRefresh className="h-4 w-4" /> Test connection
              </button>
              <button className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                Save credentials
              </button>
            </div>
          </Section>

          <Section title="Payment reconciliation" description="How Kuzafy matches M-Pesa callbacks to invoices">
            <div className="space-y-3 text-sm">
              {[
                { label: 'Auto-match (exact amount + account ref)',          status: '✅ Enabled' },
                { label: 'Fuzzy match (±2% amount + phone match)',          status: '✅ Enabled' },
                { label: 'Manual match queue for unrecognised payments',     status: '✅ Enabled' },
                { label: 'Duplicate receipt detection',                      status: '✅ Enabled' },
                { label: 'Safaricom IP whitelist',                          status: '✅ Active' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="text-green-600 font-medium text-xs">{row.status}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── Team ── */}
      {tab === 'team' && (
        <div className="space-y-5">
          <Section title="Team members" description="Invite by phone number — they receive a WhatsApp invite">
            <div className="space-y-3">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', ROLE_COLORS[member.role])}>
                        {member.role}
                      </span>
                      {member.status === 'invited' && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">Invited</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {member.phone}
                      {member.lastLogin && ` · Last login: ${member.lastLogin}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors">
                      <HiOutlinePencil className="h-3.5 w-3.5" />
                    </button>
                    {member.id !== 'u1' && (
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <HiOutlineTrash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition-colors hover:border-orange-300 hover:text-orange-500">
              <HiOutlinePlus className="h-4 w-4" /> Invite team member
            </button>
          </Section>

          <Section title="Roles & permissions">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-2 text-left font-semibold text-gray-500">Permission</th>
                    <th className="pb-2 text-center font-semibold text-orange-600">Owner</th>
                    <th className="pb-2 text-center font-semibold text-gray-600">Admin</th>
                    <th className="pb-2 text-center font-semibold text-blue-600">Agent</th>
                    <th className="pb-2 text-center font-semibold text-green-600">Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { perm: 'View inbox & reply',     owner: true,  admin: true,  agent: true,  acc: false },
                    { perm: 'Create invoices',        owner: true,  admin: true,  agent: true,  acc: true  },
                    { perm: 'View all invoices',      owner: true,  admin: true,  agent: false, acc: true  },
                    { perm: 'Manage contacts',        owner: true,  admin: true,  agent: true,  acc: false },
                    { perm: 'Send broadcasts',        owner: true,  admin: true,  agent: false, acc: false },
                    { perm: 'View analytics',         owner: true,  admin: true,  agent: false, acc: true  },
                    { perm: 'Manage automations',     owner: true,  admin: true,  agent: false, acc: false },
                    { perm: 'Connect WhatsApp',       owner: true,  admin: false, agent: false, acc: false },
                    { perm: 'Billing & subscription', owner: true,  admin: false, agent: false, acc: false },
                  ].map((row) => (
                    <tr key={row.perm}>
                      <td className="py-2.5 text-gray-600">{row.perm}</td>
                      {[row.owner, row.admin, row.agent, row.acc].map((v, i) => (
                        <td key={i} className="py-2.5 text-center">
                          {v ? <span className="text-green-500">✅</span> : <span className="text-gray-300">❌</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── Billing ── */}
      {tab === 'billing' && (
        <div className="space-y-5">
          <Section title="Current plan">
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-orange-900 text-lg">Starter plan <span className="text-sm font-medium text-orange-600">("Grace Plan")</span></p>
                  <p className="text-sm text-orange-700 mt-0.5">KES 2,500 / month</p>
                  <div className="mt-2 space-y-1 text-xs text-orange-800">
                    <p>✅ 1 agent inbox · ✅ 500 contacts · ✅ 50 invoices/month</p>
                    <p>✅ M-Pesa STK Push · ✅ Basic auto-replies · ✅ Digital receipts</p>
                    <p>❌ Broadcasts · ❌ Appointments · ❌ CRM segments</p>
                  </div>
                </div>
                <button className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                  Upgrade
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              {[
                { name: 'Starter', price: 'KES 2,500', current: true },
                { name: 'Growth',  price: 'KES 10,000', current: false },
                { name: 'Scale',   price: 'KES 25,000+', current: false },
              ].map((plan) => (
                <div key={plan.name} className={cn(
                  'rounded-xl border p-3 transition-all',
                  plan.current ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300 cursor-pointer',
                )}>
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-gray-500 mt-0.5">{plan.price}/mo</p>
                  {plan.current && <p className="mt-1 text-[10px] font-semibold text-orange-600">Current</p>}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Billing details" description="Pay your Kuzafy subscription via M-Pesa">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Next billing date</p>
                  <p className="text-xs text-gray-400">April 1, 2026</p>
                </div>
                <p className="font-bold text-gray-900">KES 2,500</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4 text-sm">
                <p className="font-medium text-gray-900 mb-1">Pay via M-Pesa Paybill</p>
                <p className="text-gray-500">Business number: <strong>522533</strong></p>
                <p className="text-gray-500">Account number: <strong>KUZAFY-{'{your-phone}'}</strong></p>
              </div>
            </div>
          </Section>

          <Section title="Invoice history">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left font-semibold text-gray-500 text-xs">Date</th>
                  <th className="pb-2 text-left font-semibold text-gray-500 text-xs">Plan</th>
                  <th className="pb-2 text-right font-semibold text-gray-500 text-xs">Amount</th>
                  <th className="pb-2 text-right font-semibold text-gray-500 text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { date: 'Mar 1, 2026', plan: 'Starter', amount: 'KES 2,500', status: 'Paid' },
                  { date: 'Feb 1, 2026', plan: 'Starter', amount: 'KES 2,500', status: 'Paid' },
                  { date: 'Jan 1, 2026', plan: 'Starter', amount: 'KES 2,500', status: 'Paid' },
                ].map((inv) => (
                  <tr key={inv.date}>
                    <td className="py-2.5 text-gray-600">{inv.date}</td>
                    <td className="py-2.5 text-gray-600">{inv.plan}</td>
                    <td className="py-2.5 text-right font-medium text-gray-900">{inv.amount}</td>
                    <td className="py-2.5 text-right">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      )}
    </div>
  );
}
