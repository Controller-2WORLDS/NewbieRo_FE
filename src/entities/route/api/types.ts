import type { ApiDriverType } from "@entities/user"

export interface ApiCoordinate {
    lat: number
    lng: number
    address?: string
}

export interface CreateRouteRequest {
    origin: ApiCoordinate
    destination: ApiCoordinate
    profile_used: ApiDriverType
}

export interface RouteOptionResponse {
    option_id: string
    distance_m: number
    duration_sec: number
    risk_score: number
    path_geometry: string
    is_selected: boolean
}

export interface CreateRouteResponse {
    route_id: string
    options: RouteOptionResponse[]
}

export interface RouteDetailResponse {
    route_id: string
    origin: ApiCoordinate
    destination: ApiCoordinate
    options: RouteOptionResponse[]
}

export interface SelectRouteOptionResponse {
    route_id: string
    selected_option_id: string
    started_at: string
}

export interface RouteHistoryEntry {
    route_id: string
    origin: ApiCoordinate
    destination: ApiCoordinate
    requested_at: string
}

export interface RouteHistoryResponse {
    routes: RouteHistoryEntry[]
}

export interface RouteHistoryQuery {
    page?: number
    size?: number
}

export interface ApiRestArea {
    rest_area_id: string
    facility_seq: string
    name: string | null
    highway_name: string | null
    lat: number | null
    lng: number | null
    capacity: number | null
}

export interface ListRestAreasQuery {
    route_id?: string
    bbox?: string
}

export interface ListRestAreasResponse {
    rest_areas: ApiRestArea[]
}

export interface CongestionEntry {
    time_band: string
    day_type: string
    predicted_occupancy_rate: number
}

export interface RestAreaCongestionQuery {
    time_band?: string
    day_type?: string
}

export interface RestAreaCongestionResponse {
    rest_area_id: string
    congestions: CongestionEntry[]
}

export type ApiSegmentType = "HIGHWAY" | "GENERAL_ROAD"

export interface ApiRiskSegment {
    segment_id: string
    segment_type: ApiSegmentType
    road_name: string
    admin_dong_cd: string | null
    route_mile_range: string | null
    start_lat: number | null
    start_lng: number | null
    end_lat: number | null
    end_lng: number | null
    accident_count: number
    severity_score: number
    time_band: string
    data_source: string
}

export interface ListRiskSegmentsQuery {
    bbox?: string
    time_band?: string
    segment_type?: ApiSegmentType
}

export interface ListRiskSegmentsResponse {
    segments: ApiRiskSegment[]
}
