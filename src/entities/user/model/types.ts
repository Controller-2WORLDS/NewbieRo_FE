export type DriverType = "초보" | "고령" | "일반"

/** GET /users/me 응답 그대로 — 서버는 email/생년월일을 내려주지 않는다. */
export interface UserProfile {
    user_id: string
    name: string
    license_issue_date: string
    driver_type: DriverType
}

export interface TrendPoint {
    week_start: string
    avg_risk_score: number
}

export interface UserStats {
    total_trips: number
    total_risk_segments_passed: number
    avg_risk_score: number
    trend: TrendPoint[]
}
