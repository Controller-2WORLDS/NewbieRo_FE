import React from "react"
import { useNavigate } from "react-router-dom"
import { ScreenHeader } from "@widgets/screen-header"
import { Button, Input, SegmentedControl } from "@shared/ui"
import { fromApiDriverType, toApiDriverType, useMe, useUpdateMe, type DriverType } from "@entities/user"
import { useAuth } from "@app/providers/AuthProvider"

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

export function ProfileEdit() {
    const navigate = useNavigate()
    const auth = useAuth()
    const { data: me } = useMe()
    const updateMe = useUpdateMe()

    const [name, setName] = React.useState("")
    const [driverType, setDriverType] = React.useState<DriverType>("일반")
    const [syncedUserId, setSyncedUserId] = React.useState<string | null>(null)

    if (me && me.user_id !== syncedUserId) {
        setSyncedUserId(me.user_id)
        setName(me.name)
        setDriverType(fromApiDriverType(me.driver_type))
    }

    const nameError = name.trim().length === 0 ? "이름을 입력해 주세요" : undefined

    const save = async () => {
        if (nameError) return
        await updateMe.mutateAsync({ name, driver_type: toApiDriverType(driverType) })
        navigate("/mypage")
    }

    const logout = () => {
        auth.logout()
        navigate("/login")
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ScreenHeader title="프로필 수정" />

            <main className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pb-8 pt-6">
                <div className="flex flex-col gap-3">
                    <Input
                        label="이름"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        error={nameError}
                        disabled={updateMe.isPending}
                    />

                    <Input
                        label="면허 취득일"
                        type="date"
                        value={me?.license_issue_date.slice(0, 10) ?? ""}
                        disabled
                        hint="면허 취득일은 앱에서 수정할 수 없어요"
                    />
                </div>

                <div className="mt-6">
                    <p className="mb-2 text-[13px] font-medium text-ink-2">운전자 유형</p>
                    <SegmentedControl
                        label="운전자 유형"
                        options={driverTypes}
                        value={driverType}
                        onChange={setDriverType}
                    />
                </div>

                {updateMe.isError ? (
                    <p role="alert" className="mt-4 rounded-btn border border-danger/30 bg-danger-tint px-3.5 py-2.5 text-[13px] font-medium text-danger">
                        저장에 실패했어요. 잠시 후 다시 시도해 주세요.
                    </p>
                ) : null}

                <div className="mt-10 border-t border-line pt-3">
                    <button
                        type="button"
                        onClick={logout}
                        className="py-3 text-[15px] font-semibold text-danger transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                    >
                        로그아웃
                    </button>
                </div>
            </main>

            <div className="relative z-20 shrink-0 border-t border-line-soft bg-grad-sheen px-5 pb-6 pt-4 shadow-tabbar backdrop-blur-xl">
                <Button size="lg" fullWidth disabled={Boolean(nameError) || updateMe.isPending} onClick={save}>
                    {updateMe.isPending ? "저장 중..." : "저장"}
                </Button>
            </div>
        </div>
    )
}
