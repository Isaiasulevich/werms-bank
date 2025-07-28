"use client"

import { cn } from "@/lib/utils";
import React from "react";
 
export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          animate && "animate-gradient-shift",
          "bg-gradient-to-r from-brand-500/20 via-brand-400/30 to-brand-600/20"
        )}
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          animate && "animate-gradient-shift-slow", 
          "bg-gradient-to-r from-brand-500/10 via-brand-400/20 to-brand-600/10"
        )}
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
      />
 
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}; 