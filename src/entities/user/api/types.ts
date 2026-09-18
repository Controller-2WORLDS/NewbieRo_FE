/** 서버(Prisma) DriverType enum 코드. UI에는 한글 라벨(DriverType)을 쓰고 API 경계에서만 변환한다. */
export type ApiDriverType = "NOVICE" | "ELDERLY" | "GENERAL"

export interface SignupRequest {
    name: string
    email: string
    password: string
    birth_date: string
    driver_type: ApiDriverType
    license_issue_date: string
}

export interface SignupResponse {
    user_id: string
    created_at: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    user_id: string
}

export interface MeResponse {
    user_id: string
    name: string
    driver_type: ApiDriverType
    license_issue_date: string
}

export interface UpdateMeRequest {
    name?: string
    driver_type?: ApiDriverType
}

export interface UpdateMeResponse {
    user_id: string
    name: string
    driver_type: ApiDriverType
}
