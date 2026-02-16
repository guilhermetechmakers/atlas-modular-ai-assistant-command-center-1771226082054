import React, { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, asChild, children, ...props }, ref) => {
    const classes = cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-ring',
          'min-h-[40px] touch-manipulation',
          'hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground shadow-md hover:shadow-glow-orange': variant === 'primary',
            'bg-panel text-foreground border border-border hover:bg-card-surface': variant === 'secondary',
            'border border-border bg-transparent hover:bg-panel': variant === 'outline',
            'bg-transparent hover:bg-panel': variant === 'ghost',
            'bg-destructive text-white hover:opacity-90': variant === 'destructive',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )
    if (asChild && children) {
      const child = Array.isArray(children) ? children[0] : children
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
          className: cn((child as React.ReactElement<{ className?: string }>).props?.className, classes),
        })
      }
    }
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled ?? isLoading}
        className={classes}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
