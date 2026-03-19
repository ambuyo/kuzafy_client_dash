'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineChat,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import { CONTACTS, INVOICES, CONVERSATIONS, APPOINTMENTS } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) {
  return `KES ${n.toLocaleString()}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

const LIFECYCLE_COLORS: Record<string, string> = {
  Lead:      'bg-gray-100 text-gray-600',
  Qualified: 'bg-blue-100 text-blue-700',
  Customer:  'bg-green-100 text-green-700',
  Repeat:    'bg-teal-100 text-teal-700',
  VIP:       'bg-orange-100 text-orange-700',
  Churned:   'bg-red-100 text-red-600',
};

const INVOICE_STATUS: Record<string, string> = {
  draft:    'bg-gray-100 text-gray-600',
  sent:     'bg-blue-100 text-blue-700',
  paid:     'bg-green-100 text-green-700',
  overdue:  'bg-red-100 text-red-600',
  disputed: 'bg-yellow-100 text-yellow-700',
};

type Tab = 'overview' | 'conversations' | 'invoices' | 'appointments';

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ContactProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>('overview');

  const contact     = CONTACTS.find((c) => c.id === id);
  const invoices    = INVOICES.filter((i) => i.contactId === id);
  const convs       = CONVERSATIONS.filter((c) => c.contactId === id);
  const apts        = APPOINTMENTS.filter((a) => contact && a.contactName === contact.name);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-sm">Contact not found.</p>
        <Link href="/dashboard/contacts" className="mt-4 text-sm text-orange-500 hover:underline">← Back to contacts</Link>
      </div>
    );
  }

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview',       label: 'Overview' },
    { key: 'conversations',  label: 'Conversations', count: convs.length },
    { key: 'invoices',       label: 'Invoices',      count: invoices.length },
    { key: 'appointments',   label: 'Appointments',  count: apts.length },
  ];

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/dashboard/contacts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <HiOutlineArrowLeft className="h-4 w-4" /> Back to contacts
      </Link>

      {/* Profile card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap items-start gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-600">
            {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{contact.name}</h1>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', LIFECYCLE_COLORS[contact.lifecycle])}>
                {contact.lifecycle}
              </span>
              {contact.optedIn ? (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">🟢 Opted in</span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">Opted out</span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{contact.phone}{contact.email && ` · ${contact.email}`}</p>
            <p className="text-xs text-gray-400">Language: {contact.language === 'en' ? 'English' : 'Swahili'} · Last contact: {fmtDate(contact.lastContact)}</p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600">#{tag}</span>
              ))}
              <button className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors">+ tag</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <HiOutlinePencil className="h-4 w-4" /> Edit
            </button>
            <Link href="/dashboard/inbox" className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
              <HiOutlineChat className="h-4 w-4" /> Message
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === t.key
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800',
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', tab === t.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500')}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Financials</h3>
            {[
              { label: 'Lifetime value',    value: fmtKES(contact.ltv), highlight: false },
              { label: 'Orders',            value: String(contact.orderCount), highlight: false },
              { label: 'Avg order value',   value: fmtKES(contact.avgOrder), highlight: false },
              { label: 'Outstanding balance', value: fmtKES(contact.outstandingBalance), highlight: contact.outstandingBalance > 0 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className={cn('text-sm font-semibold', row.highlight ? 'text-red-500' : 'text-gray-900')}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Lead score */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Lead score</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">{contact.leadScore}</span>
              <span className="mb-1 text-sm text-gray-400">/ 100</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-orange-500 transition-all"
                style={{ width: `${contact.leadScore}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {contact.leadScore >= 80 ? 'High-value — prioritise' : contact.leadScore >= 50 ? 'Medium — nurture' : 'Low — re-engage or remove'}
            </p>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/invoices/new" className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <HiOutlineDocumentText className="h-4 w-4 text-orange-500" />
                Create invoice
              </Link>
              <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <HiOutlineCurrencyDollar className="h-4 w-4 text-green-500" />
                Request M-Pesa payment
              </button>
              <Link href="/dashboard/inbox" className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <HiOutlineChat className="h-4 w-4 text-blue-500" />
                Open conversation
              </Link>
            </div>
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">No invoices yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Invoice</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Total</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Balance</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Due date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{inv.id}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', INVOICE_STATUS[inv.status])}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-gray-900">{fmtKES(inv.total)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={cn('font-semibold', inv.total - inv.paid > 0 ? 'text-red-500' : 'text-gray-400')}>
                        {fmtKES(inv.total - inv.paid)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{fmtDate(inv.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'conversations' && (
        <div className="space-y-3">
          {convs.length === 0 ? (
            <div className="rounded-2xl bg-white py-16 text-center text-sm text-gray-400 ring-1 ring-gray-100">No conversations yet</div>
          ) : (
            convs.map((conv) => (
              <Link key={conv.id} href="/dashboard/inbox" className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 hover:ring-orange-200 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{conv.channel === 'whatsapp' ? '📱 WhatsApp' : '💬 SMS'} · {conv.lastTime}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                  conv.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  conv.status === 'escalated' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600',
                )}>
                  {conv.status}
                </span>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === 'appointments' && (
        <div className="space-y-3">
          {apts.length === 0 ? (
            <div className="rounded-2xl bg-white py-16 text-center text-sm text-gray-400 ring-1 ring-gray-100">No appointments yet</div>
          ) : (
            apts.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{apt.service}</p>
                  <p className="text-xs text-gray-400">{apt.date} at {apt.time} · {apt.staff}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600',
                )}>
                  {apt.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
