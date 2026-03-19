'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES, PRODUCTS, Category } from '@/data/mock';
import { cn } from '@/lib/cn';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineCollection,
  HiOutlineTag,
} from 'react-icons/hi';

/* ─── Color palette ───────────────────────────────────────────────────── */

const PALETTE = [
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#22c55e', // green
  '#84cc16', // lime
  '#eab308', // yellow
  '#f59e0b', // amber
  '#f97316', // orange
  '#ef4444', // red
  '#78716c', // stone
  '#6b7280', // gray
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ─── Form types ──────────────────────────────────────────────────────── */

type FormState = Omit<Category, 'id' | 'createdAt'>;

const EMPTY: FormState = {
  name: '',
  slug: '',
  description: '',
  color: '#f97316',
};

function catToForm(c: Category): FormState {
  return { name: c.name, slug: c.slug, description: c.description, color: c.color };
}

/* ─── Input style ─────────────────────────────────────────────────────── */

function inputCls(error?: boolean) {
  return cn(
    'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100'
      : 'border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-100',
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Category Modal (Add / Edit) ─────────────────────────────────────── */

function CategoryModal({
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
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    setForm(initial);
    setSlugEdited(mode === 'edit');
    setErrors({});
  }, [initial, open, mode]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-derive slug from name unless user has manually edited it
      if (key === 'name' && !slugEdited) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.slug.trim()) e.slug = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === 'add' ? 'Add Category' : 'Edit Category'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          <Field label="Category Name" error={errors.name} required>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Summer Collection"
              className={inputCls(!!errors.name)}
              autoFocus
            />
          </Field>

          <Field label="Slug" error={errors.slug} required>
            <div className="flex items-center gap-0">
              <span className="flex h-9 items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-400 select-none">
                /
              </span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set('slug', toSlug(e.target.value));
                }}
                placeholder="summer-collection"
                className={cn(inputCls(!!errors.slug), 'rounded-l-none')}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Used in storefront URLs — auto-generated from name
            </p>
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Brief description shown on the storefront…"
              className={inputCls(false) + ' resize-none'}
            />
          </Field>

          {/* Color picker */}
          <Field label="Colour">
            <div className="flex flex-wrap gap-2 pt-1">
              {PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => set('color', hex)}
                  className={cn(
                    'h-7 w-7 rounded-full transition-transform hover:scale-110',
                    form.color === hex && 'ring-2 ring-offset-2 ring-gray-400 scale-110',
                  )}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => validate() && onSave(form)}
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            {mode === 'add' ? 'Add Category' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Delete Confirm ──────────────────────────────────────────────────── */

function DeleteConfirm({
  category,
  productCount,
  onConfirm,
  onCancel,
}: {
  category: Category;
  productCount: number;
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
            <h3 className="text-sm font-semibold text-gray-900">Delete category?</h3>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-medium">{category.name}</span> will be permanently
              removed.
            </p>
            {productCount > 0 && (
              <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                ⚠ {productCount} product{productCount !== 1 ? 's' : ''} in this category
                will become uncategorised.
              </p>
            )}
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

/* ─── Category Card ───────────────────────────────────────────────────── */

function CategoryCard({
  category,
  productCount,
  onEdit,
  onDelete,
}: {
  category: Category;
  productCount: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Coloured header band */}
      <div
        className="flex h-16 items-center justify-between px-4"
        style={{ backgroundColor: category.color + '18' }} // 10% opacity tint
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          {category.name.charAt(0)}
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-500 hover:bg-white hover:text-orange-600 transition-colors shadow-sm"
            title="Edit"
          >
            <HiOutlinePencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-gray-500 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
            title="Delete"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
        <p className="mt-0.5 text-xs text-gray-400">/{category.slug}</p>
        {category.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {category.description}
          </p>
        )}

        {/* Product count */}
        <div className="mt-auto pt-3">
          <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3">
            <HiOutlineTag className="h-3.5 w-3.5 text-gray-400" />
            <span
              className={cn(
                'text-xs font-medium',
                productCount === 0 ? 'text-gray-400' : 'text-gray-700',
              )}
            >
              {productCount} product{productCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalInit, setModalInit] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Product counts per category name
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of PRODUCTS) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  function openAdd() {
    setModalMode('add');
    setModalInit(EMPTY);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setModalMode('edit');
    setModalInit(catToForm(c));
    setEditingId(c.id);
    setModalOpen(true);
  }

  function handleSave(form: FormState) {
    if (modalMode === 'add') {
      setCategories((prev) => [
        ...prev,
        { ...form, id: 'cat' + Date.now(), createdAt: new Date().toISOString().split('T')[0] },
      ]);
    } else if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)),
      );
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
            <HiOutlineCollection className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Categories</h1>
            <p className="text-xs text-gray-400">{categories.length} categories</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <HiOutlineCollection className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No categories yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Add your first category to start organising products.
          </p>
          <button
            onClick={openAdd}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={productCounts[cat.name] ?? 0}
              onEdit={() => openEdit(cat)}
              onDelete={() => setDeleteTarget(cat)}
            />
          ))}

          {/* Add new — ghost card */}
          <button
            onClick={openAdd}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-orange-300 hover:text-orange-500"
          >
            <HiOutlinePlus className="h-6 w-6" />
            <span className="text-sm font-medium">New Category</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        mode={modalMode}
        initial={modalInit}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          category={deleteTarget}
          productCount={productCounts[deleteTarget.name] ?? 0}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
