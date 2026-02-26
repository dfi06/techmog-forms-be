const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema')

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
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.cookie("userId", user._id.toString(), {
    httpOnly: true,
    secure: true,        
    sameSite: "None",    
  });

  res.json({ message: "Login successful" });
});

router.get('/me', (req, res) => {
  console.log(req.cookies);
  res.json(req.cookies);
});

module.exports = router;