import type { ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { ThemeProvider, useTheme } from "./providers/ThemeProvider"
import { AuthProvider, useAuth } from "./providers/AuthProvider"
import { QueryProvider } from "./providers/QueryProvider"
import { TabLayout } from "@widgets/tab-layout"
import { Home } from "@pages/home"
import { MyPage } from "@pages/my-page"
import { RouteResults } from "@pages/route-results"
import { RouteDetail } from "@pages/route-detail"
import { DriveMode } from "@pages/drive-mode"
import { TripReport } from "@pages/trip-report"
import { PlaceSearch } from "@pages/place-search"
import { Login } from "@pages/login"
import { ProfileEdit } from "@pages/profile-edit"

interface AppProps {
    theme?: "light" | "dark"
}

export function App({ theme }: AppProps) {
    return (
        <QueryProvider>
            <AuthProvider>
                <ThemeProvider initialMode={theme}>
                    <AppShell />
                </ThemeProvider>
            </AuthProvider>
        </QueryProvider>
    )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

function AppShell() {
    const { mode } = useTheme()

    return (
        <div className={mode === "dark" ? "dark" : undefined}>
            <div className="flex min-h-screen w-full justify-center bg-canvas">
                <div className="relative flex h-screen max-h-screen w-full max-w-120 flex-col overflow-hidden bg-canvas">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route element={<ProtectedRoute><TabLayout /></ProtectedRoute>}>
                                <Route path="/" element={<Home />} />
                                <Route path="/mypage" element={<MyPage />} />
                            </Route>
                            <Route path="/search" element={<ProtectedRoute><PlaceSearch /></ProtectedRoute>} />
                            <Route path="/routes" element={<ProtectedRoute><RouteResults /></ProtectedRoute>} />
                            <Route path="/routes/detail" element={<ProtectedRoute><RouteDetail /></ProtectedRoute>} />
                            <Route path="/drive" element={<ProtectedRoute><DriveMode /></ProtectedRoute>} />
                            <Route path="/report" element={<ProtectedRoute><TripReport /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    )
}
