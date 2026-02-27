const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/middleware.js');
const jwt = require('jsonwebtoken');

const User = require('../models/userSchema')

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    

    const encryptedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      password: encryptedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user_id: newUser._id
    });
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
  }
  
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id)
  console.log(user);
  
  if (!user){
    return res.status(401).json({message: "User not found"})
  }
  res.json({
    user
  });
});

module.exports = router;