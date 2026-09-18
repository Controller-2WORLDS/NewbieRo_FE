import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div className="absolute inset-0 z-50 flex items-end justify-center">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(12,17,27,0.42)] backdrop-blur-[3px]" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ y: 22, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 22, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="relative m-4 w-full overflow-hidden rounded-modal border border-line-soft bg-grad-surface p-5 shadow-modal">
          
            <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/60 dark:bg-white/10" />
          
            <h2 className="text-[19px] font-bold tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <div className="mt-3">{children}</div>
            {footer ? <div className="mt-5">{footer}</div> : null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}