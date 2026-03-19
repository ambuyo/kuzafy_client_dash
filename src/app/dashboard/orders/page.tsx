'use client';

import {
  HiOutlineShoppingBag,
  HiOutlinePlus,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';
import { ORDERS, OrderStatus } from '@/data/mock';
import { cn } from '@/lib/cn';

function fmtKES(n: number) { return `KES ${n.toLocaleString()}`; }

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  confirmed:  { label: 'Confirmed',  cls: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', cls: 'bg-yellow-100 text-yellow-700' },
  shipped:    { label: 'Shipped',    cls: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-gray-100 text-gray-500' },
};

const PIPELINE: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400">{ORDERS.length} total orders</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          <HiOutlinePlus className="h-4 w-4" /> New order
        </button>
      </div>

      {/* Status pipeline counts */}
      <div className="grid grid-cols-4 gap-3">
        {PIPELINE.map((status) => {
          const count = ORDERS.filter((o) => o.status === status).length;
          const st = STATUS_CONFIG[status];
          return (
            <div key={status} className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <span className={cn('mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', st.cls)}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Order list */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Order</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Items</th>
                <th className="px-5 py-3 text-right font-semibold text-gray-600">Total</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Courier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ORDERS.map((order) => {
                const st = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.createdAt}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{order.contactName}</p>
                      <p className="text-xs text-gray-400">{order.contactPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-[180px]">
                      <p className="truncate text-xs">{order.items}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{fmtKES(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', st.cls)}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {order.courier ? (
                        <div className="flex items-center gap-1.5">
                          <HiOutlineTruck className="h-3.5 w-3.5" />
                          {order.courier} · {order.trackingNumber}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
