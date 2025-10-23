import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputEnhancedProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  actionIcon?: React.ReactNode
  onActionClick?: () => void
}

const InputEnhanced = forwardRef<HTMLInputElement, InputEnhancedProps>(
  ({ className, type, label, error, icon, iconPosition = 'left', actionIcon, onActionClick, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-slate-400">{icon}</div>
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
              icon && iconPosition === 'left' && 'pl-10',
              (actionIcon || iconPosition === 'right') && 'pr-10',
              error && 'border-danger focus-visible:ring-danger',
              className
            )}
            ref={ref}
            {...props}
          />
          {actionIcon && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={onActionClick}
            >
              <div className="text-slate-400 hover:text-slate-600">{actionIcon}</div>
            </button>
          )}
          {icon && iconPosition === 'right' && !actionIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-slate-400">{icon}</div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
      </div>
    )
  }
)
InputEnhanced.displayName = 'InputEnhanced'

export { InputEnhanced }