const passport = require('passport');
const User = require('../models/User');
const pool = require('../config/database');
const { generateToken, generateRefreshToken } = require('../config/auth');

const AuthController = {

  // ---------------------------------------------------------
  // GitHub OAuth – Start
  // ---------------------------------------------------------
  githubAuth: passport.authenticate('github', { scope: ['user:email'] }),

  // ---------------------------------------------------------
  // GitHub OAuth – Callback + Redirect in die App
  // ---------------------------------------------------------
  githubCallback: [
    passport.authenticate('github', { failureRedirect: '/login' }),

    async (req, res) => {
      try {
        const user = req.user;

        const token = generateToken(user.id, user.username);
        const refreshToken = generateRefreshToken(user.id);

        const avatar = encodeURIComponent(user.avatar_url || "");

        return res.redirect(
          `geoweather://auth/callback?token=${token}&avatar=${avatar}`
        );

      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  ],

  // ---------------------------------------------------------
  // GitHub OAuth – Mobile Callback (JSON response for Android/iOS)
  // ---------------------------------------------------------
  githubMobileCallback: [
    passport.authenticate('github', { failureRedirect: '/login' }),

    async (req, res) => {
      try {
        const user = req.user;

        const token = generateToken(user.id, user.username);
        const refreshToken = generateRefreshToken(user.id);

        return res.status(200).json({
          success: true,
          message: 'GitHub authentication successful',
          user: {
            id: user.id,
            username: user.username,
            name: user.name || user.username,
            avatar_url: user.avatar_url || null,
            subscription_tier: user.subscription_tier || 'freemium',
          },
          token,
          refreshToken,
        });

      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  ],

  // ---------------------------------------------------------
  // Registrierung (Username + Passwort)
  // ---------------------------------------------------------
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

      return res.status(201).json({
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
      return res.status(500).json({ message: error.message });
    }
  },

  // ---------------------------------------------------------
  // Login (Username + Passwort)
  // ---------------------------------------------------------
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

      return res.status(200).json({
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
      return res.status(500).json({ message: error.message });
    }
  },

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------
  async logout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      return res.status(200).json({ message: 'Successfully logged out' });
    });
  },
};

module.exports = AuthController;
