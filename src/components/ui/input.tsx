import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', hasError, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-panel px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground focus-ring transition-colors duration-200',
        'border-input focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
        hasError && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
