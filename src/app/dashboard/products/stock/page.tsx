'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
  Product,
  ProductStatus,
} from '@/data/mock';
import { cn } from '@/lib/cn';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineTag,
  HiOutlineRefresh,
  HiOutlineArchive,
  HiOutlineChevronDown,
  HiOutlineAdjustments,
} from 'react-icons/hi';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

const fmt = (n: number) =>
  'KES ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0 });

type StockState = 'out' | 'low' | 'ok' | 'untracked';

function stockState(p: Product): StockState {
  if (!p.trackStock) return 'untracked';
  if (p.stock === 0) return 'out';
  if (p.stock <= p.lowStockThreshold) return 'low';
  return 'ok';
}

const CATEGORY_COLORS: Record<string, string> = {
  Dresses: 'bg-rose-100 text-rose-700',
  Tops: 'bg-purple-100 text-purple-700',
  Bottoms: 'bg-blue-100 text-blue-700',
  Accessories: 'bg-amber-100 text-amber-700',
  Footwear: 'bg-teal-100 text-teal-700',
  Kids: 'bg-green-100 text-green-700',
};

const AVATAR_BG: Record<string, string> = {
  Dresses: 'bg-rose-500',
  Tops: 'bg-purple-500',
  Bottoms: 'bg-blue-500',
  Accessories: 'bg-amber-500',
  Footwear: 'bg-teal-500',
  Kids: 'bg-green-500',
};

const STATUS_BADGE: Record<ProductStatus, string> = {
  active: 'bg-green-50 text-green-700 ring-green-200',
  draft: 'bg-gray-100 text-gray-600 ring-gray-200',
  archived: 'bg-red-50 text-red-600 ring-red-200',
};

function autoSku(name: string, category: string): string {
  const cat = category.slice(0, 3).toUpperCase();
  const nm = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  return `KF-${cat}-${nm}${Math.floor(Math.random() * 900 + 100)}`;
}

/* ─── Form types ──────────────────────────────────────────────────────── */

type FormState = Omit<Product, 'id' | 'createdAt'> & { tagsRaw: string };

const EMPTY: FormState = {
  name: '',
  sku: '',
  category: '',
  description: '',
  price: 0,
  comparePrice: undefined,
  costPrice: undefined,
  stock: 0,
  lowStockThreshold: 5,
  trackStock: true,
  status: 'active',
  tags: [],
  tagsRaw: '',
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    sku: p.sku,
    category: p.category,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice,
    costPrice: p.costPrice,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    trackStock: p.trackStock,
    status: p.status,
    tags: p.tags,
    tagsRaw: p.tags.join(', '),
  };
}

/* ─── Shared input styles ─────────────────────────────────────────────── */

function inputCls(error?: boolean) {
  return cn(
    'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100'
      : 'border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-100',
  );
}

/* ─── Field wrapper ───────────────────────────────────────────────────── */

function Field({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        on ? 'bg-orange-500' : 'bg-gray-200',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
          on ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}

/* ─── Product Drawer ──────────────────────────────────────────────────── */

function ProductDrawer({
  open,
  mode,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  mode: 'add' | 'edit';
  initial: FormState;
  onSave: (f: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    setForm(initial);
    setErrors({});
  }, [initial, open]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.sku.trim()) e.sku = 'Required';
    if (!form.category) e.category = 'Required';
    if (form.price <= 0) e.price = 'Must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave({
      ...form,
      tags: form.tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  const margin =
    form.costPrice && form.costPrice > 0 && form.price > 0
      ? Math.round(((form.price - form.costPrice) / form.price) * 100)
      : null;

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === 'add' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Basic Info */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Basic Info
            </h3>

            <Field label="Product Name" error={errors.name} required>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Floral Maxi Dress"
                className={inputCls(!!errors.name)}
              />
            </Field>

            <div className="flex gap-2">
              <Field label="SKU" error={errors.sku} required className="flex-1">
                <input
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value.toUpperCase())}
                  placeholder="KF-DRS-001"
                  className={inputCls(!!errors.sku)}
                />
              </Field>
              <div className="flex flex-col justify-end pb-0">
                <button
                  type="button"
                  onClick={() => {
                    if (form.name && form.category)
                      set('sku', autoSku(form.name, form.category));
                  }}
                  title="Auto-generate SKU"
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <HiOutlineRefresh className="h-3.5 w-3.5" />
                  Auto
                </button>
              </div>
            </div>

            <Field label="Category" error={errors.category} required>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls(!!errors.category)}
              >
                <option value="">Select category…</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                placeholder="Short product description…"
                className={inputCls(false) + ' resize-none'}
              />
            </Field>
          </section>

          <hr className="border-gray-100" />

          {/* Pricing */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Pricing (KES)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Selling Price" error={errors.price} required>
                <input
                  type="number"
                  min={0}
                  value={form.price || ''}
                  onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={inputCls(!!errors.price)}
                />
              </Field>
              <Field label="Compare-at Price">
                <input
                  type="number"
                  min={0}
                  value={form.comparePrice || ''}
                  onChange={(e) =>
                    set('comparePrice', parseFloat(e.target.value) || undefined)
                  }
                  placeholder="0"
                  className={inputCls(false)}
                />
              </Field>
            </div>

            <Field label="Cost per Item">
              <input
                type="number"
                min={0}
                value={form.costPrice || ''}
                onChange={(e) =>
                  set('costPrice', parseFloat(e.target.value) || undefined)
                }
                placeholder="0"
                className={inputCls(false)}
              />
            </Field>

            {margin !== null && (
              <p className="text-xs text-gray-500">
                Margin:{' '}
                <span
                  className={cn(
                    'font-semibold',
                    margin >= 40
                      ? 'text-green-600'
                      : margin >= 20
                      ? 'text-amber-600'
                      : 'text-red-600',
                  )}
                >
                  {margin}%
                </span>
              </p>
            )}
          </section>

          <hr className="border-gray-100" />

          {/* Inventory */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Inventory
            </h3>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-700">Track quantity</p>
                <p className="text-xs text-gray-400">Monitor stock levels and alerts</p>
              </div>
              <Toggle on={form.trackStock} onChange={(v) => set('trackStock', v)} />
            </div>

            {form.trackStock && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Quantity in stock">
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => set('stock', parseInt(e.target.value) || 0)}
                    className={inputCls(false)}
                  />
                </Field>
                <Field label="Low stock alert at">
                  <input
                    type="number"
                    min={0}
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      set('lowStockThreshold', parseInt(e.target.value) || 0)
                    }
                    className={inputCls(false)}
                  />
                </Field>
              </div>
            )}
          </section>

          <hr className="border-gray-100" />

          {/* Status & Tags */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Status & Tags
            </h3>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as ProductStatus)}
                className={inputCls(false)}
              >
                <option value="active">Active — visible in store</option>
                <option value="draft">Draft — hidden from store</option>
                <option value="archived">Archived — discontinued</option>
              </select>
            </Field>

            <Field label="Tags">
              <div className="relative">
                <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={form.tagsRaw}
                  onChange={(e) => set('tagsRaw', e.target.value)}
                  placeholder="summer, bestseller, sale"
                  className={inputCls(false) + ' pl-9'}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Comma-separated</p>
            </Field>
          </section>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            {mode === 'add' ? 'Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Delete Confirm ──────────────────────────────────────────────────── */

function DeleteConfirm({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <HiOutlineExclamation className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delete product?</h3>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-medium">{product.name}</span> ({product.sku}) will be
              permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Stock Adjust Modal ──────────────────────────────────────────────── */

function StockAdjustModal({
  product,
  onSave,
  onClose,
}: {
  product: Product;
  onSave: (newQty: number) => void;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(product.stock);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-900">Adjust Stock</h3>
        <p className="mt-0.5 text-xs text-gray-500">
          {product.name} · {product.sku}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(0, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={qty}
            onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-center text-lg font-semibold text-gray-900 outline-none focus:border-orange-400"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            +
          </button>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(qty)}
            className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Stock badge ─────────────────────────────────────────────────────── */

function StockBadge({ product }: { product: Product }) {
  const s = stockState(product);
  if (s === 'untracked') return <span className="text-sm text-gray-400">—</span>;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        s === 'out'
          ? 'bg-red-50 text-red-700'
          : s === 'low'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-green-50 text-green-700',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          s === 'out' ? 'bg-red-500' : s === 'low' ? 'bg-amber-500' : 'bg-green-500',
        )}
      />
      {product.stock} {s === 'low' ? '(low)' : s === 'out' ? '(out of stock)' : 'in stock'}
    </span>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [drawerInit, setDrawerInit] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Stock adjust
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = !filterCat || p.category === filterCat;
      const matchStatus = !filterStatus || p.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, filterCat, filterStatus]);

  /* Stats */
  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === 'active').length,
      lowStock: products.filter(
        (p) => p.trackStock && p.stock > 0 && p.stock <= p.lowStockThreshold,
      ).length,
      outOfStock: products.filter((p) => p.trackStock && p.stock === 0).length,
    }),
    [products],
  );

  function openAdd() {
    setDrawerMode('add');
    setDrawerInit(EMPTY);
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(p: Product) {
    setDrawerMode('edit');
    setDrawerInit(productToForm(p));
    setEditingId(p.id);
    setDrawerOpen(true);
  }

  function handleSave(form: FormState) {
    const { tagsRaw: _, ...rest } = form;
    if (drawerMode === 'add') {
      const newProd: Product = {
        ...rest,
        id: 'prod' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts((prev) => [newProd, ...prev]);
    } else if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...rest } : p)),
      );
    }
    setDrawerOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  function handleStockAdjust(newQty: number) {
    if (adjustTarget) {
      setProducts((prev) =>
        prev.map((p) => (p.id === adjustTarget.id ? { ...p, stock: newQty } : p)),
      );
      setAdjustTarget(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
            <HiOutlineArchive className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Products</h1>
            <p className="text-xs text-gray-400">{products.length} products total</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Products" value={stats.total} />
        <StatCard label="Active" value={stats.active} color="text-green-600" />
        <StatCard
          label="Low Stock"
          value={stats.lowStock}
          color={stats.lowStock > 0 ? 'text-amber-600' : 'text-gray-900'}
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStock}
          color={stats.outOfStock > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, or tag…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
          />
        </div>

        <div className="relative">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="">All categories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <HiOutlineChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <HiOutlineChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[700px] table-auto">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  No products found.{' '}
                  <button
                    onClick={openAdd}
                    className="text-orange-500 hover:underline"
                  >
                    Add one?
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const margin =
                  p.costPrice && p.costPrice > 0
                    ? Math.round(((p.price - p.costPrice) / p.price) * 100)
                    : null;
                return (
                  <tr key={p.id} className="group hover:bg-gray-50/60 transition-colors">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                            AVATAR_BG[p.category] ?? 'bg-gray-400',
                          )}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          CATEGORY_COLORS[p.category] ?? 'bg-gray-100 text-gray-600',
                        )}
                      >
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-semibold text-gray-900">{fmt(p.price)}</p>
                      {p.comparePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {fmt(p.comparePrice)}
                        </p>
                      )}
                      {margin !== null && (
                        <p
                          className={cn(
                            'text-[10px] font-medium',
                            margin >= 40
                              ? 'text-green-600'
                              : margin >= 20
                              ? 'text-amber-600'
                              : 'text-red-500',
                          )}
                        >
                          {margin}% margin
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StockBadge product={p} />
                        {p.trackStock && (
                          <button
                            onClick={() => setAdjustTarget(p)}
                            title="Adjust stock"
                            className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                          >
                            <HiOutlineAdjustments className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                          STATUS_BADGE[p.status],
                        )}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400">
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </div>

      {/* Drawer */}
      <ProductDrawer
        open={drawerOpen}
        mode={drawerMode}
        initial={drawerInit}
        onSave={handleSave}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Stock adjust */}
      {adjustTarget && (
        <StockAdjustModal
          product={adjustTarget}
          onSave={handleStockAdjust}
          onClose={() => setAdjustTarget(null)}
        />
      )}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', color ?? 'text-gray-900')}>{value}</p>
    </div>
  );
}
