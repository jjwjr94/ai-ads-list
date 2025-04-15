
import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-lg hover:from-[#8b77e5] hover:to-[#6E59A5] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";
