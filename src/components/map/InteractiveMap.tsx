import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { MapPlaceholder } from './MapPlaceholder';

interface InteractiveMapProps {
  children?: React.ReactNode;
  className?: string;
  heatmap?: boolean;
  showRoute?: boolean;
  label?: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;

interface Transform {
  scale: number;
  x: number;
  y: number;
}

export function InteractiveMap({
  children,
  className = '',
  heatmap = false,
  showRoute = false,
  label = '지도'
}: InteractiveMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pointers = React.useRef(new Map<number, {x: number;y: number;}>());
  const pinchDistance = React.useRef<number | null>(null);
  const [transform, setTransform] = React.useState<Transform>({
    scale: 1,
    x: 0,
    y: 0
  });

  const clamp = React.useCallback((next: Transform): Transform => {
    const rect = containerRef.current?.getBoundingClientRect();
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.scale));
    const maxX = rect ? (scale - 1) * rect.width / 2 : 0;
    const maxY = rect ? (scale - 1) * rect.height / 2 : 0;
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y))
    };
  }, []);

  const zoomBy = (delta: number) => {
    setTransform((current) =>
    clamp({ ...current, scale: current.scale + delta })
    );
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinchDistance.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, next);

    if (pointers.current.size >= 2) {
      const [a, b] = Array.from(pointers.current.values());
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const start = pinchDistance.current;
      pinchDistance.current = distance;
      if (!start) return;
      const factor = distance / start;
      setTransform((current) =>
      clamp({ ...current, scale: current.scale * factor })
      );
      return;
    }

    setTransform((current) => {
      if (current.scale <= MIN_SCALE) return current;
      return clamp({
        ...current,
        x: current.x + (next.x - previous.x),
        y: current.y + (next.y - previous.y)
      });
    });
  };

  const releasePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchDistance.current = null;
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 2) return;
    setTransform((current) =>
    clamp({ ...current, scale: current.scale - event.deltaY * 0.0018 })
    );
  };

  return (
    <div
      ref={containerRef}
      className={['relative overflow-hidden bg-map-base', className].join(' ')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerLeave={releasePointer}
      onWheel={onWheel}
      style={{ touchAction: 'none' }}>
      
      <div
        className="absolute inset-0 origin-center will-change-transform"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`
        }}>
        
        <MapPlaceholder
          className="absolute inset-0 h-full w-full"
          heatmap={heatmap}
          showRoute={showRoute}
          label={label}>
          
          {children}
        </MapPlaceholder>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col overflow-hidden rounded-btn border border-line-soft bg-grad-sheen shadow-lifted backdrop-blur-xl">
        <button
          type="button"
          onClick={() => zoomBy(0.4)}
          aria-label="지도 확대"
          className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          
          <PlusIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <span className="h-px bg-line" aria-hidden="true" />
        <button
          type="button"
          onClick={() => zoomBy(-0.4)}
          aria-label="지도 축소"
          className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          
          <MinusIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
      </div>
    </div>);

}