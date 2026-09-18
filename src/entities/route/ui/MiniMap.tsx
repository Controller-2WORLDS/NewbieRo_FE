import type { RiskLevel } from "@shared/lib/risk"

interface MiniMapProps {
    level: RiskLevel
    count: number
}

const dotTone: Record<RiskLevel, string> = {
    낮음: "var(--safe-vivid)",
    보통: "var(--caution-vivid)",
    높음: "var(--danger-vivid)",
}

const ROUTE_PATH = "M12 78 C 46 14, 92 14, 122 50 S 198 96, 226 46 S 292 6, 308 28"

const DOT_POSITIONS = [
    { x: 12, y: 78 },
    { x: 64, y: 26 },
    { x: 122, y: 50 },
    { x: 172, y: 90 },
    { x: 226, y: 46 },
    { x: 274, y: 14 },
    { x: 308, y: 28 },
]

export function MiniMap({ level, count }: MiniMapProps) {
    const dots = DOT_POSITIONS.slice(0, Math.max(0, Math.min(count, DOT_POSITIONS.length)))
    const tone = dotTone[level]

    return (
        <div
            role="img"
            aria-label="지나온 경로 위의 위험구간 통과 지점"
            className="w-full overflow-hidden rounded-card border border-line bg-map-base shadow-card-inset"
        >
            <svg viewBox="0 0 320 96" className="h-24 w-full">
                <path d={ROUTE_PATH} fill="none" stroke="var(--map-road)" strokeWidth="6" strokeLinecap="round" />

                {dots.map((dot, index) => (
                    <circle
                        key={index}
                        cx={dot.x}
                        cy={dot.y}
                        r="6"
                        fill={tone}
                        stroke="var(--surface)"
                        strokeWidth="2"
                    />
                ))}
            </svg>
        </div>
    )
}
