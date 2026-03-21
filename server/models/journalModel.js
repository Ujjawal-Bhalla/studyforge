const db = require("../config/db");

// Create entry
const createEntry = async (userId, content) => {
  const result = await db.query(
    "INSERT INTO journal_entries (user_id, content) VALUES ($1, $2) RETURNING *",
    [userId, content]
  );
  return result.rows[0];
};

// Get all entries
const getEntries = async (userId) => {
  const result = await db.query(
    "SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

module.exports = {
  createEntry,
  getEntries,
};
