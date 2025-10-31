import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ImageUpload from "@/components/atoms/ImageUpload";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";
 
const CommentItem = ({ 
  comment, 
  onReply, 
  level = 0,
  isSubmittingReply = false,
  onImageClick = () => {} 
}) => {
const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImages, setReplyImages] = useState([]);

const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      await onReply(comment.Id, replyText, replyImages);
      setReplyText("");
      setReplyImages([]);
      setIsReplying(false);
    }
  };

  const maxDepth = 3; // Limit nesting depth

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border-l-2 border-gray-100 pl-4",
        level > 0 && "ml-4",
        level > 0 && "border-primary/20"
      )}
    >
      <div className="py-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <ApperIcon 
                name={comment.isAnonymous ? "UserX" : "User"} 
                className="h-4 w-4 text-primary" 
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm font-medium text-gray-900">
                {comment.isAnonymous ? "Anonymous" : comment.authorName}
              </p>
              <span className="text-xs text-gray-500">•</span>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
{comment.content}
            </p>

            {/* Comment Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {comment.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                    onClick={() => onImageClick(image)}
                  >
                    <img
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ApperIcon name="ZoomIn" className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="hidden">
            </p>
            
            {level < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-gray-500 hover:text-gray-700 p-1"
              >
                <ApperIcon name="Reply" className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>

        {/* Reply Form */}
{isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-11 mt-3"
          >
            <form onSubmit={handleSubmitReply} className="space-y-3">
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="text-sm"
              />
              <ImageUpload
                images={replyImages}
                onChange={setReplyImages}
                maxImages={2}
                maxSizeMB={5}
              />
              <div className="flex items-center space-x-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="text-xs"
                >
                  {isSubmittingReply ? (
                    <>
                      <ApperIcon name="Loader2" className="h-3 w-3 mr-1 animate-spin" />
                      Replying...
                    </>
                  ) : (
                    "Reply"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                    setReplyImages([]);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
{comment.replies.map((reply) => (
              <CommentItem
                key={reply.Id}
                comment={reply}
                onReply={onReply}
                level={level + 1}
                isSubmittingReply={isSubmittingReply}
                onImageClick={onImageClick}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentItem;