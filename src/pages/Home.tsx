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
import { getCurrentPosition, type LatLng } from "../lib/kakao"

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

/** 위치 권한이 없거나 실패했을 때의 기본 중심(서울시청). */
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }

interface PlaceSelection {
    origin?: string
    destination?: string
    destinationCoords?: LatLng
}

export function Home() {
    const navigate = useNavigate()
    const location = useLocation()
    const selection = (location.state ?? null) as PlaceSelection | null

    const [origin, setOrigin] = React.useState(selection?.origin ?? "현재 위치")
    const [destination, setDestination] = React.useState(selection?.destination ?? "")
    const [destinationCoords, setDestinationCoords] = React.useState<LatLng | null>(
        selection?.destinationCoords ?? null
    )
    const [currentPosition, setCurrentPosition] = React.useState<LatLng | null>(null)
    const [driverType, setDriverType] = React.useState<DriverType>(() => readStoredDriverType() ?? profile.driver_type)
    const [sheetOpen, setSheetOpen] = React.useState(Boolean(selection?.destination))
    const mapRef = React.useRef<kakao.maps.Map | null>(null)

    React.useEffect(() => {
        getCurrentPosition()
            .then(setCurrentPosition)
            .catch(() => setCurrentPosition(null))
    }, [])

    React.useEffect(() => {
        if (!selection?.destination) return
        setOrigin(selection.origin ?? "현재 위치")
        setDestination(selection.destination)
        setDestinationCoords(selection.destinationCoords ?? null)
        setSheetOpen(true)
    }, [selection?.destination, selection?.origin, selection?.destinationCoords])

    const centerOnCurrentPosition = () => {
        if (!currentPosition || !mapRef.current) return
        mapRef.current.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng))
    }

    const findSafeRoute = () => {
        navigate("/routes", {
            state: {
                origin,
                destination,
                originCoords: origin === "현재 위치" ? currentPosition : undefined,
                destinationCoords,
            },
        })
    }

    return (
        <div className="relative h-full min-h-0">
            <MapPlaceholder
                className="absolute inset-0"
                center={currentPosition ?? destinationCoords ?? DEFAULT_CENTER}
                fitBounds={
                    currentPosition && destinationCoords ? [currentPosition, destinationCoords] : undefined
                }
                onCreate={(map) => {
                    mapRef.current = map
                }}
                label="현재 위치가 표시된 지도"
            >
                {currentPosition ? <CurrentLocationMarker position={currentPosition} /> : null}
                {destination && destinationCoords ? (
                    <MapMarker kind="place" position={destinationCoords} label={destination} />
                ) : null}
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
                    onClick={centerOnCurrentPosition}
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

                    <Button size="lg" fullWidth className="mt-6" onClick={findSafeRoute}>
                        안전 경로 찾기
                    </Button>
                </div>
            </BottomSheet>
        </div>
    )
}
