import { apiClient } from "@shared/api/client"
import type { ListAlertsQuery, ListAlertsResponse } from "./types"

export const alertsApi = {
    list: (query: ListAlertsQuery = {}) =>
        apiClient.get<ListAlertsResponse>("/alerts", { params: query }).then((res) => res.data),
}
