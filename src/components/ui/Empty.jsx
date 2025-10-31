import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  message = "Be the first to contribute!",
  actionText = "Get Started",
  onAction,
  icon = "MessageSquareMore"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-lg"></div>
        <div className="relative bg-gradient-to-r from-primary to-purple-600 p-6 rounded-full">
          <ApperIcon name={icon} className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;