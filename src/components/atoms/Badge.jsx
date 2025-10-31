import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "sm",
  className 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
    "under-review": "bg-warning/10 text-warning",
    planned: "bg-info/10 text-info",
    "in-progress": "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;