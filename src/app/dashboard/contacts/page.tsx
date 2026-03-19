'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlinePlus,
  HiOutlineFilter,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { CONTACTS, Contact, LifecycleStage } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) {
  return n === 0 ? '—' : `KES ${n.toLocaleString()}`;
}

function relativeDate(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff}d ago`;
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}

const LIFECYCLE_COLORS: Record<LifecycleStage, string> = {
  Lead:      'bg-gray-100 text-gray-600',
  Qualified: 'bg-blue-100 text-blue-700',
  Customer:  'bg-green-100 text-green-700',
  Repeat:    'bg-teal-100 text-teal-700',
  VIP:       'bg-orange-100 text-orange-700',
  Churned:   'bg-red-100 text-red-600',
};

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ContactsPage() {
  const [search, setSearch]         = useState('');
  const [lifecycle, setLifecycle]   = useState<LifecycleStage | 'All'>('All');
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);

  const filtered = CONTACTS.filter((c) => {
    if (lifecycle !== 'All' && c.lifecycle !== lifecycle) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.tags.some((t) => t.includes(q));
    }
    return true;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  }

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-400">{CONTACTS.length.toLocaleString()} total contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <HiOutlineUpload className="h-4 w-4" /> Import
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <HiOutlineDownload className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <HiOutlinePlus className="h-4 w-4" /> New contact
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <HiOutlineSearch className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or tag..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* Lifecycle filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <HiOutlineFilter className="h-4 w-4" />
            {lifecycle === 'All' ? 'Lifecycle' : lifecycle}
            <HiOutlineChevronDown className={cn('h-3.5 w-3.5 transition-transform', showFilter && 'rotate-180')} />
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white shadow-lg z-10 overflow-hidden">
              {(['All', 'Lead', 'Qualified', 'Customer', 'Repeat', 'VIP', 'Churned'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setLifecycle(s); setShowFilter(false); }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50',
                    lifecycle === s ? 'font-medium text-orange-600 bg-orange-50' : 'text-gray-700',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-2.5">
          <span className="text-sm font-medium text-orange-700">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors">Tag</button>
            <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors">Export</button>
            <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors">Send campaign</button>
            <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tags</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Lifecycle</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">LTV</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Balance</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Last contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c: Contact) => (
                <tr
                  key={c.id}
                  className={cn(
                    'group transition-colors hover:bg-gray-50/50',
                    selected.has(c.id) && 'bg-orange-50/40',
                  )}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="h-4 w-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/dashboard/contacts/${c.id}`} className="flex items-center gap-3 hover:text-orange-600 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                        {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-orange-600">{c.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{c.phone}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">#{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', LIFECYCLE_COLORS[c.lifecycle])}>
                      {c.lifecycle}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-gray-900">{fmtKES(c.ltv)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={cn('font-medium', c.outstandingBalance > 0 ? 'text-red-500' : 'text-gray-400')}>
                      {fmtKES(c.outstandingBalance)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{relativeDate(c.lastContact)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-sm">No contacts match your filters</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {CONTACTS.length} contacts
        </div>
      </div>
    </div>
  );
}
