import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-error/20 to-orange-500/20 rounded-full blur-lg"></div>
        <div className="relative bg-gradient-to-r from-error to-orange-500 p-4 rounded-full">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="bg-gradient-to-r from-error to-orange-500 hover:from-error/90 hover:to-orange-500/90"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;