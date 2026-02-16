import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SSOMFACTAProps {
  className?: string
}

/**
 * SSO & MFA CTA: enable two-factor toggle (disabled by default).
 * Toggle is present but disabled to indicate future capability.
 */
export function SSOMFACTA({ className }: SSOMFACTAProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-border bg-panel/50 px-4 py-3 transition-colors duration-200',
        className
      )}
      role="group"
      aria-describedby="mfa-cta-desc"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          aria-hidden
        >
          <Shield className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
          <p id="mfa-cta-desc" className="text-xs text-muted-foreground">
            Add extra security (enable in Settings)
          </p>
        </div>
      </div>
      {/* Disabled toggle - visual only, not interactive by default */}
      <button
        type="button"
        disabled
        aria-label="Enable two-factor authentication (disabled)"
        className="relative h-6 w-11 shrink-0 rounded-full border border-border bg-muted transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-muted-foreground/40 transition-transform duration-300"
          aria-hidden
        />
      </button>
    </div>
  )
}
