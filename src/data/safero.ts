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
    },
    {
        origin: "서울 마포구 상암동",
        destination: "수원 광교호수공원",
        requested_at: "2026-09-11T18:40:00",
    },
    {
        origin: "현재 위치",
        destination: "인천국제공항 제2터미널",
        requested_at: "2026-09-06T05:25:00",
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
    { road_name: "남부순환로 교차로", accident_count: 18, severity_score: 84 },
    { road_name: "반포대교 남단", accident_count: 11, severity_score: 61 },
    { road_name: "과천대로 터널 출구", accident_count: 7, severity_score: 43 },
    { road_name: "양재천로 합류부", accident_count: 4, severity_score: 26 },
]

export const restAreas: RestArea[] = [
    { rest_area_name: "덕평 졸음쉼터", predicted_occupancy_rate: 0.32 },
    { rest_area_name: "양촌 졸음쉼터", predicted_occupancy_rate: 0.58 },
    { rest_area_name: "기흥 졸음쉼터", predicted_occupancy_rate: 0.86 },
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
        { requested_at: "2026-04-01T00:00:00", avg_risk_score: 61 },
        { requested_at: "2026-05-01T00:00:00", avg_risk_score: 54 },
        { requested_at: "2026-06-01T00:00:00", avg_risk_score: 58 },
        { requested_at: "2026-07-01T00:00:00", avg_risk_score: 45 },
        { requested_at: "2026-08-01T00:00:00", avg_risk_score: 41 },
        { requested_at: "2026-09-01T00:00:00", avg_risk_score: 38 },
    ],
}

export const routeHistory: RouteQuery[] = [
    {
        origin: "현재 위치",
        destination: "강릉 경포해변",
        requested_at: "2026-09-14T09:12:00",
    },
    {
        origin: "서울 마포구 상암동",
        destination: "수원 광교호수공원",
        requested_at: "2026-09-11T18:40:00",
    },
    {
        origin: "현재 위치",
        destination: "인천국제공항 제2터미널",
        requested_at: "2026-09-06T05:25:00",
    },
    {
        origin: "성남 분당구 정자동",
        destination: "평창 대관령면",
        requested_at: "2026-08-30T06:10:00",
    },
]
