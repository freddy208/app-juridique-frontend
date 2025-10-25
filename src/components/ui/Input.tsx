// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}

        {/* Input Container avec icon optionnel */}
        <div className="relative">
          {/* Icon à gauche */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          
          {/* Input */}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
              // Styles conditionnels pour l'erreur
              error 
                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-500' 
                : 'border-gray-200 dark:border-gray-800',
              // Padding si icon présent
              icon && 'pl-10',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>

        {/* Message d'erreur */}
        {error && (
          <p 
            id={`${props.id}-error`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {/* Texte d'aide */}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };