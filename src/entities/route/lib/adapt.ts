import type { ApiCoordinate, ApiRestArea, ApiRiskSegment, RouteOptionResponse } from "../api/types"
import type { RestArea, RiskSegment, RouteCandidate } from "../model/types"

/**
 * 서버는 안전경로를 먼저, 최단경로를 나중에 생성하지만 relation 조회 순서는 보장하지 않는다.
 * 생성 로직상 안전경로의 risk_score는 항상 최단경로보다 낮거나 같으므로, 그 값으로 라벨을 매긴다.
 */
export function toRouteCandidates(options: RouteOptionResponse[]): RouteCandidate[] {
    const sortedIds = [...options].sort((a, b) => a.risk_score - b.risk_score).map((option) => option.option_id)

    return options.map((option) => ({
        id: option.option_id,
        kind: sortedIds.indexOf(option.option_id) === 0 ? "안전경로" : "최단경로",
        distance_m: option.distance_m,
        duration_sec: option.duration_sec,
        risk_score: option.risk_score,
        is_selected: option.is_selected,
    }))
}

export function toRiskSegment(segment: ApiRiskSegment): RiskSegment | null {
    if (segment.start_lat === null || segment.start_lng === null) return null
    return {
        segment_id: segment.segment_id,
        road_name: segment.road_name,
        accident_count: segment.accident_count,
        severity_score: segment.severity_score,
        lat: segment.start_lat,
        lng: segment.start_lng,
    }
}

export function toRestArea(restArea: ApiRestArea): RestArea | null {
    if (restArea.lat === null || restArea.lng === null) return null
    return {
        rest_area_id: restArea.rest_area_id,
        rest_area_name: restArea.name ?? restArea.highway_name ?? "졸음쉼터",
        lat: restArea.lat,
        lng: restArea.lng,
    }
}

export function coordinateLabel(coordinate: ApiCoordinate, fallback: string): string {
    return coordinate.address ?? fallback
}

export function averageOccupancyRate(congestions: { predicted_occupancy_rate: number }[]): number | undefined {
    if (congestions.length === 0) return undefined
    return congestions.reduce((sum, c) => sum + c.predicted_occupancy_rate, 0) / congestions.length
}
