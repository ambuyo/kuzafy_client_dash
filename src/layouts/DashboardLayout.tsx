'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineViewGrid,
  HiOutlineChat,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineArchive,
  HiOutlineCollection,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineLink,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineOfficeBuilding,
  HiOutlineColorSwatch,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';

/* ─── Kuzafy Logo ────────────────────────────────────────────────────── */

function KuzafyLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="33" height="33" rx="8" fill="#F97315" />
      <path d="M1 28 L1 34 Q1 36 3 36 H9 L1 28Z" fill="#F97315" />
      <path d="M13 13 Q13 5 17.5 5 Q22 5 22 13" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <rect x="10" y="13" width="15" height="13" rx="2.5" stroke="white" strokeWidth="2.4" fill="none" />
      <path d="M13.5 22 Q17.5 26.5 21.5 22" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Nav structure ──────────────────────────────────────────────────── */

interface NavChild {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  key: string;
  label: string;
  href?: string;           // if set → direct link, no dropdown
  icon?: React.ElementType;
  children?: NavChild[];
}

const NAV: NavGroup[] = [
  {
    key: 'overview',
    label: 'Overview',
    href: '/dashboard',
    icon: HiOutlineViewGrid,
  },
  {
    key: 'chats',
    label: 'Chats',
    children: [
      { label: 'Inbox',        href: '/dashboard/inbox',        icon: HiOutlineChat,     badge: 7 },
      { label: 'Contacts',     href: '/dashboard/contacts',     icon: HiOutlineUsers },
      { label: 'Appointments', href: '/dashboard/appointments', icon: HiOutlineCalendar },
    ],
  },
  {
    key: 'payments',
    label: 'Payments',
    children: [
      { label: 'Invoices', href: '/dashboard/invoices', icon: HiOutlineDocumentText },
      { label: 'Orders',   href: '/dashboard/orders',   icon: HiOutlineShoppingBag },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    children: [
      { label: 'Discounts',   href: '/dashboard/products/discounts',   icon: HiOutlineTag },
      { label: 'Stock',       href: '/dashboard/products/stock',       icon: HiOutlineArchive },
      { label: 'Categories',  href: '/dashboard/products/categories',  icon: HiOutlineCollection },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    children: [
      { label: 'Carts',         href: '/dashboard/carts',     icon: HiOutlineShoppingCart },
      { label: 'Checkout',      href: '/dashboard/checkout',  icon: HiOutlineCreditCard },
      { label: 'Links',         href: '/dashboard/links',     icon: HiOutlineLink },
      { label: 'Customers',     href: '/dashboard/customers', icon: HiOutlineUserGroup },
      { label: 'Daily Reports', href: '/dashboard/reports',   icon: HiOutlineChartBar },
    ],
  },
  {
    key: 'store',
    label: 'Store Settings',
    children: [
      { label: 'Business Info',        href: '/dashboard/settings',                   icon: HiOutlineOfficeBuilding },
      { label: 'Storefront',           href: '/dashboard/settings/storefront',         icon: HiOutlineColorSwatch },
      { label: 'Payments Settings',    href: '/dashboard/settings/payments-config',    icon: HiOutlineCog },
      { label: 'Users',                href: '/dashboard/settings/users',              icon: HiOutlineUsers },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function useActiveGroup(pathname: string) {
  return (group: NavGroup) => {
    if (group.href) return pathname === group.href;
    return group.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + '/'),
    ) ?? false;
  };
}

/* ─── Theme toggle ───────────────────────────────────────────────────── */

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <HiOutlineSun className="h-4 w-4" />
        : <HiOutlineMoon className="h-4 w-4" />}
    </button>
  );
}

/* ─── Desktop dropdown group ─────────────────────────────────────────── */

function DesktopGroup({
  group,
  open,
  onToggle,
  onClose,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const isGroupActive = useActiveGroup(pathname)(group);

  /* direct link — no dropdown */
  if (group.href && group.icon) {
    const Icon = group.icon;
    return (
      <Link
        href={group.href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap',
          isGroupActive
            ? 'bg-orange-50 text-orange-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {group.label}
      </Link>
    );
  }

  /* dropdown group */
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cn(
          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap',
          isGroupActive
            ? 'bg-orange-50 text-orange-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        {group.label}
        <HiOutlineChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[180px] rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
          {group.children?.map((child) => {
            const Icon = child.icon;
            const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-orange-500' : 'text-gray-400')} />
                {child.label}
                {child.badge ? (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {child.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Mobile accordion group ─────────────────────────────────────────── */

function MobileGroup({
  group,
  onClose,
}: {
  group: NavGroup;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const isGroupActive = useActiveGroup(pathname)(group);
  const [expanded, setExpanded] = useState(isGroupActive);

  /* direct link */
  if (group.href && group.icon) {
    const Icon = group.icon;
    return (
      <Link
        href={group.href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
          isGroupActive
            ? 'bg-orange-50 text-orange-600'
            : 'text-gray-700 hover:bg-gray-100',
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {group.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
          isGroupActive ? 'text-orange-600' : 'text-gray-700 hover:bg-gray-100',
        )}
      >
        <span>{group.label}</span>
        <HiOutlineChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="mb-1 ml-4 space-y-0.5 border-l-2 border-gray-100 pl-3">
          {group.children?.map((child) => {
            const Icon = child.icon;
            const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-orange-50 font-medium text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-orange-500' : 'text-gray-400')} />
                {child.label}
                {child.badge ? (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {child.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Mobile drawer ──────────────────────────────────────────────────── */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={onClose} />
      )}
      <div className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:hidden',
        open ? 'translate-x-0' : 'translate-x-full',
      )}>
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2">
            <KuzafyLogo size={24} />
            <span className="font-lexend text-sm font-bold text-gray-900">kuzafy</span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map((group) => (
            <MobileGroup key={group.key} group={group} onClose={onClose} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
            GM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">Grace Mwangi</p>
            <p className="truncate text-xs text-gray-400">grace@fashionke.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Topbar ─────────────────────────────────────────────────────────── */

function Topbar({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => setOpenGroup(null), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeAll();
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [closeAll]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-2 px-4 lg:px-6">

        {/* Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2 mr-3" onClick={closeAll}>
          <KuzafyLogo size={28} />
          <span className="hidden font-lexend text-base font-bold tracking-tight text-gray-900 sm:block">
            kuzafy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex flex-1 items-center gap-0.5">
          {NAV.map((group) => (
            <DesktopGroup
              key={group.key}
              group={group}
              open={openGroup === group.key}
              onToggle={() => setOpenGroup((prev) => prev === group.key ? null : group.key)}
              onClose={closeAll}
            />
          ))}
        </nav>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
            <HiOutlineBell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500 ring-1 ring-white" />
          </button>
          <ThemeToggle />
          <div className="ml-1 flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
            GM
          </div>
          <button
            onClick={onMobileMenuOpen}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── Shell ──────────────────────────────────────────────────────────── */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
