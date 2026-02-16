import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmailVerificationStatusProps {
  email: string
  isResending?: boolean
  onResend: () => void | Promise<void>
  className?: string
}

/**
 * Displays email verification pending state and resend action.
 */
export function EmailVerificationStatus({
  email,
  isResending = false,
  onResend,
  className,
}: EmailVerificationStatusProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-panel/50 p-4 animate-fade-in-up',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary"
          aria-hidden
        >
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Verify your email</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            We sent a verification link to <strong className="text-foreground">{email}</strong>.
            Click the link to confirm your address.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={onResend}
            disabled={isResending}
            isLoading={isResending}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    </div>
  )
}

export function EmailVerificationSuccess({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 animate-fade-in-up',
        className
      )}
      role="status"
    >
      <CheckCircle className="h-5 w-5 shrink-0 text-green-500" aria-hidden />
      <p className="text-sm font-medium text-foreground">Email verified. You can sign in.</p>
    </div>
  )
}
