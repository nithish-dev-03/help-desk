import React from 'react';
import { TicketPriority } from '@/types/tickets';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
  showIcon = true,
}) => {
  const configs: Record<
    TicketPriority,
    { label: string; text: string; bg: string; icon: React.ReactNode }
  > = {
    low: {
      label: 'Low',
      text: 'text-on-surface-variant',
      bg: 'bg-surface-container-low border border-outline-variant/50',
      icon: <ArrowDown className="w-3 h-3 text-on-surface-variant" />,
    },
    medium: {
      label: 'Medium',
      text: 'text-primary',
      bg: 'bg-secondary-container/60 border border-primary/20',
      icon: <Minus className="w-3 h-3 text-primary" />,
    },
    high: {
      label: 'High',
      text: 'text-tertiary-container font-semibold',
      bg: 'bg-tertiary-fixed/30 border border-tertiary-container/30',
      icon: <ArrowUp className="w-3 h-3 text-tertiary-container" />,
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium uppercase select-none',
        config.bg,
        config.text,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
