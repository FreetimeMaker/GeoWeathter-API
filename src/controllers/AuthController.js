const User = require('../models/User');
const pool = require('../config/database');
const { generateToken, generateRefreshToken } = require('../config/auth');

// Dynamic import for Octokit OAuth (ESM inside CommonJS)
let OAuthApp;
(async () => {
  const module = await import("@octokit/oauth-app");
  OAuthApp = module.OAuthApp;
})();

const AuthController = {

  // ---------------------------------------------------------
  // GitHub OAuth – Start
  // ---------------------------------------------------------
  async githubAuth(req, res) {
    const app = new OAuthApp({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    });

    const url = app.getAuthorizationUrl({
      scopes: ["user:email"]
    });

    res.redirect(url);
  },

  // ---------------------------------------------------------
  // GitHub OAuth – Callback (Deep Link Redirect)
  // ---------------------------------------------------------
  async githubCallback(req, res) {
    try {
      const { code } = req.query;

      const app = new OAuthApp({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      });

      const tokenData = await app.createToken({ code });
      const accessToken = tokenData.authentication.token;

      // Fetch GitHub user
      const userResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const ghUser = await userResponse.json();

      // Check if user exists
      let user = await User.findByUsername(ghUser.login);

      if (!user) {
        user = await User.createOAuthUser(
          ghUser.login,
          ghUser.name || ghUser.login,
          ghUser.avatar_url
        );
      }

      const token = generateToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id);

      const avatar = encodeURIComponent(user.avatar_url || "");

      return res.redirect(
        `geoweather://auth/callback?token=${token}&avatar=${avatar}`
      );

    } catch (error) {
      console.error("GitHub OAuth error:", error);
      return res.status(500).json({ message: "OAuth failed", error: error.message });
    }
  },

  // ---------------------------------------------------------
  // GitHub OAuth – Mobile JSON Callback
  // ---------------------------------------------------------
  async githubMobileCallback(req, res) {
    try {
      const { code } = req.query;

      const app = new OAuthApp({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      });

      const tokenData = await app.createToken({ code });
      const accessToken = tokenData.authentication.token;

      const userResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const ghUser = await userResponse.json();

      let user = await User.findByUsername(ghUser.login);

      if (!user) {
        user = await User.createOAuthUser(
          ghUser.login,
          ghUser.name || ghUser.login,
          ghUser.avatar_url
        );
      }

      const token = generateToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id);

      return res.status(200).json({
        success: true,
        message: "GitHub authentication successful",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar_url: user.avatar_url,
          subscription_tier: user.subscription_tier
        },
        token,
        refreshToken
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

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
    return res.status(200).json({ message: 'Successfully logged out' });
  },
};

module.exports = AuthController;
