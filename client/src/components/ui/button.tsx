import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground focus:ring-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
        link: "underline-offset-4 hover:underline text-primary focus:ring-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
