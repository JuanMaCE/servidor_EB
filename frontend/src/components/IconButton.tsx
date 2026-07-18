import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'edit' | 'danger';
  children: ReactNode;
}

export function IconButton({ label, tone = 'edit', children, ...props }: IconButtonProps) {
  return (
    <button type="button" className={`icon-button icon-button-${tone}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
