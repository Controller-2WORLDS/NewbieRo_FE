export type DriverType = '초보' | '고령' | '일반';

export type RiskLevel = '낮음' | '보통' | '높음';

export type CongestionLevel = '여유' | '보통' | '혼잡';

export type RouteKind = '안전경로' | '최단경로';

export interface RouteCandidate {
  id: string;
  kind: RouteKind;
  distance_m: number;
  duration_sec: number;
  risk_score: number;
  is_selected: boolean;
}

export interface RiskSegment {
  road_name: string;
  accident_count: number;
  severity_score: number;
  lat: number;
  lng: number;
}

export interface RestArea {
  rest_area_name: string;
  predicted_occupancy_rate: number;
  lat: number;
  lng: number;
}

export interface RouteQuery {
  origin: string;
  destination: string;
  requested_at: string;
  origin_lat?: number;
  origin_lng?: number;
  destination_lat: number;
  destination_lng: number;
}

export interface DriveAlert {
  road_name: string;
  severity_score: number;
  alert_type: string;
}

export interface TripReport {
  risk_segments_passed: number;
  total_risk_score: number;
  driven_at: string;
  tips: string;
}

export interface UserProfile {
  name: string;
  email: string;
  birth_date: string;
  license_issue_date: string;
  driver_type: DriverType;
}

export interface TrendPoint {
  requested_at: string;
  avg_risk_score: number;
}

export interface UserStats {
  total_trips: number;
  total_risk_segments_passed: number;
  avg_risk_score: number;
  trend: TrendPoint[];
}