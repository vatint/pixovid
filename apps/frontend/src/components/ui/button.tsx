import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_oklch(0.82_0.14_210/0.55)] hover:bg-primary/90 hover:shadow-[0_0_28px_-2px_oklch(0.82_0.14_210/0.7)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_0_16px_-4px_oklch(0.62_0.22_25/0.5)] hover:bg-destructive/90",
        outline:
          "border border-primary/35 bg-primary/5 text-foreground hover:bg-primary/10 hover:border-primary/60 hover:shadow-[0_0_16px_-6px_oklch(0.82_0.14_210/0.4)]",
        secondary:
          "bg-secondary text-secondary-foreground border border-primary/15 hover:bg-secondary/80 hover:border-primary/30",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-xs tracking-wider uppercase font-hud",
        lg: "h-11 rounded-md px-8 font-display text-[0.95rem] tracking-wider",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
