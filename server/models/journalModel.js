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

//Update entry
const updateEntry = async (id, userId, content) => {
  const result = await db.query(
    "UPDATE journal_entries SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [content, id, userId]
  );
  return result.rows[0];
};
//Delete entry
const deleteEntry = async (id, userId) => {
  await db.query(
    "DELETE FROM journal_entries WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
}
module.exports = {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry
};
