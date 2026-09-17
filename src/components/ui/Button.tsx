import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'quiet';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
  'bg-grad-navy text-on-navy shadow-navy-inset active:shadow-navy-pressed-inset active:translate-y-[1px]',
  secondary:
  'bg-grad-surface text-ink border border-line-soft shadow-card-inset active:shadow-card active:translate-y-[1px]',
  quiet: 'bg-transparent text-ink-2'
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-11 px-4 text-[15px]',
  lg: 'h-[54px] px-5 text-base'
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
      className={[
      'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-btn font-semibold tracking-[-0.01em]',
      'transition-[box-shadow,background-color,color,transform] duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      'disabled:opacity-40 disabled:shadow-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className].
      join(' ')}
      {...props as React.ComponentProps<typeof motion.button>}>
      
      {variant === 'primary' ?
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/16 to-transparent" /> :

      null}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>);

}