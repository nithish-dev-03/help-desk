import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-10 flex flex-col items-center justify-center text-center rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-3">
        {icon || <Inbox className="w-6 h-6 text-primary" />}
      </div>
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};
