import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md'
}: SegmentedControlProps<T>) {
  const layoutId = React.useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={[
      'flex w-full gap-1 rounded-btn border border-line bg-surface-2 p-1',
      'shadow-[inset_0_1px_3px_rgba(23,43,77,0.04)]',
      size === 'sm' ? 'h-9' : 'h-12'].
      join(' ')}>
      
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={[
            'relative flex-1 rounded-[10px] font-semibold',
            'transition-colors duration-200 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
            size === 'sm' ? 'text-[13px]' : 'text-[15px]',
            selected ? 'text-navy' : 'text-ink-3'].
            join(' ')}>
            
            {selected ?
            <motion.span
              layoutId={layoutId}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 rounded-[10px] border border-line bg-grad-surface shadow-card-inset" /> :

            null}
            <span className="relative z-10">{option}</span>
          </button>);

      })}
    </div>);

}