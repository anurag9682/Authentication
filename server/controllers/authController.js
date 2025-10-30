import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if any field is missing
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  // Check if user already exists
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token valid for 1 day
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in cookies for session persistence
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if any field is missing
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invaild Email or Password" });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invaild Password" });
    }

    // Generate JWT token valid for 1 day
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Store the token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ----------------> LOGOUT <-------------------------

export const logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      none: "strict",
    });

    return res.json({ success: true, message: "Logout Successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
