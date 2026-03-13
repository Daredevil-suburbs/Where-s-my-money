import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-primary/10 border border-primary/5", className)}
      {...props}
    />
  )
}

export { Skeleton }
