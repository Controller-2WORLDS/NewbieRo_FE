import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { MoonIcon, XIcon } from "lucide-react"
import { MapPlaceholder } from "../components/map/MapPlaceholder"
import { MapMarker } from "../components/map/MapMarker"
import { CurrentLocationMarker } from "../components/map/CurrentLocationMarker"
import { AlertBanner } from "../components/ui/AlertBanner"
import { CongestionBadge } from "../components/ui/CongestionBadge"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { approachingRestArea, driveAlert, riskSegments } from "../data/safero"

export function DriveMode() {
    const navigate = useNavigate()
    const [restAreaVisible, setRestAreaVisible] = React.useState(false)
    const [endConfirmOpen, setEndConfirmOpen] = React.useState(false)

    React.useEffect(() => {
        const showTimer = window.setTimeout(() => setRestAreaVisible(true), 2600)
        return () => window.clearTimeout(showTimer)
    }, [])

    React.useEffect(() => {
        if (!restAreaVisible) return
        const hideTimer = window.setTimeout(() => setRestAreaVisible(false), 7000)
        return () => window.clearTimeout(hideTimer)
    }, [restAreaVisible])

    return (
        <div className="relative flex h-full min-h-0 flex-col">
            <MapPlaceholder
                className="absolute inset-0"
                variant="nav"
                moving
                showRoute
                label="주행 중 실시간 위치 지도"
            >
                <MapMarker kind="risk" x={44} y={38} label={`위험구간 ${riskSegments[0].road_name}`} />

                <MapMarker
                    kind="rest"
                    x={70}
                    y={52}
                    delay={0.06}
                    label={`졸음쉼터 ${approachingRestArea.rest_area_name}`}
                />

                <CurrentLocationMarker x={50} y={78} variant="puck" />
            </MapPlaceholder>

            <div className="relative z-20 flex h-full min-h-0 flex-col p-4">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <AlertBanner
                            road_name={driveAlert.road_name}
                            severity_score={driveAlert.severity_score}
                            alert_type={driveAlert.alert_type}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setEndConfirmOpen(true)}
                        aria-label="주행 종료"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-soft bg-grad-sheen text-ink shadow-lifted-inset backdrop-blur-xl transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    >
                        <XIcon className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                <div className="mt-auto">
                    <AnimatePresence>
                        {restAreaVisible ? (
                            <motion.div
                                role="status"
                                initial={{ y: 12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 12, opacity: 0 }}
                                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                                className="flex items-center gap-2.5 rounded-btn border border-line-soft bg-grad-sheen py-2.5 pl-3 pr-2.5 shadow-lifted-inset backdrop-blur-xl"
                            >
                                <MoonIcon
                                    className="h-4.5 w-4.5 shrink-0 text-navy"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />

                                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
                                    {approachingRestArea.rest_area_name}
                                </span>
                                <CongestionBadge rate={approachingRestArea.predicted_occupancy_rate} />

                                <button
                                    type="button"
                                    onClick={() => setRestAreaVisible(false)}
                                    aria-label="졸음쉼터 안내 닫기"
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                                >
                                    <XIcon className="h-4 w-4" strokeWidth={2.2} />
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            <Modal
                open={endConfirmOpen}
                onClose={() => setEndConfirmOpen(false)}
                title="주행을 종료할까요?"
                footer={
                    <div className="flex gap-2.5">
                        <Button variant="secondary" size="lg" fullWidth onClick={() => setEndConfirmOpen(false)}>
                            계속 주행
                        </Button>
                        <Button size="lg" fullWidth onClick={() => navigate("/report")}>
                            종료
                        </Button>
                    </div>
                }
            >
                <p className="text-[15px] leading-relaxed text-ink-2">종료하면 운행 리포트로 이동합니다.</p>
            </Modal>
        </div>
    )
}
