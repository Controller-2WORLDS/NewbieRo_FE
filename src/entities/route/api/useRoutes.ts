import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { routesApi } from "./routesApi"
import type { CreateRouteRequest, RouteHistoryQuery } from "./types"

export const routeQueryKeys = {
    detail: (routeId: string) => ["routes", routeId] as const,
    history: (query: RouteHistoryQuery) => ["routes", "history", query] as const,
}

export function useCreateRoute() {
    return useMutation({
        mutationFn: (payload: CreateRouteRequest) => routesApi.create(payload),
    })
}

export function useRoute(routeId: string | undefined) {
    return useQuery({
        queryKey: routeQueryKeys.detail(routeId ?? ""),
        queryFn: () => routesApi.findOne(routeId as string),
        enabled: Boolean(routeId),
    })
}

export function useRouteHistory(query: RouteHistoryQuery = {}) {
    return useQuery({
        queryKey: routeQueryKeys.history(query),
        queryFn: () => routesApi.history(query),
    })
}

export function useSelectRouteOption(routeId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (optionId: string) => routesApi.selectOption(routeId, optionId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: routeQueryKeys.detail(routeId) }),
    })
}
