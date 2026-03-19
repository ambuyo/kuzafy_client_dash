'use client';

import React, { useState, useMemo } from 'react';
import { ABANDONED_CARTS, AbandonedCart, CartRecoveryStatus } from '@/data/mock';
import { cn } from '@/lib/cn';
import {
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChat,
  HiOutlineExclamation,
} from 'react-icons/hi';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE');

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000 / 60; // minutes
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 60 / 24)}d ago`;
}

const STATUS_CONFIG: Record<
  CartRecoveryStatus,
  { label: string; cls: string; dot: string }
> = {
  none:      { label: 'Uncontacted', cls: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400' },
  reminded:  { label: 'Reminded',    cls: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-500' },
  recovered: { label: 'Recovered',   cls: 'bg-green-50 text-green-700',  dot: 'bg-green-500' },
  lost:      { label: 'Lost',        cls: 'bg-red-50 text-red-600',      dot: 'bg-red-500' },
};

const TABS: { key: CartRecoveryStatus | 'all'; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'none',      label: 'Uncontacted' },
  { key: 'reminded',  label: 'Reminded' },
  { key: 'recovered', label: 'Recovered' },
  { key: 'lost',      label: 'Lost' },
];

/* ─── Confirm Modal ───────────────────────────────────────────────────── */

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmCls,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmCls: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <HiOutlineExclamation className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className={cn('rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors', confirmCls)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Cart Row ────────────────────────────────────────────────────────── */

function CartRow({
  cart,
  onRemind,
  onRecover,
  onLost,
}: {
  cart: AbandonedCart;
  onRemind: () => void;
  onRecover: () => void;
  onLost: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[cart.recoveryStatus];

  return (
    <>
      <tr
        className={cn(
          'group transition-colors',
          expanded ? 'bg-orange-50/40' : 'hover:bg-gray-50/60',
        )}
      >
        {/* Contact */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
              {cart.contactName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{cart.contactName}</p>
              <p className="text-xs text-gray-400">{cart.contactPhone}</p>
            </div>
          </div>
        </td>

        {/* Items summary */}
        <td className="px-4 py-3">
          <p className="text-sm text-gray-700">
            {cart.items.map((i) => `${i.productName}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 flex items-center gap-0.5 text-xs text-orange-500 hover:underline"
          >
            {expanded ? (
              <>Hide details <HiOutlineChevronUp className="h-3 w-3" /></>
            ) : (
              <>View details <HiOutlineChevronDown className="h-3 w-3" /></>
            )}
          </button>
        </td>

        {/* Channel */}
        <td className="px-4 py-3">
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            cart.channel === 'whatsapp' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700',
          )}>
            {cart.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </span>
        </td>

        {/* Total */}
        <td className="px-4 py-3 text-right">
          <p className="text-sm font-semibold text-gray-900">{fmt(cart.total)}</p>
        </td>

        {/* Abandoned */}
        <td className="px-4 py-3 text-sm text-gray-500">
          {timeAgo(cart.abandonedAt)}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.cls)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {cart.recoveryStatus === 'none' && (
              <button
                onClick={onRemind}
                title="Send WhatsApp reminder"
                className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
              >
                <HiOutlineChat className="h-3.5 w-3.5" />
                Remind
              </button>
            )}
            {cart.recoveryStatus === 'reminded' && (
              <button
                onClick={onRemind}
                title="Send follow-up reminder"
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <HiOutlineRefresh className="h-3.5 w-3.5" />
                Follow-up
              </button>
            )}
            {(cart.recoveryStatus === 'none' || cart.recoveryStatus === 'reminded') && (
              <>
                <button
                  onClick={onRecover}
                  title="Mark as recovered"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <HiOutlineCheck className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onLost}
                  title="Mark as lost"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <HiOutlineX className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            {cart.recoveryStatus === 'recovered' && (
              <span className="text-xs text-green-600 font-medium">
                ✓ {cart.recoveredAt ? timeAgo(cart.recoveredAt) : ''}
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded item breakdown */}
      {expanded && (
        <tr className="bg-orange-50/40">
          <td colSpan={7} className="px-4 pb-3 pt-0">
            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">SKU</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Unit Price</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-gray-800">{item.productName}</td>
                      <td className="px-3 py-2 text-gray-400">{item.sku}</td>
                      <td className="px-3 py-2 text-center text-gray-700">{item.qty}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{fmt(item.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">{fmt(item.unitPrice * item.qty)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/60">
                    <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Total</td>
                    <td className="px-3 py-2 text-right font-bold text-gray-900">{fmt(cart.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
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

export default function CartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>(ABANDONED_CARTS);
  const [activeTab, setActiveTab] = useState<CartRecoveryStatus | 'all'>('all');
  const [confirm, setConfirm] = useState<{
    cartId: string;
    action: 'remind' | 'recover' | 'lost';
  } | null>(null);

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { all: carts.length };
    for (const cart of carts) c[cart.recoveryStatus] = (c[cart.recoveryStatus] ?? 0) + 1;
    return c;
  }, [carts]);

  const filtered = useMemo(
    () => (activeTab === 'all' ? carts : carts.filter((c) => c.recoveryStatus === activeTab)),
    [carts, activeTab],
  );

  const stats = useMemo(() => {
    const atRisk = carts
      .filter((c) => c.recoveryStatus === 'none' || c.recoveryStatus === 'reminded')
      .reduce((s, c) => s + c.total, 0);
    const recovered = carts.filter((c) => c.recoveryStatus === 'recovered');
    const recoveredRevenue = recovered.reduce((s, c) => s + c.total, 0);
    const reminded = carts.filter((c) => c.recoveryStatus !== 'none');
    const rate = reminded.length === 0 ? 0 : Math.round((recovered.length / reminded.length) * 100);
    return { atRisk, recoveredRevenue, recoveryRate: rate, total: carts.length };
  }, [carts]);

  function applyAction(cartId: string, action: 'remind' | 'recover' | 'lost') {
    setCarts((prev) =>
      prev.map((c) => {
        if (c.id !== cartId) return c;
        if (action === 'remind') return { ...c, recoveryStatus: 'reminded', reminderSentAt: new Date().toISOString() };
        if (action === 'recover') return { ...c, recoveryStatus: 'recovered', recoveredAt: new Date().toISOString() };
        return { ...c, recoveryStatus: 'lost' };
      }),
    );
    setConfirm(null);
  }

  const CONFIRM_CONFIG = {
    remind:  { title: 'Send WhatsApp reminder?',   message: 'A recovery message will be sent to the customer via WhatsApp.',     confirmLabel: 'Send',          confirmCls: 'bg-green-600 hover:bg-green-700' },
    recover: { title: 'Mark cart as recovered?',   message: 'This cart will be marked as successfully recovered.',               confirmLabel: 'Mark Recovered', confirmCls: 'bg-orange-500 hover:bg-orange-600' },
    lost:    { title: 'Mark cart as lost?',        message: 'This cart will be archived as lost and no further reminders sent.', confirmLabel: 'Mark Lost',     confirmCls: 'bg-red-600 hover:bg-red-700' },
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
          <HiOutlineShoppingCart className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Abandoned Carts</h1>
          <p className="text-xs text-gray-400">Recover lost revenue via WhatsApp</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Carts" value={stats.total} />
        <StatCard label="Revenue at Risk" value={fmt(stats.atRisk)} color="text-amber-600" />
        <StatCard label="Recovered Revenue" value={fmt(stats.recoveredRevenue)} color="text-green-600" />
        <StatCard label="Recovery Rate" value={`${stats.recoveryRate}%`} sub="of reminded carts" color={stats.recoveryRate >= 50 ? 'text-green-600' : 'text-orange-500'} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800',
            )}
          >
            {tab.label}
            {tabCounts[tab.key] ? (
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600',
              )}>
                {tabCounts[tab.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[780px] table-auto">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Channel</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Cart Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Abandoned</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-sm text-gray-400">
                  No carts in this category.
                </td>
              </tr>
            ) : (
              filtered.map((cart) => (
                <CartRow
                  key={cart.id}
                  cart={cart}
                  onRemind={() => setConfirm({ cartId: cart.id, action: 'remind' })}
                  onRecover={() => setConfirm({ cartId: cart.id, action: 'recover' })}
                  onLost={() => setConfirm({ cartId: cart.id, action: 'lost' })}
                />
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400">
            {filtered.length} cart{filtered.length !== 1 ? 's' : ''} shown
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          {...CONFIRM_CONFIG[confirm.action]}
          onConfirm={() => applyAction(confirm.cartId, confirm.action)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
