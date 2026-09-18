import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CrosshairIcon, NavigationIcon, SearchIcon } from "lucide-react"
import { MapPlaceholder, CurrentLocationMarker, MapMarker } from "@widgets/kakao-map"
import { BottomSheet, Button, Input, Modal, SegmentedControl } from "@shared/ui"
import { fromApiDriverType, toApiDriverType, useMe, type DriverType } from "@entities/user"
import { useCreateRoute } from "@entities/route"
import { extractApiErrorMessage } from "@shared/api/client"
import { getCurrentPosition, getGeolocationPermissionState, reverseGeocode, type LatLng } from "@shared/api/kakao"

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

/** 위치 권한이 없거나 실패했을 때의 기본 중심(서울시청). */
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }

/** 앱을 새로 시작할 때(세션당 한 번)만 위치 권한 안내를 띄우기 위한 플래그. */
const LOCATION_PROMPT_SEEN_KEY = "newbiero:location-prompt-seen"

interface PlaceSelection {
    origin?: string
    destination?: string
    destinationCoords?: LatLng
}

export function Home() {
    const navigate = useNavigate()
    const location = useLocation()
    const selection = (location.state ?? null) as PlaceSelection | null
    const { data: me } = useMe()
    const createRoute = useCreateRoute()

    const [origin, setOrigin] = React.useState(selection?.origin ?? "현재 위치")
    const [destination, setDestination] = React.useState(selection?.destination ?? "")
    const [destinationCoords, setDestinationCoords] = React.useState<LatLng | null>(
        selection?.destinationCoords ?? null
    )
    const [currentPosition, setCurrentPosition] = React.useState<LatLng | null>(null)
    const [driverType, setDriverType] = React.useState<DriverType>("일반")
    const [syncedDriverTypeUserId, setSyncedDriverTypeUserId] = React.useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = React.useState(Boolean(selection?.destination))
    const [locationPromptOpen, setLocationPromptOpen] = React.useState(false)
    const [locationDenied, setLocationDenied] = React.useState(false)
    const [routeError, setRouteError] = React.useState<string | null>(null)
    const [syncedSelection, setSyncedSelection] = React.useState(selection)
    const mapRef = React.useRef<kakao.maps.Map | null>(null)

    // 내 프로필의 운전자 유형을 기본값으로 반영한다(이후 이 화면에서 바꾼 값은 그대로 유지).
    if (me && me.user_id !== syncedDriverTypeUserId) {
        setSyncedDriverTypeUserId(me.user_id)
        setDriverType(fromApiDriverType(me.driver_type))
    }

    React.useEffect(() => {
        let cancelled = false

        const requestPosition = () => {
            getCurrentPosition()
                .then((position) => {
                    if (!cancelled) setCurrentPosition(position)
                })
                .catch(() => {
                    if (!cancelled) setCurrentPosition(null)
                })
        }

        getGeolocationPermissionState().then((state) => {
            if (cancelled) return

            if (state === "granted") {
                requestPosition()
                return
            }

            setLocationDenied(state === "denied")

            // 세션당 한 번만 안내를 띄우고, 이미 봤다면 브라우저 기본 동작에 맡긴다.
            if (sessionStorage.getItem(LOCATION_PROMPT_SEEN_KEY)) {
                requestPosition()
                return
            }
            sessionStorage.setItem(LOCATION_PROMPT_SEEN_KEY, "1")
            setLocationPromptOpen(true)
        })

        return () => {
            cancelled = true
        }
    }, [])

    const requestLocationAccess = () => {
        getCurrentPosition()
            .then((position) => {
                setCurrentPosition(position)
                setLocationDenied(false)
                setLocationPromptOpen(false)
            })
            .catch(() => setLocationDenied(true))
    }

    // 장소 검색 화면에서 새 목적지를 들고 돌아왔을 때만(최초 마운트 이후) 반영한다.
    if (selection?.destination && selection !== syncedSelection) {
        setSyncedSelection(selection)
        setOrigin(selection.origin ?? "현재 위치")
        setDestination(selection.destination)
        setDestinationCoords(selection.destinationCoords ?? null)
        setSheetOpen(true)
    }

    const centerOnCurrentPosition = () => {
        if (!currentPosition || !mapRef.current) return
        mapRef.current.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng))
    }

    const handleMapClick = async (position: LatLng) => {
        // 즉시 마커를 찍고 부드럽게 그 위치로 이동해 탭이 인식됐다는 피드백을 먼저 준다.
        setDestinationCoords(position)
        setDestination("선택한 위치")
        mapRef.current?.panTo(new kakao.maps.LatLng(position.lat, position.lng))

        // 근처에 건물/단지명이 있으면 주소보다 그 이름을 우선해서 보여준다.
        const result = await reverseGeocode(position).catch(() => null)
        if (result?.label) setDestination(result.label)
    }

    const findSafeRoute = async () => {
        const originCoords = origin.trim() === "현재 위치" ? currentPosition : null
        if (!originCoords || !destinationCoords) {
            setRouteError("출발지와 도착지 위치를 확인할 수 없어요. 지도를 눌러 도착지를 선택해 주세요.")
            return
        }

        setRouteError(null)
        try {
            const result = await createRoute.mutateAsync({
                origin: { ...originCoords, address: origin },
                destination: { ...destinationCoords, address: destination },
                profile_used: toApiDriverType(driverType),
            })
            navigate("/routes", { state: { routeId: result.route_id } })
        } catch (error) {
            setRouteError(extractApiErrorMessage(error, "경로를 찾지 못했어요. 잠시 후 다시 시도해 주세요."))
        }
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
                onMapClick={handleMapClick}
                label="현재 위치가 표시된 지도"
            >
                {currentPosition ? <CurrentLocationMarker position={currentPosition} /> : null}
                {destination && destinationCoords ? (
                    <MapMarker kind="place" position={destinationCoords} label={destination} />
                ) : null}
            </MapPlaceholder>

            <div className="absolute inset-x-0 top-0 z-20 px-4 pt-3">
                <div className="flex h-13.5 w-full items-center gap-1 rounded-btn border border-line-soft bg-grad-sheen pl-4 pr-1.5 shadow-lifted-inset backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-150 ease-out">
                    <button
                        type="button"
                        onClick={() => navigate("/search")}
                        className="flex min-w-0 flex-1 items-center gap-2.5 py-2 text-left focus-visible:outline-none"
                    >
                        <NavigationIcon className="h-4.5 w-4.5 shrink-0 text-navy" strokeWidth={2.2} aria-hidden="true" />
                        <span
                            className={[
                                "flex-1 truncate text-[15px]",
                                destination ? "font-medium text-ink" : "text-ink-3",
                            ].join(" ")}
                        >
                            {destination || "어디로 갈까요?"}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        aria-label="경로 찾기"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent transition-[transform,background-color] duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    >
                        <SearchIcon className="h-4.5 w-4.5" strokeWidth={2.2} aria-hidden="true" />
                    </button>
                </div>
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

                    {routeError ? (
                        <p role="alert" className="mt-4 rounded-btn border border-danger/30 bg-danger-tint px-3.5 py-2.5 text-[13px] font-medium text-danger">
                            {routeError}
                        </p>
                    ) : null}

                    <Button
                        size="lg"
                        fullWidth
                        className="mt-6"
                        disabled={createRoute.isPending}
                        onClick={findSafeRoute}
                    >
                        {createRoute.isPending ? "찾는 중..." : "안전 경로 찾기"}
                    </Button>
                </div>
            </BottomSheet>

            <Modal
                open={locationPromptOpen}
                onClose={() => setLocationPromptOpen(false)}
                title="위치 권한이 필요해요"
                footer={
                    <div className="flex gap-2.5">
                        <Button variant="secondary" size="lg" fullWidth onClick={() => setLocationPromptOpen(false)}>
                            나중에
                        </Button>
                        <Button size="lg" fullWidth onClick={requestLocationAccess}>
                            위치 허용하기
                        </Button>
                    </div>
                }
            >
                <p className="text-[15px] leading-relaxed text-ink-2">
                    {locationDenied
                        ? "위치 접근이 차단되어 있어요. 허용하기를 다시 눌러 보고, 그래도 안 되면 주소창의 위치 아이콘을 눌러 권한을 허용해 주세요."
                        : "현재 위치를 기반으로 실시간 안전 경로와 위험구간 알림을 제공하려면 위치 권한이 필요해요. 허용하기를 누르면 브라우저 권한 요청 창이 떠요."}
                </p>
            </Modal>
        </div>
    )
}
