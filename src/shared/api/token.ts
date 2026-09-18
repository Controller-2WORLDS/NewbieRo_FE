const TOKEN_STORAGE_KEY = "newbiero:token"

let currentToken: string | null = readStoredToken()
const listeners = new Set<(token: string | null) => void>()

function readStoredToken(): string | null {
    try {
        return window.localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
        return null
    }
}

export function getToken(): string | null {
    return currentToken
}

export function setToken(token: string): void {
    currentToken = token
    try {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } catch {
        // localStorage unavailable
    }
    listeners.forEach((listener) => listener(currentToken))
}

export function clearToken(): void {
    currentToken = null
    try {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch {
        // localStorage unavailable
    }
    listeners.forEach((listener) => listener(currentToken))
}

/** 다른 탭이나 axios 401 인터셉터가 토큰을 바꿨을 때 React 상태를 동기화하기 위한 구독. */
export function subscribeToken(listener: (token: string | null) => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
}
