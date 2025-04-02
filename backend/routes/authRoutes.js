const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require('multer'); // Add multer for file uploads
const User = require("../models/User");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory (you might want to use diskStorage for production)
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Updated Signup endpoint with file handling
router.post("/signup", upload.single('profilePicture'), async (req, res) => {
  try {
    console.log("Incoming request files:", req.file); // Log uploaded file info
    console.log("Incoming request body:", req.body); // Log other form data
    // Get form data from body and file
    const { name, username, email, password, role, interests, cashtag } = req.body;
    const profilePicture = req.file;

    // Validate input
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists",
        field: existingUser.email === email ? "email" : "username"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile picture upload
    let profileImageUrl = '/images/nopic.png';
    
    if (profilePicture) {
      // In production, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll just use a placeholder
      profileImageUrl = `data:${profilePicture.mimetype};base64,${profilePicture.buffer.toString('base64')}`;
    }

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      interests: interests || "",
      cashtag: cashtag || "",
      profileImage: profileImageUrl
    });

    await newUser.save();
    
    res.status(201).json({ 
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login handler remains the same
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 3. Create session/token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

module.exports = router;