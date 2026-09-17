import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  label,
  children
}: BottomSheetProps) {
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
      <div className="fixed inset-y-0 left-1/2 z-[60] flex w-full max-w-[480px] -translate-x-1/2 flex-col justify-end">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(12,17,27,0.38)] backdrop-blur-[2px]" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(_event, info) => {
            if (info.offset.y > 100) onClose();
          }}
          className="relative flex max-h-[86%] flex-col overflow-hidden rounded-t-modal border-t border-line-soft bg-grad-surface shadow-modal">
          
            <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70 dark:bg-white/10" />
          
            <div className="flex shrink-0 justify-center pb-1 pt-2.5">
              <span
              className="h-1 w-9 rounded-full bg-line-strong"
              aria-hidden="true" />
            
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}