import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { RiskBadge } from '../components/ui/RiskBadge';
import { TrendChart } from '../components/charts/TrendChart';
import { RouteHistoryItem } from '../components/RouteHistoryItem';
import { profile, routeHistory, userStats } from '../data/safero';
import { riskLevel } from '../utils/safero';
import { useTheme } from '../contexts/ThemeContext';

export function MyPage() {
  const navigate = useNavigate();
  const { mode, toggle } = useTheme();
  const isSenior = profile.driver_type === '고령';

  return (
    <main className="h-full overflow-y-auto no-scrollbar pb-10">
      <header className="sticky top-0 z-20 -mx-0 flex h-14 items-center border-b border-line-soft bg-grad-header px-5 shadow-card backdrop-blur-xl">
        <h1 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
          마이페이지
        </h1>
      </header>
      <div className="px-5">

      <Card className="mt-3">
        <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            
          <span
              className={[
              'flex shrink-0 items-center justify-center rounded-full bg-grad-navy font-bold text-on-navy shadow-navy-inset',
              isSenior ? 'h-14 w-14 text-[20px]' : 'h-12 w-12 text-[17px]'].
              join(' ')}>
              
            {profile.name.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span
                className={[
                'block tracking-tight text-ink',
                isSenior ?
                'text-[23px] font-bold' :
                'text-[18px] font-semibold'].
                join(' ')}>
                
              {profile.name}
            </span>
            <span
                className={[
                'mt-0.5 block text-ink-2',
                isSenior ? 'text-[16px] font-semibold' : 'text-[13px]'].
                join(' ')}>
                
              {profile.driver_type} 운전자
            </span>
          </span>
          <ChevronRightIcon
              className="h-[18px] w-[18px] text-ink-3"
              strokeWidth={2}
              aria-hidden="true" />
            
        </button>
      </Card>

      <div className="mt-7 grid grid-cols-3 gap-2.5">
        <StatCard label="총 주행" value={userStats.total_trips} unit="회" />
        <StatCard
            label="누적 위험구간"
            value={userStats.total_risk_segments_passed}
            unit="곳" />
          
        <StatCard
            label="평균 위험도"
            value={<RiskBadge level={riskLevel(userStats.avg_risk_score)} />} />
          
      </div>

      <section className="mt-9">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          평균 위험도 추이
        </h2>
        <Card className="mt-3">
          <TrendChart trend={userStats.trend} />
        </Card>
      </section>

      <section className="mt-9">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          경로 이력
        </h2>
        <ul className="mt-1 divide-y divide-line">
          {routeHistory.map((query) =>
            <RouteHistoryItem key={query.requested_at} query={query} />
            )}
        </ul>
      </section>

      <div className="mt-9 border-t border-line pt-3">
        <button
            type="button"
            onClick={toggle}
            aria-pressed={mode === 'dark'}
            className="flex w-full items-center gap-3 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            
          {mode === 'dark' ?
            <MoonIcon className="h-[18px] w-[18px] text-ink-2" strokeWidth={2} /> :

            <SunIcon className="h-[18px] w-[18px] text-ink-2" strokeWidth={2} />
            }
          <span className="flex-1 text-[15px] font-medium text-ink">
            다크 모드
          </span>
          <span
              className={[
              'relative h-[26px] w-[46px] rounded-full transition-colors duration-200 ease-out',
              mode === 'dark' ?
              'bg-grad-navy shadow-navy' :
              'bg-surface-2 border border-line-soft shadow-[inset_0_1px_3px_rgba(23,43,77,0.05)]'].
              join(' ')}
              aria-hidden="true">
              
            <span
                className={[
                'absolute top-1/2 h-[20px] w-[20px] -translate-y-1/2 rounded-full bg-white shadow-card',
                'transition-[left] duration-200 ease-out',
                mode === 'dark' ? 'left-[23px]' : 'left-[3px]'].
                join(' ')} />
              
          </span>
        </button>
        </div>
      </div>
    </main>);

}