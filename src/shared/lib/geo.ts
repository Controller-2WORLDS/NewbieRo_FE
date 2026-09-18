import type { LatLngLike } from "./bbox"

const EARTH_RADIUS_M = 6371000

export function distanceMeters(a: LatLngLike, b: LatLngLike): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)
    const sinDLat = Math.sin(dLat / 2)
    const sinDLng = Math.sin(dLng / 2)
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

export function findNearestWithin<T extends LatLngLike>(
    origin: LatLngLike,
    points: T[],
    maxDistanceM: number
): T | null {
    let nearest: T | null = null
    let nearestDistance = Infinity

    for (const point of points) {
        const distance = distanceMeters(origin, point)
        if (distance < nearestDistance) {
            nearestDistance = distance
            nearest = point
        }
    }

    return nearest && nearestDistance <= maxDistanceM ? nearest : null
}
