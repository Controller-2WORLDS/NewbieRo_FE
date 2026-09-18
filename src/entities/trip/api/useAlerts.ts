import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { alertsApi } from "./alertsApi"
import type { CreateAlertRequest, ListAlertsQuery } from "./types"

export function useAlerts(query: ListAlertsQuery = {}) {
    return useQuery({
        queryKey: ["alerts", query],
        queryFn: () => alertsApi.list(query),
    })
}

export function useCreateAlert() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateAlertRequest) => alertsApi.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
    })
}
