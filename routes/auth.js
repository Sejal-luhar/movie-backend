const express = require('express');
const passport = require('passport');
const User=require('../models/userSchema')
const router = express.Router();

// Register Route
router.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      const newUser = new User({ email });
      await User.register(newUser, password);
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful!', user: req.user });
  });
  

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Logout successful!' });
  });
});

module.exports = router;
