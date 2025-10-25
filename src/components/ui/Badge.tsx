// components/ui/badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900',
        secondary: 'border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50',
        destructive: 'border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        success: 'border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning: 'border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        blue: 'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        purple: 'border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        orange: 'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        teal: 'border-transparent bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
        outline: 'text-gray-950 border-gray-300 dark:text-gray-50 dark:border-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };