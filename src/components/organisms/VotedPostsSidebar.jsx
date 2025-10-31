import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const VotedPostsSidebar = ({ 
  isOpen, 
  onClose, 
  votedPosts,
  onPostClick,
  onVote,
  isPostVoted
}) => {
  const getStatusColor = (status) => {
    const colors = {
      "under-review": "bg-blue-100 text-blue-700",
      "planned": "bg-purple-100 text-purple-700",
      "in-progress": "bg-amber-100 text-amber-700",
      "completed": "bg-green-100 text-green-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatStatus = (status) => {
    return status
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCategoryColor = (category) => {
    const colors = {
      "UI/UX": "bg-pink-100 text-pink-700",
      "Features": "bg-blue-100 text-blue-700",
      "Platform": "bg-indigo-100 text-indigo-700",
      "Data": "bg-green-100 text-green-700",
      "Notifications": "bg-yellow-100 text-yellow-700",
      "Moderation": "bg-red-100 text-red-700",
      "Accessibility": "bg-purple-100 text-purple-700",
      "Integrations": "bg-cyan-100 text-cyan-700",
      "User Management": "bg-orange-100 text-orange-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ 
          x: isOpen ? 0 : 300, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-0 top-20 bottom-0 w-80 bg-white/95 backdrop-blur-lg shadow-xl border-l border-gray-100 z-50 overflow-hidden"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">My Votes</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {votedPosts.length} {votedPosts.length === 1 ? 'post' : 'posts'} voted
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {votedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ApperIcon name="Heart" className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  No votes yet
                </h4>
                <p className="text-sm text-gray-500">
                  Start voting on feature requests to track your engagement here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {votedPosts.map((post) => (
                  <Card
                    key={post.Id}
                    hover
                    onClick={() => onPostClick(post)}
                    className="cursor-pointer"
                  >
                    <div className="p-4">
                      {/* Vote Count */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className={`flex flex-col items-center justify-center min-w-[48px] h-12 rounded-lg transition-colors ${
                          isPostVoted(post.Id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <ApperIcon 
                            name="ChevronUp" 
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-semibold">
                            {post.votes}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category}
                            </Badge>
                            <Badge className={getStatusColor(post.status)}>
                              {formatStatus(post.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <ApperIcon name="MessageSquare" className="h-3 w-3" />
                            <span>{post.comments}</span>
                          </span>
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default VotedPostsSidebar;