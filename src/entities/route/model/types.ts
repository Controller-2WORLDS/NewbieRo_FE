export type CongestionLevel = "여유" | "보통" | "혼잡"

export type RouteKind = "안전경로" | "최단경로"

export interface RouteCandidate {
    id: string
    kind: RouteKind
    distance_m: number
    duration_sec: number
    risk_score: number
    is_selected: boolean
}

export interface RiskSegment {
    segment_id: string
    road_name: string
    accident_count: number
    severity_score: number
    lat: number
    lng: number
}

export interface RestArea {
    rest_area_id: string
    rest_area_name: string
    /** 혼잡도는 별도 congestion API로 조회해야 알 수 있어, 불러오기 전까지는 없다. */
    predicted_occupancy_rate?: number
    lat: number
    lng: number
}

export interface RouteQuery {
    origin: string
    destination: string
    requested_at: string
    origin_lat?: number
    origin_lng?: number
    destination_lat: number
    destination_lng: number
}
