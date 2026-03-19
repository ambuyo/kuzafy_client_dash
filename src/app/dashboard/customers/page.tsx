'use client';

import React, { useState, useMemo } from 'react';
import { CONTACTS, INVOICES, Contact, LifecycleStage } from '@/data/mock';
import { cn } from '@/lib/cn';
import {
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineCurrencyDollar,
  HiOutlineChevronDown,
  HiOutlineX,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlineShoppingBag,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE');
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

const LIFECYCLE_CONFIG: Record<LifecycleStage, { cls: string; dot: string }> = {
  VIP:       { cls: 'bg-purple-100 text-purple-700',  dot: 'bg-purple-500' },
  Repeat:    { cls: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  Customer:  { cls: 'bg-green-100 text-green-700',    dot: 'bg-green-500' },
  Qualified: { cls: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  Lead:      { cls: 'bg-gray-100 text-gray-600',      dot: 'bg-gray-400' },
  Churned:   { cls: 'bg-red-100 text-red-600',        dot: 'bg-red-500' },
};

const SEGMENTS: { key: LifecycleStage | 'all'; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'VIP',       label: 'VIP' },
  { key: 'Repeat',    label: 'Repeat' },
  { key: 'Customer',  label: 'Customer' },
  { key: 'Qualified', label: 'Qualified' },
  { key: 'Lead',      label: 'Lead' },
  { key: 'Churned',   label: 'Churned' },
];

/* ─── Purchase History Panel ──────────────────────────────────────────── */

function PurchasePanel({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const invoices = INVOICES.filter((inv) => inv.contactId === contact.id);
  const cfg = LIFECYCLE_CONFIG[contact.lifecycle];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
              <p className="text-xs text-gray-400">{contact.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">LTV</p>
              <p className="mt-0.5 text-base font-bold text-gray-900">{fmt(contact.ltv)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Orders</p>
              <p className="mt-0.5 text-base font-bold text-gray-900">{contact.orderCount}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Avg Order</p>
              <p className="mt-0.5 text-base font-bold text-gray-900">{fmt(contact.avgOrder)}</p>
            </div>
          </div>

          {/* Segment & tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.cls)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
              {contact.lifecycle}
            </span>
            {contact.tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                #{t}
              </span>
            ))}
          </div>

          {/* Lead score bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Lead Score</p>
              <p className="text-xs font-bold text-gray-900">{contact.leadScore}/100</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  contact.leadScore >= 80 ? 'bg-green-500' : contact.leadScore >= 50 ? 'bg-amber-500' : 'bg-red-400',
                )}
                style={{ width: `${contact.leadScore}%` }}
              />
            </div>
          </div>

          {/* Outstanding balance */}
          {contact.outstandingBalance > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <HiOutlineExclamationCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Outstanding balance:{' '}
                <span className="font-semibold">{fmt(contact.outstandingBalance)}</span>
              </p>
            </div>
          )}

          {/* Purchase history */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Purchase History
            </h3>

            {invoices.length === 0 ? (
              <p className="text-sm text-gray-400">No invoices on record.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((inv) => (
                  <div key={inv.id} className="rounded-xl border border-gray-100 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{inv.id}</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {inv.lineItems.map((l) => l.description).join(', ')}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Due {fmtDate(inv.dueDate)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">{fmt(inv.total)}</p>
                        <span className={cn(
                          'mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          inv.status === 'paid'    ? 'bg-green-50 text-green-700' :
                          inv.status === 'overdue' ? 'bg-red-50 text-red-600' :
                          inv.status === 'sent'    ? 'bg-blue-50 text-blue-700' :
                                                     'bg-gray-100 text-gray-500',
                        )}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', color ?? 'text-gray-900')}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function CustomersPage() {
  const [segment, setSegment] = useState<LifecycleStage | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [sortBy, setSortBy] = useState<'ltv' | 'orders' | 'lastContact'>('ltv');

  const segmentCounts = useMemo(() => {
    const c: Record<string, number> = { all: CONTACTS.length };
    for (const ct of CONTACTS) c[ct.lifecycle] = (c[ct.lifecycle] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CONTACTS
      .filter((c) => {
        const matchSeg = segment === 'all' || c.lifecycle === segment;
        const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.tags.some((t) => t.includes(q));
        return matchSeg && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'ltv') return b.ltv - a.ltv;
        if (sortBy === 'orders') return b.orderCount - a.orderCount;
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      });
  }, [segment, search, sortBy]);

  const stats = useMemo(() => {
    const customers = CONTACTS.filter((c) => c.lifecycle !== 'Lead');
    const totalLtv = customers.reduce((s, c) => s + c.ltv, 0);
    const avgLtv = customers.length ? Math.round(totalLtv / customers.length) : 0;
    const vip = CONTACTS.filter((c) => c.lifecycle === 'VIP').length;
    const churned = CONTACTS.filter((c) => c.lifecycle === 'Churned').length;
    const outstanding = CONTACTS.reduce((s, c) => s + c.outstandingBalance, 0);
    return { totalCustomers: customers.length, avgLtv, vip, churned, outstanding };
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
          <HiOutlineUserGroup className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Customers</h1>
          <p className="text-xs text-gray-400">{CONTACTS.length} contacts · {stats.totalCustomers} customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Customers" value={stats.totalCustomers} sub="excl. leads" />
        <StatCard label="Avg LTV" value={fmt(stats.avgLtv)} color="text-orange-600" />
        <StatCard label="VIP Customers" value={stats.vip} color="text-purple-600" />
        <StatCard label="Outstanding" value={fmt(stats.outstanding)} color={stats.outstanding > 0 ? 'text-amber-600' : 'text-gray-900'} />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, tag…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="ltv">Sort: LTV</option>
            <option value="orders">Sort: Orders</option>
            <option value="lastContact">Sort: Last Active</option>
          </select>
          <HiOutlineChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Segment tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm w-fit">
        {SEGMENTS.map((seg) => (
          <button
            key={seg.key}
            onClick={() => setSegment(seg.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              segment === seg.key
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800',
            )}
          >
            {seg.label}
            {segmentCounts[seg.key] ? (
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                segment === seg.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600',
              )}>
                {segmentCounts[seg.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[700px] table-auto">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Segment</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">LTV</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Avg Order</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Outstanding</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Last Active</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center text-sm text-gray-400">
                  No customers match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((contact) => {
                const cfg = LIFECYCLE_CONFIG[contact.lifecycle];
                return (
                  <tr
                    key={contact.id}
                    onClick={() => setSelected(contact)}
                    className="group cursor-pointer hover:bg-orange-50/30 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          {contact.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-400">{contact.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.cls)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                        {contact.lifecycle}
                      </span>
                    </td>

                    {/* LTV */}
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-semibold text-gray-900">{contact.ltv > 0 ? fmt(contact.ltv) : '—'}</p>
                    </td>

                    {/* Orders */}
                    <td className="px-4 py-3 text-center">
                      <p className="text-sm text-gray-700">{contact.orderCount}</p>
                    </td>

                    {/* Avg Order */}
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm text-gray-700">{contact.avgOrder > 0 ? fmt(contact.avgOrder) : '—'}</p>
                    </td>

                    {/* Outstanding */}
                    <td className="px-4 py-3 text-right">
                      <p className={cn('text-sm font-medium', contact.outstandingBalance > 0 ? 'text-amber-600' : 'text-gray-400')}>
                        {contact.outstandingBalance > 0 ? fmt(contact.outstandingBalance) : '—'}
                      </p>
                    </td>

                    {/* Last active */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {fmtDate(contact.lastContact)}
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((t) => (
                          <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                            {t}
                          </span>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                            +{contact.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400">
            {filtered.length} of {CONTACTS.length} customers
          </div>
        )}
      </div>

      {/* Purchase history side panel */}
      {selected && (
        <PurchasePanel contact={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
