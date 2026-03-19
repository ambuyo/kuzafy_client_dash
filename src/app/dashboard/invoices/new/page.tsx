'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePaperAirplane,
} from 'react-icons/hi';
import { CONTACTS } from '@/data/mock';
import { cn } from '@/lib/cn';

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  vatApplicable: boolean;
}

const VAT_RATE = 0.16;

function fmtKES(n: number) {
  return `KES ${n.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
}

export default function NewInvoicePage() {
  const [contactId, setContactId]   = useState('');
  const [dueDate, setDueDate]       = useState('');
  const [notes, setNotes]           = useState('');
  const [items, setItems]           = useState<LineItem[]>([
    { description: '', qty: 1, unitPrice: 0, vatApplicable: false },
  ]);
  const [sendVia, setSendVia]       = useState<'whatsapp' | 'sms'>('whatsapp');

  const selectedContact = CONTACTS.find((c) => c.id === contactId);

  function addItem() {
    setItems((prev) => [...prev, { description: '', qty: 1, unitPrice: 0, vatApplicable: false }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem<K extends keyof LineItem>(i: number, key: K, value: LineItem[K]) {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [key]: value } : item));
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const vatAmount = items.reduce((sum, item) => {
    if (!item.vatApplicable) return sum;
    return sum + item.qty * item.unitPrice * VAT_RATE;
  }, 0);
  const total = subtotal + vatAmount;

  const canSend = contactId && dueDate && items.some((i) => i.description && i.unitPrice > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/invoices" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <HiOutlineArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">New invoice</h1>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-6">

        {/* Step 1 — Contact */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">1. Select contact</label>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <option value="">— Select a contact —</option>
            {CONTACTS.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
          {selectedContact && (
            <p className="mt-1.5 text-xs text-gray-400">
              LTV: {fmtKES(selectedContact.ltv)} · Outstanding balance: {fmtKES(selectedContact.outstandingBalance)}
            </p>
          )}
        </div>

        {/* Step 2 — Line items */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">2. Line items</label>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="Description"
                  className="col-span-5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                  className="col-span-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 text-center focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                  placeholder="Unit price"
                  className="col-span-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
                <div className="col-span-1 flex items-center justify-center pt-2">
                  <label className="flex items-center gap-1 cursor-pointer" title="Apply 16% VAT">
                    <input
                      type="checkbox"
                      checked={item.vatApplicable}
                      onChange={(e) => updateItem(i, 'vatApplicable', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-orange-500"
                    />
                    <span className="text-[10px] text-gray-500">VAT</span>
                  </label>
                </div>
                <div className="col-span-1 flex items-center justify-center pt-1.5">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            <HiOutlinePlus className="h-4 w-4" /> Add line item
          </button>
        </div>

        {/* Totals */}
        <div className="rounded-xl bg-gray-50 p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span><span>{fmtKES(subtotal)}</span>
          </div>
          {vatAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>VAT (16%)</span><span>{fmtKES(vatAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
            <span>Total</span><span>{fmtKES(total)}</span>
          </div>
        </div>

        {/* Step 3 — Due date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">3. Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Send via</label>
            <div className="flex gap-2">
              {(['whatsapp', 'sms'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSendVia(ch)}
                  className={cn(
                    'flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors',
                    sendVia === ch
                      ? 'border-orange-300 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',
                  )}
                >
                  {ch === 'whatsapp' ? '📱 WhatsApp' : '💬 SMS'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Payment terms, bank details, or any other info..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Preview note */}
        {canSend && selectedContact && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs text-green-700">
            <p className="font-semibold mb-1">📋 Preview</p>
            <p>Will send to <strong>{selectedContact.name}</strong> ({selectedContact.phone}) via {sendVia === 'whatsapp' ? 'WhatsApp' : 'SMS'}.</p>
            <p className="mt-1">Invoice includes a <strong>[PAY {fmtKES(total)}]</strong> button that triggers an M-Pesa STK push.</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/dashboard/invoices"
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            disabled={!canSend}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors',
              canSend
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            )}
          >
            <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" />
            Send invoice
          </button>
        </div>
      </div>
    </div>
  );
}
