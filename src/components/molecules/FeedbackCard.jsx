import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import VoteButton from "@/components/molecules/VoteButton";

const FeedbackCard = ({ 
  post, 
  onVote, 
  onClick,
  isVoted = false,
  isVoting = false 
}) => {
  const hasImages = post.images && post.images.length > 0;
  const handleVoteClick = (e) => {
    e.stopPropagation();
    onVote(post.Id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "under-review": return "warning";
      case "planned": return "info";
      case "in-progress": return "primary";
      case "completed": return "success";
      default: return "default";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary/20"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>by {post.isAnonymous ? "Anonymous" : post.authorName}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          
          <VoteButton
            count={post.voteCount}
            isVoted={isVoted}
            isLoading={isVoting}
            onClick={handleVoteClick}
            size="sm"
          />
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(post.description)}
        </p>
{/* Image Indicator */}
          {hasImages && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500">
              <ApperIcon name="Image" className="h-3.5 w-3.5" />
              <span>{post.images.length}</span>
            </div>
          )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(post.status)}>
              {formatStatus(post.status)}
            </Badge>
            <Badge variant="default">
              {post.category}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageCircle" className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackCard;