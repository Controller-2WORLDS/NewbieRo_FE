import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CrosshairIcon, NavigationIcon, SearchIcon } from "lucide-react"
import { MapPlaceholder } from "../components/map/MapPlaceholder"
import { CurrentLocationMarker } from "../components/map/CurrentLocationMarker"
import { MapMarker } from "../components/map/MapMarker"
import { BottomSheet } from "../components/ui/BottomSheet"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { SegmentedControl } from "../components/ui/SegmentedControl"
import { profile } from "../data/safero"
import type { DriverType } from "../types/newbiero"
import { readStoredDriverType } from "../utils/newbiero"

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

interface PlaceSelection {
    origin?: string
    destination?: string
}

export function Home() {
    const navigate = useNavigate()
    const location = useLocation()
    const selection = (location.state ?? null) as PlaceSelection | null

    const [origin, setOrigin] = React.useState(selection?.origin ?? "현재 위치")
    const [destination, setDestination] = React.useState(selection?.destination ?? "")
    const [driverType, setDriverType] = React.useState<DriverType>(() => readStoredDriverType() ?? profile.driver_type)
    const [sheetOpen, setSheetOpen] = React.useState(Boolean(selection?.destination))

    React.useEffect(() => {
        if (!selection?.destination) return
        setOrigin(selection.origin ?? "현재 위치")
        setDestination(selection.destination)
        setSheetOpen(true)
    }, [selection?.destination, selection?.origin])

    return (
        <div className="relative h-full min-h-0">
            <MapPlaceholder className="absolute inset-0" label="현재 위치가 표시된 지도">
                <CurrentLocationMarker x={46} y={62} />
                {destination ? <MapMarker kind="place" x={64} y={34} label={destination} /> : null}
            </MapPlaceholder>

            <div className="absolute inset-x-0 top-0 z-20 px-4 pt-3">
                <button
                    type="button"
                    onClick={() => navigate("/search")}
                    className="flex h-13.5 w-full items-center gap-2.5 rounded-btn border border-line-soft bg-grad-sheen px-4 shadow-lifted-inset backdrop-blur-xl transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                    <NavigationIcon className="h-4.5 w-4.5 shrink-0 text-navy" strokeWidth={2.2} aria-hidden="true" />

                    <span
                        className={[
                            "flex-1 truncate text-left text-[15px]",
                            destination ? "font-medium text-ink" : "text-ink-3",
                        ].join(" ")}
                    >
                        {destination || "어디로 갈까요?"}
                    </span>
                    <SearchIcon className="h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={2.2} aria-hidden="true" />
                </button>
            </div>

            <div className="absolute bottom-5 right-4 z-20">
                <button
                    type="button"
                    aria-label="현재 위치로 이동"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line-soft bg-grad-sheen text-navy shadow-lifted-inset backdrop-blur-xl transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                    <CrosshairIcon className="h-5 w-5" strokeWidth={2} />
                </button>
            </div>

            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="선택한 장소">
                <div className="px-5 pb-7 pt-3">
                    <h2 className="text-[22px] font-bold tracking-tight text-ink">{destination}</h2>

                    <div className="mt-5">
                        <Input
                            label="출발지"
                            value={origin}
                            onChange={(event) => setOrigin(event.target.value)}
                            icon={<NavigationIcon className="h-4.5 w-4.5" strokeWidth={2} />}
                            placeholder="현재 위치"
                        />
                    </div>

                    <div className="mt-5">
                        <p className="mb-2.5 text-[13px] font-medium text-ink-2">운전자 유형</p>
                        <SegmentedControl
                            label="운전자 유형"
                            options={driverTypes}
                            value={driverType}
                            onChange={setDriverType}
                        />
                    </div>

                    <Button size="lg" fullWidth className="mt-6" onClick={() => navigate("/routes")}>
                        안전 경로 찾기
                    </Button>
                </div>
            </BottomSheet>
        </div>
    )
}
