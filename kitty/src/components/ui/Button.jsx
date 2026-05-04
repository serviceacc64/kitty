import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-white shadow-elegant hover:opacity-90 active:scale-95",
    secondary: "bg-secondary text-white shadow-elegant hover:opacity-90 active:scale-95",
    outline: "border border-border bg-transparent hover:bg-muted text-foreground",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
    rainbow: "bg-rainbow text-white shadow-elegant hover:scale-105 active:scale-95",
  };


  const sizes = {
    default: "h-11 px-6 py-2 rounded-lg",
    sm: "h-9 px-4 rounded-md text-sm",
    lg: "h-14 px-10 rounded-xl text-lg",
    icon: "h-10 w-10 rounded-full",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
