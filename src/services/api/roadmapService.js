import { getApperClient } from "@/services/apperClient";
import { feedbackService } from "@/services/api/feedbackService";

export const roadmapService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "estimated_date_c" } },
          { field: { Name: "feedback_post_id_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "stage_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("roadmap_item_c", params);

      if (!response.success) {
        console.error(response.message);
        return { planned: [], "in-progress": [], completed: [] };
      }

      const items = (response.data || []).map(item => ({
        Id: item.Id,
        estimatedDate: item.estimated_date_c || null,
        feedbackPostId: item.feedback_post_id_c || "",
        position: item.position_c || 0,
        stage: item.stage_c || "planned"
      }));

      const itemsWithPosts = await Promise.all(
        items.map(async (item) => {
          try {
            const post = await feedbackService.getById(item.feedbackPostId);
            return { ...item, post };
          } catch (error) {
            return null;
          }
        })
      );

      const validItems = itemsWithPosts.filter(Boolean);

      const grouped = {
        planned: validItems
          .filter(item => item.stage === "planned")
          .sort((a, b) => a.position - b.position),
        "in-progress": validItems
          .filter(item => item.stage === "in-progress")
          .sort((a, b) => a.position - b.position),
        completed: validItems
          .filter(item => item.stage === "completed")
          .sort((a, b) => b.position - a.position)
      };

      return grouped;
    } catch (error) {
      console.error("Error fetching roadmap items:", error);
      return { planned: [], "in-progress": [], completed: [] };
    }
  },

  async updateStage(feedbackPostId, newStage, newPosition = 1) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const fetchParams = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "feedback_post_id_c" } }
        ],
        where: [
          {
            FieldName: "feedback_post_id_c",
            Operator: "EqualTo",
            Values: [String(feedbackPostId)]
          }
        ]
      };

      const existingResponse = await apperClient.fetchRecords("roadmap_item_c", fetchParams);
      const existingItem = existingResponse.success && existingResponse.data?.length > 0 
        ? existingResponse.data[0] 
        : null;

      if (!existingItem) {
        const createParams = {
          records: [
            {
              Name: `Roadmap Item for Post ${feedbackPostId}`,
              feedback_post_id_c: String(feedbackPostId),
              stage_c: newStage,
              position_c: newPosition,
              estimated_date_c: this.getEstimatedDate(newStage)
            }
          ]
        };

        const createResponse = await apperClient.createRecord("roadmap_item_c", createParams);

        if (!createResponse.success || !createResponse.results?.[0]?.success) {
          throw new Error("Failed to create roadmap item");
        }

        const created = createResponse.results[0].data;
        return {
          Id: created.Id,
          feedbackPostId: created.feedback_post_id_c,
          stage: created.stage_c,
          position: created.position_c,
          estimatedDate: created.estimated_date_c
        };
      } else {
        const updateParams = {
          records: [
            {
              Id: existingItem.Id,
              stage_c: newStage,
              position_c: newPosition,
              estimated_date_c: this.getEstimatedDate(newStage)
            }
          ]
        };

        const updateResponse = await apperClient.updateRecord("roadmap_item_c", updateParams);

        if (!updateResponse.success || !updateResponse.results?.[0]?.success) {
          throw new Error("Failed to update roadmap item");
        }

        const updated = updateResponse.results[0].data;
        return {
          Id: updated.Id,
          feedbackPostId: updated.feedback_post_id_c,
          stage: updated.stage_c,
          position: updated.position_c,
          estimatedDate: updated.estimated_date_c
        };
      }
    } catch (error) {
      console.error("Error updating roadmap stage:", error);
      throw error;
    }
  },

  async updatePosition(id, newPosition) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        records: [
          {
            Id: parseInt(id),
            position_c: newPosition
          }
        ]
      };

      const response = await apperClient.updateRecord("roadmap_item_c", params);

      if (!response.success || !response.results?.[0]?.success) {
        throw new Error(`Failed to update position for roadmap item ${id}`);
      }

      const updated = response.results[0].data;
      return {
        Id: updated.Id,
        estimatedDate: updated.estimated_date_c,
        feedbackPostId: updated.feedback_post_id_c,
        position: updated.position_c,
        stage: updated.stage_c
      };
    } catch (error) {
      console.error(`Error updating roadmap position ${id}:`, error);
      throw error;
    }
  },

  getEstimatedDate(stage) {
    const now = new Date();
    switch (stage) {
      case "planned":
        return new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      case "in-progress":
        return new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      case "completed":
        return new Date().toISOString().split('T')[0];
      default:
        return null;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "estimated_date_c" } },
          { field: { Name: "feedback_post_id_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "stage_c" } }
        ]
      };

      const response = await apperClient.getRecordById("roadmap_item_c", id, params);

      if (!response.success || !response.data) {
        throw new Error(`Roadmap item with id ${id} not found`);
      }

      const item = response.data;
      const roadmapItem = {
        Id: item.Id,
        estimatedDate: item.estimated_date_c || null,
        feedbackPostId: item.feedback_post_id_c || "",
        position: item.position_c || 0,
        stage: item.stage_c || "planned"
      };

      try {
        const post = await feedbackService.getById(roadmapItem.feedbackPostId);
        return { ...roadmapItem, post };
      } catch (error) {
        throw new Error(`Associated feedback post (ID: ${roadmapItem.feedbackPostId}) not found for roadmap item`);
      }
    } catch (error) {
      console.error(`Error fetching roadmap item ${id}:`, error);
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

      const response = await apperClient.deleteRecord("roadmap_item_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting roadmap item ${id}:`, error);
      throw error;
    }
  }
};