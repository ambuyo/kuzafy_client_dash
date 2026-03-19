'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineBan,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import { INVOICES, Invoice, InvoiceStatus } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) { return `KES ${n.toLocaleString()}`; }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; cls: string; icon: React.ElementType }> = {
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-600',    icon: HiOutlineDocumentText },
  sent:     { label: 'Sent',     cls: 'bg-blue-100 text-blue-700',    icon: HiOutlineMail },
  paid:     { label: 'Paid',     cls: 'bg-green-100 text-green-700',  icon: HiOutlineCheck },
  overdue:  { label: 'Overdue',  cls: 'bg-red-100 text-red-600',      icon: HiOutlineExclamation },
  disputed: { label: 'Disputed', cls: 'bg-yellow-100 text-yellow-700',icon: HiOutlineClock },
};

const TAB_OPTIONS = ['all', 'draft', 'sent', 'paid', 'overdue', 'disputed'] as const;
type TabOption = typeof TAB_OPTIONS[number];

/* ─── Invoice detail modal ───────────────────────────────────────────── */

function InvoiceDetailPanel({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const daysOverdue = inv.status === 'overdue'
    ? Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-gray-900">{inv.id}</h2>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_CONFIG[inv.status].cls)}>
                {STATUS_CONFIG[inv.status].label}
                {inv.status === 'overdue' && ` (${daysOverdue}d)`}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{inv.contactName} · {inv.contactPhone}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">×</button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-6 py-3">
          {inv.status === 'overdue' || inv.status === 'sent' ? (
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
              Send reminder
            </button>
          ) : null}
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Record payment
          </button>
          {inv.status !== 'paid' && (
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Mark as paid
            </button>
          )}
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <HiOutlineDownload className="h-3.5 w-3.5" /> PDF
          </button>
        </div>

        {/* Line items */}
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-left text-xs font-semibold text-gray-400">Description</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-400">Qty</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-400">Unit price</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inv.lineItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-2.5 text-gray-700">
                    {item.description}
                    {item.vatApplicable && <span className="ml-1.5 text-[10px] text-gray-400">+VAT</span>}
                  </td>
                  <td className="py-2.5 text-right text-gray-600">{item.qty}</td>
                  <td className="py-2.5 text-right text-gray-600">{fmtKES(item.unitPrice)}</td>
                  <td className="py-2.5 text-right font-medium text-gray-900">{fmtKES(item.qty * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>{fmtKES(inv.subtotal)}</span>
            </div>
            {inv.vatAmount > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>VAT (16%)</span><span>{fmtKES(inv.vatAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span><span>{fmtKES(inv.total)}</span>
            </div>
            {inv.paid > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Paid</span><span>− {fmtKES(inv.paid)}</span>
                </div>
                <div className="flex justify-between font-bold text-red-500">
                  <span>Balance due</span><span>{fmtKES(inv.total - inv.paid)}</span>
                </div>
              </>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
            <span>Due: {fmtDate(inv.dueDate)}</span>
            <span>Created: {fmtDate(inv.createdAt)}</span>
            {inv.mpesaReceipt && <span>M-Pesa: {inv.mpesaReceipt}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function InvoicesPage() {
  const [tab, setTab]           = useState<TabOption>('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = INVOICES.filter((inv) => {
    if (tab !== 'all' && inv.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      return inv.contactName.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
    }
    return true;
  });

  const outstanding = INVOICES.filter((i) => i.status === 'overdue' || i.status === 'sent')
    .reduce((sum, i) => sum + (i.total - i.paid), 0);

  const tabCounts = TAB_OPTIONS.reduce((acc, t) => {
    acc[t] = t === 'all' ? INVOICES.length : INVOICES.filter((i) => i.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quotes & Invoices</h1>
            <p className="text-sm text-gray-400">Outstanding: <span className="font-semibold text-red-500">{fmtKES(outstanding)}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <HiOutlineDocumentText className="h-4 w-4" /> New quote
            </button>
            <Link href="/dashboard/invoices/new" className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
              <HiOutlinePlus className="h-4 w-4" /> New invoice
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
          {TAB_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors whitespace-nowrap',
                tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {t}
              {tabCounts[t] > 0 && (
                <span className={cn('rounded-full px-1.5 text-[10px] font-semibold', tab === t ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500')}>
                  {tabCounts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
          <HiOutlineSearch className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by contact or invoice number..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Invoice</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Contact</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Total</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Balance</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Due date</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((inv) => {
                  const st = STATUS_CONFIG[inv.status];
                  const StatusIcon = st.icon;
                  const daysOverdue = inv.status === 'overdue'
                    ? Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000)
                    : 0;
                  return (
                    <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setSelected(inv)}
                          className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                        >
                          {inv.id}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{inv.contactName}</p>
                        <p className="text-xs text-gray-400">{inv.contactPhone}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', st.cls)}>
                          <StatusIcon className="h-3 w-3" />
                          {st.label}{daysOverdue > 0 ? ` (${daysOverdue}d)` : ''}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-gray-900">{fmtKES(inv.total)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={cn('font-semibold', inv.total - inv.paid > 0 ? 'text-red-500' : 'text-gray-400')}>
                          {inv.total - inv.paid === 0 ? '—' : fmtKES(inv.total - inv.paid)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{fmtDate(inv.dueDate)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(inv.status === 'overdue' || inv.status === 'sent') && (
                            <button className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-1">
                              <HiOutlineMail className="h-3 w-3" /> Remind
                            </button>
                          )}
                          {inv.status !== 'paid' && (
                            <button className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1">
                              <HiOutlineCheck className="h-3 w-3" /> Mark paid
                            </button>
                          )}
                          <button
                            onClick={() => setSelected(inv)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <HiOutlineBan className="h-8 w-8 mb-2" />
              <p className="text-sm">No invoices in this category</p>
            </div>
          )}
        </div>
      </div>

      {selected && <InvoiceDetailPanel inv={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
