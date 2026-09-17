import React from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ScreenHeader } from "../components/ScreenHeader"
import { MapPlaceholder } from "../components/map/MapPlaceholder"
import { MapMarker } from "../components/map/MapMarker"
import { MapTooltip } from "../components/map/MapTooltip"
import { SeverityChart } from "../components/charts/SeverityChart"
import { CongestionBadge } from "../components/ui/CongestionBadge"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { restAreas, riskSegments } from "../data/safero"

const mapBounds = [...riskSegments.map((segment) => segment), restAreas[0]]

export function RouteDetail() {
    const navigate = useNavigate()
    const [activeRoad, setActiveRoad] = React.useState<string | null>(riskSegments[0].road_name)

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ScreenHeader title="경로 상세" />

            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
                <MapPlaceholder
                    className="h-110 w-full"
                    center={riskSegments[0]}
                    fitBounds={mapBounds}
                    zoomControl
                    label="경로 상세 지도"
                >
                    {riskSegments.map((segment, index) => (
                        <MapMarker
                            key={segment.road_name}
                            kind="risk"
                            position={segment}
                            delay={index * 0.04}
                            active={activeRoad === segment.road_name}
                            label={`위험구간 ${segment.road_name}`}
                            onClick={() =>
                                setActiveRoad((current) => (current === segment.road_name ? null : segment.road_name))
                            }
                        >
                            <AnimatePresence>
                                {activeRoad === segment.road_name ? (
                                    <MapTooltip road_name={segment.road_name} accident_count={segment.accident_count} />
                                ) : null}
                            </AnimatePresence>
                        </MapMarker>
                    ))}

                    <MapMarker kind="rest" position={restAreas[0]} delay={0.16} label={`졸음쉼터 ${restAreas[0].rest_area_name}`}>
                        <span className="mb-2 flex items-center gap-2 whitespace-nowrap rounded-full border border-line-soft bg-grad-sheen px-2.5 py-1 shadow-lifted backdrop-blur-xl">
                            <span className="text-[12px] font-semibold text-ink">{restAreas[0].rest_area_name}</span>
                            <CongestionBadge rate={restAreas[0].predicted_occupancy_rate} />
                        </span>
                    </MapMarker>
                </MapPlaceholder>

                <div className="px-5 pb-8 pt-7">
                    <section>
                        <h2 className="text-[18px] font-semibold tracking-tight text-ink">위험구간</h2>
                        <Card className="mt-3 py-1! shadow-card">
                            <SeverityChart
                                segments={riskSegments}
                                activeRoadName={activeRoad ?? undefined}
                                onSelect={(road_name) =>
                                    setActiveRoad((current) => (current === road_name ? null : road_name))
                                }
                            />
                        </Card>
                    </section>

                    <section className="mt-9">
                        <h2 className="text-[18px] font-semibold tracking-tight text-ink">졸음쉼터</h2>
                        <ul className="mt-1 divide-y divide-line">
                            {restAreas.map((restArea) => (
                                <li
                                    key={restArea.rest_area_name}
                                    className="flex items-center justify-between gap-3 py-3.5"
                                >
                                    <span className="truncate text-[15px] font-medium text-ink">
                                        {restArea.rest_area_name}
                                    </span>
                                    <CongestionBadge rate={restArea.predicted_occupancy_rate} size="sm" />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            <div className="relative z-20 shrink-0 border-t border-line-soft bg-surface px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-4 shadow-tabbar">
                <Button size="lg" fullWidth onClick={() => navigate("/drive")}>
                    주행 시작
                </Button>
            </div>
        </div>
    )
}
