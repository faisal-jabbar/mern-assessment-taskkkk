import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ Register Controller
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic field check
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user (password hashed in pre-save hook)
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET not configured in .env' });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ msg: 'User registered', token });
  } catch (error) {
    console.error('❌ Register Error:', error);
    res.status(500).json({ msg: 'Registration failed. Try again later.' });
  }
};

// ✅ Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Basic field check
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (wrong password)' });
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET not configured in .env' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ msg: 'Logged in successfully', token });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ msg: 'Login failed. Try again later.' });
  }
};

// ✅ Logout (placeholder)
export const logoutUser = (req, res) => {
  res.status(200).json({ msg: 'Logout successful (placeholder)' });
};

// ✅ Update Password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Password Update Error:', err);
    res.status(500).json({ msg: 'Failed to update password' });
  }
};
