import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const MAP_LIGHT = "/08516cf1-f7c9-476e-ac11-243bbf08554f.jpg";

const MAP_DARK = "/5083dd3f-c339-4625-87a2-efff047614b3.jpg";

const MAP_NAV = "/ea460eec-3ddc-4f71-ae26-cfccb7519a77.jpg";


interface MapPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
  /** Renders the risk heatmap layer. */
  heatmap?: boolean;
  /** Highlights the active route line. */
  showRoute?: boolean;
  /** 'top' = overhead map, 'nav' = tilted driving view. */
  variant?: 'top' | 'nav';
  /** Continuous forward motion for the driving view. */
  moving?: boolean;
  label?: string;
}

const heatSpots = [
{ cx: 118, cy: 176, r: 60, tone: 'var(--danger-vivid)', opacity: 0.32 },
{ cx: 246, cy: 268, r: 72, tone: 'var(--caution-vivid)', opacity: 0.28 },
{ cx: 176, cy: 408, r: 56, tone: 'var(--caution-vivid)', opacity: 0.22 },
{ cx: 300, cy: 468, r: 48, tone: 'var(--safe-vivid)', opacity: 0.2 }];


const TOP_ROUTE =
'M64 556 L64 430 L172 430 L172 268 L262 268 L262 120 L330 120 L330 44';
const NAV_ROUTE = 'M196 600 L196 470 L186 330 L176 232 L186 150';

export function MapPlaceholder({
  children,
  className = '',
  heatmap = false,
  showRoute = false,
  variant = 'top',
  moving = false,
  label = '지도'
}: MapPlaceholderProps) {
  const { mode } = useTheme();
  const [imageFailed, setImageFailed] = React.useState(false);
  const src = variant === 'nav' ? MAP_NAV : mode === 'dark' ? MAP_DARK : MAP_LIGHT;
  const routePath = variant === 'nav' ? NAV_ROUTE : TOP_ROUTE;

  return (
    <div
      role="img"
      aria-label={label}
      className={['relative overflow-hidden bg-map-base', className].join(' ')}>
      
      {moving ?
      <motion.img
        src={src}
        alt=""
        onError={() => setImageFailed(true)}
        animate={{ y: ['0%', '-14%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 top-0 h-[125%] w-full object-cover" /> :


      <img
        src={src}
        alt=""
        onError={() => setImageFailed(true)}
        className="absolute inset-0 h-full w-full object-cover" />

      }

      {mode === 'dark' && variant === 'nav' ?
      <div className="absolute inset-0 bg-[#0f1216]/72" aria-hidden="true" /> :
      null}

      <svg
        viewBox="0 0 390 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true">
        
        {imageFailed ?
        <g stroke="var(--map-road)" strokeLinecap="round" fill="none">
            <path d="M-20 120 H410" strokeWidth="14" />
            <path d="M-20 330 H410" strokeWidth="10" />
            <path d="M-20 505 H410" strokeWidth="12" />
            <path d="M92 -20 V620" strokeWidth="12" />
            <path d="M262 -20 V620" strokeWidth="9" />
            <path d="M-20 -10 L200 210 L200 620" strokeWidth="7" />
            <path d="M410 60 L250 220 L120 220" strokeWidth="6" />
            <g strokeWidth="3" opacity="0.6">
              <path d="M-20 215 H410" />
              <path d="M-20 420 H410" />
              <path d="M172 -20 V620" />
              <path d="M330 -20 V620" />
            </g>
          </g> :
        null}

        {heatmap ?
        heatSpots.map((spot, index) =>
        <circle
          key={index}
          cx={spot.cx}
          cy={spot.cy}
          r={spot.r}
          fill={spot.tone}
          opacity={spot.opacity}
          style={{ filter: 'blur(14px)' }} />

        ) :
        null}

        {showRoute ?
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
            d={routePath}
            stroke="var(--navy)"
            strokeOpacity="0.2"
            strokeWidth={variant === 'nav' ? 24 : 14} />
          
            <path
            d={routePath}
            stroke="var(--navy)"
            strokeWidth={variant === 'nav' ? 12 : 5} />
          
          </g> :
        null}
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-grad-scrim-top" />
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-grad-scrim-bottom" />
      

      {children}
    </div>);

}