const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema')
const authMiddleware = require('../middleware.js');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
  res.send('Sup World!');
});

router.post('/register', async (req, res) => {
  try {
    console.log("BODY:", req.body);
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
      userId: newUser._id
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
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user.userId
  });
});

module.exports = router;