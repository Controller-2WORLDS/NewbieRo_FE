import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRightIcon, ChevronLeftIcon, ClockIcon, MapPinIcon, SearchIcon, XIcon } from "lucide-react"
import { useKakaoLoader } from "react-kakao-maps-sdk"
import { recentQueries } from "../data/safero"
import { formatDateTime } from "../utils/newbiero"
import { KAKAO_MAP_APP_KEY, searchPlacesByKeyword, type PlaceSearchResult } from "../lib/kakao"

export function PlaceSearch() {
    const navigate = useNavigate()
    const [loading] = useKakaoLoader({ appkey: KAKAO_MAP_APP_KEY, libraries: ["services"] })
    const [keyword, setKeyword] = React.useState("")
    const [results, setResults] = React.useState<PlaceSearchResult[]>([])
    const [searching, setSearching] = React.useState(false)
    const [searchError, setSearchError] = React.useState(false)

    React.useEffect(() => {
        const trimmed = keyword.trim()
        if (trimmed.length === 0 || loading) {
            setResults([])
            setSearchError(false)
            return
        }

        let cancelled = false
        setSearching(true)
        const timer = window.setTimeout(() => {
            searchPlacesByKeyword(trimmed)
                .then((found) => {
                    if (cancelled) return
                    setResults(found)
                    setSearchError(false)
                })
                .catch(() => {
                    if (cancelled) return
                    setResults([])
                    setSearchError(true)
                })
                .finally(() => {
                    if (!cancelled) setSearching(false)
                })
        }, 300)

        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [keyword, loading])

    const selectRecent = (origin: string, destination: string, lat: number, lng: number) => {
        navigate("/", { state: { origin, destination, destinationCoords: { lat, lng } } })
    }

    const selectResult = (place: PlaceSearchResult) => {
        navigate("/", {
            state: {
                origin: "현재 위치",
                destination: place.placeName,
                destinationCoords: { lat: place.lat, lng: place.lng },
            },
        })
    }

    return (
        <div className="flex h-full min-h-0 flex-col bg-surface">
            <div className="relative z-20 flex h-16 shrink-0 items-center gap-1 border-b border-line-soft bg-grad-header px-2 shadow-card">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                    <ChevronLeftIcon className="h-5 w-5" strokeWidth={2} />
                </button>
                <div className="flex h-11 flex-1 items-center gap-2 rounded-btn border border-line-soft bg-surface-2 px-3.5 shadow-[inset_0_1px_3px_rgba(23,43,77,0.04)]">
                    <SearchIcon className="h-4.5 w-4.5 shrink-0 text-ink-3" strokeWidth={2} aria-hidden="true" />

                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="장소를 검색하세요"
                        aria-label="장소 검색"
                        autoFocus
                        className="h-full w-full border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
                    />

                    {keyword.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => setKeyword("")}
                            aria-label="검색어 지우기"
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-line text-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                        >
                            <XIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
                {keyword.trim().length === 0 ? (
                    <section className="pt-4">
                        <h2 className="text-[14px] font-medium text-ink-2">최근 검색지</h2>
                        <ul className="mt-1 divide-y divide-line">
                            {recentQueries.map((query) => (
                                <li key={query.requested_at}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            selectRecent(
                                                query.origin,
                                                query.destination,
                                                query.destination_lat,
                                                query.destination_lng
                                            )
                                        }
                                        className="flex w-full items-center gap-3 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                                    >
                                        <ClockIcon
                                            className="h-4.5 w-4.5 shrink-0 text-ink-3"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        <span className="min-w-0 flex-1">
                                            <span className="flex min-w-0 items-center gap-1.5">
                                                <span className="truncate text-[15px] font-medium text-ink">
                                                    {query.origin}
                                                </span>
                                                <ArrowRightIcon
                                                    className="h-3.5 w-3.5 shrink-0 text-ink-3"
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                />

                                                <span className="truncate text-[15px] font-medium text-ink">
                                                    {query.destination}
                                                </span>
                                            </span>
                                            <span className="mt-1 block text-[12px] text-ink-3">
                                                {formatDateTime(query.requested_at)}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : searching ? (
                    <p className="pt-16 text-center text-[14px] text-ink-3">검색 중...</p>
                ) : searchError ? (
                    <p className="pt-16 text-center text-[14px] text-ink-3">검색에 실패했습니다. 다시 시도해 주세요.</p>
                ) : results.length > 0 ? (
                    <ul className="divide-y divide-line pt-2">
                        {results.map((place) => (
                            <li key={place.id}>
                                <button
                                    type="button"
                                    onClick={() => selectResult(place)}
                                    className="flex w-full items-center gap-3 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                                >
                                    <MapPinIcon
                                        className="h-4.5 w-4.5 shrink-0 text-navy"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[16px] font-medium text-ink">
                                            {place.placeName}
                                        </span>
                                        <span className="mt-0.5 block truncate text-[12px] text-ink-3">
                                            {place.addressName}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="pt-16 text-center text-[14px] text-ink-3">검색 결과가 없습니다</p>
                )}
            </div>
        </div>
    )
}
