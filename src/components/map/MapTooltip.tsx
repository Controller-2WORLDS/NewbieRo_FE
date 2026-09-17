import { motion } from "framer-motion"

interface MapTooltipProps {
    road_name: string
    accident_count: number
}

export function MapTooltip({ road_name, accident_count }: MapTooltipProps) {
    return (
        <motion.div
            role="tooltip"
            initial={{ y: 4, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 4, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="relative mb-2.5 whitespace-nowrap rounded-btn border border-line-soft bg-grad-sheen px-3.5 py-2 shadow-lifted-inset backdrop-blur-xl"
        >
            <p className="text-[13px] font-bold tracking-[-0.01em] text-ink">{road_name}</p>
            <p className="mt-0.5 text-[12px] font-medium text-ink-2">사고 {accident_count}건</p>
            <span
                aria-hidden="true"
                className="absolute -bottom-1.25 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-line bg-surface"
            />
        </motion.div>
    )
}
