require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/mentorship', mentorshipRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Full error stack:", err.stack); // Log full error details
  res.status(500).json({ 
    message: err.message || "Something broke",
    errorType: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

