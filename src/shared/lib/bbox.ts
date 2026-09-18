export interface LatLngLike {
    lat: number
    lng: number
}

/** BE bbox 형식("minLng,minLat,maxLng,maxLat")으로, 좌표들을 감싸는 사각형에 여유 반경을 더해 만든다. */
export function buildBboxAround(points: LatLngLike[], marginDeg = 0.05): string | undefined {
    if (points.length === 0) return undefined

    const minLat = Math.min(...points.map((p) => p.lat)) - marginDeg
    const maxLat = Math.max(...points.map((p) => p.lat)) + marginDeg
    const minLng = Math.min(...points.map((p) => p.lng)) - marginDeg
    const maxLng = Math.max(...points.map((p) => p.lng)) + marginDeg

    return `${minLng},${minLat},${maxLng},${maxLat}`
}
