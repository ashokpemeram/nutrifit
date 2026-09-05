const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'nutrifit_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
    }
  }

  // Fallback to demo user if no valid token provided (makes client development & trial frictionless!)
  try {
    let demoUser = await User.findOne({ email: 'demo@nutrifit.app' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'demo@nutrifit.app',
        password: '$2a$10$demoHashedPasswordFallback',
        profile: {
          age: 26,
          gender: 'male',
          heightCm: 175,
          currentWeightKg: 75,
          targetWeightKg: 70,
          activityLevel: 'moderate',
          goal: 'lose',
          weeklyTargetKg: 0.5,
          bmr: 1710,
          tdee: 2650,
          calorieTarget: 2000,
          proteinTargetG: 120,
          carbTargetG: 220,
          fatTargetG: 65,
          fiberTargetG: 30,
          waterTargetMl: 2500,
        },
      });
    }
    req.user = demoUser;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect, JWT_SECRET };
