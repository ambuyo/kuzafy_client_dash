'use client';

import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlineLightningBolt,
  HiOutlineChat,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineRefresh,
  HiOutlineBadgeCheck,
  HiOutlineClock,
} from 'react-icons/hi';
import { AUTO_REPLIES } from '@/data/mock';
import { cn } from '@/lib/cn';

/* ─── Template status ─────────────────────────────────────────────────── */

type TemplateStatus = 'approved' | 'pending' | 'rejected';

interface Template {
  id: string;
  name: string;
  category: 'utility' | 'marketing';
  status: TemplateStatus;
  lastUpdated: string;
  languages: ('EN' | 'SW')[];
}

const TEMPLATES: Template[] = [
  { id: 't1', name: 'welcome_new_contact',        category: 'utility',   status: 'approved', lastUpdated: '2026-03-01', languages: ['EN', 'SW'] },
  { id: 't2', name: 'invoice_sent',               category: 'utility',   status: 'approved', lastUpdated: '2026-03-01', languages: ['EN', 'SW'] },
  { id: 't3', name: 'payment_received',           category: 'utility',   status: 'approved', lastUpdated: '2026-03-01', languages: ['EN', 'SW'] },
  { id: 't4', name: 'appointment_confirmed',      category: 'utility',   status: 'approved', lastUpdated: '2026-03-05', languages: ['EN', 'SW'] },
  { id: 't5', name: 'appointment_reminder_24h',   category: 'utility',   status: 'approved', lastUpdated: '2026-03-05', languages: ['EN', 'SW'] },
  { id: 't6', name: 'payment_reminder_due',       category: 'utility',   status: 'approved', lastUpdated: '2026-03-08', languages: ['EN', 'SW'] },
  { id: 't7', name: 'payment_overdue_7d',         category: 'utility',   status: 'pending',  lastUpdated: '2026-03-18', languages: ['EN'] },
  { id: 't8', name: 'order_shipped',              category: 'utility',   status: 'approved', lastUpdated: '2026-03-10', languages: ['EN'] },
  { id: 't9', name: 'broadcast_promotion',        category: 'marketing', status: 'approved', lastUpdated: '2026-02-20', languages: ['EN', 'SW'] },
  { id:'t10', name: 'reengagement_60d',           category: 'marketing', status: 'approved', lastUpdated: '2026-02-20', languages: ['EN', 'SW'] },
  { id:'t11', name: 'birthday_greeting',          category: 'marketing', status: 'rejected', lastUpdated: '2026-03-15', languages: ['EN'] },
  { id:'t12', name: 'post_purchase_followup',     category: 'marketing', status: 'pending',  lastUpdated: '2026-03-19', languages: ['EN', 'SW'] },
];

const TEMPLATE_STATUS: Record<TemplateStatus, { label: string; cls: string; icon: React.ElementType }> = {
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-700',  icon: HiOutlineCheckCircle },
  pending:  { label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700', icon: HiOutlineClock },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-600',      icon: HiOutlineXCircle },
};

type SectionTab = 'rules' | 'templates' | 'flows';

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AutomationsPage() {
  const [tab, setTab]     = useState<SectionTab>('rules');
  const [rules, setRules] = useState(AUTO_REPLIES.map((r) => ({ ...r })));

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Automations</h1>
          <p className="text-sm text-gray-400">Bot flows, auto-replies, and message templates</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          <HiOutlinePlus className="h-4 w-4" /> New rule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        {([
          { key: 'rules',     label: 'Auto-reply rules',  icon: HiOutlineLightningBolt },
          { key: 'templates', label: 'Templates',         icon: HiOutlineDocumentText },
          { key: 'flows',     label: 'Bot flow builder',  icon: HiOutlineChat },
        ] as const).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Auto-reply rules ── */}
      {tab === 'rules' && (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 transition-all',
                rule.active ? 'ring-gray-100' : 'ring-gray-100 opacity-60',
              )}
            >
              {/* Toggle */}
              <button
                onClick={() => toggleRule(rule.id)}
                className={cn(
                  'relative mt-0.5 h-5 w-9 flex-shrink-0 rounded-full transition-colors focus:outline-none',
                  rule.active ? 'bg-orange-500' : 'bg-gray-200',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  rule.active ? 'translate-x-4' : 'translate-x-0',
                )} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{rule.name}</p>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                  )}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Trigger:</span> {rule.trigger}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Response:</span> {rule.response}
                </p>
                <p className="mt-1.5 text-[11px] text-gray-400">Triggered {rule.triggerCount.toLocaleString()} times</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                  <HiOutlinePencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <HiOutlineTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-5 text-sm font-medium text-gray-400 transition-colors hover:border-orange-300 hover:text-orange-500">
            <HiOutlinePlus className="h-4 w-4" /> Add auto-reply rule
          </button>
        </div>
      )}

      {/* ── Templates ── */}
      {tab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {TEMPLATES.filter((t) => t.status === 'approved').length} approved ·{' '}
              <span className="text-yellow-600">{TEMPLATES.filter((t) => t.status === 'pending').length} pending</span> ·{' '}
              <span className="text-red-500">{TEMPLATES.filter((t) => t.status === 'rejected').length} rejected</span>
            </p>
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <HiOutlinePlus className="h-3.5 w-3.5" /> New template
            </button>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Template name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Languages</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TEMPLATES.map((t) => {
                  const st = TEMPLATE_STATUS[t.status];
                  const StatusIcon = st.icon;
                  return (
                    <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-700">{t.name}</code>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                          t.category === 'utility' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700',
                        )}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          {t.languages.map((lang) => (
                            <span key={lang} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">{lang}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', st.cls)}>
                          <StatusIcon className="h-3 w-3" /> {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <HiOutlineEye className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <HiOutlinePencil className="h-3.5 w-3.5" />
                          </button>
                          {t.status === 'rejected' && (
                            <button className="rounded-lg bg-orange-50 border border-orange-200 p-1.5 text-orange-600 hover:bg-orange-100 transition-colors" title="Resubmit">
                              <HiOutlineRefresh className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Bot flow builder ── */}
      {tab === 'flows' && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm ring-1 ring-gray-100">
          <HiOutlineBadgeCheck className="h-12 w-12 text-orange-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900">Visual bot flow builder</h3>
          <p className="mt-2 text-sm text-gray-400 text-center max-w-sm">
            Drag-and-drop nodes to build your bot flows — send messages, ask questions, set conditions, trigger payments.
          </p>
          <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 p-8 w-full max-w-lg">
            <div className="flex flex-col items-center gap-3 text-xs text-gray-400">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-600 font-medium">
                🔔 TRIGGER: Customer sends first message
              </div>
              <div className="text-gray-300">↓</div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-orange-700 font-medium">
                💬 SEND: &quot;welcome_new_contact&quot; template
              </div>
              <div className="text-gray-300">↓</div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-700 font-medium">
                ❓ CONDITION: Customer reply intent?
              </div>
              <div className="flex gap-4 text-gray-300">
                <div className="flex flex-col items-center gap-1">
                  <span>↓ Price request</span>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">Send pricing</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span>↓ Booking</span>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">Booking flow</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span>↓ Other</span>
                  <div className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-purple-700">→ Agent</div>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-6 flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <HiOutlinePlus className="h-4 w-4" /> Build new flow
          </button>
        </div>
      )}
    </div>
  );
}
