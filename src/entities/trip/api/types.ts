export interface CreateDrivingReportRequest {
    route_id: string
    driven_at: string
}

export interface DrivingReportResponse {
    report_id: string
    driven_at: string
    risk_segments_passed: number
    total_risk_score: number
    tips: string
}

export type SummaryPeriod = "week" | "month" | "all"

export interface DrivingReportSummaryQuery {
    period?: SummaryPeriod
}

export interface TrendEntry {
    week_start: string
    avg_risk_score: number
}

export interface DrivingReportSummaryResponse {
    total_trips: number
    total_risk_segments_passed: number
    avg_risk_score: number
    trend: TrendEntry[]
}

export interface AlertEntry {
    alert_id: string
    segment_id: string | null
    alert_type: string
    triggered_at: string
}

export interface ListAlertsQuery {
    route_id?: string
}

export interface ListAlertsResponse {
    alerts: AlertEntry[]
}
