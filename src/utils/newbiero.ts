import type { CongestionLevel, DriverType, RiskLevel } from "../types/newbiero"

const DRIVER_TYPE_STORAGE_KEY = "newbiero:driver-type"

export function readStoredDriverType(): DriverType | null {
    try {
        const stored = window.localStorage.getItem(DRIVER_TYPE_STORAGE_KEY)
        return stored === "초보" || stored === "고령" || stored === "일반" ? stored : null
    } catch {
        return null
    }
}

export function storeDriverType(driverType: DriverType): void {
    try {
        window.localStorage.setItem(DRIVER_TYPE_STORAGE_KEY, driverType)
    } catch {
        // localStorage unavailable
    }
}

export function riskLevel(score: number): RiskLevel {
    if (score < 34) return "낮음"
    if (score < 67) return "보통"
    return "높음"
}

export function congestionLevel(rate: number): CongestionLevel {
    if (rate < 0.4) return "여유"
    if (rate < 0.75) return "보통"
    return "혼잡"
}

export function formatDistance(distance_m: number): string {
    if (distance_m < 1000) return `${distance_m} m`
    return `${(distance_m / 1000).toFixed(1)} km`
}

export function formatDuration(duration_sec: number): string {
    const totalMinutes = Math.round(duration_sec / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours === 0) return `${minutes}분`
    if (minutes === 0) return `${hours}시간`
    return `${hours}시간 ${minutes}분`
}

export function formatDateTime(iso: string): string {
    const date = new Date(iso)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = `${date.getHours()}`.padStart(2, "0")
    const minutes = `${date.getMinutes()}`.padStart(2, "0")
    return `${month}월 ${day}일 ${hours}:${minutes}`
}

export function formatShortDate(iso: string): string {
    const date = new Date(iso)
    return `${date.getMonth() + 1}/${date.getDate()}`
}

export function formatOccupancy(rate: number): CongestionLevel {
    return congestionLevel(rate)
}
