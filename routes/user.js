const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signin
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists.",
      });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({
        message: "Username should have at least 3 characters.",
      });
    }

    // Validate password length
    if (password.length < 3) {
      return res.status(400).json({
        message: "Password should have at least 3 characters.",
      });
    } else if (password.length > 30) {
      return res.status(400).json({
        message: "Password characters cannot exceed 30 characters.",
      });
    }

    // Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({
      message: "Sign-in successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Login
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [{ name: username }, { jti: jwt.sign({}, process.env.JWT_TOKEN) }];
        const token = jwt.sign({ authClaims }, process.env.JWT_TOKEN, { expiresIn: "30d" });
        res.status(200).json({
          id: existingUser._id,
          token: token,
        });
      } else {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
