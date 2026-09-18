import React from "react"
import { useNavigate } from "react-router-dom"
import { ScreenHeader } from "@widgets/screen-header"
import { Button, Input, SegmentedControl } from "@shared/ui"
import { profile } from "@mocks/safero"
import { readStoredDriverType, storeDriverType, type DriverType } from "@entities/user"

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

export function ProfileEdit() {
    const navigate = useNavigate()
    const [name, setName] = React.useState(profile.name)
    const [email, setEmail] = React.useState(profile.email)
    const [birthDate, setBirthDate] = React.useState(profile.birth_date)
    const [licenseIssueDate, setLicenseIssueDate] = React.useState(profile.license_issue_date)
    const [driverType, setDriverType] = React.useState<DriverType>(() => readStoredDriverType() ?? profile.driver_type)

    const nameError = name.trim().length === 0 ? "이름을 입력해 주세요" : undefined

    const save = () => {
        profile.driver_type = driverType
        storeDriverType(driverType)
        navigate("/mypage")
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
                    />

                    <Input
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <Input
                        label="생년월일"
                        type="date"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                    />

                    <Input
                        label="면허 취득일"
                        type="date"
                        value={licenseIssueDate}
                        onChange={(event) => setLicenseIssueDate(event.target.value)}
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

                <div className="mt-10 border-t border-line pt-3">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="py-3 text-[15px] font-semibold text-danger transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                    >
                        로그아웃
                    </button>
                </div>
            </main>

            <div className="relative z-20 shrink-0 border-t border-line-soft bg-grad-sheen px-5 pb-6 pt-4 shadow-tabbar backdrop-blur-xl">
                <Button size="lg" fullWidth disabled={Boolean(nameError)} onClick={save}>
                    저장
                </Button>
            </div>
        </div>
    )
}
