import changelogData from "@/services/mockData/changelogEntries.json";

let entries = [...changelogData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const changelogService = {
  async getAll() {
    await delay(300);
    // Sort by release date, newest first
    return entries
      .slice()
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  },

  async getById(id) {
    await delay(150);
    const entry = entries.find(e => e.Id === parseInt(id));
    if (!entry) {
      throw new Error(`Changelog entry with id ${id} not found`);
    }
    return { ...entry };
  },

  async create(entryData) {
    await delay(400);
    const newId = Math.max(...entries.map(e => e.Id)) + 1;
    const newEntry = {
      Id: newId,
      ...entryData,
      releaseDate: new Date().toISOString()
    };
    entries.unshift(newEntry); // Add to beginning for newest first
    return { ...newEntry };
  },

  async update(id, updateData) {
    await delay(300);
    const index = entries.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Changelog entry with id ${id} not found`);
    }
    entries[index] = {
      ...entries[index],
      ...updateData
    };
    return { ...entries[index] };
  },

  async delete(id) {
    await delay(250);
    const index = entries.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Changelog entry with id ${id} not found`);
    }
    const deleted = entries.splice(index, 1)[0];
    return { ...deleted };
  }
};