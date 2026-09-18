import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Input, SegmentedControl } from "@shared/ui"
import { extractApiErrorMessage } from "@shared/api/client"
import { useAuth } from "@app/providers/AuthProvider"
import { toApiDriverType, useLogin, useSignup, type DriverType } from "@entities/user"

const modes = ["로그인", "회원가입"] as const
type Mode = (typeof modes)[number]

const driverTypes: readonly DriverType[] = ["초보", "고령", "일반"]

const MIN_PASSWORD_LENGTH = 8

interface LocationState {
    from?: { pathname: string }
}

interface LoginFormState {
    email: string
    password: string
}

const initialLoginForm: LoginFormState = { email: "", password: "" }

interface SignupFormState {
    name: string
    email: string
    password: string
    birthDate: string
    licenseIssueDate: string
    driverType: DriverType
}

const initialSignupForm: SignupFormState = {
    name: "",
    email: "",
    password: "",
    birthDate: "",
    licenseIssueDate: "",
    driverType: "일반",
}

export function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()
    const login = useLogin()
    const signup = useSignup()

    const [mode, setMode] = React.useState<Mode>("로그인")

    const [loginForm, setLoginForm] = React.useState<LoginFormState>(initialLoginForm)
    const [signupForm, setSignupForm] = React.useState<SignupFormState>(initialSignupForm)
    const [loginTouched, setLoginTouched] = React.useState(false)
    const [signupTouched, setSignupTouched] = React.useState(false)
    const [apiError, setApiError] = React.useState<string | null>(null)

    const isSignup = mode === "회원가입"
    const submitting = login.isPending || signup.isPending
    const touched = isSignup ? signupTouched : loginTouched
    const setTouched = isSignup ? setSignupTouched : setLoginTouched

    const email = isSignup ? signupForm.email : loginForm.email
    const password = isSignup ? signupForm.password : loginForm.password
    const setEmail = (value: string) =>
        isSignup
            ? setSignupForm((prev) => ({ ...prev, email: value }))
            : setLoginForm((prev) => ({ ...prev, email: value }))
    const setPassword = (value: string) =>
        isSignup
            ? setSignupForm((prev) => ({ ...prev, password: value }))
            : setLoginForm((prev) => ({ ...prev, password: value }))

    const handleModeChange = (next: Mode) => {
        setMode(next)
        setApiError(null)
    }

    const emailError = !touched
        ? undefined
        : email.trim().length === 0
          ? "이메일을 입력해 주세요"
          : !email.includes("@")
            ? "이메일 형식을 확인해 주세요"
            : undefined
    const passwordError = !touched
        ? undefined
        : password.length === 0
          ? "비밀번호를 입력해 주세요"
          : isSignup && password.length < MIN_PASSWORD_LENGTH
            ? `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 해요`
            : undefined
    const nameError =
        signupTouched && isSignup && signupForm.name.trim().length === 0 ? "이름을 입력해 주세요" : undefined
    const birthDateError =
        signupTouched && isSignup && signupForm.birthDate.length === 0 ? "생년월일을 입력해 주세요" : undefined
    const licenseIssueDateError =
        signupTouched && isSignup && signupForm.licenseIssueDate.length === 0
            ? "면허 취득일을 입력해 주세요"
            : undefined

    const isValid =
        email.trim().length > 0 &&
        email.includes("@") &&
        password.length > 0 &&
        (!isSignup ||
            (password.length >= MIN_PASSWORD_LENGTH &&
                signupForm.name.trim().length > 0 &&
                signupForm.birthDate.length > 0 &&
                signupForm.licenseIssueDate.length > 0))

    const submit = async () => {
        setTouched(true)
        setApiError(null)
        if (!isValid) return

        try {
            if (isSignup) {
                await signup.mutateAsync({
                    name: signupForm.name,
                    email: signupForm.email,
                    password: signupForm.password,
                    birth_date: signupForm.birthDate,
                    driver_type: toApiDriverType(signupForm.driverType),
                    license_issue_date: signupForm.licenseIssueDate,
                })

                const { access_token } = await login.mutateAsync({
                    email: signupForm.email,
                    password: signupForm.password,
                })
                auth.login(access_token)
            } else {
                const { access_token } = await login.mutateAsync({
                    email: loginForm.email,
                    password: loginForm.password,
                })
                auth.login(access_token)
            }

            const state = location.state as LocationState | null
            navigate(state?.from?.pathname ?? "/", { replace: true })
        } catch (error) {
            setApiError(
                extractApiErrorMessage(
                    error,
                    isSignup
                        ? "회원가입에 실패했어요. 잠시 후 다시 시도해 주세요."
                        : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요."
                )
            )
        }
    }

    return (
        <main className="flex h-full min-h-0 flex-col overflow-y-auto no-scrollbar px-5 pb-8">
            <header className="sticky top-0 z-20 -mx-5 flex h-14 items-center border-b border-line-soft bg-grad-header px-5 shadow-card backdrop-blur-xl">
                <img src="/Logo.svg" alt="뉴비로" className="h-10 w-10 mt-3" />
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
                <SegmentedControl
                    label="인증 방식"
                    size="sm"
                    options={modes}
                    value={mode}
                    onChange={handleModeChange}
                />
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

                <Input
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={passwordError}
                    placeholder={isSignup ? `${MIN_PASSWORD_LENGTH}자 이상 입력하세요` : "비밀번호를 입력하세요"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    disabled={submitting}
                />

                {isSignup ? (
                    <>
                        <Input
                            label="이름"
                            value={signupForm.name}
                            onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
                            error={nameError}
                            placeholder="이름을 입력하세요"
                            autoComplete="name"
                            disabled={submitting}
                        />

                        <Input
                            label="생년월일"
                            type="date"
                            value={signupForm.birthDate}
                            onChange={(event) => setSignupForm((prev) => ({ ...prev, birthDate: event.target.value }))}
                            error={birthDateError}
                            disabled={submitting}
                        />

                        <Input
                            label="면허 취득일"
                            type="date"
                            value={signupForm.licenseIssueDate}
                            onChange={(event) =>
                                setSignupForm((prev) => ({ ...prev, licenseIssueDate: event.target.value }))
                            }
                            error={licenseIssueDateError}
                            disabled={submitting}
                        />

                        <div className="mt-1">
                            <p className="mb-2 text-[13px] font-medium text-ink-2">운전자 유형</p>
                            <SegmentedControl
                                label="운전자 유형"
                                options={driverTypes}
                                value={signupForm.driverType}
                                onChange={(value) => setSignupForm((prev) => ({ ...prev, driverType: value }))}
                            />
                        </div>
                    </>
                ) : null}
            </div>

            {apiError ? (
                <p
                    role="alert"
                    className="mt-4 rounded-btn border border-danger/30 bg-danger-tint px-3.5 py-2.5 text-[13px] font-medium text-danger"
                >
                    {apiError}
                </p>
            ) : null}

            <Button size="lg" fullWidth className="mt-8" disabled={submitting} onClick={submit}>
                {submitting ? "처리 중..." : mode}
            </Button>
        </main>
    )
}
