'use client';

import React, { useState, useMemo } from 'react';
import { DAILY_REPORTS, DailyReport } from '@/data/mock';
import { cn } from '@/lib/cn';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  HiOutlineChartBar,
  HiOutlineDownload,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from 'react-icons/hi';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE');
const fmtShort = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n}`;

function fmtDate(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString('en-KE', opts ?? { day: 'numeric', month: 'short' });
}

function dayOfWeek(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', { weekday: 'short' });
}

const RANGES = [
  { key: 7,  label: 'Last 7 days' },
  { key: 14, label: 'Last 14 days' },
  { key: 30, label: 'Last 30 days' },
] as const;

/* ─── Custom Tooltip ──────────────────────────────────────────────────── */

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="mt-0.5 text-orange-600 font-medium">{fmt(payload[0].value)}</p>
    </div>
  );
}

/* ─── Trend chip ──────────────────────────────────────────────────────── */

function Trend({ current, previous, suffix = '' }: { current: number; previous: number; suffix?: string }) {
  if (!previous) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', up ? 'text-green-600' : 'text-red-500')}>
      {up ? <HiOutlineTrendingUp className="h-3.5 w-3.5" /> : <HiOutlineTrendingDown className="h-3.5 w-3.5" />}
      {up ? '+' : ''}{pct}%{suffix}
    </span>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  prev,
  color,
}: {
  label: string;
  value: string;
  prev?: number;
  current?: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', color ?? 'text-gray-900')}>{value}</p>
      {prev !== undefined && <p className="mt-0.5 text-xs text-gray-400">prev period: {fmtShort(prev)}</p>}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function ReportsPage() {
  const [range, setRange] = useState<7 | 14 | 30>(30);

  const { slice, prev } = useMemo(() => {
    const sorted = [...DAILY_REPORTS].sort((a, b) => a.date.localeCompare(b.date));
    const slice = sorted.slice(-range);
    const prev = sorted.slice(-range * 2, -range);
    return { slice, prev };
  }, [range]);

  const totals = useMemo(() => ({
    revenue:      slice.reduce((s, d) => s + d.revenue, 0),
    orders:       slice.reduce((s, d) => s + d.orders, 0),
    newCustomers: slice.reduce((s, d) => s + d.newCustomers, 0),
    avgOrder:     slice.length
      ? Math.round(slice.reduce((s, d) => s + d.avgOrderValue, 0) / slice.length)
      : 0,
  }), [slice]);

  const prevTotals = useMemo(() => ({
    revenue:  prev.reduce((s, d) => s + d.revenue, 0),
    orders:   prev.reduce((s, d) => s + d.orders, 0),
    avgOrder: prev.length
      ? Math.round(prev.reduce((s, d) => s + d.avgOrderValue, 0) / prev.length)
      : 0,
  }), [prev]);

  const chartData = slice.map((d) => ({
    name: fmtDate(d.date),
    revenue: d.revenue,
    day: dayOfWeek(d.date),
  }));

  // Top product across period
  const topProductMap: Record<string, number> = {};
  for (const d of slice) topProductMap[d.topProduct] = (topProductMap[d.topProduct] ?? 0) + 1;
  const topProduct = Object.entries(topProductMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  function handleExport() {
    const header = 'Date,Revenue (KES),Orders,Avg Order (KES),New Customers,Conversations,Top Product';
    const rows = slice.map((d) =>
      [d.date, d.revenue, d.orders, d.avgOrderValue, d.newCustomers, d.conversations, `"${d.topProduct}"`].join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kuzafy-sales-report-${slice[0]?.date}-to-${slice[slice.length - 1]?.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
            <HiOutlineChartBar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Daily Reports</h1>
            <p className="text-xs text-gray-400">
              {fmtDate(slice[0]?.date ?? '', { day: 'numeric', month: 'short', year: 'numeric' })} –{' '}
              {fmtDate(slice[slice.length - 1]?.date ?? '', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Range tabs */}
          <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  range === r.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <HiOutlineDownload className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(totals.revenue)}</p>
          <div className="mt-1">
            <Trend current={totals.revenue} previous={prevTotals.revenue} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totals.orders}</p>
          <div className="mt-1">
            <Trend current={totals.orders} previous={prevTotals.orders} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Avg Order Value</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(totals.avgOrder)}</p>
          <div className="mt-1">
            <Trend current={totals.avgOrder} previous={prevTotals.avgOrder} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">New Customers</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{totals.newCustomers}</p>
          <p className="mt-0.5 text-xs text-gray-400">Top: {topProduct}</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Daily Revenue (KES)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              interval={range === 7 ? 0 : range === 14 ? 1 : 4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={38}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#fff7ed' }} />
            <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day-by-day table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Day-by-Day Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] table-auto">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Revenue</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Avg Order</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">New Customers</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Conversations</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Top Product</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...slice].reverse().map((day) => {
                const isWeekend = [0, 6].includes(new Date(day.date).getDay());
                return (
                  <tr key={day.date} className={cn('hover:bg-gray-50/60 transition-colors', isWeekend && 'bg-gray-50/30')}>
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium text-gray-900">
                        {fmtDate(day.date, { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      {isWeekend && <p className="text-[10px] text-gray-400">Weekend</p>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <p className="text-sm font-semibold text-gray-900">{fmt(day.revenue)}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center text-sm text-gray-700">{day.orders}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-700">{fmt(day.avgOrderValue)}</td>
                    <td className="px-4 py-2.5 text-center">
                      {day.newCustomers > 0 ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          +{day.newCustomers}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center text-sm text-gray-700">{day.conversations}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 max-w-[160px] truncate">{day.topProduct}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-100 bg-orange-50/40">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Totals / Avg</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{fmt(totals.revenue)}</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">{totals.orders}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{fmt(totals.avgOrder)}</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-700">+{totals.newCustomers}</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                  {slice.reduce((s, d) => s + d.conversations, 0)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-orange-600">{topProduct}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
