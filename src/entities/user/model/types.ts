export type DriverType = "초보" | "고령" | "일반"

export interface UserProfile {
    name: string
    email: string
    birth_date: string
    license_issue_date: string
    driver_type: DriverType
}

export interface TrendPoint {
    requested_at: string
    avg_risk_score: number
}

export interface UserStats {
    total_trips: number
    total_risk_segments_passed: number
    avg_risk_score: number
    trend: TrendPoint[]
}
