import React from "react"
import { clearToken, getToken, setToken, subscribeToken } from "@shared/api/token"

interface AuthContextValue {
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = React.useState<string | null>(() => getToken())

    React.useEffect(() => subscribeToken(setTokenState), [])

    const value = React.useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: token !== null,
            login: setToken,
            logout: clearToken,
        }),
        [token]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = React.useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}
