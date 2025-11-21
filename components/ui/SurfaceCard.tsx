import { ReactNode } from 'react';

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SurfaceCard({ children, className = '', onClick }: SurfaceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-card text-card-foreground p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

