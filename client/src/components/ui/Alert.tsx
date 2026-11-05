import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  onDismiss,
}) => {
  const configs = {
    info: {
      bg: 'bg-surface-container-high border-outline-variant',
      text: 'text-on-surface',
      icon: <Info className="w-4 h-4 text-primary shrink-0" />,
    },
    success: {
      bg: 'bg-secondary-container/70 border-primary/20',
      text: 'text-primary',
      icon: <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />,
    },
    warning: {
      bg: 'bg-[#FAF3E8] border-[#A66A22]/20',
      text: 'text-[#A66A22]',
      icon: <AlertTriangle className="w-4 h-4 text-[#A66A22] shrink-0" />,
    },
    error: {
      bg: 'bg-error-container/70 border-error/20',
      text: 'text-on-error-container',
      icon: <AlertCircle className="w-4 h-4 text-error shrink-0" />,
    },
  };

  const config = configs[variant];

  return (
    <div
      role="alert"
      className={cn(
        'p-3.5 rounded-lg border flex items-start gap-3 transition-colors',
        config.bg,
        config.text,
        className
      )}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 text-xs">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="leading-relaxed opacity-95">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current opacity-70 hover:opacity-100 p-0.5"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
