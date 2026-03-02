const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_EMAIL = "kanishkchawhan.ai26@jecrc.ac.in";
const ADMIN_PASSWORD = "Kanishk24";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    let role = "user";
    if (email === ADMIN_EMAIL) {
      role = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: "Server error during registration. Please try again." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let user = await User.findOne({ email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name: "Admin", email, password: hashedPassword, role: "admin" });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: "admin", coupons: user.coupons || 0 }
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, coupons: user.coupons || 0 }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };
