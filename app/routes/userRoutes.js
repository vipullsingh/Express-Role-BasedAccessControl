const express = require('express');
const router = express.Router();
const { authUser, authRole } = require('../middleware/authMiddleware');
const User = require('../models/user');
const { ROLES } = require('../utils/constants');

// Create a new user
router.post('/', authUser, authRole(ROLES.ADMIN), async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: ROLES.USER
    });

    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Delete a user by ID
router.delete('/:userId', authUser, authRole(ROLES.ADMIN), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
