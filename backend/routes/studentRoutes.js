const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/students', async (req, res) => {
    console.log("Received request for students"); // Check if this appears in terminal
    try {
      // Fetch only students (not mentors) and exclude sensitive data
      const students = await User.find(
        { role: 'student' },
        { name: 1, interests: 1, profileImage: 1, _id: 1 }
      );
      
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
});
  
module.exports = router;