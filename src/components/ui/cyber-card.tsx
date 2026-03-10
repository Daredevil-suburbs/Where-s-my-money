import * as React from "react"
import { cn } from "@/lib/utils"

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: 'blue' | 'purple' | 'green';
  title?: string;
  headerAction?: React.ReactNode;
}

export function CyberCard({ 
  children, 
  className, 
  accentColor = 'blue', 
  title,
  headerAction,
  ...props 
}: CyberCardProps) {
  const accentClasses = {
    blue: "border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.1)]",
    purple: "border-secondary/50 shadow-[0_0_15px_rgba(255,0,255,0.1)]",
    green: "border-accent/50 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
  };

  const textAccentClasses = {
    blue: "text-primary",
    purple: "text-secondary",
    green: "text-accent"
  }

  return (
    <div 
      className={cn(
        "cyber-box p-6 flex flex-col gap-4", 
        accentClasses[accentColor],
        className
      )} 
      {...props}
    >
      <div className="scanline-overlay" />
      
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
          {title && (
            <h3 className={cn("font-headline text-lg tracking-widest", textAccentClasses[accentColor])}>
              {title}
            </h3>
          )}
          {headerAction && (
            <div className="flex items-center gap-2">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative Corners */}
      <div className={cn("absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2", accentColor === 'blue' ? 'border-primary' : accentColor === 'purple' ? 'border-secondary' : 'border-accent')} />
      <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2", accentColor === 'blue' ? 'border-primary' : accentColor === 'purple' ? 'border-secondary' : 'border-accent')} />
    </div>
  )
}
