import React from 'react';

const entries = [
{ level: '낮음', dot: 'bg-safe-vivid' },
{ level: '보통', dot: 'bg-caution-vivid' },
{ level: '높음', dot: 'bg-danger-vivid' }];


export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-line-soft bg-grad-sheen px-3.5 py-2 shadow-lifted-inset backdrop-blur-xl">
      {entries.map((entry) =>
      <span key={entry.level} className="flex items-center gap-1.5">
          <span
          className={['h-2 w-2 rounded-full', entry.dot].join(' ')}
          aria-hidden="true" />
        
          <span className="text-[12px] font-semibold text-ink-2">
            {entry.level}
          </span>
        </span>
      )}
    </div>);

}