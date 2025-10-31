import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { roadmapService } from "@/services/api/roadmapService";
import { commentService } from "@/services/api/commentService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ImageUpload from "@/components/atoms/ImageUpload";
import Roadmap from "@/components/pages/Roadmap";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VoteButton from "@/components/molecules/VoteButton";
import CommentItem from "@/components/molecules/CommentItem";

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    loadItemDetails();
    loadComments();
  }, [id]);

  const loadItemDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await roadmapService.getById(id);
      setItem(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getByRoadmapItemId(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const comment = await commentService.create({
        postId: id,
        authorName: authorName.trim() || "User",
        content: newComment.trim(),
        images: commentImages
      });
setComments([...comments, comment]);
      setNewComment('');
      setCommentImages([]);
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

const handleReply = async (parentId, content, images = []) => {
    try {
      const reply = await commentService.create({
        postId: id,
        authorName: authorName.trim() || "User",
        content: content.trim(),
        images: images,
        parentId: parentId
      });
      await loadComments();
      toast.success("Reply added successfully!");
    } catch (err) {
      toast.error("Failed to add reply");
    }
  };

const handleVote = async () => {
    if (!item?.post) return;
    try {
      setItem(prev => ({
        ...prev,
        post: {
          ...prev.post,
          voteCount: (prev.post?.voteCount || 0) + 1
        }
      }));
      toast.success("Vote recorded!");
    } catch (err) {
      toast.error("Failed to record vote");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planned": return "info";
      case "in-progress": return "primary";
      case "completed": return "success";
      default: return "secondary";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

if (loading) return <Loading type="post" />;
  if (error) return <Error message={error} onRetry={loadItemDetails} />;
  if (!item) return <Error message="Roadmap item not found" onRetry={() => navigate("/roadmap")} />;
  if (!item.post) return <Error message="Roadmap item details not available" onRetry={loadItemDetails} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/roadmap")}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span className="font-medium">Back to Roadmap</span>
          </button>
        </motion.div>

        {/* Item Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
<Badge variant={getStatusColor(item.stage)}>
                    {formatStatus(item.stage)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(item.post?.createdAt || new Date()), { addSuffix: true })}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {item.post?.title || 'Untitled'}
                </h1>
<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.post?.description || 'No description available'}
                </p>
              </div>
              <div className="ml-6">
                <VoteButton
                  count={item.post?.voteCount || 0}
                  onClick={handleVote}
                />
              </div>
            </div>

{item.post?.images && item.post.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {item.post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Roadmap item ${idx + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Comment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ApperIcon name="MessageSquare" className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Discussion ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
<form onSubmit={handleSubmitComment} className="mb-6">
              <div className="space-y-4">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this roadmap item..."
                  className="w-full"
                  disabled={submitting}
                />
                
                <ImageUpload
                  images={commentImages}
                  onChange={setCommentImages}
                  maxImages={3}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="px-6"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="MessageSquare" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CommentItem
                        comment={comment}
                        onReply={handleReply}
                        level={0}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapDetail;