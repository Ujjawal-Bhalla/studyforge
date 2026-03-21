const taskModel = require("../models/taskModel");

// Create task
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await taskModel.createTask(userId, title);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await taskModel.getTasksByUser(userId);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { completed } = req.body;

    const task = await taskModel.updateTask(taskId, userId, completed);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await taskModel.deleteTask(taskId, userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
