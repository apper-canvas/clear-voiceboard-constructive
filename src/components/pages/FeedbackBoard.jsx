import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VotedPostsSidebar from "@/components/organisms/VotedPostsSidebar";
import { feedbackService } from "@/services/api/feedbackService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PostDetailModal from "@/components/organisms/PostDetailModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import FeedbackCard from "@/components/molecules/FeedbackCard";
import SortDropdown from "@/components/molecules/SortDropdown";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSidebar from "@/components/molecules/FilterSidebar";

const FeedbackBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVotedSidebarOpen, setIsVotedSidebarOpen] = useState(false);
  const [votingPosts, setVotingPosts] = useState(new Set());
  const [votedPosts, setVotedPosts] = useState([]);
  
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    statuses: [],
    sortBy: "trending"
  });

useEffect(() => {
    loadPosts();
    loadVotedPosts();
  }, [filters.categories, filters.statuses, filters.search, filters.sortBy]);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await feedbackService.getAll(filters);
      setPosts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId) => {
    if (votingPosts.has(postId)) return;
    
    setVotingPosts(prev => new Set([...prev, postId]));
    
    try {
      // Check if already voted
      const votedPosts = JSON.parse(localStorage.getItem("votedPosts") || "[]");
      const isVoted = votedPosts.includes(postId);
      const increment = !isVoted;
      
      const updatedPost = await feedbackService.vote(postId, increment);
      
      // Update posts list
      setPosts(prev => prev.map(post => 
        post.Id === postId ? updatedPost : post
      ));
      
      // Update localStorage
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
      setVotingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsVotedSidebarOpen(false);
  };

  const isPostVoted = (postId) => {
    const votedPostIds = JSON.parse(localStorage.getItem("votedPosts") || "[]");
    return votedPostIds.includes(postId);
  };

const loadVotedPosts = async () => {
    try {
      const voted = await feedbackService.getVotedPosts();
      setVotedPosts(voted);
    } catch (err) {
      console.error("Failed to load voted posts:", err);
    }
  };
  const hasActiveFilters = filters.categories.length > 0 || filters.statuses.length > 0 || filters.search;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-xl opacity-30"></div>
            <h1 className="relative text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
              Feedback Board
            </h1>
          </motion.div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your ideas, vote on features, and help shape the future of our platform
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
<div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsVotedSidebarOpen(true)}
                >
                  <ApperIcon name="Heart" className="h-4 w-4 mr-2" />
                  My Votes
                  {votedPosts.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {votedPosts.length}
                    </span>
                  )}
                </Button>
              </div>
              
              <SearchBar
                value={filters.search}
                onChange={handleSearchChange}
                className="flex-1"
                placeholder="Search feedback requests..."
              />
              
              <SortDropdown
                value={filters.sortBy}
                onChange={handleSortChange}
                className="sm:w-48"
              />
            </div>

            {/* Results Info */}
            {!loading && posts.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {hasActiveFilters ? `Found ${posts.length} matching results` : `Showing ${posts.length} feedback requests`}
                </p>
              </div>
            )}

            {/* Content */}
            {loading && <Loading type="cards" />}
            
            {error && (
              <Error 
                message={error} 
                onRetry={loadPosts} 
              />
            )}
            
            {!loading && !error && posts.length === 0 && (
              <Empty
                title="No feedback found"
                message={hasActiveFilters 
                  ? "Try adjusting your filters or search terms to find more results."
                  : "Be the first to share your ideas and help improve our platform!"
                }
                actionText="Submit First Request"
                onAction={() => {
                  // This would open the submit modal, but it's handled by the header
                  document.querySelector('[data-submit-button]')?.click();
                }}
                icon="MessageSquareMore"
              />
            )}
            
            {!loading && !error && posts.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {posts.map((post) => (
                  <FeedbackCard
                    key={post.Id}
                    post={post}
                    onVote={handleVote}
                    onClick={() => setSelectedPostId(post.Id)}
                    isVoted={isPostVoted(post.Id)}
                    isVoting={votingPosts.has(post.Id)}
                  />
                ))}
              </motion.div>
)}
          </div>

          {/* Voted Posts Sidebar */}
          <VotedPostsSidebar
            isOpen={isVotedSidebarOpen}
            onClose={() => setIsVotedSidebarOpen(false)}
            votedPosts={votedPosts}
            onPostClick={handlePostClick}
            onVote={handleVote}
            isPostVoted={isPostVoted}
          />
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        postId={selectedPostId}
        isOpen={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
      />
    </div>
  );
};

export default FeedbackBoard;