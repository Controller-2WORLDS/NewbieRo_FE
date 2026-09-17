import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  icon,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? `input-${label}`;
  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-[13px] font-medium text-ink-2">
        
        {label}
      </label>
      <div
        className={[
        'flex h-[52px] items-center gap-2.5 rounded-btn border bg-grad-surface px-3.5',
        'shadow-[inset_0_1px_2px_rgba(23,43,77,0.03)]',
        'transition-[border-color,box-shadow] duration-200 ease-out',
        error ?
        'border-danger' :
        'border-line focus-within:border-navy focus-within:shadow-[0_0_0_3px_var(--navy-tint)]'].
        join(' ')}>
        
        {icon ?
        <span className="shrink-0 text-ink-3" aria-hidden="true">
            {icon}
          </span> :
        null}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={[
          'h-full w-full border-0 bg-transparent text-[15px] font-medium text-ink outline-none',
          'placeholder:font-normal placeholder:text-ink-3',
          className].
          join(' ')}
          {...props} />
        
      </div>
      {error ?
      <p className="mt-1.5 text-[12px] text-danger">{error}</p> :
      hint ?
      <p className="mt-1.5 text-[12px] text-ink-3">{hint}</p> :
      null}
    </div>);

}