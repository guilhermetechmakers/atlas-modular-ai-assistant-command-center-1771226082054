import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer rounded-md bg-muted', className)}
      aria-hidden
      {...props}
    />
  )
}

export { Skeleton }
