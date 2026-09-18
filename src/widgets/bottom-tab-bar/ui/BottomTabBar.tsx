import { NavLink } from "react-router-dom"
import { HomeIcon, UserIcon } from "lucide-react"

const tabs = [
    { to: "/", label: "홈", Icon: HomeIcon },
    { to: "/mypage", label: "마이페이지", Icon: UserIcon },
]

export function BottomTabBar() {
    return (
        <nav
            aria-label="주요 메뉴"
            className="relative z-30 rounded-t-[22px] border-t border-line-soft bg-grad-sheen px-6 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 shadow-tabbar backdrop-blur-xl"
        >
            <ul className="flex items-stretch gap-2">
                {tabs.map(({ to, label, Icon }) => (
                    <li key={to} className="flex-1">
                        <NavLink
                            to={to}
                            end
                            className={({ isActive }) =>
                                [
                                    "group relative flex flex-col items-center justify-center gap-1.5 rounded-full px-5 py-2.5",
                                    "transition-colors duration-200 ease-out",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy",
                                    isActive ? "text-navy" : "text-ink-3",
                                ].join(" ")
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 rounded-full bg-grad-navy-pill"
                                        />
                                    ) : null}
                                    <Icon className="relative h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.9} />

                                    <span className="relative text-[12px] font-semibold leading-none">{label}</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
