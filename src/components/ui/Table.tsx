import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Table primitive components
 *
 * Styled to match Isomorphic's table design:
 * - Subtle header background (gray-50)
 * - Row dividers using muted border
 * - Hover state on rows
 * - Responsive horizontal scroll wrapper
 *
 * Usage:
 *   <TableWrapper>
 *     <Table>
 *       <TableHead>
 *         <TableRow>
 *           <TableHeader>Name</TableHeader>
 *         </TableRow>
 *       </TableHead>
 *       <TableBody>
 *         <TableRow>
 *           <TableCell>Alice</TableCell>
 *         </TableRow>
 *       </TableBody>
 *     </Table>
 *   </TableWrapper>
 */

export function TableWrapper({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('w-full overflow-x-auto custom-scrollbar', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Table({
  className,
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn('w-full border-collapse text-sm', className)}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('border-b border-muted', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('divide-y divide-muted', className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  clickable,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }) {
  return (
    <tr
      className={cn(
        'bg-background transition-colors',
        clickable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-100',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400',
        'dark:bg-gray-100',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'px-4 py-3.5 text-sm text-gray-600 dark:text-gray-500',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
