import { useQuery } from "@tanstack/react-query"
import { alertsApi } from "./alertsApi"
import type { ListAlertsQuery } from "./types"

export function useAlerts(query: ListAlertsQuery = {}) {
    return useQuery({
        queryKey: ["alerts", query],
        queryFn: () => alertsApi.list(query),
    })
}
