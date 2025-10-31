import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary/50 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500/50",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary/50",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500/50",
    pill: "rounded-full border-2 border-gray-300 bg-white hover:border-primary hover:bg-primary hover:text-white text-gray-700 focus:ring-primary/50 transition-colors duration-200",
    voted: "rounded-full border-2 border-primary bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;