import React from "react"
import { AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { ScreenHeader } from "@widgets/screen-header"
import { MapPlaceholder, MapMarker, MapTooltip } from "@widgets/kakao-map"
import {
    RestAreaCongestionBadge,
    SeverityChart,
    toRestArea,
    toRiskSegment,
    useRestAreas,
    useRiskSegments,
    useRoute,
} from "@entities/route"
import { Button, Card } from "@shared/ui"
import { buildBboxAround } from "@shared/lib"
import type { LatLng } from "@shared/api/kakao"

/** 경로 데이터가 아직 없을 때의 기본 중심(서울시청). */
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }

interface RouteDetailState {
    routeId?: string
}

export function RouteDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state ?? null) as RouteDetailState | null
    const routeId = state?.routeId

    const { data: route } = useRoute(routeId)
    const bbox = route ? buildBboxAround([route.origin, route.destination]) : undefined
    const { data: riskSegmentsData } = useRiskSegments({ bbox })
    const { data: restAreasData } = useRestAreas({ route_id: routeId })

    const riskSegments = (riskSegmentsData?.segments ?? [])
        .map(toRiskSegment)
        .filter((segment): segment is NonNullable<typeof segment> => segment !== null)

    const restAreas = (restAreasData?.rest_areas ?? [])
        .map(toRestArea)
        .filter((restArea): restArea is NonNullable<typeof restArea> => restArea !== null)

    const [activeSegmentId, setActiveSegmentId] = React.useState<string | null>(null)
    const [syncedFirstSegmentId, setSyncedFirstSegmentId] = React.useState<string | null>(null)

    const firstSegmentId = riskSegments[0]?.segment_id ?? null
    if (firstSegmentId && firstSegmentId !== syncedFirstSegmentId) {
        setSyncedFirstSegmentId(firstSegmentId)
        setActiveSegmentId(firstSegmentId)
    }

    if (!routeId) {
        return (
            <div className="flex h-full min-h-0 flex-col">
                <ScreenHeader title="경로 상세" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
                    <p className="text-[15px] text-ink-2">잘못된 접근이에요. 홈에서 다시 경로를 찾아 주세요.</p>
                    <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
                </div>
            </div>
        )
    }

    const mapBounds = [...riskSegments, ...(restAreas[0] ? [restAreas[0]] : [])]

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ScreenHeader title="경로 상세" />

            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
                <MapPlaceholder
                    className="h-110 w-full"
                    center={riskSegments[0] ?? route?.origin ?? DEFAULT_CENTER}
                    fitBounds={mapBounds.length ? mapBounds : undefined}
                    zoomControl
                    label="경로 상세 지도"
                >
                    {riskSegments.map((segment, index) => (
                        <MapMarker
                            key={segment.segment_id}
                            kind="risk"
                            position={segment}
                            delay={index * 0.04}
                            active={activeSegmentId === segment.segment_id}
                            label={`위험구간 ${segment.road_name}`}
                            onClick={() =>
                                setActiveSegmentId((current) =>
                                    current === segment.segment_id ? null : segment.segment_id
                                )
                            }
                        >
                            <AnimatePresence>
                                {activeSegmentId === segment.segment_id ? (
                                    <MapTooltip road_name={segment.road_name} accident_count={segment.accident_count} />
                                ) : null}
                            </AnimatePresence>
                        </MapMarker>
                    ))}

                    {restAreas[0] ? (
                        <MapMarker
                            kind="rest"
                            position={restAreas[0]}
                            delay={0.16}
                            label={`졸음쉼터 ${restAreas[0].rest_area_name}`}
                        >
                            <span className="mb-2 flex items-center gap-2 whitespace-nowrap rounded-full border border-line-soft bg-grad-sheen px-2.5 py-1 shadow-lifted backdrop-blur-xl">
                                <span className="text-[12px] font-semibold text-ink">
                                    {restAreas[0].rest_area_name}
                                </span>
                                <RestAreaCongestionBadge restAreaId={restAreas[0].rest_area_id} />
                            </span>
                        </MapMarker>
                    ) : null}
                </MapPlaceholder>

                <div className="px-5 pb-8 pt-7">
                    <section>
                        <h2 className="text-[18px] font-semibold tracking-tight text-ink">위험구간</h2>
                        <Card className="mt-3 py-1! shadow-card">
                            {riskSegments.length > 0 ? (
                                <SeverityChart
                                    segments={riskSegments}
                                    activeSegmentId={activeSegmentId ?? undefined}
                                    onSelect={(segmentId) =>
                                        setActiveSegmentId((current) => (current === segmentId ? null : segmentId))
                                    }
                                />
                            ) : (
                                <p className="py-6 text-center text-[14px] text-ink-3">
                                    주변에 알려진 위험구간이 없어요.
                                </p>
                            )}
                        </Card>
                    </section>

                    <section className="mt-9">
                        <h2 className="text-[18px] font-semibold tracking-tight text-ink">졸음쉼터</h2>
                        {restAreas.length > 0 ? (
                            <ul className="mt-1 divide-y divide-line">
                                {restAreas.map((restArea) => (
                                    <li
                                        key={restArea.rest_area_id}
                                        className="flex items-center justify-between gap-3 py-3.5"
                                    >
                                        <span className="truncate text-[15px] font-medium text-ink">
                                            {restArea.rest_area_name}
                                        </span>
                                        <RestAreaCongestionBadge restAreaId={restArea.rest_area_id} size="sm" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-[14px] text-ink-3">경로 주변에 졸음쉼터가 없어요.</p>
                        )}
                    </section>
                </div>
            </div>

            <div className="relative z-20 shrink-0 border-t border-line-soft bg-surface px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-4 shadow-tabbar">
                <Button size="lg" fullWidth onClick={() => navigate("/drive", { state: { routeId } })}>
                    주행 시작
                </Button>
            </div>
        </div>
    )
}
