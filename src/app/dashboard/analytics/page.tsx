'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from 'recharts';
import {
  HiOutlineDownload,
  HiOutlineChatAlt2,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardCheck,
  HiOutlineLightningBolt,
} from 'react-icons/hi';
import { REVENUE_CHART, FUNNEL, TEAM_PERFORMANCE } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) { return `KES ${n.toLocaleString()}`; }

/* ─── Tooltips ───────────────────────────────────────────────────────── */

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg space-y-0.5">
      <p className="font-medium text-gray-300">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-orange-400">{fmtKES(p.value)}</p>
      ))}
    </div>
  );
}

function ConvTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium text-gray-300">{label}</p>
      <p className="text-blue-400">{payload[0].value} conversations</p>
    </div>
  );
}

/* ─── KPI stat ───────────────────────────────────────────────────────── */

function KpiStat({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', color)}>
          <Icon className="h-4.5 w-4.5 text-white" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AnalyticsPage() {
  const totalRevenue7d = REVENUE_CHART.reduce((s, d) => s + d.revenue, 0);
  const totalConvs7d   = REVENUE_CHART.reduce((s, d) => s + d.conversations, 0);
  const convToQuote = Math.round((FUNNEL[1].count / FUNNEL[0].count) * 100);
  const quoteToPaid = Math.round((FUNNEL[4].count / FUNNEL[1].count) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400">Last 7 days · All channels · EAT timezone</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <HiOutlineDownload className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiStat label="Revenue (7d)"          value={fmtKES(totalRevenue7d)}       sub="All M-Pesa + card"         icon={HiOutlineCurrencyDollar} color="bg-green-500" />
        <KpiStat label="Conversations (7d)"    value={totalConvs7d.toLocaleString()} sub="Across WhatsApp + SMS"    icon={HiOutlineChatAlt2}       color="bg-blue-500" />
        <KpiStat label="Conv → Quote rate"     value={`${convToQuote}%`}             sub="Target: >15%"             icon={HiOutlineClipboardCheck} color="bg-orange-500" />
        <KpiStat label="Quote → Paid rate"     value={`${quoteToPaid}%`}             sub="Target: >40%"             icon={HiOutlineLightningBolt}  color="bg-purple-500" />
      </div>

      {/* Revenue + Conversations charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Revenue chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue over time</h2>
          <p className="text-xs text-gray-400 mb-4">Daily M-Pesa + card revenue (KES)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_CHART} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F97315" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F97315" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `${v / 1000}k`} width={36} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#F97315" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#F97315' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversations chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-1">Conversation volume</h2>
          <p className="text-xs text-gray-400 mb-4">Daily conversations across all channels</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_CHART} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} width={28} />
                <Tooltip content={<ConvTooltip />} />
                <Bar dataKey="conversations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion funnel + Team performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Funnel */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Conversion funnel</h2>
          <div className="space-y-2">
            {FUNNEL.map((step, i) => {
              const pct = Math.round((step.count / FUNNEL[0].count) * 100);
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-green-500'];
              return (
                <div key={step.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{step.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{pct}%</span>
                      <span className="text-sm font-semibold text-gray-900">{step.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100">
                    <div
                      className={cn('h-2.5 rounded-full transition-all', colors[i])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 text-xs">
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">{convToQuote}%</p>
              <p className="text-gray-500">Conv → Quote</p>
              <p className="text-[10px] text-gray-400">Target: 15%</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{quoteToPaid}%</p>
              <p className="text-gray-500">Quote → Paid</p>
              <p className="text-[10px] text-gray-400">Target: 40%</p>
            </div>
          </div>
        </div>

        {/* Team performance */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Team performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Agent</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Convs</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Avg resp.</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TEAM_PERFORMANCE.map((row) => (
                  <tr key={row.agent}>
                    <td className="py-3 font-medium text-gray-900">{row.agent}</td>
                    <td className="py-3 text-right text-gray-600">{row.conversations}</td>
                    <td className="py-3 text-right text-gray-600">{row.avgResponseMins}m</td>
                    <td className="py-3 text-right">
                      <span className={cn(
                        'font-semibold',
                        row.csat >= 4.7 ? 'text-green-600' :
                        row.csat >= 4.4 ? 'text-orange-500' : 'text-red-500',
                      )}>
                        {row.csat}/5
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KPI targets */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">KPI Targets</p>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Message delivery rate', current: '98.3%', target: '>98%', ok: true },
                { label: 'Avg response (bot)',     current: '0.2m',  target: '<2m',  ok: true },
                { label: 'Avg response (agent)',   current: '3.9m',  target: '<5m',  ok: true },
                { label: 'M-Pesa completion rate', current: '87%',   target: '>85%', ok: true },
                { label: 'DAU/MAU ratio',          current: '38%',   target: '>40%', ok: false },
              ].map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between">
                  <span className="text-gray-500">{kpi.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn('font-semibold', kpi.ok ? 'text-green-600' : 'text-red-500')}>{kpi.current}</span>
                    <span className="text-gray-300">/ {kpi.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
