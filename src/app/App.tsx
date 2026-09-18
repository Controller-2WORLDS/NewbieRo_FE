import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider, useTheme } from "./providers/ThemeProvider"
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
        <ThemeProvider initialMode={theme}>
            <AppShell />
        </ThemeProvider>
    )
}

function AppShell() {
    const { mode } = useTheme()

    return (
        <div className={mode === "dark" ? "dark" : undefined}>
            <div className="flex min-h-screen w-full justify-center bg-canvas">
                <div className="relative flex h-screen max-h-screen w-full max-w-120 flex-col overflow-hidden bg-canvas">
                    <BrowserRouter>
                        <Routes>
                            <Route element={<TabLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/mypage" element={<MyPage />} />
                            </Route>
                            <Route path="/search" element={<PlaceSearch />} />
                            <Route path="/routes" element={<RouteResults />} />
                            <Route path="/routes/detail" element={<RouteDetail />} />
                            <Route path="/drive" element={<DriveMode />} />
                            <Route path="/report" element={<TripReport />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<ProfileEdit />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    )
}
