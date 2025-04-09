import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variant styles
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
          variant === "outline" && "border border-input hover:bg-accent hover:text-accent-foreground focus:ring-accent",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
          variant === "link" && "underline-offset-4 hover:underline text-primary focus:ring-primary",
          
          // Size styles
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-8 px-3 text-sm",
          size === "lg" && "h-11 px-8",
          size === "icon" && "h-10 w-10",
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
