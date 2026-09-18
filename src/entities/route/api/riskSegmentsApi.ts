import { apiClient } from "@shared/api/client"
import type { ListRiskSegmentsQuery, ListRiskSegmentsResponse } from "./types"

export const riskSegmentsApi = {
    list: (query: ListRiskSegmentsQuery) =>
        apiClient.get<ListRiskSegmentsResponse>("/risk-segments", { params: query }).then((res) => res.data),
}
