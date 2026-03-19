'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { RxCross2 } from 'react-icons/rx';
import { cn } from '@/lib/cn';

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: DrawerPlacement;
  size?: string; // e.g. 'w-80', 'w-[400px]', 'h-64'
  className?: string;
}

const ENTER_FROM: Record<DrawerPlacement, string> = {
  right:  'translate-x-full',
  left:   '-translate-x-full',
  top:    '-translate-y-full',
  bottom: 'translate-y-full',
};

const PANEL_POSITION: Record<DrawerPlacement, string> = {
  right:  'inset-y-0 right-0',
  left:   'inset-y-0 left-0',
  top:    'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
};

const DEFAULT_SIZE: Record<DrawerPlacement, string> = {
  right:  'w-80',
  left:   'w-80',
  top:    'h-64',
  bottom: 'h-64',
};

/**
 * Drawer
 *
 * Slide-in panel from any edge. Uses Headless UI Dialog for accessibility.
 * Styled to match Isomorphic's drawer design.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  placement = 'right',
  size,
  className,
}: DrawerProps) {
  const panelSize = size ?? DEFAULT_SIZE[placement];
  const isHorizontal = placement === 'left' || placement === 'right';

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>

        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn('pointer-events-none fixed flex', PANEL_POSITION[placement])}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={ENTER_FROM[placement]}
                enterTo="translate-x-0 translate-y-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0 translate-y-0"
                leaveTo={ENTER_FROM[placement]}
              >
                <Dialog.Panel
                  className={cn(
                    'pointer-events-auto flex flex-col border-muted bg-background shadow-roundedCard',
                    isHorizontal
                      ? 'h-full border-l border-r-0'
                      : 'w-full border-t border-b-0',
                    panelSize,
                    className,
                  )}
                >
                  {/* Header */}
                  {(title) && (
                    <div className="flex items-center justify-between border-b border-muted px-5 py-4">
                      <Dialog.Title className="font-lexend text-base font-semibold text-gray-900 dark:text-gray-700">
                        {title}
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-200"
                        aria-label="Close drawer"
                      >
                        <RxCross2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Scrollable body */}
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
