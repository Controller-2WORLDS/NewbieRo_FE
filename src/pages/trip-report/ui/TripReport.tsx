import { useNavigate } from "react-router-dom"
import { ScreenHeader } from "@widgets/screen-header"
import { Card, StatCard, Button } from "@shared/ui"
import { formatDateTime } from "@shared/lib/date"
import { riskLevel } from "@shared/lib/risk"
import { RiskBadge, MiniMap } from "@entities/route"
import { tripReport } from "@mocks/safero"

export function TripReport() {
    const navigate = useNavigate()

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ScreenHeader title="운행 리포트" onBack={() => navigate("/")} />

            <main className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pb-8 pt-6">
                <p className="text-[13px] text-ink-2">{formatDateTime(tripReport.driven_at)}</p>
                <h2 className="mt-2 text-[27px] font-bold leading-tight tracking-[-0.03em] text-ink">
                    주행이 끝났어요
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-2.5">
                    <StatCard label="지나온 위험구간" value={tripReport.risk_segments_passed} unit="곳" />

                    <StatCard
                        label="주행 위험도"
                        value={<RiskBadge level={riskLevel(tripReport.total_risk_score)} size="md" />}
                    />
                </div>

                <section className="mt-9">
                    <h3 className="text-[18px] font-semibold tracking-tight text-ink">지나온 경로</h3>
                    <div className="mt-3">
                        <MiniMap
                            level={riskLevel(tripReport.total_risk_score)}
                            count={tripReport.risk_segments_passed}
                        />
                    </div>
                </section>

                <section className="mt-9">
                    <h3 className="text-[18px] font-semibold tracking-tight text-ink">개선 팁</h3>
                    <Card className="mt-3" accent>
                        <p className="text-[15px] leading-relaxed text-ink">{tripReport.tips}</p>
                    </Card>
                </section>
            </main>

            <div className="relative z-20 shrink-0 border-t border-line-soft bg-grad-sheen px-5 pb-6 pt-4 shadow-tabbar backdrop-blur-xl">
                <Button size="lg" fullWidth onClick={() => navigate("/")}>
                    홈으로
                </Button>
            </div>
        </div>
    )
}
