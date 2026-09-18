import { ArrowRightIcon, ChevronRightIcon } from "lucide-react"
import type { RouteQuery } from "../model/types"
import { formatDateTime } from "@shared/lib/date"

interface RouteHistoryItemProps {
    query: RouteQuery
    onSelect?: () => void
}

export function RouteHistoryItem({ query, onSelect }: RouteHistoryItemProps) {
    return (
        <li>
            <button
                type="button"
                onClick={onSelect}
                className="-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-btn px-2 py-3.5 text-left transition-colors duration-150 ease-out active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[15px] font-medium text-ink">{query.origin}</span>
                        <ArrowRightIcon
                            className="h-3.5 w-3.5 shrink-0 text-ink-3"
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        <span className="truncate text-[15px] font-medium text-ink">{query.destination}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-ink-3">{formatDateTime(query.requested_at)}</p>
                </div>
                <ChevronRightIcon className="h-4.5 w-4.5 shrink-0 text-ink-3" strokeWidth={2} aria-hidden="true" />
            </button>
        </li>
    )
}
