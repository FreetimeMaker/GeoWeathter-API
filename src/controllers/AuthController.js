const passport = require('passport');
const User = require('../models/User');
const pool = require('../config/database');
const { generateToken, generateRefreshToken } = require('../config/auth');
const AuthController = {
  // GitHub OAuth authentication
  githubAuth(req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  },

  githubCallback(req, res, next) {
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'GitHub authentication failed' });
      }

      try {
        // Generate tokens for the authenticated user
        const token = generateToken(req.user.id, req.user.username);
        const refreshToken = generateRefreshToken(req.user.id);

        res.status(200).json({
          message: 'Successfully logged in with GitHub',
          user: {
            id: req.user.id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            subscription_tier: req.user.subscription_tier,
          },
          token,
          refreshToken,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    })(req, res, next);
  },

  async register(req, res) {
    try {
      const { username, password, name } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password and name required' });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const user = await User.create(username, password, name);

      const token = generateToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id);

      res.status(201).json({
        message: 'User successfully registered',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          subscription_tier: user.subscription_tier,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id);

      res.status(200).json({
        message: 'Successfully logged in',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          subscription_tier: user.subscription_tier,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async logout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.status(200).json({ message: 'Successfully logged out' });
    });
  },
};

module.exports = AuthController;
