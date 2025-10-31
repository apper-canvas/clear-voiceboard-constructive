import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import VoteButton from "@/components/molecules/VoteButton";

const RoadmapColumn = ({ 
  title, 
  items, 
  stage, 
  color = "primary",
  icon = "Clock"
}) => {
  const navigate = useNavigate();
  const getColorClasses = (colorName) => {
    const colors = {
      primary: {
        header: "bg-gradient-to-r from-primary to-purple-600",
        badge: "primary"
      },
      info: {
        header: "bg-gradient-to-r from-info to-blue-600", 
        badge: "info"
      },
      success: {
        header: "bg-gradient-to-r from-success to-green-600",
        badge: "success"
      }
    };
    return colors[colorName] || colors.primary;
  };

  const colorClasses = getColorClasses(color);

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
      {/* Column Header */}
      <div className={`${colorClasses.header} rounded-lg p-4 mb-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon name={icon} className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <span className="text-sm opacity-80">{items.length}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Package" className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items yet</p>
          </div>
        ) : (
items.map((item, index) => (
<motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/roadmap/${item.Id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.post?.title || 'Untitled'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {truncateText(item.post?.description || '')}
                    </p>
                  </div>
                  
                  <VoteButton
                    count={item.post?.voteCount || 0}
                    isVoted={false}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={colorClasses.badge} size="sm">
                      {item.post.category}
                    </Badge>
                  </div>
                  
                  {item.estimatedDate && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <ApperIcon name="Calendar" className="h-3 w-3" />
                      <span>{format(new Date(item.estimatedDate), "MMM d")}</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoadmapColumn;