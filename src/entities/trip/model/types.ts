export interface DriveAlert {
    road_name: string
    severity_score: number
    alert_type: string
}

export interface TripReport {
    risk_segments_passed: number
    total_risk_score: number
    driven_at: string
    tips: string
}
