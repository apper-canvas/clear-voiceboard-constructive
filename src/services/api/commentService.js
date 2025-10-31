import commentsData from "@/services/mockData/comments.json";

let comments = [...commentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getByPostId(postId) {
    await delay(250);
    const postComments = comments.filter(c => c.postId === String(postId));
    
    // Sort comments by creation date (newest first for top-level, oldest first for replies)
    const topLevel = postComments
      .filter(c => !c.parentId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    const withReplies = topLevel.map(comment => {
      const replies = postComments
        .filter(c => c.parentId === String(comment.Id))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      return {
        ...comment,
        replies
      };
    });
    
    return withReplies;
  },

async create(commentData) {
    await delay(300);
    const newId = Math.max(...comments.map(c => c.Id)) + 1;
    const newComment = {
      Id: newId,
      ...commentData,
      images: commentData.images || [],
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async getAll() {
    await delay(200);
    return comments.map(c => ({ ...c }));
  },

  async getById(id) {
    await delay(150);
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    return { ...comment };
  },

async update(id, updateData) {
    await delay(250);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Comment with id ${id} not found`);
    }
    comments[index] = {
      ...comments[index],
      ...updateData,
      images: updateData.images !== undefined ? updateData.images : comments[index].images
    };
    return { ...comments[index] };
  },

  async delete(id) {
    await delay(200);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Comment with id ${id} not found`);
    }
const deleted = comments.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByRoadmapItemId(roadmapItemId) {
    await delay(250);
    const itemComments = comments.filter(c => c.roadmapItemId === String(roadmapItemId));
    
    // Sort comments by creation date (oldest first for top-level)
    const topLevel = itemComments
      .filter(c => !c.parentId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    const withReplies = topLevel.map(comment => {
      const replies = itemComments
        .filter(c => c.parentId === String(comment.Id))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      return {
        ...comment,
        replies
      };
    });
    
    return withReplies;
  }
};