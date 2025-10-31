import roadmapData from "@/services/mockData/roadmapItems.json";
import { feedbackService } from "@/services/api/feedbackService";

let roadmapItems = [...roadmapData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const roadmapService = {
  async getAll() {
    await delay(350);
    
    // Get all roadmap items with their associated feedback posts
    const itemsWithPosts = await Promise.all(
      roadmapItems.map(async (item) => {
        try {
          const post = await feedbackService.getById(item.feedbackPostId);
          return {
            ...item,
            post
          };
        } catch (error) {
          return null;
        }
      })
    );
    
    // Filter out items where post couldn't be found and group by stage
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
        .sort((a, b) => b.position - a.position) // Completed items show newest first
    };
    
    return grouped;
  },

  async updateStage(feedbackPostId, newStage, newPosition = 1) {
    await delay(300);
    
    const index = roadmapItems.findIndex(item => 
      item.feedbackPostId === String(feedbackPostId)
    );
    
    if (index === -1) {
      // Create new roadmap item if it doesn't exist
      const newId = Math.max(...roadmapItems.map(item => item.Id)) + 1;
      const newItem = {
        Id: newId,
        feedbackPostId: String(feedbackPostId),
        stage: newStage,
        position: newPosition,
        estimatedDate: this.getEstimatedDate(newStage)
      };
      roadmapItems.push(newItem);
      return { ...newItem };
    } else {
      // Update existing item
      roadmapItems[index] = {
        ...roadmapItems[index],
        stage: newStage,
        position: newPosition,
        estimatedDate: this.getEstimatedDate(newStage)
      };
      return { ...roadmapItems[index] };
    }
  },

  async updatePosition(id, newPosition) {
    await delay(200);
    const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Roadmap item with id ${id} not found`);
    }
    
    roadmapItems[index].position = newPosition;
    return { ...roadmapItems[index] };
  },

  getEstimatedDate(stage) {
    const now = new Date();
    switch (stage) {
      case "planned":
        return new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // +90 days
      case "in-progress":
        return new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // +30 days
      case "completed":
        return new Date().toISOString().split('T')[0]; // Today
      default:
        return null;
    }
  },

async getById(id) {
    await delay(150);
    const item = roadmapItems.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error(`Roadmap item with id ${id} not found`);
    }
    
    // Fetch associated feedback post
    try {
      const post = await feedbackService.getById(item.feedbackPostId);
      return { ...item, post };
    } catch (error) {
      throw new Error(`Associated feedback post (ID: ${item.feedbackPostId}) not found for roadmap item`);
    }
  },

  async delete(id) {
    await delay(200);
    const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Roadmap item with id ${id} not found`);
    }
    const deleted = roadmapItems.splice(index, 1)[0];
    return { ...deleted };
  }
};