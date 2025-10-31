import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className, 
  hover = false,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-200",
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;