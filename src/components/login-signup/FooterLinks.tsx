import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface FooterLinksProps {
  className?: string
  /** Use anchor tags for external or non-SPA links */
  termsHref?: string
  privacyHref?: string
  helpHref?: string
}

const defaultTerms = '/terms'
const defaultPrivacy = '/privacy'
const defaultHelp = '/help'

export function FooterLinks({
  className,
  termsHref = defaultTerms,
  privacyHref = defaultPrivacy,
  helpHref = defaultHelp,
}: FooterLinksProps) {
  const linkClass =
    'text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring rounded py-3 px-2 inline-flex items-center justify-center min-h-[44px]'

  return (
    <footer
      className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1', className)}
      role="contentinfo"
    >
      <Link to={termsHref} className={linkClass}>
        Terms
      </Link>
      <span className="text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <Link to={privacyHref} className={linkClass}>
        Privacy
      </Link>
      <span className="text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <Link to={helpHref} className={linkClass}>
        Help
      </Link>
    </footer>
  )
}
