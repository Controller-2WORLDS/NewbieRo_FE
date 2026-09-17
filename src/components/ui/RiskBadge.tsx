import React from "react"
import type { RiskLevel } from "../../types/newbiero"
import { riskLevel } from "../../utils/newbiero"

interface RiskBadgeProps {
    /** Raw risk_score — never rendered as a number, only mapped to a level. */
    score?: number
    level?: RiskLevel
    size?: "sm" | "md"
}

const levelClasses: Record<RiskLevel, string> = {
    낮음: "bg-grad-safe text-safe",
    보통: "bg-grad-caution text-caution",
    높음: "bg-grad-danger text-danger",
}

const dotClasses: Record<RiskLevel, string> = {
    낮음: "bg-safe-vivid",
    보통: "bg-caution-vivid",
    높음: "bg-danger-vivid",
}

export function RiskBadge({ score, level, size = "sm" }: RiskBadgeProps) {
    const resolved: RiskLevel = level ?? riskLevel(score ?? 0)
    return (
        <span
            className={[
                "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold shadow-inset",
                size === "sm" ? "h-[26px] pl-2 pr-2.5 text-[12px]" : "h-8 pl-2.5 pr-3.5 text-[14px]",
                levelClasses[resolved],
            ].join(" ")}
        >
            <span
                className={["rounded-full", size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2", dotClasses[resolved]].join(" ")}
                aria-hidden="true"
            />

            {resolved}
        </span>
    )
}
