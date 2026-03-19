'use client';

import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlineSpeakerphone,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineEye,
  HiOutlinePencil,
} from 'react-icons/hi';
import { CAMPAIGNS, Campaign, CampaignStatus, CampaignType } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function fmtKES(n: number) { return `KES ${n.toLocaleString()}`; }

function pct(num: number, den: number) {
  if (den === 0) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

const TYPE_ICON: Record<CampaignType, React.ElementType> = {
  broadcast: HiOutlineSpeakerphone,
  drip:      HiOutlineLightningBolt,
  automated: HiOutlineClock,
};

const TYPE_LABEL: Record<CampaignType, string> = {
  broadcast: 'Broadcast',
  drip:      'Drip',
  automated: 'Automated',
};

const STATUS_CONFIG: Record<CampaignStatus, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
  scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700' },
  running:   { label: 'Running',   cls: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', cls: 'bg-purple-100 text-purple-700' },
  paused:    { label: 'Paused',    cls: 'bg-yellow-100 text-yellow-700' },
};

/* ─── Metric bar ─────────────────────────────────────────────────────── */

function MetricBar({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className={cn('text-base font-bold', color)}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

/* ─── Campaign card ──────────────────────────────────────────────────── */

function CampaignCard({ camp }: { camp: Campaign }) {
  const TypeIcon = TYPE_ICON[camp.type];
  const st = STATUS_CONFIG[camp.status];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            camp.type === 'broadcast' ? 'bg-orange-100 text-orange-600' :
            camp.type === 'drip'      ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600',
          )}>
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{camp.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {TYPE_LABEL[camp.type]} · {camp.audience} ({camp.audienceCount.toLocaleString()} contacts)
            </p>
            {camp.scheduledAt && camp.status === 'scheduled' && (
              <p className="text-xs text-blue-600 mt-0.5">Scheduled: {camp.scheduledAt} EAT</p>
            )}
          </div>
        </div>
        <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', st.cls)}>
          {st.label}
        </span>
      </div>

      {/* Metrics */}
      {camp.sent > 0 && (
        <div className="mt-4 grid grid-cols-5 divide-x divide-gray-100 rounded-xl bg-gray-50 py-3">
          <MetricBar label="Sent"       value={camp.sent.toLocaleString()}              color="text-gray-700" />
          <MetricBar label="Delivered"  value={pct(camp.delivered, camp.sent)}          color="text-gray-700" />
          <MetricBar label="Read"       value={pct(camp.read, camp.delivered)}           color="text-blue-600" />
          <MetricBar label="Replied"    value={pct(camp.replied, camp.delivered)}        color="text-purple-600" />
          <MetricBar label="Converted"  value={pct(camp.converted, camp.sent)}          color="text-green-600" />
        </div>
      )}

      {camp.revenueAttributed > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          Revenue attributed: <span className="font-semibold text-green-600">{fmtKES(camp.revenueAttributed)}</span>
          <span className="text-gray-400"> (M-Pesa payments within 48h)</span>
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {(camp.status === 'running' || camp.status === 'scheduled') && (
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <HiOutlinePause className="h-3.5 w-3.5" /> Pause
          </button>
        )}
        {camp.status === 'paused' && (
          <button className="flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors">
            <HiOutlinePlay className="h-3.5 w-3.5" /> Resume
          </button>
        )}
        {camp.status === 'draft' && (
          <button className="flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors">
            <HiOutlinePlay className="h-3.5 w-3.5" /> Launch
          </button>
        )}
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <HiOutlinePencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <HiOutlineEye className="h-3.5 w-3.5" /> Report
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function CampaignsPage() {
  const [filter, setFilter] = useState<CampaignStatus | 'all'>('all');

  const filtered = filter === 'all' ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === filter);

  const totalRevenue = CAMPAIGNS.reduce((s, c) => s + c.revenueAttributed, 0);
  const totalSent    = CAMPAIGNS.reduce((s, c) => s + c.sent, 0);
  const running      = CAMPAIGNS.filter((c) => c.status === 'running').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-400">
            {running} running · {totalSent.toLocaleString()} messages sent · {fmtKES(totalRevenue)} revenue attributed
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          <HiOutlinePlus className="h-4 w-4" /> New campaign
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {(['all', 'running', 'scheduled', 'completed', 'paused', 'draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors whitespace-nowrap',
              filter === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((camp) => (
          <CampaignCard key={camp.id} camp={camp} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <HiOutlineSpeakerphone className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No campaigns in this category</p>
          <button className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium">
            + Create your first campaign
          </button>
        </div>
      )}
    </div>
  );
}
