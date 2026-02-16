import { forwardRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
  showClose?: boolean
}

function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    },
    [onOpenChange]
  )
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open) return null
  return (
    <>
      {createPortal(
        <div
          className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            aria-hidden
            onClick={() => onOpenChange(false)}
          />
          {children}
        </div>,
        document.body
      )}
    </>
  )
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, onClose, showClose = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative z-50 w-full max-w-lg rounded-card-lg bg-card-surface border border-border shadow-card p-6 animate-fade-in',
        'max-h-[90vh] overflow-y-auto',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {showClose && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-3 top-3 h-8 w-8 p-0 rounded-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {children}
    </div>
  )
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pr-8', className)} {...props} />
  )
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold text-white', className)} {...props} />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

const DialogFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex justify-end gap-2 mt-6', className)} {...props} />
  )
)
DialogFooter.displayName = 'DialogFooter'

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
