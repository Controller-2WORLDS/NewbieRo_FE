import React from "react"
import { useNavigate } from "react-router-dom"
import { NavigationIcon } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { SegmentedControl } from "../components/ui/SegmentedControl"
import type { DriverType } from "../types/newbiero"

const modes = ["로그인", "회원가입"] as const
type Mode = (typeof modes)[number]

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

export function Login() {
    const navigate = useNavigate()
    const [mode, setMode] = React.useState<Mode>("로그인")
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [birthDate, setBirthDate] = React.useState("")
    const [licenseIssueDate, setLicenseIssueDate] = React.useState("")
    const [driverType, setDriverType] = React.useState<DriverType>("일반")
    const [touched, setTouched] = React.useState(false)

    const emailError = touched && email.length > 0 && !email.includes("@") ? "이메일 형식을 확인해 주세요" : undefined

    const submit = () => {
        setTouched(true)
        if (!email.includes("@")) return
        navigate("/")
    }

    return (
        <main className="flex h-full min-h-0 flex-col overflow-y-auto no-scrollbar px-5 pb-8">
            <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center border-b border-line-soft bg-grad-header px-5 shadow-card backdrop-blur-xl">
                <span className="flex items-center gap-2">
                    <NavigationIcon className="h-4.5 w-4.5 text-navy" strokeWidth={2.2} aria-hidden="true" />

                    <span className="text-[17px] font-bold tracking-tight text-ink">뉴비로</span>
                </span>
            </header>

            <h1 className="mt-6 text-[26px] font-bold leading-tight tracking-tight text-ink">
                {mode === "로그인" ? "다시 만나서 반가워요" : "안전 운전을 시작해요"}
            </h1>

            <div className="mt-6">
                <SegmentedControl label="인증 방식" size="sm" options={modes} value={mode} onChange={setMode} />
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    label="이메일"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={emailError}
                    placeholder="name@example.com"
                    autoComplete="email"
                />

                {mode === "회원가입" ? (
                    <>
                        <Input
                            label="이름"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="이름을 입력하세요"
                            autoComplete="name"
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

                        <div className="mt-1">
                            <p className="mb-2 text-[13px] font-medium text-ink-2">운전자 유형</p>
                            <SegmentedControl
                                label="운전자 유형"
                                options={driverTypes}
                                value={driverType}
                                onChange={setDriverType}
                            />
                        </div>
                    </>
                ) : null}
            </div>

            <Button size="lg" fullWidth className="mt-8" onClick={submit}>
                {mode}
            </Button>
        </main>
    )
}
