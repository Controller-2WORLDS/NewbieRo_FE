import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "./usersApi"
import type { LoginRequest, SignupRequest, UpdateMeRequest } from "./types"

export const userQueryKeys = {
    me: ["users", "me"] as const,
}

export function useSignup() {
    return useMutation({
        mutationFn: (payload: SignupRequest) => usersApi.signup(payload),
    })
}

export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginRequest) => usersApi.login(payload),
    })
}

export function useMe(enabled = true) {
    return useQuery({
        queryKey: userQueryKeys.me,
        queryFn: usersApi.getMe,
        enabled,
    })
}

export function useUpdateMe() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: UpdateMeRequest) => usersApi.updateMe(payload),
        onSuccess: (data) => {
            queryClient.setQueryData(userQueryKeys.me, (previous: unknown) =>
                previous ? { ...previous, ...data } : previous
            )
        },
    })
}
