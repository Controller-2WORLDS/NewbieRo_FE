import type {
    DriveAlert,
    RestArea,
    RiskSegment,
    RouteCandidate,
    RouteQuery,
    TripReport,
    UserProfile,
    UserStats,
} from "../types/newbiero"

export const profile: UserProfile = {
    name: "김서연",
    email: "seoyeon.kim@safero.app",
    birth_date: "1994-03-08",
    license_issue_date: "2019-11-22",
    driver_type: "일반",
}

export const recentQueries: RouteQuery[] = [
    {
        origin: "현재 위치",
        destination: "강릉 경포해변",
        requested_at: "2026-09-14T09:12:00",
        destination_lat: 37.8054,
        destination_lng: 128.9086,
    },
    {
        origin: "서울 마포구 상암동",
        destination: "수원 광교호수공원",
        requested_at: "2026-09-11T18:40:00",
        origin_lat: 37.5794,
        origin_lng: 126.8896,
        destination_lat: 37.2911,
        destination_lng: 127.0472,
    },
    {
        origin: "현재 위치",
        destination: "인천국제공항 제2터미널",
        requested_at: "2026-09-06T05:25:00",
        destination_lat: 37.4602,
        destination_lng: 126.4407,
    },
]

export const routeCandidates: RouteCandidate[] = [
    {
        id: "safe",
        kind: "안전경로",
        distance_m: 12400,
        duration_sec: 1080,
        risk_score: 24,
        is_selected: true,
    },
    {
        id: "fast",
        kind: "최단경로",
        distance_m: 10900,
        duration_sec: 900,
        risk_score: 71,
        is_selected: false,
    },
]

export const riskSegments: RiskSegment[] = [
    { road_name: "남부순환로 교차로", accident_count: 18, severity_score: 84, lat: 37.4844, lng: 127.0164 },
    { road_name: "반포대교 남단", accident_count: 11, severity_score: 61, lat: 37.5057, lng: 127.0019 },
    { road_name: "과천대로 터널 출구", accident_count: 7, severity_score: 43, lat: 37.4501, lng: 127.0089 },
    { road_name: "양재천로 합류부", accident_count: 4, severity_score: 26, lat: 37.4779, lng: 127.0429 },
]

export const restAreas: RestArea[] = [
    { rest_area_name: "덕평 졸음쉼터", predicted_occupancy_rate: 0.32, lat: 37.2965, lng: 127.557 },
    { rest_area_name: "양촌 졸음쉼터", predicted_occupancy_rate: 0.58, lat: 37.622, lng: 126.6035 },
    { rest_area_name: "기흥 졸음쉼터", predicted_occupancy_rate: 0.86, lat: 37.274, lng: 127.116 },
]

export const driveAlert: DriveAlert = {
    road_name: "남부순환로 교차로",
    severity_score: 84,
    alert_type: "사고다발구간",
}

export const approachingRestArea: RestArea = restAreas[1]

export const tripReport: TripReport = {
    risk_segments_passed: 3,
    total_risk_score: 52,
    driven_at: "2026-09-15T08:05:00",
    tips: "사고이력이 많은 교차로에 진입하기 전 감속 구간을 조금 더 길게 확보해 보세요.",
}

export const userStats: UserStats = {
    total_trips: 128,
    total_risk_segments_passed: 412,
    avg_risk_score: 38,
    trend: [
        { requested_at: "2026-07-27T00:00:00", avg_risk_score: 66 },
        { requested_at: "2026-08-03T00:00:00", avg_risk_score: 60 },
        { requested_at: "2026-08-10T00:00:00", avg_risk_score: 58 },
        { requested_at: "2026-08-17T00:00:00", avg_risk_score: 53 },
        { requested_at: "2026-08-24T00:00:00", avg_risk_score: 49 },
        { requested_at: "2026-08-31T00:00:00", avg_risk_score: 45 },
        { requested_at: "2026-09-07T00:00:00", avg_risk_score: 41 },
        { requested_at: "2026-09-14T00:00:00", avg_risk_score: 38 },
    ],
}

export const routeHistory: RouteQuery[] = [
    {
        origin: "현재 위치",
        destination: "강릉 경포해변",
        requested_at: "2026-09-14T09:12:00",
        destination_lat: 37.8054,
        destination_lng: 128.9086,
    },
    {
        origin: "서울 마포구 상암동",
        destination: "수원 광교호수공원",
        requested_at: "2026-09-11T18:40:00",
        origin_lat: 37.5794,
        origin_lng: 126.8896,
        destination_lat: 37.2911,
        destination_lng: 127.0472,
    },
    {
        origin: "현재 위치",
        destination: "인천국제공항 제2터미널",
        requested_at: "2026-09-06T05:25:00",
        destination_lat: 37.4602,
        destination_lng: 126.4407,
    },
    {
        origin: "성남 분당구 정자동",
        destination: "평창 대관령면",
        requested_at: "2026-08-30T06:10:00",
        origin_lat: 37.3665,
        origin_lng: 127.1086,
        destination_lat: 37.6874,
        destination_lng: 128.7182,
    },
]
