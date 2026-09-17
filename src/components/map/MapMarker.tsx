import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, MapPinIcon, MoonIcon } from 'lucide-react';

type MarkerKind = 'risk' | 'rest' | 'place';

interface MapMarkerProps {
  kind: MarkerKind;
  /** Positioning inside the map area, in percentages. */
  x: number;
  y: number;
  active?: boolean;
  delay?: number;
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const kindTone: Record<MarkerKind, {classes: string;glow: string;}> = {
  risk: {
    classes: 'bg-danger-vivid text-white',
    glow: '0 6px 14px -8px rgba(240,68,82,0.42)'
  },
  place: {
    classes: 'bg-grad-navy text-on-navy',
    glow: '0 6px 14px -8px rgba(47,111,235,0.42)'
  },
  rest: {
    classes: 'bg-grad-surface text-navy border border-line-soft',
    glow: '0 6px 14px -10px rgba(23,43,77,0.32)'
  }
};

export function MapMarker({
  kind,
  x,
  y,
  active = false,
  delay = 0,
  label,
  onClick,
  children
}: MapMarkerProps) {
  const Icon =
  kind === 'risk' ?
  AlertTriangleIcon :
  kind === 'place' ?
  MapPinIcon :
  MoonIcon;
  const tone = kindTone[kind];

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, delay, ease: [0.23, 1, 0.32, 1] }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}>
      
      <div className="relative flex flex-col items-center">
        {children}
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={onClick ? active : undefined}
          style={{ boxShadow: tone.glow }}
          className={[
          'relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full',
          'transition-transform duration-150 ease-out active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
          tone.classes,
          active ? 'ring-2 ring-navy ring-offset-2 ring-offset-surface' : ''].
          join(' ')}>
          
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/30 to-transparent" />
          
          <Icon className="relative h-4.5 w-4.5" strokeWidth={2.1} />
        </button>
      </div>
    </motion.div>);

}