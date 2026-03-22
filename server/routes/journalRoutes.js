const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createEntry,
  getEntries,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");

router.post("/", authMiddleware, createEntry);
router.get("/", authMiddleware, getEntries);
router.put("/:id", authMiddleware, updateJournal);
router.delete("/:id", authMiddleware, deleteJournal);
module.exports = router;
