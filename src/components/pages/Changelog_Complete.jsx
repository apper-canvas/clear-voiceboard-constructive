import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { changelogService } from "@/services/api/changelogService";
import { commentService } from "@/services/api/commentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ImageUpload from "@/components/atoms/ImageUpload";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ChangelogCard from "@/components/molecules/ChangelogCard";
import CommentItem from "@/components/molecules/CommentItem";

function Changelog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEntries, setExpandedEntries] = useState({});
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [errorComments, setErrorComments] = useState({});
  const [commentForms, setCommentForms] = useState({});

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      setLoading(true);
      setError(null);
      const data = await changelogService.getAll();
      setEntries(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load changelog entries");
    } finally {
      setLoading(false);
    }
  }

  async function loadComments(entryId) {
    if (comments[entryId]) return; // Already loaded

    try {
      setLoadingComments(prev => ({ ...prev, [entryId]: true }));
      setErrorComments(prev => ({ ...prev, [entryId]: null }));
      
      const allComments = await commentService.getAll();
      const entryComments = allComments.filter(c => c.postId === entryId);
      
      setComments(prev => ({ ...prev, [entryId]: entryComments }));
    } catch (err) {
      setErrorComments(prev => ({ ...prev, [entryId]: err.message }));
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(prev => ({ ...prev, [entryId]: false }));
    }
  }

async function handleSubmitComment(e, entryId) {
    e.preventDefault();
    
    const form = commentForms[entryId];
    if (!form?.content?.trim()) return;

    try {
      const newComment = await commentService.create({
        postId: entryId,
        authorName: form.authorName?.trim() || 'Anonymous',
        content: form.content.trim(),
        images: form.images || []
      });

      setComments(prev => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), newComment]
      }));

      setCommentForms(prev => ({
        ...prev,
        [entryId]: { authorName: '', content: '', images: [] }
      }));
      toast.success("Comment posted successfully");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  }

async function handleReply(entryId, parentId, content, images = []) {
    try {
      const newReply = await commentService.create({
        postId: entryId,
        parentId: parentId,
        content: content.trim(),
        images: images || []
      });

      setComments(prev => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), newReply]
      }));

      toast.success("Reply posted successfully");
    } catch (err) {
      toast.error("Failed to post reply");
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEntries} />;
  if (!entries.length) return <Empty message="No changelog entries yet" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <ApperIcon name="Newspaper" size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          </div>
          <p className="text-gray-600">
            Stay updated with our latest features and improvements
          </p>
        </motion.div>

        {/* Changelog Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.Id}>
              <ChangelogCard 
                entry={entry} 
                index={index}
              />
              
              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Comments Header */}
                <button
                  onClick={() => {
                    if (expandedEntries[entry.Id]) {
                      setExpandedEntries(prev => ({ ...prev, [entry.Id]: false }));
                    } else {
                      setExpandedEntries(prev => ({ ...prev, [entry.Id]: true }));
                      loadComments(entry.Id);
                    }
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name="MessageSquare" size={20} className="text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Discussion
                    </span>
                    {comments[entry.Id] && (
                      <span className="text-sm text-gray-500">
                        ({comments[entry.Id].length} {comments[entry.Id].length === 1 ? 'comment' : 'comments'})
                      </span>
                    )}
                  </div>
                  <ApperIcon 
                    name={expandedEntries[entry.Id] ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-gray-400"
                  />
                </button>

                {/* Comments Content */}
                {expandedEntries[entry.Id] && (
                  <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                    {/* Comment Form */}
<form 
                      onSubmit={(e) => handleSubmitComment(e, entry.Id)}
                      className="pt-6 space-y-4"
                    >
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Share your thoughts on this release..."
                          value={commentForms[entry.Id]?.content || ''}
                          onChange={(e) => setCommentForms(prev => ({
                            ...prev,
                            [entry.Id]: { ...prev[entry.Id], content: e.target.value }
                          }))}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <ImageUpload
                          images={commentForms[entry.Id]?.images || []}
                          onChange={(newImages) => setCommentForms(prev => ({
                            ...prev,
                            [entry.Id]: { ...prev[entry.Id], images: newImages }
                          }))}
                          maxImages={3}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          type="submit"
                          disabled={!commentForms[entry.Id]?.content?.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </form>
                    {/* Comments List */}
                    {loadingComments[entry.Id] ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin">
                          <ApperIcon name="Loader2" size={24} className="text-primary" />
                        </div>
                      </div>
                    ) : errorComments[entry.Id] ? (
                      <div className="text-center py-8 text-red-600">
                        {errorComments[entry.Id]}
                      </div>
                    ) : comments[entry.Id] && comments[entry.Id].length > 0 ? (
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        {comments[entry.Id]
                          .filter(comment => !comment.parentId)
                          .map(comment => (
                            <CommentItem
                              key={comment.Id}
                              comment={comment}
                              replies={comments[entry.Id].filter(c => c.parentId === comment.Id)}
                              onReply={(parentId, content, images) => handleReply(entry.Id, parentId, content, images)}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to share your thoughts!
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Changelog;