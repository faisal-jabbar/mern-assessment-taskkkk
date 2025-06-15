const User = require('../models/User');

exports.getProfile = async (req, res) => {
  console.log('HIT /api/auth/profile'); // For debugging
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
