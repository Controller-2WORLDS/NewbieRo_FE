import React from "react"
import { motion } from "framer-motion"
import type { TrendPoint } from "../../types/newbiero"
import { formatShortDate } from "../../utils/newbiero"

interface TrendChartProps {
    trend: TrendPoint[]
}

const WIDTH = 300
const HEIGHT = 108

export function TrendChart({ trend }: TrendChartProps) {
    const gradientId = React.useId()
    const values = trend.map((point) => point.avg_risk_score)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = Math.max(max - min, 1)

    const points = trend.map((point, index) => {
        const x = (index / Math.max(trend.length - 1, 1)) * WIDTH
        const y = HEIGHT - ((point.avg_risk_score - min) / span) * (HEIGHT - 16) - 8
        return { x, y, point }
    })

    const path = points.map((entry, index) => `${index === 0 ? "M" : "L"}${entry.x} ${entry.y}`).join(" ")
    const areaPath = `${path} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`

    return (
        <div>
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-[108px] w-full overflow-visible"
                role="img"
                aria-label="월별 평균 위험도 추이"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--navy)" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="var(--navy)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <g stroke="var(--line)" strokeWidth="1">
                    <line x1="0" y1="8" x2={WIDTH} y2="8" />
                    <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} />
                    <line x1="0" y1={HEIGHT - 8} x2={WIDTH} y2={HEIGHT - 8} />
                </g>

                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    d={areaPath}
                    fill={`url(#${gradientId})`}
                />

                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    d={path}
                    fill="none"
                    stroke="var(--navy)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 3px 6px rgba(47,111,235,0.18))" }}
                />

                {points.map((entry, index) => (
                    <circle
                        key={entry.point.requested_at}
                        cx={entry.x}
                        cy={entry.y}
                        r={index === points.length - 1 ? 4.5 : 3}
                        fill={index === points.length - 1 ? "var(--navy)" : "var(--surface)"}
                        stroke="var(--navy)"
                        strokeWidth="2"
                    />
                ))}
            </svg>
            <div className="mt-3 flex justify-between">
                {trend.map((point) => (
                    <span key={point.requested_at} className="text-[11px] font-semibold text-ink-3">
                        {formatShortDate(point.requested_at)}
                    </span>
                ))}
            </div>
        </div>
    )
}
