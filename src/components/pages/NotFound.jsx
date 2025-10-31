import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/5 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-r from-primary to-purple-600 p-6 rounded-full inline-block">
              <ApperIcon name="AlertCircle" className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Back to Feedback Board
            </Button>
          </Link>
          
          <div className="flex space-x-3">
            <Link to="/roadmap" className="flex-1">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Map" className="h-4 w-4 mr-2" />
                Roadmap
              </Button>
            </Link>
            
            <Link to="/changelog" className="flex-1">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Package" className="h-4 w-4 mr-2" />
                Changelog
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <ApperIcon name="MessageSquareMore" className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600">
              If you think this is a bug, please submit feedback so we can fix it!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;