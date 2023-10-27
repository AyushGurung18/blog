const express = require("express");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../models/User");
const Note = require("../models/note");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, secret);

    res.cookie('token' , token , { httpOnly:true });
    res.status(200).json({ message: "Signup successful", token });

    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
  
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message: "All fields are required"})
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId : user._id }, secret);
    
    res.cookie('token' , token , { httpOnly:true });
    res.status(200).json({ message: "Login successful", token }); // Send a response to the client


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/logout' , (req, res)=>{
  res.clearCookie('token');
  res.json({success:true});
});

router.get('/user-info', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }
  
  try {
    const { userId } = jwt.verify(token, secret);
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const username = user.username;
    res.status(200).json({ username });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
  
  
});


module.exports = router;
