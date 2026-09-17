import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LayersIcon } from "lucide-react"
import { ScreenHeader } from "../components/ScreenHeader"
import { MapPlaceholder } from "../components/map/MapPlaceholder"
import { MapMarker } from "../components/map/MapMarker"
import { HeatmapLegend } from "../components/map/HeatmapLegend"
import { RouteCard } from "../components/RouteCard"
import { Button } from "../components/ui/Button"
import { Dropdown } from "../components/ui/Dropdown"
import { CurrentLocationMarker } from "../components/map/CurrentLocationMarker"
import { routeCandidates, riskSegments, restAreas } from "../data/safero"
import type { RouteCandidate } from "../types/newbiero"
import { riskLevel } from "../utils/newbiero"
import type { LatLng } from "../lib/kakao"

const sortOptions = ["안전순", "최단순"] as const
type SortOption = (typeof sortOptions)[number]

/** 위치 정보 없이 이 화면으로 바로 들어온 경우의 기본 중심(서울시청). */
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }

const riskTone: Record<string, string> = {
    낮음: "#22c55e",
    보통: "#ffb020",
    높음: "#f04452",
}

interface RouteState {
    originCoords?: LatLng
    destinationCoords?: LatLng
}

export function RouteResults() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state ?? null) as RouteState | null
    const [sort, setSort] = React.useState<SortOption>("안전순")
    const [heatmap, setHeatmap] = React.useState(true)
    const [routes, setRoutes] = React.useState<RouteCandidate[]>(routeCandidates)

    const handleSort = (next: SortOption) => {
        setSort(next)
        setRoutes((current) =>
            current.map((route) => ({
                ...route,
                is_selected: next === "안전순" ? route.kind === "안전경로" : route.kind === "최단경로",
            }))
        )
    }

    const handleSelect = (id: string) => {
        setRoutes((current) => current.map((route) => ({ ...route, is_selected: route.id === id })))
    }

    const ordered = React.useMemo(
        () =>
            [...routes].sort((a, b) =>
                sort === "안전순" ? a.risk_score - b.risk_score : a.duration_sec - b.duration_sec
            ),
        [routes, sort]
    )

    const shownRiskSegments = riskSegments.slice(0, 2)
    const currentPosition = state?.originCoords ?? DEFAULT_CENTER
    const routePath =
        state?.originCoords && state?.destinationCoords ? [state.originCoords, state.destinationCoords] : undefined
    const fitBounds = [
        currentPosition,
        ...(state?.destinationCoords ? [state.destinationCoords] : []),
        ...shownRiskSegments,
        restAreas[0],
    ]

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ScreenHeader title="경로 결과" />

            <div className="relative min-h-0 flex-1">
                <MapPlaceholder
                    className="absolute inset-0"
                    center={currentPosition}
                    fitBounds={fitBounds}
                    routePath={routePath}
                    heatSpots={
                        heatmap
                            ? shownRiskSegments.map((segment) => ({
                                  position: segment,
                                  radius: 350,
                                  tone: riskTone[riskLevel(segment.severity_score)],
                              }))
                            : undefined
                    }
                    label="경로 후보 지도"
                >
                    <CurrentLocationMarker position={currentPosition} />
                    {shownRiskSegments.map((segment, index) => (
                        <MapMarker
                            key={segment.road_name}
                            kind="risk"
                            position={segment}
                            delay={index * 0.05}
                            label={segment.road_name}
                        />
                    ))}

                    <MapMarker kind="rest" position={restAreas[0]} delay={0.1} label={restAreas[0].rest_area_name} />

                    <div className="absolute left-4 top-4 z-20">
                        <HeatmapLegend />
                    </div>

                    <div className="absolute right-4 top-4 z-20">
                        <button
                            type="button"
                            onClick={() => setHeatmap((value) => !value)}
                            aria-pressed={heatmap}
                            className={[
                                "flex h-10 items-center gap-2 rounded-full border px-3.5",
                                "transition-[box-shadow,background-color,border-color] duration-200 ease-out",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy",
                                heatmap
                                    ? "border-navy-soft bg-grad-navy text-on-navy shadow-navy-inset"
                                    : "border-line-soft bg-grad-sheen text-ink-2 shadow-lifted-inset backdrop-blur-xl",
                            ].join(" ")}
                        >
                            <LayersIcon className="h-4 w-4" strokeWidth={2} />
                            <span className="text-[13px] font-semibold">히트맵 {heatmap ? "ON" : "OFF"}</span>
                        </button>
                    </div>
                </MapPlaceholder>
            </div>

            <div className="relative z-20 shrink-0 rounded-t-modal border-t border-line-soft bg-grad-sheen px-5 pb-6 pt-4 shadow-tabbar backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                    <Dropdown label="경로 정렬" options={sortOptions} value={sort} onChange={handleSort} />
                </div>

                <div className="flex flex-col gap-2.5">
                    {ordered.map((route) => (
                        <RouteCard key={route.id} route={route} onSelect={handleSelect} />
                    ))}
                </div>

                <Button size="lg" fullWidth className="mt-4" onClick={() => navigate("/routes/detail")}>
                    경로 상세 보기
                </Button>
            </div>
        </div>
    )
}
