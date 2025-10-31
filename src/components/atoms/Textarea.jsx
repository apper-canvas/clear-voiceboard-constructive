import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors duration-200",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;