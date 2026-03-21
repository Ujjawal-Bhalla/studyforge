const db = require("../config/db");

// Create task
const createTask = async (userId, title) => {
  const result = await db.query(
    "INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *",
    [userId, title]
  );
  return result.rows[0];
};

// Get all tasks for a user
const getTasksByUser = async (userId) => {
  const result = await db.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

// Update task (mark complete/incomplete)
const updateTask = async (taskId, userId, completed) => {
  const result = await db.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [completed, taskId, userId]
  );
  return result.rows[0];
};

// Delete task
const deleteTask = async (taskId, userId) => {
  const result = await db.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [taskId, userId]
  );
  return result.rows[0];
};

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
};
