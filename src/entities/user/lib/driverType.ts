import type { DriverType } from "../model/types"

const DRIVER_TYPE_STORAGE_KEY = "newbiero:driver-type"

export function readStoredDriverType(): DriverType | null {
    try {
        const stored = window.localStorage.getItem(DRIVER_TYPE_STORAGE_KEY)
        return stored === "초보" || stored === "고령" || stored === "일반" ? stored : null
    } catch {
        return null
    }
}

export function storeDriverType(driverType: DriverType): void {
    try {
        window.localStorage.setItem(DRIVER_TYPE_STORAGE_KEY, driverType)
    } catch {
        // localStorage unavailable
    }
}
