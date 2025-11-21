import { ReactNode, ButtonHTMLAttributes } from 'react';

interface SurfaceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export function SurfaceButton({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: SurfaceButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
    secondary: 'bg-card text-card-foreground border border-border/50',
    outline: 'bg-transparent border-2 border-primary text-primary',
    danger: 'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20',
  };

  return (
    <button
      className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 text-base font-bold leading-normal tracking-[0.015em] gap-2 ${variantStyles[variant]
        } ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

