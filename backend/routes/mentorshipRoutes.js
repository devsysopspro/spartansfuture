// routes/mentorshipRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get student dashboard data
router.get('student/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // In a real app, you'd have separate Mentor and Session models
    const mentor = await User.findOne({ role: 'mentor', interests: { $in: student.interests } });
    
    const dashboardData = {
      name: student.name,
      mentor: {
        name: mentor?.name || 'Not assigned',
        expertise: mentor?.interests || ''
      },
      sessions: [], // Would come from a Session model
      goals: student.interests.split(',').map(i => i.trim())
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentor dashboard data
router.get('mentor/:id', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    // Get assigned students (would be more complex in real app)
    const students = await User.find({ 
      role: 'student',
      interests: { $in: mentor.interests }
    }).limit(5);
    
    res.json({
      mentor: mentor,
      students: students,
      upcomingSessions: [] // Would come from Session model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;