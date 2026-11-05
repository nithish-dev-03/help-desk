import React from 'react';
import { TicketStatus } from '@/types/tickets';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const configs: Record<
    TicketStatus,
    { label: string; bg: string; text: string; dotBg: string; animateDot?: boolean }
  > = {
    open: {
      label: 'OPEN',
      bg: 'bg-surface-container-low border border-outline-variant/60',
      text: 'text-on-surface',
      dotBg: 'bg-outline',
      animateDot: false,
    },
    in_progress: {
      label: 'IN PROGRESS',
      bg: 'bg-secondary-container border border-primary/20',
      text: 'text-primary font-semibold',
      dotBg: 'bg-primary',
      animateDot: true,
    },
    pending: {
      label: 'PENDING',
      bg: 'bg-[#FAF3E8] border border-[#A66A22]/20',
      text: 'text-[#A66A22] font-semibold',
      dotBg: 'bg-[#A66A22]',
      animateDot: false,
    },
    resolved: {
      label: 'RESOLVED',
      bg: 'bg-[#EAF2EC] border border-[#2F7652]/20',
      text: 'text-[#2F7652] font-semibold',
      dotBg: 'bg-[#2F7652]',
      animateDot: false,
    },
    closed: {
      label: 'CLOSED',
      bg: 'bg-surface-container-high border border-outline-variant/60',
      text: 'text-on-surface-variant font-medium',
      dotBg: 'bg-outline',
      animateDot: false,
    },
  };

  const config = configs[status] || configs.open;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase select-none',
        config.bg,
        config.text,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            config.dotBg,
            config.animateDot && 'animate-pulse'
          )}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
