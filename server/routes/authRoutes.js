const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { signup, login, deleteAccount, updateName } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
router.put("/name", authMiddleware, updateName);
router.delete("/delete", authMiddleware, deleteAccount);
module.exports = router;
