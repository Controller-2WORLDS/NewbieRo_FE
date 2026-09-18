export type RiskLevel = "낮음" | "보통" | "높음"

export function riskLevel(score: number): RiskLevel {
    if (score < 34) return "낮음"
    if (score < 67) return "보통"
    return "높음"
}
