const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "mentor"] },
  interests: { type: String, default: "" },
  profileImage: {type: String, default:"/images/nopic.png"},
  cashtag:{type: String, default: "" }
}, { timestamps: true });

// Add index for faster queries
userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model("User", userSchema);