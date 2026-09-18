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
    const [submitting, setSubmitting] = React.useState(false)
    const [apiError, setApiError] = React.useState<string | null>(null)

    const isSignup = mode === "회원가입"

    const emailError = !touched
        ? undefined
        : email.trim().length === 0
          ? "이메일을 입력해 주세요"
          : !email.includes("@")
            ? "이메일 형식을 확인해 주세요"
            : undefined
    const nameError = touched && isSignup && name.trim().length === 0 ? "이름을 입력해 주세요" : undefined
    const birthDateError = touched && isSignup && birthDate.length === 0 ? "생년월일을 입력해 주세요" : undefined
    const licenseIssueDateError =
        touched && isSignup && licenseIssueDate.length === 0 ? "면허 취득일을 입력해 주세요" : undefined

    const isValid =
        email.trim().length > 0 &&
        email.includes("@") &&
        (!isSignup || (name.trim().length > 0 && birthDate.length > 0 && licenseIssueDate.length > 0))

    const submit = async () => {
        setTouched(true)
        setApiError(null)
        if (!isValid) return

        setSubmitting(true)
        try {
            // navigate 자체는 실패하지 않지만, 실제 API 연동 후에는 이 지점에서 에러가 날 수 있다.
            navigate("/")
        } catch {
            setApiError(isSignup ? "회원가입에 실패했어요. 잠시 후 다시 시도해 주세요." : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="flex h-full min-h-0 flex-col overflow-y-auto no-scrollbar px-5 pb-8">
            <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center border-b border-line-soft bg-grad-header px-5 shadow-card backdrop-blur-xl">
                <span className="flex items-center gap-2">
                    <NavigationIcon className="h-4.5 w-4.5 text-navy" strokeWidth={2.2} aria-hidden="true" />

                    <span className="text-[17px] font-bold tracking-tight text-ink">뉴비로</span>
                </span>
            </header>

            <div className="relative -mx-5 overflow-hidden px-5 pb-3 pt-6">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-grad-navy-soft blur-xl"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-3 top-3 h-14 w-14 rounded-full bg-grad-navy-soft opacity-70"
                />
                <h1 className="relative text-[26px] font-bold leading-tight tracking-tight text-ink">
                    {isSignup ? "안전 운전을 시작해요" : "다시 만나서 반가워요"}
                </h1>
            </div>

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
                    disabled={submitting}
                />

                {isSignup ? (
                    <>
                        <Input
                            label="이름"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            error={nameError}
                            placeholder="이름을 입력하세요"
                            autoComplete="name"
                            disabled={submitting}
                        />

                        <Input
                            label="생년월일"
                            type="date"
                            value={birthDate}
                            onChange={(event) => setBirthDate(event.target.value)}
                            error={birthDateError}
                            disabled={submitting}
                        />

                        <Input
                            label="면허 취득일"
                            type="date"
                            value={licenseIssueDate}
                            onChange={(event) => setLicenseIssueDate(event.target.value)}
                            error={licenseIssueDateError}
                            disabled={submitting}
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

            {apiError ? (
                <p role="alert" className="mt-4 rounded-btn border border-danger/30 bg-danger-tint px-3.5 py-2.5 text-[13px] font-medium text-danger">
                    {apiError}
                </p>
            ) : null}

            <Button size="lg" fullWidth className="mt-8" disabled={submitting} onClick={submit}>
                {submitting ? "처리 중..." : mode}
            </Button>
        </main>
    )
}
