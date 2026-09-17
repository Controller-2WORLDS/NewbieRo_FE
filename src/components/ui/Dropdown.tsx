import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

interface DropdownProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  align?: 'left' | 'right';
}

export function Dropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  align = 'left'
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-grad-surface px-3.5 text-[13px] font-semibold text-ink shadow-card-inset transition-[box-shadow,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
        
        {value}
        <ChevronDownIcon
          className={[
          'h-4 w-4 text-ink-3 transition-transform duration-150 ease-out',
          open ? 'rotate-180' : ''].
          join(' ')}
          strokeWidth={2} />
        
      </button>

      <AnimatePresence>
        {open ?
        <motion.ul
          role="listbox"
          aria-label={label}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className={[
          'absolute top-[42px] z-30 min-w-[132px] overflow-hidden rounded-[16px] border border-line bg-grad-surface p-1 shadow-float-inset backdrop-blur-xl',
          align === 'right' ? 'right-0' : 'left-0'].
          join(' ')}>
          
            {options.map((option) =>
          <li key={option}>
                <button
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={[
              'flex h-10 w-full items-center justify-between gap-2 rounded-[10px] px-3 text-left text-[14px]',
              'transition-colors duration-150 ease-out',
              option === value ?
              'bg-navy-tint font-semibold text-navy' :
              'font-medium text-ink'].
              join(' ')}>
              
                  {option}
                  {option === value ?
              <CheckIcon className="h-4 w-4" strokeWidth={2.2} /> :
              null}
                </button>
              </li>
          )}
          </motion.ul> :
        null}
      </AnimatePresence>
    </div>);

}