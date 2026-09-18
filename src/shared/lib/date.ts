export function formatDateTime(iso: string): string {
    const date = new Date(iso)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = `${date.getHours()}`.padStart(2, "0")
    const minutes = `${date.getMinutes()}`.padStart(2, "0")
    return `${month}월 ${day}일 ${hours}:${minutes}`
}

export function formatShortDate(iso: string): string {
    const date = new Date(iso)
    return `${date.getMonth() + 1}/${date.getDate()}`
}
