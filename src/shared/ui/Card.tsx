import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
  /** 카드 우상단에 은은한 원형 포인트를 더해 귀여운 느낌을 준다. 남발하지 말고 화면당 한두 곳만. */
  accent?: boolean;
}

export function Card({ children, className = '', as = 'div', accent = false }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={[
      'rounded-card border border-line-soft bg-grad-surface p-4.5 shadow-card-inset',
      accent ? 'relative overflow-hidden' : '',
      className].
      join(' ')}>

      {accent ?
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-20 w-20 rounded-full bg-grad-navy-soft" /> :
      null}
      {accent ? <div className="relative">{children}</div> : children}
    </Tag>);

}