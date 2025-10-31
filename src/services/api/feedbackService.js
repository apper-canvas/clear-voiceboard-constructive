import { getApperClient } from "@/services/apperClient";

export const feedbackService = {
  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const whereConditions = [];
      
      if (filters.categories && filters.categories.length > 0) {
        whereConditions.push({
          FieldName: "category_c",
          Operator: "ExactMatch",
          Values: filters.categories,
          Include: true
        });
      }
      
      if (filters.statuses && filters.statuses.length > 0) {
        whereConditions.push({
          FieldName: "status_c",
          Operator: "ExactMatch",
          Values: filters.statuses,
          Include: true
        });
      }

      const whereGroups = [];
      if (filters.search) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "title_c",
                  operator: "Contains",
                  values: [filters.search]
                },
                {
                  fieldName: "description_c",
                  operator: "Contains",
                  values: [filters.search]
                }
              ],
              operator: "OR"
            }
          ]
        });
      }

      let orderBy = [];
      if (filters.sortBy === "votes") {
        orderBy = [{ fieldName: "vote_count_c", sorttype: "DESC" }];
      } else if (filters.sortBy === "newest") {
        orderBy = [{ fieldName: "created_at_c", sorttype: "DESC" }];
      } else if (filters.sortBy === "oldest") {
        orderBy = [{ fieldName: "created_at_c", sorttype: "ASC" }];
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "vote_count_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "images_c" } }
        ],
        where: whereConditions,
        whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("feedback_post_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const posts = (response.data || []).map(post => ({
        Id: post.Id,
        title: post.title_c || "",
        description: post.description_c || "",
        category: post.category_c || "",
        status: post.status_c || "under-review",
        voteCount: post.vote_count_c || 0,
        commentCount: post.comment_count_c || 0,
        authorName: post.author_name_c || "Anonymous",
        isAnonymous: post.is_anonymous_c || false,
        createdAt: post.created_at_c || new Date().toISOString(),
        updatedAt: post.updated_at_c || new Date().toISOString(),
        images: post.images_c ? JSON.parse(post.images_c) : []
      }));

      if (filters.sortBy === "trending") {
        posts.sort((a, b) => {
          const aScore = a.voteCount + (a.commentCount * 2);
          const bScore = b.voteCount + (b.commentCount * 2);
          return bScore - aScore;
        });
      }

      return posts;
    } catch (error) {
      console.error("Error fetching feedback posts:", error);
      return [];
    }
  },

  async getVotedPosts() {
    return [];
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "vote_count_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "author_name_c" } },
          { field: { Name: "is_anonymous_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "images_c" } }
        ]
      };

      const response = await apperClient.getRecordById("feedback_post_c", id, params);

      if (!response.success || !response.data) {
        throw new Error(`Post with id ${id} not found`);
      }

      const post = response.data;
      return {
        Id: post.Id,
        title: post.title_c || "",
        description: post.description_c || "",
        category: post.category_c || "",
        status: post.status_c || "under-review",
        voteCount: post.vote_count_c || 0,
        commentCount: post.comment_count_c || 0,
        authorName: post.author_name_c || "Anonymous",
        isAnonymous: post.is_anonymous_c || false,
        createdAt: post.created_at_c || new Date().toISOString(),
        updatedAt: post.updated_at_c || new Date().toISOString(),
        images: post.images_c ? JSON.parse(post.images_c) : []
      };
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  async create(postData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        records: [
          {
            Name: postData.title || "Untitled",
            title_c: postData.title || "",
            description_c: postData.description || "",
            category_c: postData.category || "",
            status_c: "under-review",
            vote_count_c: 0,
            comment_count_c: 0,
            author_name_c: postData.authorName || "Anonymous",
            is_anonymous_c: postData.isAnonymous || false,
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString(),
            images_c: postData.images ? JSON.stringify(postData.images) : "[]"
          }
        ]
      };

      const response = await apperClient.createRecord("feedback_post_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]?.success) {
        const created = response.results[0].data;
        return {
          Id: created.Id,
          title: created.title_c || "",
          description: created.description_c || "",
          category: created.category_c || "",
          status: created.status_c || "under-review",
          voteCount: created.vote_count_c || 0,
          commentCount: created.comment_count_c || 0,
          authorName: created.author_name_c || "Anonymous",
          isAnonymous: created.is_anonymous_c || false,
          createdAt: created.created_at_c || new Date().toISOString(),
          updatedAt: created.updated_at_c || new Date().toISOString(),
          images: created.images_c ? JSON.parse(created.images_c) : []
        };
      }

      throw new Error("Failed to create post");
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateFields = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString()
      };

      if (updateData.title !== undefined) updateFields.title_c = updateData.title;
      if (updateData.description !== undefined) updateFields.description_c = updateData.description;
      if (updateData.category !== undefined) updateFields.category_c = updateData.category;
      if (updateData.status !== undefined) updateFields.status_c = updateData.status;
      if (updateData.voteCount !== undefined) updateFields.vote_count_c = updateData.voteCount;
      if (updateData.commentCount !== undefined) updateFields.comment_count_c = updateData.commentCount;
      if (updateData.images !== undefined) updateFields.images_c = JSON.stringify(updateData.images);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord("feedback_post_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]?.success) {
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          title: updated.title_c || "",
          description: updated.description_c || "",
          category: updated.category_c || "",
          status: updated.status_c || "under-review",
          voteCount: updated.vote_count_c || 0,
          commentCount: updated.comment_count_c || 0,
          authorName: updated.author_name_c || "Anonymous",
          isAnonymous: updated.is_anonymous_c || false,
          createdAt: updated.created_at_c || new Date().toISOString(),
          updatedAt: updated.updated_at_c || new Date().toISOString(),
          images: updated.images_c ? JSON.parse(updated.images_c) : []
        };
      }

      throw new Error("Failed to update post");
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
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

      const response = await apperClient.deleteRecord("feedback_post_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }
};