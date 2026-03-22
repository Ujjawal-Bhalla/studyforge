const pool = require("../config/db");

// Create user
const createUser = async (email, password,name) => {
  const result = await pool.query(
    "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
    [email, password, name]
  );
  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};
//Update user name
const updateUserName = async (userId, name) => {
  const result = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
    [name, userId]
  );
  return result.rows[0];
};

//Delete user
const deleteUser = async (userId) => {
  await pool.query(
    "DELETE FROM users WHERE id = $1",
    [userId]
  );
};
module.exports = {
  createUser,
  findUserByEmail,
  updateUserName,
  deleteUser
};