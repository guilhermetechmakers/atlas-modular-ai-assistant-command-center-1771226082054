import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary/20 text-primary border border-primary/30': variant === 'default',
          'bg-muted text-muted-foreground': variant === 'secondary',
          'border border-border bg-transparent text-foreground': variant === 'outline',
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': variant === 'success',
          'bg-amber-500/20 text-amber-400 border border-amber-500/30': variant === 'warning',
          'bg-destructive/20 text-destructive border border-destructive/30': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'

export { Badge }
