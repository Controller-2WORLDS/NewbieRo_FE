import React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Map, Polyline, Circle, useKakaoLoader } from "react-kakao-maps-sdk"
import { KAKAO_MAP_APP_KEY, type LatLng } from "../../lib/kakao"
import { cn } from "../../lib/cn"

interface HeatSpot {
    position: LatLng
    radius: number
    tone: string
    opacity?: number
}

interface MapPlaceholderProps {
    children?: React.ReactNode
    className?: string
    /** 위험구간 반경 원(들). 실제 위험구간 좌표 기반으로 호출부에서 계산해 전달. */
    heatSpots?: HeatSpot[]
    /** 경로 표시용 좌표 목록(직선 연결 — 실제 경로 엔진 연동 전 임시 표시). */
    routePath?: LatLng[]
    /** 주어지면 center/level 대신 이 좌표들이 모두 보이도록 자동으로 화면을 맞춘다. */
    fitBounds?: LatLng[]
    center: LatLng
    level?: number
    zoomControl?: boolean
    label?: string
    onCreate?: (map: kakao.maps.Map) => void
    /** 지도를 탭/클릭해서 직접 좌표를 고를 수 있게 할 때 사용. */
    onMapClick?: (position: LatLng) => void
}

export function MapPlaceholder({
    children,
    className = "",
    heatSpots,
    routePath,
    fitBounds,
    center,
    level = 5,
    zoomControl = false,
    label = "지도",
    onCreate,
    onMapClick,
}: MapPlaceholderProps) {
    const [loading, error] = useKakaoLoader({
        appkey: KAKAO_MAP_APP_KEY,
        libraries: ["services"],
    })
    const mapRef = React.useRef<kakao.maps.Map | null>(null)

    const zoomBy = (delta: number) => {
        const map = mapRef.current
        if (!map) return
        map.setLevel(map.getLevel() + delta, { animate: true })
    }

    if (!KAKAO_MAP_APP_KEY) {
        return (
            <div
                role="img"
                aria-label={label}
                className={cn("relative flex items-center justify-center bg-map-base p-4 text-center", className)}
            >
                <p className="text-[13px] font-medium text-ink-3">
                    지도를 표시하려면 .env에 VITE_KAKAO_MAP_APP_KEY를 설정하세요.
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div
                role="img"
                aria-label={label}
                className={cn("relative flex items-center justify-center bg-map-base p-4 text-center", className)}
            >
                <p className="text-[13px] font-medium text-ink-3">지도를 불러오지 못했습니다.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div
                role="img"
                aria-label={label}
                className={cn("relative animate-pulse overflow-hidden bg-map-base", className)}
            />
        )
    }

    return (
        <div role="img" aria-label={label} className={cn("relative overflow-hidden bg-map-base", className)}>
            <Map
                center={center}
                // fitBounds가 있으면 setBounds가 확대수준을 정하게 두고, 여기서는 level을 지정하지
                // 않는다 — react-kakao-maps-sdk는 level prop이 undefined면 자체 setLevel 동기화
                // effect를 건너뛰므로, 이 값을 넘기면 매 마운트마다 setBounds 직후 level을 이 값으로
                // 되돌려버린다.
                level={fitBounds && fitBounds.length > 1 ? undefined : level}
                className="h-full w-full"
                onCreate={(map) => {
                    mapRef.current = map
                    if (fitBounds && fitBounds.length > 1) {
                        // react-kakao-maps-sdk도 같은 커밋에서 center를 prop 값으로 동기화하는
                        // effect를 (onCreate 이후 순서로) 실행하므로, setBounds를 바로 호출하면
                        // 그 동기화 effect가 곧장 되돌려버린다. 이번 커밋의 동기화가 끝난 다음
                        // tick으로 미뤄서 setBounds가 마지막에 적용되게 한다.
                        window.setTimeout(() => {
                            const bounds = new kakao.maps.LatLngBounds()
                            fitBounds.forEach((point) => bounds.extend(new kakao.maps.LatLng(point.lat, point.lng)))
                            map.setBounds(bounds, 48, 48, 48, 48)
                        }, 0)
                    }
                    onCreate?.(map)
                }}
                onClick={
                    onMapClick
                        ? (_, mouseEvent) =>
                              onMapClick({ lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() })
                        : undefined
                }
            >
                {heatSpots?.map((spot, index) => (
                    <Circle
                        key={index}
                        center={spot.position}
                        radius={spot.radius}
                        fillColor={spot.tone}
                        fillOpacity={spot.opacity ?? 0.28}
                        strokeOpacity={0}
                    />
                ))}

                {routePath && routePath.length > 1 ? (
                    <>
                        <Polyline path={routePath} strokeColor="#2f6feb" strokeOpacity={0.2} strokeWeight={14} />
                        <Polyline path={routePath} strokeColor="#2f6feb" strokeWeight={5} />
                    </>
                ) : null}

                {children}
            </Map>

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-grad-scrim-top" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-grad-scrim-bottom"
            />

            {zoomControl ? (
                <div className="absolute bottom-4 right-4 z-20 flex flex-col overflow-hidden rounded-btn border border-line-soft bg-grad-sheen shadow-lifted backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => zoomBy(-1)}
                        aria-label="지도 확대"
                        className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    >
                        <PlusIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
                    </button>
                    <span className="h-px bg-line" aria-hidden="true" />
                    <button
                        type="button"
                        onClick={() => zoomBy(1)}
                        aria-label="지도 축소"
                        className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    >
                        <MinusIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
                    </button>
                </div>
            ) : null}
        </div>
    )
}
