import feedbackData from "@/services/mockData/feedbackPosts.json";

let posts = [...feedbackData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const feedbackService = {
async getAll(filters = {}) {
    await delay(300);
    
    let filteredPosts = [...posts];
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.categories.includes(post.category)
      );
    }
    
    // Apply status filter  
    if (filters.statuses && filters.statuses.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.statuses.includes(post.status)
      );
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "trending":
          // Sort by recent activity and vote count
          filteredPosts.sort((a, b) => {
            const aScore = a.voteCount + (a.commentCount * 2);
            const bScore = b.voteCount + (b.commentCount * 2);
            return bScore - aScore;
          });
          break;
        case "votes":
          filteredPosts.sort((a, b) => b.voteCount - a.voteCount);
          break;
        case "newest":
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
case "oldest":
          filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        default:
          // Default to trending
          filteredPosts.sort((a, b) => {
            const aScore = a.voteCount + (a.commentCount * 2);
            const bScore = b.voteCount + (b.commentCount * 2);
            return bScore - aScore;
          });
      }
    }
    
    return filteredPosts;
  },
async getVotedPosts() {
    await delay(200);
    
    // Get voted post IDs from localStorage
    const votedPostIds = JSON.parse(localStorage.getItem("votedPosts") || "[]");
    
    // Return posts that user has voted for
    return posts.filter(post => votedPostIds.includes(post.Id));
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return { ...post };
  },

async create(postData) {
    await delay(400);
    const newId = Math.max(...posts.map(p => p.Id)) + 1;
    const newPost = {
      Id: newId,
      ...postData,
      images: postData.images || [],
      voteCount: 0,
      commentCount: 0,
      status: "under-review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    return { ...newPost };
  },

async update(id, updateData) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    posts[index] = {
      ...posts[index],
      ...updateData,
      images: updateData.images !== undefined ? updateData.images : posts[index].images,
      updatedAt: new Date().toISOString()
    };
    return { ...posts[index] };
  },

  async vote(id, increment = true) {
    await delay(200);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    posts[index].voteCount += increment ? 1 : -1;
    posts[index].voteCount = Math.max(0, posts[index].voteCount);
    return { ...posts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    const deleted = posts.splice(index, 1)[0];
    return { ...deleted };
  }
};