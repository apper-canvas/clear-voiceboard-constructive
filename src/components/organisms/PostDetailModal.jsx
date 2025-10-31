import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { feedbackService } from "@/services/api/feedbackService";
import { commentService } from "@/services/api/commentService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ImageUpload from "@/components/atoms/ImageUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VoteButton from "@/components/molecules/VoteButton";
import CommentItem from "@/components/molecules/CommentItem";
const PostDetailModal = ({ postId, isOpen, onClose }) => {
const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVoted, setIsVoted] = useState(false);
const [isVoting, setIsVoting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [commentImages, setCommentImages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (isOpen && postId) {
      loadPostDetails();
    }
  }, [isOpen, postId]);

const loadPostDetails = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [postData, commentsData] = await Promise.all([
        feedbackService.getById(postId),
        commentService.getByPostId(postId)
      ]);
      
      setPost(postData);
      setComments(commentsData);
      
      // Check if user has voted (simulate with localStorage)
      const votedPosts = JSON.parse(localStorage.getItem("votedPosts") || "[]");
      setIsVoted(votedPosts.includes(postId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCommentImages([]);
    }
  };

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      const increment = !isVoted;
      const updatedPost = await feedbackService.vote(postId, increment);
      
      setPost(updatedPost);
      setIsVoted(!isVoted);
      
      // Update localStorage
      const votedPosts = JSON.parse(localStorage.getItem("votedPosts") || "[]");
      if (increment) {
        votedPosts.push(postId);
      } else {
        const index = votedPosts.indexOf(postId);
        if (index > -1) votedPosts.splice(index, 1);
      }
      localStorage.setItem("votedPosts", JSON.stringify(votedPosts));
      
      toast.success(increment ? "Vote added!" : "Vote removed!");
    } catch (err) {
      toast.error("Failed to vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    if (!authorName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const comment = await commentService.create({
postId: post.Id,
        authorName: authorName.trim() || "Anonymous",
        content: newComment.trim(),
        images: commentImages
      });
      
      // Update comment count in post
      const updatedPost = await feedbackService.update(postId, {
        commentCount: post.commentCount + 1
      });
      setPost(updatedPost);
      
      // Reload comments
      const updatedComments = await commentService.getByPostId(postId);
      setComments(updatedComments);
      
      setNewComment("");
      setCommentImages([]);
      setAuthorName("");
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

const handleReply = async (parentId, content, images = []) => {
    if (!content.trim()) return;
    
    try {
      await commentService.create({
        postId: post.Id,
        parentId: parentId,
        authorName: authorName.trim() || "Anonymous",
        content: content.trim(),
        images: images
      });
      // Reload comments
      const updatedComments = await commentService.getByPostId(postId);
      setComments(updatedComments);
      
      toast.success("Reply added!");
    } catch (err) {
      toast.error("Failed to add reply. Please try again.");
    }
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

return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-purple-600/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Feedback Details</h2>
                  <p className="text-sm text-gray-600">Join the discussion</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {loading && <Loading />}
                
                {error && (
                  <div className="p-6">
                    <Error message={error} onRetry={loadPostDetails} />
                  </div>
                )}

                {post && (
                  <div className="p-6 space-y-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                          {post.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span>by {post.isAnonymous ? "Anonymous" : post.authorName}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      <VoteButton
                        count={post.voteCount}
                        isVoted={isVoted}
                        isLoading={isVoting}
                        onClick={handleVote}
                        size="lg"
                      />
                    </div>

                    {/* Status and Category */}
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusColor(post.status)} size="md">
                        {formatStatus(post.status)}
                      </Badge>
                      <Badge variant="default" size="md">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Description */}
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {post.description}
                      </p>
                    </div>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {post.images.map((image, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                              onClick={() => setSelectedImage(image)}
                            >
                              <img
                                src={image}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ApperIcon name="ZoomIn" className="h-6 w-6 text-white" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comment Form */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Add Comment ({comments.length})
                      </h3>
                      
                      <form onSubmit={handleSubmitComment} className="space-y-4">
                        <div className="space-y-3">
                          <Input
                            placeholder="Write your comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                          
<ImageUpload
                            images={commentImages}
                            onChange={setCommentImages}
                            maxImages={3}
                            maxSizeMB={5}
                          />
                          
                          <Input
                            placeholder="Your name..."
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="max-w-xs"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          {isSubmittingComment ? (
                            <>
                              <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
                              Post Comment
                            </>
                          )}
                        </Button>
                      </form>
                    </div>

                    {/* Comments */}
                    {comments.length > 0 && (
                      <div className="border-t pt-6">
                        <div className="space-y-0 divide-y divide-gray-100">
                          {comments.map((comment) => (
                            <CommentItem
                              key={comment.Id}
                              comment={comment}
                              onReply={handleReply}
                              isSubmittingReply={false}
                              onImageClick={setSelectedImage}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostDetailModal;