import React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeftIcon } from "lucide-react"

interface ScreenHeaderProps {
    title: string
    action?: React.ReactNode
    onBack?: () => void
}

export function ScreenHeader({ title, action, onBack }: ScreenHeaderProps) {
    const navigate = useNavigate()
    return (
        <header className="relative z-20 flex h-14 shrink-0 items-center gap-1 border-b border-line-soft bg-grad-header px-3 shadow-card backdrop-blur-xl">
            <button
                type="button"
                onClick={onBack ?? (() => navigate(-1))}
                aria-label="뒤로"
                className="flex h-10 w-10 items-center justify-center rounded-btn text-ink transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
                <ChevronLeftIcon className="h-5.5 w-5.5" strokeWidth={2} />
            </button>
            <h1 className="flex-1 text-[17px] font-semibold tracking-tight text-ink">{title}</h1>
            {action ? <div className="pr-1">{action}</div> : null}
        </header>
    )
}
