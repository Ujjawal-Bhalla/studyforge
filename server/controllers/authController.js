
//SIGNUP
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createUser,
  findUserByEmail,
  updateUserName,
  deleteUser
} = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!name||!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 pass name here
    const user = await createUser(email, hashedPassword, name);

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Step 3: include name in JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Step 4: return user also
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//UPDATE NAME
exports.updateName = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const updatedUser = await updateUserName(userId, name);

    res.json({
      message: "Name updated",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await deleteUser(userId);

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

