import React from 'react';
import type { RiskLevel } from '../types/safero';

interface MiniMapProps {
  level: RiskLevel;
}

const strokeTone: Record<RiskLevel, string> = {
  낮음: 'var(--safe-vivid)',
  보통: 'var(--caution-vivid)',
  높음: 'var(--danger-vivid)'
};

/** Small static map thumbnail used beside a passed risk segment. */
export function MiniMap({ level }: MiniMapProps) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-line bg-map-base shadow-card-inset">
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <g stroke="var(--map-road)" strokeWidth="4" fill="none">
          <path d="M-2 18 H50" />
          <path d="M30 -2 V50" />
        </g>
        <path
          d="M6 42 L18 30 L18 18 L42 12"
          fill="none"
          stroke={strokeTone[level]}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round" />
        
      </svg>
    </div>);

}