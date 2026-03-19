# Isomorphic Starter — Next.js Design System

A complete Next.js 15 starter that faithfully extracts and implements the **Isomorphic dashboard** design system: tokens, fonts, dark mode, layout shell, and primitive UI components.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the dashboard
open http://localhost:3000/dashboard
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          ← ALL design tokens + base styles (start here)
│   ├── fonts.ts             ← Inter + Lexend Deca via next/font
│   ├── layout.tsx           ← Root layout: fonts, ThemeProvider, Toaster
│   ├── providers.tsx        ← ThemeProvider (next-themes) + StateProvider (Jotai)
│   └── dashboard/
│       ├── layout.tsx       ← Wraps pages with DashboardLayout
│       └── page.tsx         ← Example dashboard overview page
│
├── layouts/
│   └── DashboardLayout.tsx  ← Collapsible sidebar + sticky header shell
│
├── components/ui/
│   ├── Button.tsx           ← variant/size/color system
│   ├── Card.tsx             ← Card + CardHeader + CardBody
│   ├── Badge.tsx            ← Status badges (solid / flat / outline)
│   ├── Input.tsx            ← Text input with label, error, icons
│   ├── Avatar.tsx           ← Image or initials fallback
│   ├── Skeleton.tsx         ← Animated loading placeholder
│   ├── StatCard.tsx         ← KPI card with trend arrow
│   ├── Table.tsx            ← Table primitives
│   ├── Modal.tsx            ← Accessible modal (Headless UI)
│   └── Drawer.tsx           ← Slide-in drawer (Headless UI)
│
├── config/
│   └── site.config.ts       ← Site name, default theme, layout variant
│
└── lib/
    ├── cn.ts                ← clsx + tailwind-merge helper
    ├── useTheme.ts          ← Typed next-themes wrapper with `mounted` guard
    └── atoms.ts             ← Jotai atoms for sidebar, modal, drawer state
```

---

## Design Tokens

All tokens live in `src/app/globals.css` as CSS custom properties and are consumed by Tailwind via `tailwind.config.ts`.

### Color Palette

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#08090e` |
| `--foreground` | `#484848` | `#dfdfdf` |
| `--muted` | `#e3e3e3` | `#333333` |
| `--primary-default` | `#111111` | `#f1f1f1` |
| `--secondary-default` | `#4e36f5` | same |
| `--red-default` | `#ee0000` | same |
| `--green-default` | `#11a849` | same |
| `--orange-default` | `#f5a623` | same |
| `--blue-default` | `#0070f3` | same |

### In Tailwind classes

```tsx
<div className="bg-background text-foreground border-muted" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-secondary/10 text-secondary" />
<div className="text-green font-semibold" />
```

### In inline styles / CSS

```css
color: rgb(var(--primary-default));
background: rgb(var(--background) / 0.8);  /* with alpha */
```

---

## Dark Mode

Dark mode is toggled via the `data-theme="dark"` attribute on `<html>` (not the `.dark` class). This is handled automatically by `next-themes` in `providers.tsx`.

```tsx
// Toggle anywhere
import { useTheme } from '@/lib/useTheme';

const { toggle, isDark, mounted } = useTheme();

// Always guard theme-dependent UI with `mounted`
if (!mounted) return null;

return <button onClick={toggle}>{isDark ? 'Light' : 'Dark'}</button>;
```

---

## Fonts

| Font | Variable | Usage |
|---|---|---|
| Inter | `--font-inter` | Body text, UI labels (default) |
| Lexend Deca | `--font-lexend` | All headings h1–h6, sidebar titles |

```tsx
// Use in Tailwind
<p className="font-inter">Body text</p>
<h2 className="font-lexend font-bold">Heading</h2>
```

---

## UI Components

### Button

```tsx
<Button variant="solid"   color="primary"   size="md">Save</Button>
<Button variant="outline" color="secondary" size="sm">Cancel</Button>
<Button variant="flat"    color="red"       isLoading>Deleting...</Button>
<Button leftIcon={<RxPlus />}>Add Item</Button>
```

Variants: `solid` | `outline` | `ghost` | `flat`
Colors: `primary` | `secondary` | `red` | `green` | `orange`
Sizes: `sm` | `md` | `lg`

### Card

```tsx
<Card>
  <CardHeader title="Revenue" subtitle="Last 30 days" action={<Button size="sm">View</Button>} />
  <CardBody>content</CardBody>
</Card>
```

### Badge

```tsx
<Badge color="green"  dot>Active</Badge>
<Badge color="red"    variant="flat">Failed</Badge>
<Badge color="orange" variant="outline">Pending</Badge>
```

### Input

```tsx
<Input label="Email" placeholder="you@example.com" type="email" />
<Input label="Search" leftIcon={<RxMagnifyingGlass />} />
<Input error="This field is required" />
```

### StatCard

```tsx
<StatCard title="Total Revenue" value="$48,295" change={12.5} icon={<RxBarChart />} />
```

### Modal

```tsx
const [open, setOpen] = useState(false);

<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Delete" size="sm">
  <p>Are you sure you want to delete this item?</p>
  <div className="mt-4 flex justify-end gap-2">
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button color="red">Delete</Button>
  </div>
</Modal>
```

### Drawer

```tsx
<Drawer isOpen={open} onClose={() => setOpen(false)} title="Filters" placement="right">
  <p>Filter options here</p>
</Drawer>
```

### Table

```tsx
<TableWrapper>
  <Table>
    <TableHead>
      <TableRow>
        <TableHeader>Name</TableHeader>
        <TableHeader>Status</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow clickable>
        <TableCell>Alice Martin</TableCell>
        <TableCell><Badge color="green">Active</Badge></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableWrapper>
```

---

## Layout Shell

`DashboardLayout` provides:
- **Collapsible sidebar** (desktop) — icon-only mode at 68px
- **Mobile drawer sidebar** with overlay
- **Sticky header** with theme toggle and notification bell
- **Smooth transitions** on all open/close actions

```tsx
// app/(dashboard)/layout.tsx
import DashboardLayout from '@/layouts/DashboardLayout';
export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

To add nav items, edit the `NAV_ITEMS` array in `DashboardLayout.tsx`.

---

## Global State (Jotai)

```tsx
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom, activeModalAtom } from '@/lib/atoms';

// In any client component:
const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
const [modal, setModal] = useAtom(activeModalAtom);
```

---

## Extending with RizzUI

The original Isomorphic template uses **RizzUI** for richer components (Select, DatePicker, Checkbox, etc.). Install it to get those:

```bash
npm install rizzui
```

RizzUI components are pre-wired to the same CSS variables — they will match your theme automatically.

```tsx
import { Select, Switch, Checkbox } from 'rizzui';
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `next` 15 | Framework |
| `tailwindcss` 3 | Styling |
| `next-themes` | Dark/light mode |
| `jotai` | Global UI state |
| `rizzui` | Rich component library (optional) |
| `@headlessui/react` | Accessible Modal/Drawer/Dropdown |
| `react-icons` | Icon sets (rx, hi, bs, fi, etc.) |
| `motion` | Animations (Framer Motion v12) |
| `recharts` | Charts |
| `react-hook-form` + `zod` | Forms + validation |
| `react-hot-toast` | Toast notifications |
| `nextjs-toploader` | Page transition progress bar |
| `clsx` + `tailwind-merge` | Safe class composition via `cn()` |
# kuzafy_client_dash
