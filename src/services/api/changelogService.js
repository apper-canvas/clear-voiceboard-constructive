import { getApperClient } from "@/services/apperClient";

export const changelogService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "release_date_c" } },
          { field: { Name: "related_post_ids_c" } }
        ],
        orderBy: [{ fieldName: "release_date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("changelog_entry_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(entry => ({
        Id: entry.Id,
        title: entry.title_c || "",
        description: entry.description_c || "",
        category: entry.category_c || "",
        releaseDate: entry.release_date_c || new Date().toISOString(),
        relatedPostIds: entry.related_post_ids_c ? entry.related_post_ids_c.split(',').filter(Boolean) : []
      }));
    } catch (error) {
      console.error("Error fetching changelog entries:", error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "release_date_c" } },
          { field: { Name: "related_post_ids_c" } }
        ]
      };

      const response = await apperClient.getRecordById("changelog_entry_c", id, params);

      if (!response.success || !response.data) {
        throw new Error(`Changelog entry with id ${id} not found`);
      }

      const entry = response.data;
      return {
        Id: entry.Id,
        title: entry.title_c || "",
        description: entry.description_c || "",
        category: entry.category_c || "",
        releaseDate: entry.release_date_c || new Date().toISOString(),
        relatedPostIds: entry.related_post_ids_c ? entry.related_post_ids_c.split(',').filter(Boolean) : []
      };
    } catch (error) {
      console.error(`Error fetching changelog entry ${id}:`, error);
      throw error;
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const params = {
        records: [
          {
            Name: entryData.title || "Untitled",
            title_c: entryData.title || "",
            description_c: entryData.description || "",
            category_c: entryData.category || "",
            release_date_c: new Date().toISOString(),
            related_post_ids_c: entryData.relatedPostIds ? entryData.relatedPostIds.join(',') : ""
          }
        ]
      };

      const response = await apperClient.createRecord("changelog_entry_c", params);

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
          releaseDate: created.release_date_c || new Date().toISOString(),
          relatedPostIds: created.related_post_ids_c ? created.related_post_ids_c.split(',').filter(Boolean) : []
        };
      }

      throw new Error("Failed to create changelog entry");
    } catch (error) {
      console.error("Error creating changelog entry:", error);
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

      if (updateData.title !== undefined) updateFields.title_c = updateData.title;
      if (updateData.description !== undefined) updateFields.description_c = updateData.description;
      if (updateData.category !== undefined) updateFields.category_c = updateData.category;
      if (updateData.releaseDate !== undefined) updateFields.release_date_c = updateData.releaseDate;
      if (updateData.relatedPostIds !== undefined) updateFields.related_post_ids_c = updateData.relatedPostIds.join(',');

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord("changelog_entry_c", params);

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
          releaseDate: updated.release_date_c || new Date().toISOString(),
          relatedPostIds: updated.related_post_ids_c ? updated.related_post_ids_c.split(',').filter(Boolean) : []
        };
      }

      throw new Error("Failed to update changelog entry");
    } catch (error) {
      console.error(`Error updating changelog entry ${id}:`, error);
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

      const response = await apperClient.deleteRecord("changelog_entry_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting changelog entry ${id}:`, error);
      throw error;
    }
  }
};