import { motion } from "framer-motion"
import type { RouteCandidate } from "../model/types"
import { formatDistance, formatDuration } from "../lib/format"
import { RiskBadge } from "./RiskBadge"

interface RouteCardProps {
    route: RouteCandidate
    onSelect: (id: string) => void
}

export function RouteCard({ route, onSelect }: RouteCardProps) {
    const selected = route.is_selected
    return (
        <motion.button
            type="button"
            onClick={() => onSelect(route.id)}
            aria-pressed={selected}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
            className={[
                "relative w-full overflow-hidden rounded-card border p-4.5 text-left",
                "transition-[box-shadow,border-color] duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy",
                selected
                    ? "border-navy-soft bg-grad-surface shadow-float-inset"
                    : "border-line-soft bg-grad-surface shadow-card-inset",
            ].join(" ")}
        >
            {selected ? (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grad-navy-soft" />
            ) : null}

            <div className="relative flex items-center justify-between gap-3">
                <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">{route.kind}</span>
                <RiskBadge score={route.risk_score} />
            </div>
            <div className="relative mt-3 flex items-baseline gap-2.5">
                <span className="text-[25px] font-bold tracking-[-0.03em] text-ink">
                    {formatDuration(route.duration_sec)}
                </span>
                <span className="text-[15px] font-medium text-ink-2">{formatDistance(route.distance_m)}</span>
            </div>
        </motion.button>
    )
}
