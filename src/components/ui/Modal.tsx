'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { RxCross2 } from 'react-icons/rx';
import { cn } from '@/lib/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  /** Hide the default close (×) button */
  hideCloseButton?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw]',
};

/**
 * Modal
 *
 * Uses Headless UI's Dialog + Transition for accessible, animated modals.
 * Styled to match Isomorphic: white card, rounded-xl, backdrop blur, slide-up enter.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Edit User">
 *     <p>Modal content here</p>
 *   </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideCloseButton = false,
  className,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>

        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel
              className={cn(
                'w-full rounded-xl border border-muted bg-background shadow-roundedCard',
                SIZE_CLASSES[size],
                className,
              )}
            >
              {/* Header */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between border-b border-muted px-5 py-4">
                  {title && (
                    <Dialog.Title className="font-lexend text-base font-semibold text-gray-900 dark:text-gray-700">
                      {title}
                    </Dialog.Title>
                  )}
                  {!hideCloseButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-200"
                      aria-label="Close modal"
                    >
                      <RxCross2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-5">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
