const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../config/auth');

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, Passwort und Name erforderlich' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email bereits registriert' });
      }

      const user = await User.create(email, password, name);

      const token = generateToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id);

      res.status(201).json({
        message: 'Benutzer erfolgreich registriert',
        user: {
          id: user.id,
          email: user.email,
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
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email und Passwort erforderlich' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
      }

      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
      }

      const token = generateToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id);

      res.status(200).json({
        message: 'Erfolgreich angemeldet',
        user: {
          id: user.id,
          email: user.email,
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
    // Logout-Logik (z.B. Token invalidieren, wenn mit Blacklist-System)
    res.status(200).json({ message: 'Erfolgreich abgemeldet' });
  },
};

module.exports = AuthController;
