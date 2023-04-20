const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware');
const User = require('../models/user');

// Get current user's profile
router.get('/profile', authUser, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).select('-password');
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
