import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LayersIcon } from "lucide-react"
import { ScreenHeader } from "@widgets/screen-header"
import { MapPlaceholder, MapMarker, HeatmapLegend, CurrentLocationMarker } from "@widgets/kakao-map"
import {
    RouteCard,
    toRestArea,
    toRiskSegment,
    toRouteCandidates,
    useRestAreas,
    useRiskSegments,
    useRoute,
    useSelectRouteOption,
    type RouteCandidate,
} from "@entities/route"
import { Button, Dropdown } from "@shared/ui"
import { riskLevel, buildBboxAround } from "@shared/lib"
import type { LatLng } from "@shared/api/kakao"

const sortOptions = ["안전순", "최단순"] as const
type SortOption = (typeof sortOptions)[number]

/** 경로 데이터가 아직 없을 때(direct URL 접근 등)의 기본 중심(서울시청). */
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }

const riskTone: Record<string, string> = {
    낮음: "#22c55e",
    보통: "#ffb020",
    높음: "#f04452",
}

interface RouteResultsState {
    routeId?: string
}

export function RouteResults() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state ?? null) as RouteResultsState | null
    const routeId = state?.routeId

    const [sort, setSort] = React.useState<SortOption>("안전순")
    const [heatmap, setHeatmap] = React.useState(true)
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [syncedRouteId, setSyncedRouteId] = React.useState<string | null>(null)

    const { data: route, isPending: routeLoading } = useRoute(routeId)
    const selectOption = useSelectRouteOption(routeId ?? "")

    const candidates: RouteCandidate[] = React.useMemo(
        () => (route ? toRouteCandidates(route.options) : []),
        [route]
    )

    if (route && route.route_id !== syncedRouteId) {
        setSyncedRouteId(route.route_id)
        const safe = candidates.find((candidate) => candidate.kind === "안전경로") ?? candidates[0]
        setSelectedId(safe?.id ?? null)
    }

    const bbox = route ? buildBboxAround([route.origin, route.destination]) : undefined
    const { data: riskSegmentsData } = useRiskSegments({ bbox })
    const { data: restAreasData } = useRestAreas({ route_id: routeId })

    const shownRiskSegments = (riskSegmentsData?.segments ?? [])
        .map(toRiskSegment)
        .filter((segment): segment is NonNullable<typeof segment> => segment !== null)
        .slice(0, 2)

    const restAreas = (restAreasData?.rest_areas ?? [])
        .map(toRestArea)
        .filter((restArea): restArea is NonNullable<typeof restArea> => restArea !== null)

    const handleSort = (next: SortOption) => {
        setSort(next)
        const match = candidates.find((candidate) =>
            next === "안전순" ? candidate.kind === "안전경로" : candidate.kind === "최단경로"
        )
        if (match) setSelectedId(match.id)
    }

    const handleSelect = (id: string) => setSelectedId(id)

    const withSelection = candidates.map((candidate) => ({ ...candidate, is_selected: candidate.id === selectedId }))
    const ordered = React.useMemo(
        () =>
            [...withSelection].sort((a, b) =>
                sort === "안전순" ? a.risk_score - b.risk_score : a.duration_sec - b.duration_sec
            ),
        [withSelection, sort]
    )

    const currentPosition: LatLng = route?.origin ?? DEFAULT_CENTER
    const routePath = route ? [route.origin, route.destination] : undefined
    const fitBounds = [
        currentPosition,
        ...(route ? [route.destination] : []),
        ...shownRiskSegments,
        ...restAreas.slice(0, 1),
    ]

    const goToDetail = async () => {
        if (!routeId || !selectedId) return
        await selectOption.mutateAsync(selectedId)
        navigate("/routes/detail", { state: { routeId } })
    }

    if (!routeId) {
        return (
            <div className="flex h-full min-h-0 flex-col">
                <ScreenHeader title="경로 결과" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
                    <p className="text-[15px] text-ink-2">잘못된 접근이에요. 홈에서 다시 경로를 찾아 주세요.</p>
                    <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
                </div>
            </div>
        )
    }

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
                            key={segment.segment_id}
                            kind="risk"
                            position={segment}
                            delay={index * 0.05}
                            label={segment.road_name}
                        />
                    ))}

                    {restAreas[0] ? (
                        <MapMarker
                            kind="rest"
                            position={restAreas[0]}
                            delay={0.1}
                            label={restAreas[0].rest_area_name}
                        />
                    ) : null}

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
                <div className="mb-3 flex items-center justify-end">
                    <Dropdown label="경로 정렬" options={sortOptions} value={sort} onChange={handleSort} align="right" />
                </div>

                <div className="flex flex-col gap-2.5">
                    {routeLoading ? (
                        <p className="py-6 text-center text-[14px] text-ink-3">경로를 불러오는 중...</p>
                    ) : (
                        ordered.map((candidate) => (
                            <RouteCard key={candidate.id} route={candidate} onSelect={handleSelect} />
                        ))
                    )}
                </div>

                <Button
                    size="lg"
                    fullWidth
                    className="mt-4"
                    disabled={!selectedId || selectOption.isPending}
                    onClick={goToDetail}
                >
                    {selectOption.isPending ? "선택하는 중..." : "경로 상세 보기"}
                </Button>
            </div>
        </div>
    )
}
