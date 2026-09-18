import { useRestAreaCongestion } from "../api/useRestAreas"
import { averageOccupancyRate } from "../lib/adapt"
import { CongestionBadge } from "./CongestionBadge"

interface RestAreaCongestionBadgeProps {
    restAreaId: string
    size?: "sm" | "md"
}

/** 목록 API는 혼잡도를 주지 않아, 졸음쉼터별로 congestion API를 불러와 평균치를 배지로 보여준다. */
export function RestAreaCongestionBadge({ restAreaId, size = "sm" }: RestAreaCongestionBadgeProps) {
    const { data } = useRestAreaCongestion(restAreaId)
    const rate = data ? averageOccupancyRate(data.congestions) : undefined
    return <CongestionBadge rate={rate} size={size} />
}
