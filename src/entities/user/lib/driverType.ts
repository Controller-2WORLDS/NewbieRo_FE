import type { DriverType } from "../model/types"
import type { ApiDriverType } from "../api/types"

const KOREAN_TO_API: Record<DriverType, ApiDriverType> = {
    초보: "NOVICE",
    고령: "ELDERLY",
    일반: "GENERAL",
}

const API_TO_KOREAN: Record<ApiDriverType, DriverType> = {
    NOVICE: "초보",
    ELDERLY: "고령",
    GENERAL: "일반",
}

export function toApiDriverType(driverType: DriverType): ApiDriverType {
    return KOREAN_TO_API[driverType]
}

export function fromApiDriverType(driverType: ApiDriverType): DriverType {
    return API_TO_KOREAN[driverType]
}
