import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      required,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-on-surface flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-error">*</span>}
            </span>
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-on-surface-variant">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            className={cn(
              'w-full bg-surface-container-lowest border rounded text-sm text-on-surface placeholder:text-outline-variant/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-surface-container-low disabled:text-outline disabled:cursor-not-allowed',
              leftElement ? 'pl-9' : 'pl-3',
              rightElement ? 'pr-9' : 'pr-3',
              'py-2',
              error ? 'border-error focus:ring-error focus:border-error' : 'border-outline-variant',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-on-surface-variant">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-error font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-on-surface-variant">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
