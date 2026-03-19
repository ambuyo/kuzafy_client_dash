/**
 * components/ui/index.ts
 *
 * Barrel export for all primitive UI components.
 * These are lightweight wrappers that wire Isomorphic's design tokens
 * to simple HTML elements — no rizzui dependency required.
 *
 * For richer components (Select, DatePicker, etc.) install rizzui:
 *   npm install rizzui
 * and import directly from 'rizzui'.
 */

export { Button } from './Button';
export { Card, CardHeader, CardBody } from './Card';
export { Badge } from './Badge';
export { Input } from './Input';
export { Avatar } from './Avatar';
export { Skeleton } from './Skeleton';
export { StatCard } from './StatCard';
export { Modal } from './Modal';
export { Drawer } from './Drawer';
export {
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from './Table';
