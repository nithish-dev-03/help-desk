import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: {
    current: number;
    max?: number;
    min?: number;
  };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, charCount, id, required, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1">
        {(label || charCount) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={textareaId}
                className="text-xs font-medium text-on-surface"
              >
                {label} {required && <span className="text-error">*</span>}
              </label>
            )}
            {charCount && (
              <span className="font-mono text-[11px] text-on-surface-variant ml-auto">
                {charCount.current}
                {charCount.min ? ` / ${charCount.min} min` : ''}
                {charCount.max ? ` / ${charCount.max} max` : ''}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          className={cn(
            'w-full bg-surface-container-lowest border rounded p-3 text-sm text-on-surface placeholder:text-outline-variant/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-surface-container-low disabled:text-outline disabled:cursor-not-allowed',
            error ? 'border-error focus:ring-error focus:border-error' : 'border-outline-variant',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-error font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-on-surface-variant">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
