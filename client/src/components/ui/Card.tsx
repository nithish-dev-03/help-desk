import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden flex flex-col',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-3.5 border-b border-outline-variant bg-surface-container-low/40 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low/20">
          {footer}
        </div>
      )}
    </div>
  );
};
