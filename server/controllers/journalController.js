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

module.exports = {
  createEntry,
  getEntries,
};
