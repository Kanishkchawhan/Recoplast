const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_EMAIL = "kanishkchawhan.ai26@jecrc.ac.in";
const ADMIN_PASSWORD = "Kanishk24";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Set role (admin or user)
    let role = "user";
    if (email === ADMIN_EMAIL) {
      role = "admin";
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name: name || email.split('@')[0], // Use part of email as name if not provided
      email, 
      password: hashedPassword, 
      role 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    
    // Send more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Invalid input data" });
    } else if (error.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    res.status(500).json({ message: "Server error during registration. Please try again." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special admin login logic
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let user = await User.findOne({ email });
      if (!user) {
        // Auto-create admin if not exists
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name: "Admin", email, password: hashedPassword, role: "admin" });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token, user: { name: user.name, email: user.email, role: "admin" } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { registerUser, loginUser };
