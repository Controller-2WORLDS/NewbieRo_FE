import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-line-soft bg-grad-surface px-3.5 py-4 shadow-card-inset">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-20 w-20 rounded-full bg-grad-navy-soft" />
      
      <p className="relative text-[12px] font-medium leading-tight text-ink-2">
        {label}
      </p>
      <p className="relative mt-2 flex items-baseline gap-0.5 text-[22px] font-bold tracking-[-0.02em] text-ink">
        {value}
        {unit ?
        <span className="text-[13px] font-medium text-ink-2">{unit}</span> :
        null}
      </p>
    </div>);

}