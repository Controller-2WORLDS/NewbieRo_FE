import { apiClient } from "@shared/api/client"
import type {
    LoginRequest,
    LoginResponse,
    MeResponse,
    SignupRequest,
    SignupResponse,
    UpdateMeRequest,
    UpdateMeResponse,
} from "./types"

export const usersApi = {
    signup: (payload: SignupRequest) =>
        apiClient.post<SignupResponse>("/users/signup", payload).then((res) => res.data),

    login: (payload: LoginRequest) =>
        apiClient.post<LoginResponse>("/users/login", payload).then((res) => res.data),

    getMe: () => apiClient.get<MeResponse>("/users/me").then((res) => res.data),

    updateMe: (payload: UpdateMeRequest) =>
        apiClient.patch<UpdateMeResponse>("/users/me", payload).then((res) => res.data),
}
