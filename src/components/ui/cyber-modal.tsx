
'use client';

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  accentColor?: 'cyan' | 'pink' | 'green' | 'amber';
}

export function CyberModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  accentColor = 'cyan'
}: CyberModalProps) {
  const accentClasses = {
    cyan: "border-primary/50 shadow-[0_0_30px_rgba(0,245,255,0.15)]",
    pink: "border-secondary/50 shadow-[0_0_30px_rgba(255,0,110,0.15)]",
    green: "border-accent/50 shadow-[0_0_30px_rgba(57,255,20,0.15)]",
    amber: "border-warning/50 shadow-[0_0_30px_rgba(255,170,0,0.15)]"
  };

  const titleShadows = {
    cyan: "neon-text-cyan",
    pink: "neon-text-pink",
    green: "neon-text-green",
    amber: "neon-text-amber"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm z-[100]" />
        <DialogContent className={cn(
          "sm:max-w-[425px] bg-card border-2 p-0 gap-0 overflow-hidden z-[101]",
          accentClasses[accentColor]
        )}>
          {/* Header Bar */}
          <div className={cn(
            "h-1 w-full",
            accentColor === 'cyan' ? 'bg-primary' : accentColor === 'pink' ? 'bg-secondary' : accentColor === 'green' ? 'bg-accent' : 'bg-warning'
          )} />
          
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className={cn("text-xl font-headline tracking-tighter uppercase", titleShadows[accentColor])}>
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-muted-foreground font-code text-[10px] uppercase tracking-widest mt-1">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="relative">
              {children}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
