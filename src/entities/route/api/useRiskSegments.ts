import { useQuery } from "@tanstack/react-query"
import { riskSegmentsApi } from "./riskSegmentsApi"
import type { ListRiskSegmentsQuery } from "./types"

export function useRiskSegments(query: ListRiskSegmentsQuery) {
    return useQuery({
        queryKey: ["risk-segments", query],
        queryFn: () => riskSegmentsApi.list(query),
        enabled: Boolean(query.bbox),
    })
}
