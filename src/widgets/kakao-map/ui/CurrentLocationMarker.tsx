import { CustomOverlayMap } from "react-kakao-maps-sdk"
import type { LatLng } from "@shared/api/kakao"

interface CurrentLocationMarkerProps {
    position: LatLng
    variant?: "dot" | "puck"
}

export function CurrentLocationMarker({ position, variant = "dot" }: CurrentLocationMarkerProps) {
    return (
        <CustomOverlayMap position={position} zIndex={15}>
            <div className="relative flex items-center justify-center" aria-hidden="true">
                {/* animate-ping: 순수 CSS 애니메이션이라 framer-motion 루프 리셋 시 생기던
                    깜빡임(확산 후 원점으로 순간 복귀하는 지점의 팝) 없이 자연스럽게 반복된다. */}
                <span className="absolute h-8 w-8 rounded-full bg-grad-navy opacity-30 animate-ping" />

                <span className="absolute h-10 w-10 rounded-full bg-navy opacity-[0.07] blur-md" />

                {variant === "dot" ? (
                    <span
                        style={{ boxShadow: "0 4px 12px -6px rgba(47,111,235,0.45)" }}
                        className="relative h-4.5 w-4.5 rounded-full border-[3px] border-white bg-grad-navy"
                    />
                ) : (
                    <span
                        style={{ boxShadow: "0 8px 18px -10px rgba(47,111,235,0.5)" }}
                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-grad-navy"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/35 to-transparent"
                        />

                        <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="#ffffff">
                            <path d="M12 4 L19 20 L12 16.4 L5 20 Z" />
                        </svg>
                    </span>
                )}
            </div>
        </CustomOverlayMap>
    )
}
