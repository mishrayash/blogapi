const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Checking if the username is already taken
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    //adding salt to the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
