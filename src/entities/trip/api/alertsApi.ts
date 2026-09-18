import { apiClient } from "@shared/api/client"
import type { AlertEntry, CreateAlertRequest, ListAlertsQuery, ListAlertsResponse } from "./types"

export const alertsApi = {
    list: (query: ListAlertsQuery = {}) =>
        apiClient.get<ListAlertsResponse>("/alerts", { params: query }).then((res) => res.data),

    create: (payload: CreateAlertRequest) =>
        apiClient.post<AlertEntry>("/alerts", payload).then((res) => res.data),
}
