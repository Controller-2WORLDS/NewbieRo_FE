import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

export function Card({ children, className = '', as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={[
      'rounded-card border border-line-soft bg-grad-surface p-4.5 shadow-card-inset',
      className].
      join(' ')}>
      
      {children}
    </Tag>);

}