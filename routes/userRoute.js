const express = require('express');
const router = express.Router();
const { User } = require('../model/users'); // Import your MongoDB User model

// Create a new user (POST /users)
router.post('/user', async (req, res) => {
  try {
    const { name, email, profile_picture, role, password } = req.body;
    const user = new User({ name, email, profile_picture, role, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// User login (POST /login)
router.post('/login', async (req, res) => {
  try {

    const { email, password, role } = req.body;
    const user = await User.findOne({ email, password, role });
    if (user) {
      // User found, login successful
      res.status(200).json({user} );
    } else {
      // User not found or credentials are incorrect
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get all users (GET /user)
router.get('/user', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ message: 'Failed to retrieve user details' });
  }
});

router.get('/showmanager', async (req, res) => {
  try {
    // Fetch users with the role 'Project Manager' from the database
    const projectManagers = await User.find({ role: 'Project Manager' });

    res.send(projectManagers );
  } catch (error) {
    console.error('Error fetching Project Managers:', error);
    res.status(500).json({ message: 'Failed to fetch Project Managers' });
  }
});

router.get('/showteammembers', async (req, res) => {
  try {
    // Fetch users with the role 'Project Manager' from the database
    const TeamMember = await User.find({ role: 'Team Member' });

    res.send(TeamMember );
  } catch (error) {
    console.error('Error fetching Project Managers:', error);
    res.status(500).json({ message: 'Failed to fetch Project Managers' });
  }
});

// Get a specific user by ID (GET /user/:id)
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ message: 'Failed to retrieve user details' });
  }
});

// Update user data by ID (PATCH /user/:id)
router.patch('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    await User.findByIdAndUpdate(userId, updatedUserData);
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Failed to update user details' });
  }
});

// Delete a user by ID (DELETE /user/:id)
router.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndRemove(userId);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
