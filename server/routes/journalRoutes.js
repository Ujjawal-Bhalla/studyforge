const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createEntry,
  getEntries,
} = require("../controllers/journalController");

router.post("/", authMiddleware, createEntry);
router.get("/", authMiddleware, getEntries);

module.exports = router;
