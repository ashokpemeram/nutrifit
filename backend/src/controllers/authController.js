const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { calculateTargets } = require('../utils/calculations');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate BMR, TDEE, Calories & Macros
    const profileData = profile || {};
    const defaultProfile = {
      age: profileData.age || 26,
      gender: profileData.gender || 'male',
      heightCm: profileData.heightCm || 175,
      currentWeightKg: profileData.currentWeightKg || 75,
      targetWeightKg: profileData.targetWeightKg || 70,
      activityLevel: profileData.activityLevel || 'moderate',
      goal: profileData.goal || 'lose',
      weeklyTargetKg: profileData.weeklyTargetKg || 0.5,
    };

    const calculated = calculateTargets(defaultProfile);
    const finalProfile = {
      ...defaultProfile,
      bmr: calculated.bmr,
      tdee: calculated.tdee,
      calorieTarget: profileData.customCalorieTarget || calculated.recommendedCalories,
      customCalorieTarget: profileData.customCalorieTarget || null,
      proteinTargetG: calculated.proteinTarget,
      carbTargetG: calculated.carbTarget,
      fatTargetG: calculated.fatTarget,
      fiberTargetG: calculated.fiberTarget,
      waterTargetMl: calculated.waterTargetMl,
    };

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile: finalProfile,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        notifications: user.notifications,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & recalculate targets
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.notifications) {
        user.notifications = { ...user.notifications, ...req.body.notifications };
      }

      if (req.body.profile) {
        const updatedProf = { ...user.profile.toObject(), ...req.body.profile };
        const calculated = calculateTargets(updatedProf);

        user.profile = {
          ...updatedProf,
          bmr: calculated.bmr,
          tdee: calculated.tdee,
          calorieTarget: req.body.profile.customCalorieTarget || calculated.recommendedCalories,
          customCalorieTarget: req.body.profile.customCalorieTarget || null,
          proteinTargetG: calculated.proteinTarget,
          carbTargetG: calculated.carbTarget,
          fatTargetG: calculated.fatTarget,
          fiberTargetG: calculated.fiberTarget,
          waterTargetMl: updatedProf.waterTargetMl || calculated.waterTargetMl,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        notifications: updatedUser.notifications,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
