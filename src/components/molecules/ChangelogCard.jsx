import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ChangelogCard = ({ entry, index = 0 }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      "UI/UX": "Palette",
      "Features": "Zap",
      "Platform": "Smartphone",
      "Data": "Database",
      "Notifications": "Bell",
      "Moderation": "Shield",
      "Accessibility": "Eye",
      "Integrations": "Link",
      "Performance": "Gauge",
      "Community": "Users"
    };
    return icons[category] || "Package";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-success/20 to-green-600/20 rounded-full blur"></div>
              <div className="relative bg-gradient-to-r from-success to-green-600 p-3 rounded-full">
                <ApperIcon 
                  name={getCategoryIcon(entry.category)} 
                  className="h-5 w-5 text-white" 
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {entry.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                  <span>Released {format(new Date(entry.releaseDate), "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(entry.releaseDate), { addSuffix: true })}</span>
                </div>
              </div>
              
              <Badge variant="success" size="md">
                Released
              </Badge>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              {entry.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="default" size="sm">
                  {entry.category}
                </Badge>
                
                {entry.relatedPostIds.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ApperIcon name="ArrowRight" className="h-3 w-3" />
                    <span>From {entry.relatedPostIds.length} request{entry.relatedPostIds.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {entry.relatedPostIds.length > 0 && (
                <div className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 cursor-pointer">
                  <ApperIcon name="ExternalLink" className="h-3 w-3" />
                  <span>View Original</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChangelogCard;