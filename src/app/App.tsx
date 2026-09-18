import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"
import { TabLayout } from "./components/TabLayout"
import { Home } from "./pages/Home"
import { MyPage } from "./pages/MyPage"
import { RouteResults } from "./pages/RouteResults"
import { RouteDetail } from "./pages/RouteDetail"
import { DriveMode } from "./pages/DriveMode"
import { TripReport } from "./pages/TripReport"
import { PlaceSearch } from "./pages/PlaceSearch"
import { Login } from "./pages/Login"
import { ProfileEdit } from "./pages/ProfileEdit"

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
