import { getApperClient } from "@/services/apperClient";

export const commentService = {
  async getByPostId(postId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "images_c" } }
        ],
        where: [
          {
            FieldName: "post_id_c",
            Operator: "EqualTo",
            Values: [String(postId)]
          }
        ],
        orderBy: [{ fieldName: "created_at_c", sorttype: "ASC" }],
        pagingInfo: { limit: 200, offset: 0 }
      };

      const response = await apperClient.fetchRecords("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const allComments = (response.data || []).map(comment => ({
        Id: comment.Id,
        authorName: comment.author_name_c || "Anonymous",
        content: comment.content_c || "",
        createdAt: comment.created_at_c || new Date().toISOString(),
        isAnonymous: comment.is_anonymous_c || false,
        parentId: comment.parent_id_c || null,
        postId: comment.post_id_c || "",
        images: comment.images_c ? JSON.parse(comment.images_c) : []
      }));

      const topLevel = allComments.filter(c => !c.parentId);
      
      const withReplies = topLevel.map(comment => {
        const replies = allComments.filter(c => c.parentId === String(comment.Id));
        return { ...comment, replies };
      });

      return withReplies;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  },

  async create(commentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        records: [
          {
            Name: `Comment by ${commentData.authorName || "Anonymous"}`,
            author_name_c: commentData.authorName || "Anonymous",
            content_c: commentData.content || "",
            created_at_c: new Date().toISOString(),
            is_anonymous_c: commentData.isAnonymous || false,
            parent_id_c: commentData.parentId || "",
            post_id_c: String(commentData.postId) || "",
            roadmap_item_id_c: commentData.roadmapItemId ? String(commentData.roadmapItemId) : "",
            images_c: commentData.images ? JSON.stringify(commentData.images) : "[]"
          }
        ]
      };

      const response = await apperClient.createRecord("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]?.success) {
        const created = response.results[0].data;
        return {
          Id: created.Id,
          authorName: created.author_name_c || "Anonymous",
          content: created.content_c || "",
          createdAt: created.created_at_c || new Date().toISOString(),
          isAnonymous: created.is_anonymous_c || false,
          parentId: created.parent_id_c || null,
          postId: created.post_id_c || "",
          roadmapItemId: created.roadmap_item_id_c || null,
          images: created.images_c ? JSON.parse(created.images_c) : []
        };
      }

      throw new Error("Failed to create comment");
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "roadmap_item_id_c" } },
          { field: { Name: "images_c" } }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      };

      const response = await apperClient.fetchRecords("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(comment => ({
        Id: comment.Id,
        authorName: comment.author_name_c || "Anonymous",
        content: comment.content_c || "",
        createdAt: comment.created_at_c || new Date().toISOString(),
        isAnonymous: comment.is_anonymous_c || false,
        parentId: comment.parent_id_c || null,
        postId: comment.post_id_c || "",
        roadmapItemId: comment.roadmap_item_id_c || null,
        images: comment.images_c ? JSON.parse(comment.images_c) : []
      }));
    } catch (error) {
      console.error("Error fetching all comments:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "roadmap_item_id_c" } },
          { field: { Name: "images_c" } }
        ]
      };

      const response = await apperClient.getRecordById("comment_c", id, params);

      if (!response.success || !response.data) {
        throw new Error(`Comment with id ${id} not found`);
      }

      const comment = response.data;
      return {
        Id: comment.Id,
        authorName: comment.author_name_c || "Anonymous",
        content: comment.content_c || "",
        createdAt: comment.created_at_c || new Date().toISOString(),
        isAnonymous: comment.is_anonymous_c || false,
        parentId: comment.parent_id_c || null,
        postId: comment.post_id_c || "",
        roadmapItemId: comment.roadmap_item_id_c || null,
        images: comment.images_c ? JSON.parse(comment.images_c) : []
      };
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateFields = {
        Id: parseInt(id)
      };

      if (updateData.content !== undefined) updateFields.content_c = updateData.content;
      if (updateData.images !== undefined) updateFields.images_c = JSON.stringify(updateData.images);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]?.success) {
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          authorName: updated.author_name_c || "Anonymous",
          content: updated.content_c || "",
          createdAt: updated.created_at_c || new Date().toISOString(),
          isAnonymous: updated.is_anonymous_c || false,
          parentId: updated.parent_id_c || null,
          postId: updated.post_id_c || "",
          roadmapItemId: updated.roadmap_item_id_c || null,
          images: updated.images_c ? JSON.parse(updated.images_c) : []
        };
      }

      throw new Error("Failed to update comment");
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  },

  async getByRoadmapItemId(roadmapItemId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "roadmap_item_id_c" } },
          { field: { Name: "images_c" } }
        ],
        where: [
          {
            FieldName: "roadmap_item_id_c",
            Operator: "EqualTo",
            Values: [String(roadmapItemId)]
          }
        ],
        orderBy: [{ fieldName: "created_at_c", sorttype: "ASC" }],
        pagingInfo: { limit: 200, offset: 0 }
      };

      const response = await apperClient.fetchRecords("comment_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const allComments = (response.data || []).map(comment => ({
        Id: comment.Id,
        authorName: comment.author_name_c || "Anonymous",
        content: comment.content_c || "",
        createdAt: comment.created_at_c || new Date().toISOString(),
        isAnonymous: comment.is_anonymous_c || false,
        parentId: comment.parent_id_c || null,
        postId: comment.post_id_c || "",
        roadmapItemId: comment.roadmap_item_id_c || null,
        images: comment.images_c ? JSON.parse(comment.images_c) : []
      }));

      const topLevel = allComments.filter(c => !c.parentId);
      
      const withReplies = topLevel.map(comment => {
        const replies = allComments.filter(c => c.parentId === String(comment.Id));
        return { ...comment, replies };
      });

      return withReplies;
    } catch (error) {
      console.error(`Error fetching comments for roadmap item ${roadmapItemId}:`, error);
      return [];
    }
  }
};