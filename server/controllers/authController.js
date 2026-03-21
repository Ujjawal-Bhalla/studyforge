//SIGNUP
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await createUser(email, hashedPassword);

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//LOGIN
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

