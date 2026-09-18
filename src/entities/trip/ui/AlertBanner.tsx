import { motion } from "framer-motion"
import { AlertTriangleIcon } from "lucide-react"
import type { RiskLevel } from "../../types/newbiero"
import { riskLevel } from "../../utils/newbiero"

interface AlertBannerProps {
    road_name: string
    severity_score: number
    alert_type: string
}

const levelTone: Record<RiskLevel, { bar: string; text: string; wash: string; glow: string }> = {
    낮음: {
        bar: "bg-safe-vivid",
        text: "text-safe",
        wash: "bg-grad-safe",
        glow: "0 8px 20px -16px rgba(34,197,94,0.35)",
    },
    보통: {
        bar: "bg-caution-vivid",
        text: "text-caution",
        wash: "bg-grad-caution",
        glow: "0 8px 20px -16px rgba(255,176,32,0.38)",
    },
    높음: {
        bar: "bg-danger-vivid",
        text: "text-danger",
        wash: "bg-grad-danger",
        glow: "0 8px 20px -16px rgba(240,68,82,0.4)",
    },
}

export function AlertBanner({ road_name, severity_score, alert_type }: AlertBannerProps) {
    const level = riskLevel(severity_score)
    const tone = levelTone[level]
    const filled = level === "높음" ? 3 : level === "보통" ? 2 : 1

    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
            role="status"
            style={{ boxShadow: `var(--elevation-lifted), ${tone.glow}` }}
            className="relative flex items-center gap-2.5 overflow-hidden rounded-btn border border-line-soft bg-surface/90 py-2.5 pl-2.5 pr-3.5 backdrop-blur-xl"
        >
            <span aria-hidden="true" className={["pointer-events-none absolute inset-0", tone.wash].join(" ")} />

            <span
                className={[
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface shadow-card",
                ].join(" ")}
            >
                <AlertTriangleIcon className={["h-4.5 w-4.5", tone.text].join(" ")} strokeWidth={2.2} />
            </span>

            <span className="relative min-w-0 flex-1">
                <span className={["block text-[11px] font-bold", tone.text].join(" ")}>{alert_type}</span>
                <span className="mt-0.5 block truncate text-[17px] font-bold leading-tight tracking-[-0.02em] text-ink">
                    {road_name}
                </span>
            </span>

            <span className="relative flex shrink-0 items-end gap-0.75" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                    <span
                        key={index}
                        className={[
                            "w-1 rounded-full",
                            index === 0 ? "h-2.5" : index === 1 ? "h-4" : "h-5.5",
                            index < filled ? tone.bar : "bg-surface-2",
                        ].join(" ")}
                    />
                ))}
            </span>
        </motion.div>
    )
}
