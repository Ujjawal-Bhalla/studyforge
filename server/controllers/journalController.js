const journalModel = require("../models/journalModel");

// Create entry
const createEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const entry = await journalModel.createEntry(userId, content);

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get entries
const getEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await journalModel.getEntries(userId);

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update entry
const updateJournal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;

    const updated = await journalModel.updateEntry(id, userId, content);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update entry" });
  }
}; 

// Delete entry
const deleteJournal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await journalModel.deleteEntry(id, userId);

    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
}; 

module.exports = {
  createEntry,
  getEntries,
  updateJournal,
  deleteJournal
};
