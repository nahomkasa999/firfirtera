import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card text-card-foreground rounded-lg p-3 ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

