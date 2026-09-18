import { apiClient } from "@shared/api/client"
import type {
    CreateRouteRequest,
    CreateRouteResponse,
    RouteDetailResponse,
    RouteHistoryQuery,
    RouteHistoryResponse,
    SelectRouteOptionResponse,
} from "./types"

export const routesApi = {
    create: (payload: CreateRouteRequest) =>
        apiClient.post<CreateRouteResponse>("/routes", payload).then((res) => res.data),

    findOne: (routeId: string) =>
        apiClient.get<RouteDetailResponse>(`/routes/${routeId}`).then((res) => res.data),

    history: (query: RouteHistoryQuery) =>
        apiClient.get<RouteHistoryResponse>("/routes/history", { params: query }).then((res) => res.data),

    selectOption: (routeId: string, optionId: string) =>
        apiClient
            .post<SelectRouteOptionResponse>(`/routes/${routeId}/select`, { option_id: optionId })
            .then((res) => res.data),
}
