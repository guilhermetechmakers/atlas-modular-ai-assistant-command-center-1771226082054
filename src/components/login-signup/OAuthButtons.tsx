import { Github, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface OAuthButtonsProps {
  /** Base URL for OAuth redirects (e.g. /api/auth) */
  basePath?: string
  className?: string
}

export function OAuthButtons({
  basePath = '/api/auth',
  className,
}: OAuthButtonsProps) {
  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
          <span className="bg-card-surface px-2">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          asChild
        >
          <a
            href={`${basePath}/github`}
            className="inline-flex items-center justify-center gap-2"
            aria-label="Sign in with GitHub"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          asChild
        >
          <a
            href={`${basePath}/google`}
            className="inline-flex items-center justify-center gap-2"
            aria-label="Sign in with Google (Calendar)"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Google (Calendar)
          </a>
        </Button>
      </div>
      {/* Optional SSO placeholder */}
      <Button
        type="button"
        variant="ghost"
        className="w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
        disabled
        aria-disabled="true"
      >
        <Building2 className="h-4 w-4 mr-2" aria-hidden />
        SSO (coming soon)
      </Button>
    </div>
  )
}
