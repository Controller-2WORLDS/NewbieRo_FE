import axios from "axios"
import { clearToken, getToken } from "./token"

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            clearToken()
        }
        return Promise.reject(error)
    }
)

export interface ApiErrorBody {
    message?: string | string[]
    statusCode?: number
}

/** NestJS 에러 응답에서 사용자에게 보여줄 메시지를 뽑아낸다. */
export function extractApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        const message = error.response?.data?.message
        if (Array.isArray(message)) return message[0] ?? fallback
        if (typeof message === "string") return message
    }
    return fallback
}
