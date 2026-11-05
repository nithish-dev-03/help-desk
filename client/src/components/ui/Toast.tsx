import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
}

const variants = {
  info: {
    container: 'bg-inverse-surface text-inverse-on-surface border-white/10',
    icon: 'text-primary-fixed-dim',
  },
  success: {
    container: 'bg-primary text-on-primary border-white/10',
    icon: 'text-primary-fixed-dim',
  },
  warning: {
    container: 'bg-[#A66A22] text-white border-white/10',
    icon: 'text-white',
  },
  error: {
    container: 'bg-error text-on-error border-white/10',
    icon: 'text-white',
  },
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  onClose,
  className,
}) => {
  const config = variants[variant];
  const Icon = icons[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'toast-enter flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs font-medium shadow-lg',
        config.container,
        className
      )}
    >
      <Icon className={cn('w-4 h-4 shrink-0', config.icon)} />
      <span className="flex-1 leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-0.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
