export const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY

export interface LatLng {
    lat: number
    lng: number
}

export interface PlaceSearchResult {
    id: string
    placeName: string
    addressName: string
    lat: number
    lng: number
}

function servicesReady(): boolean {
    return Boolean(window.kakao?.maps?.services)
}

/** Keyword place search (경로찾기 출발지/목적지 검색용). Resolves to [] on zero results. */
export function searchPlacesByKeyword(keyword: string): Promise<PlaceSearchResult[]> {
    return new Promise((resolve, reject) => {
        if (!servicesReady()) {
            reject(new Error("카카오맵이 아직 준비되지 않았습니다."))
            return
        }

        const places = new kakao.maps.services.Places()
        places.keywordSearch(keyword, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(
                    result.map((item) => ({
                        id: item.id,
                        placeName: item.place_name,
                        addressName: item.road_address_name || item.address_name,
                        lat: Number(item.y),
                        lng: Number(item.x),
                    }))
                )
                return
            }
            if (status === kakao.maps.services.Status.ZERO_RESULT) {
                resolve([])
                return
            }
            reject(new Error("장소 검색에 실패했습니다."))
        })
    })
}

export interface ReverseGeocodeResult {
    /** 표시용 라벨 — 건물/단지명이 있으면 그걸 우선하고, 없으면 주소. */
    label: string
    address: string
    buildingName: string | null
}

/** Reverse geocode a coordinate into a readable address (e.g. for "현재 위치").
 * 도로명주소에 건물명(예: "롯데월드타워")이 있으면 주소보다 그 이름을 우선한다. */
export function reverseGeocode(position: LatLng): Promise<ReverseGeocodeResult | null> {
    return new Promise((resolve, reject) => {
        if (!servicesReady()) {
            reject(new Error("카카오맵이 아직 준비되지 않았습니다."))
            return
        }

        const geocoder = new kakao.maps.services.Geocoder()
        geocoder.coord2Address(position.lng, position.lat, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result[0]) {
                const address = result[0].road_address?.address_name ?? result[0].address?.address_name ?? ""
                const buildingName = result[0].road_address?.building_name || null
                if (!address && !buildingName) {
                    resolve(null)
                    return
                }
                resolve({ label: buildingName || address, address, buildingName })
                return
            }
            resolve(null)
        })
    })
}

/** Wraps the browser Geolocation API in a promise. Rejects if unsupported or denied. */
export function getCurrentPosition(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."))
            return
        }
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
        )
    })
}
