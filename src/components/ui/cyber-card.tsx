
import * as React from "react"
import { cn } from "@/lib/utils"

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: 'cyan' | 'pink' | 'green' | 'amber';
}

export function CyberCard({ 
  children, 
  className, 
  accentColor = 'cyan',
  ...props 
}: CyberCardProps) {
  const accentClasses = {
    cyan: "border-primary/30 shadow-[0_0_15px_rgba(0,245,255,0.05)]",
    pink: "border-secondary/30 shadow-[0_0_15px_rgba(255,0,110,0.05)]",
    green: "border-accent/30 shadow-[0_0_15px_rgba(57,255,20,0.05)]",
    amber: "border-warning/30 shadow-[0_0_15px_rgba(255,170,0,0.05)]"
  };

  return (
    <div 
      className={cn(
        "bg-card/80 backdrop-blur-md border rounded-sm relative overflow-hidden group transition-all", 
        accentClasses[accentColor],
        className
      )} 
      {...props}
    >
      {/* Decorative Corner Flaps */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Cybernetic Accent Line */}
      <div className={cn(
        "absolute bottom-0 left-0 w-full h-[1px] opacity-30 group-hover:opacity-60 transition-opacity",
        accentColor === 'cyan' ? 'bg-primary' : accentColor === 'pink' ? 'bg-secondary' : accentColor === 'green' ? 'bg-accent' : 'bg-warning'
      )} />
    </div>
  )
}
