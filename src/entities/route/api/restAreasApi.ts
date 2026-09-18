import { apiClient } from "@shared/api/client"
import type {
    ListRestAreasQuery,
    ListRestAreasResponse,
    RestAreaCongestionQuery,
    RestAreaCongestionResponse,
} from "./types"

export const restAreasApi = {
    list: (query: ListRestAreasQuery) =>
        apiClient.get<ListRestAreasResponse>("/rest-areas", { params: query }).then((res) => res.data),

    congestion: (restAreaId: string, query: RestAreaCongestionQuery = {}) =>
        apiClient
            .get<RestAreaCongestionResponse>(`/rest-areas/${restAreaId}/congestion`, { params: query })
            .then((res) => res.data),
}
