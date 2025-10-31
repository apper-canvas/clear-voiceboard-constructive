import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const VoteButton = ({ 
  count, 
  isVoted = false, 
  isLoading = false, 
  onClick, 
  size = "md" 
}) => {
  const sizes = {
    sm: {
      button: "h-8 px-3 text-xs",
      icon: "h-3 w-3",
      spacing: "space-x-1"
    },
    md: {
      button: "h-10 px-4 text-sm",
      icon: "h-4 w-4", 
      spacing: "space-x-2"
    },
    lg: {
      button: "h-12 px-6 text-base",
      icon: "h-5 w-5",
      spacing: "space-x-2"
    }
  };

  const sizeConfig = sizes[size];

  return (
    <Button
      variant={isVoted ? "voted" : "pill"}
      className={cn(
        sizeConfig.button,
        "font-semibold select-none",
        isLoading && "cursor-not-allowed opacity-75"
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      <div className={cn("flex items-center", sizeConfig.spacing)}>
        <motion.div
          animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: isLoading ? Infinity : 0, ease: "linear" }}
        >
          <ApperIcon 
            name={isLoading ? "Loader2" : "ChevronUp"} 
            className={sizeConfig.icon} 
          />
        </motion.div>
        
        <motion.span
          key={count}
          initial={{ scale: 1 }}
          animate={{ scale: isVoted ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="font-bold"
        >
          {count}
        </motion.span>
      </div>
    </Button>
  );
};

export default VoteButton;