'use client';

import { useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlinePaperAirplane,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineLightningBolt,
  HiOutlinePhone,
} from 'react-icons/hi';
import { CONVERSATIONS, CONTACTS, INVOICES, Conversation } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

type FilterTab = 'all' | 'unread' | 'mine' | 'bot' | 'escalated' | 'resolved';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'unread',    label: 'Unread' },
  { key: 'mine',      label: 'Assigned to me' },
  { key: 'bot',       label: 'Bot-handled' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved',  label: 'Resolved' },
];

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  open:      { label: 'Open',      cls: 'bg-blue-100 text-blue-700' },
  bot:       { label: 'Bot',       cls: 'bg-purple-100 text-purple-700' },
  escalated: { label: 'Escalated', cls: 'bg-orange-100 text-orange-700' },
  resolved:  { label: 'Resolved',  cls: 'bg-green-100 text-green-700' },
};

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function fmtKES(n: number) {
  return `KES ${n.toLocaleString()}`;
}

/* ─── Conversation list item ─────────────────────────────────────────── */

function ConvItem({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  const st = STATUS_LABEL[conv.status];
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors hover:bg-gray-50',
        active && 'bg-orange-50 border-l-2 border-l-orange-500',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
            {initials(conv.contactName)}
          </div>
          {conv.channel === 'whatsapp' && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 ring-1 ring-white">
              <svg viewBox="0 0 24 24" className="h-2 w-2 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.524 5.849L.057 23.286a.75.75 0 00.921.921l5.437-1.467A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.708 9.708 0 01-4.951-1.352l-.355-.21-3.678.992.991-3.599-.228-.371A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('truncate text-sm font-medium', conv.unread > 0 ? 'text-gray-900' : 'text-gray-600')}>
              {conv.contactName}
            </p>
            <span className="shrink-0 text-xs text-gray-400">{conv.lastTime}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-gray-400">{conv.lastMessage}</p>
            {conv.unread > 0 && (
              <span className="flex h-4.5 min-w-[18px] shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {conv.unread}
              </span>
            )}
          </div>
          <div className="mt-1.5">
            <span className={cn('inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium', st.cls)}>
              {st.label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─── Conversation view ──────────────────────────────────────────────── */

function ConvView({ conv }: { conv: Conversation }) {
  const [draft, setDraft] = useState('');
  const contact = CONTACTS.find((c) => c.id === conv.contactId);
  const invoices = INVOICES.filter((i) => i.contactId === conv.contactId);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
            {initials(conv.contactName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{conv.contactName}</p>
            <p className="text-xs text-gray-400">{conv.contactPhone} · {conv.channel === 'whatsapp' ? '📱 WhatsApp' : '💬 SMS'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conv.status === 'bot' && (
            <button className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors">
              <HiOutlineLightningBolt className="h-3.5 w-3.5" />
              Bot active · Take over
            </button>
          )}
          <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <HiOutlineUser className="h-3.5 w-3.5" />
            Assign
          </button>
          <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <HiOutlineTag className="h-3.5 w-3.5" />
            Tag
          </button>
        </div>
      </div>

      {/* Body — messages + sidebar */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {conv.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex max-w-[75%] flex-col gap-1',
                msg.direction === 'outbound' ? 'ml-auto items-end' : 'items-start',
              )}
            >
              {msg.direction === 'outbound' && msg.isBot && (
                <span className="text-[10px] text-purple-500 font-medium flex items-center gap-1">
                  <HiOutlineLightningBolt className="h-3 w-3" /> Bot
                </span>
              )}
              <div className={cn(
                'rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                msg.direction === 'outbound'
                  ? 'bg-orange-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm ring-1 ring-gray-100',
              )}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span>{msg.time}</span>
                {msg.direction === 'outbound' && msg.status === 'read' && <span className="text-blue-500">✓✓</span>}
                {msg.direction === 'outbound' && msg.status === 'delivered' && <span>✓✓</span>}
                {msg.direction === 'outbound' && msg.status === 'sent' && <span>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Contact sidebar */}
        {contact && (
          <div className="w-64 shrink-0 overflow-y-auto border-l border-gray-100 bg-white p-4 space-y-4">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-600 mx-auto">
                {initials(contact.name)}
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-gray-900">{contact.name}</p>
              <p className="text-center text-xs text-gray-400">{contact.phone}</p>
              <div className="mt-1 flex justify-center">
                <span className={cn(
                  'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  contact.optedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                )}>
                  {contact.optedIn ? '🟢 Opted in' : 'Opted out'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Lifecycle</span>
                <span className="font-medium text-gray-900">{contact.lifecycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">LTV</span>
                <span className="font-semibold text-gray-900">{fmtKES(contact.ltv)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Orders</span>
                <span className="font-medium text-gray-900">{contact.orderCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Balance</span>
                <span className={cn('font-semibold', contact.outstandingBalance > 0 ? 'text-red-500' : 'text-gray-900')}>
                  {fmtKES(contact.outstandingBalance)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {contact.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">#{tag}</span>
              ))}
            </div>

            {invoices.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Recent invoices</p>
                <div className="space-y-1.5">
                  {invoices.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2 text-xs">
                      <span className="text-gray-500 truncate">{inv.id}</span>
                      <span className={cn(
                        'font-semibold',
                        inv.status === 'overdue' ? 'text-red-500' :
                        inv.status === 'paid' ? 'text-green-600' : 'text-gray-700',
                      )}>
                        {fmtKES(inv.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
                <HiOutlineDocumentText className="h-3.5 w-3.5" />
                Create invoice
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <HiOutlineCurrencyDollar className="h-3.5 w-3.5" />
                Request M-Pesa payment
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <HiOutlinePhone className="h-3.5 w-3.5" />
                View full profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-50"
            disabled={!draft.trim()}
          >
            <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function InboxPage() {
  const [activeTab, setActiveTab]   = useState<FilterTab>('all');
  const [search, setSearch]         = useState('');
  const [selectedId, setSelectedId] = useState<string>(CONVERSATIONS[0].id);

  const filtered = CONVERSATIONS.filter((c) => {
    if (search && !c.contactName.toLowerCase().includes(search.toLowerCase()) && !c.lastMessage.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'unread')    return c.unread > 0;
    if (activeTab === 'bot')       return c.status === 'bot';
    if (activeTab === 'escalated') return c.status === 'escalated';
    if (activeTab === 'resolved')  return c.status === 'resolved';
    return true;
  });

  const selected = CONVERSATIONS.find((c) => c.id === selectedId) ?? CONVERSATIONS[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem-2rem)] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Left — conversation list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-gray-100">
        {/* Search */}
        <div className="border-b border-gray-100 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <HiOutlineSearch className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3 py-2 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <HiOutlineRefresh className="h-6 w-6 mb-2" />
              No conversations
            </div>
          ) : (
            filtered.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === selectedId}
                onClick={() => setSelectedId(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right — conversation view */}
      <div className="flex min-w-0 flex-1 flex-col">
        {selected ? <ConvView conv={selected} /> : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
