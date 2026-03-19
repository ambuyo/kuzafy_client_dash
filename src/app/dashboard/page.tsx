'use client';

import Link from 'next/link';
import {
  HiOutlineChat,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineExclamationCircle,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiTrendingUp,
} from 'react-icons/hi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TODAY_STATS, ALERTS, REVENUE_CHART, INVOICES, CONVERSATIONS } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) {
  return `KES ${n.toLocaleString()}`;
}

/* ─── Stat card ──────────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  sub,
  change,
  positive,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string;
  sub?: string;
  change: number;
  positive: boolean;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className={cn(
        'mt-3 flex items-center gap-1 text-xs font-medium',
        positive ? 'text-green-600' : 'text-red-500',
      )}>
        {positive
          ? <HiOutlineArrowUp className="h-3.5 w-3.5" />
          : <HiOutlineArrowDown className="h-3.5 w-3.5" />}
        {change}% vs yesterday
      </div>
    </div>
  );
}

/* ─── Revenue tooltip ────────────────────────────────────────────────── */

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="mt-0.5 text-orange-400">{fmtKES(payload[0].value)}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function OverviewPage() {
  const overdue = INVOICES.filter((i) => i.status === 'overdue');
  const recentConvs = CONVERSATIONS.filter((c) => c.unread > 0).slice(0, 4);
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good morning, Grace! ☀️</h1>
          <p className="text-sm text-gray-400">{today}</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          + New Invoice
        </Link>
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ALERTS.map((alert) => (
            <Link
              key={alert.message}
              href={alert.href}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700 transition-colors hover:bg-orange-100"
            >
              <HiOutlineExclamationCircle className="h-4 w-4 shrink-0" />
              {alert.message}
            </Link>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Conversations today"
          value={String(TODAY_STATS.conversations.value)}
          change={TODAY_STATS.conversations.change}
          positive
          icon={HiOutlineChat}
          iconBg="bg-blue-500"
        />
        <KpiCard
          label="Revenue today"
          value={fmtKES(TODAY_STATS.revenue.value)}
          change={TODAY_STATS.revenue.change}
          positive
          icon={HiOutlineCurrencyDollar}
          iconBg="bg-green-500"
        />
        <KpiCard
          label="Quotes accepted"
          value={String(TODAY_STATS.quotesAccepted.value)}
          sub={`${TODAY_STATS.quotesAccepted.rate}% acceptance rate`}
          change={TODAY_STATS.quotesAccepted.change}
          positive
          icon={HiOutlineDocumentText}
          iconBg="bg-orange-500"
        />
        <KpiCard
          label="CSAT score"
          value={`${TODAY_STATS.csat.value}/5`}
          change={TODAY_STATS.csat.change}
          positive
          icon={HiOutlineStar}
          iconBg="bg-purple-500"
        />
      </div>

      {/* Revenue chart + Recent conversations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Revenue chart — 2/3 width */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue — Last 7 days</h2>
              <p className="text-xs text-gray-400 mt-0.5">All M-Pesa + card payments</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
              <HiTrendingUp className="h-3.5 w-3.5" />
              +8% this week
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_CHART} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F97315" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F97315" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#F97315" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#F97315' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unread conversations — 1/3 */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Needs attention</h2>
            <Link href="/dashboard/inbox" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentConvs.map((conv) => (
              <Link
                key={conv.id}
                href="/dashboard/inbox"
                className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                  {conv.contactName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{conv.contactName}</p>
                  <p className="truncate text-xs text-gray-400">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white px-1">
                    {conv.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue invoices */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Overdue invoices</h2>
          <Link href="/dashboard/invoices?status=overdue" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {overdue.map((inv) => {
            const daysOverdue = Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000);
            return (
              <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{inv.contactName}</p>
                  <p className="text-xs text-gray-400">{inv.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{fmtKES(inv.total - inv.paid)}</p>
                  <p className="text-xs text-red-500">{daysOverdue}d overdue</p>
                </div>
                <Link
                  href="/dashboard/invoices"
                  className="hidden sm:inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Send reminder
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
