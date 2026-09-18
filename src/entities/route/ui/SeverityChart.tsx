import { motion } from "framer-motion"
import type { RiskSegment } from "../model/types"
import { riskLevel } from "@shared/lib/risk"

interface SeverityChartProps {
    segments: RiskSegment[]
    onSelect?: (road_name: string) => void
    activeRoadName?: string
}

const barTone: Record<string, { fill: string; glow: string }> = {
    낮음: {
        fill: "bg-safe-vivid",
        glow: "0 3px 8px -6px rgba(34,197,94,0.4)",
    },
    보통: {
        fill: "bg-caution-vivid",
        glow: "0 3px 8px -6px rgba(255,176,32,0.42)",
    },
    높음: {
        fill: "bg-danger-vivid",
        glow: "0 3px 8px -6px rgba(240,68,82,0.42)",
    },
}

export function SeverityChart({ segments, onSelect, activeRoadName }: SeverityChartProps) {
    const max = Math.max(...segments.map((segment) => segment.severity_score), 1)

    return (
        <ul className="flex flex-col">
            {segments.map((segment, index) => {
                const level = riskLevel(segment.severity_score)
                const tone = barTone[level]
                const width = Math.max(8, Math.round((segment.severity_score / max) * 100))
                const active = activeRoadName === segment.road_name
                return (
                    <li key={segment.road_name} className={index > 0 ? "border-t border-line" : ""}>
                        <button
                            type="button"
                            onClick={onSelect ? () => onSelect(segment.road_name) : undefined}
                            className={[
                                "w-full py-3.5 text-left",
                                "transition-opacity duration-150 ease-out",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy",
                                onSelect ? "" : "cursor-default",
                            ].join(" ")}
                        >
                            <div className="flex items-baseline justify-between gap-3">
                                <span
                                    className={[
                                        "truncate text-[15px] tracking-[-0.01em]",
                                        active ? "font-bold text-ink" : "font-medium text-ink",
                                    ].join(" ")}
                                >
                                    {segment.road_name}
                                </span>
                                <span className="shrink-0 text-[13px] font-medium text-ink-2">
                                    사고 {segment.accident_count}건
                                </span>
                            </div>
                            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-2 shadow-[inset_0_1px_2px_rgba(23,43,77,0.05)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${width}%` }}
                                    transition={{
                                        duration: 0.28,
                                        delay: index * 0.04,
                                        ease: [0.23, 1, 0.32, 1],
                                    }}
                                    style={{ boxShadow: tone.glow }}
                                    className={["relative h-full overflow-hidden rounded-full", tone.fill].join(" ")}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/40 to-transparent"
                                    />
                                </motion.div>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
