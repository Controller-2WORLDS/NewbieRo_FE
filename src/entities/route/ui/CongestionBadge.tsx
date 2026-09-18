import type { CongestionLevel } from "../../types/newbiero"
import { congestionLevel } from "../../utils/newbiero"

interface CongestionBadgeProps {
    rate?: number
    level?: CongestionLevel
    size?: "sm" | "md"
}

const levelClasses: Record<CongestionLevel, string> = {
    여유: "bg-grad-safe text-safe",
    보통: "bg-grad-caution text-caution",
    혼잡: "bg-grad-danger text-danger",
}

const dotClasses: Record<CongestionLevel, string> = {
    여유: "bg-safe-vivid",
    보통: "bg-caution-vivid",
    혼잡: "bg-danger-vivid",
}

export function CongestionBadge({ rate, level, size = "sm" }: CongestionBadgeProps) {
    const resolved: CongestionLevel = level ?? congestionLevel(rate ?? 0)
    return (
        <span
            className={[
                "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold shadow-inset",
                size === "sm" ? "h-6.5 pl-2 pr-2.5 text-[12px]" : "h-8 pl-2.5 pr-3.5 text-[14px]",
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
