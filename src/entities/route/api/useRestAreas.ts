import { useQuery } from "@tanstack/react-query"
import { restAreasApi } from "./restAreasApi"
import type { ListRestAreasQuery, RestAreaCongestionQuery } from "./types"

export function useRestAreas(query: ListRestAreasQuery) {
    return useQuery({
        queryKey: ["rest-areas", query],
        queryFn: () => restAreasApi.list(query),
        enabled: Boolean(query.route_id || query.bbox),
    })
}

export function useRestAreaCongestion(restAreaId: string | undefined, query: RestAreaCongestionQuery = {}) {
    return useQuery({
        queryKey: ["rest-areas", restAreaId, "congestion", query],
        queryFn: () => restAreasApi.congestion(restAreaId as string, query),
        enabled: Boolean(restAreaId),
    })
}
