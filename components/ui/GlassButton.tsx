import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: GlassButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    danger: 'bg-destructive text-destructive-foreground',
  };

  return (
    <button
      className={`${variantStyles[variant]} rounded px-3 py-2 text-sm font-semibold ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

