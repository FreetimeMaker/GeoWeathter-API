const express = require('express');
const AuthController = require('../controllers/AuthController');
const { githubLogin, githubCallback } = require("../config/passport");

const router = express.Router();

// Username/Password Auth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// GitHub OAuth
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

// Mobile GitHub OAuth (JSON)
router.get("/github/mobile-callback", async (req, res) => {
  try {
    const { code } = req.query;
    const token = await app.createToken({ code });

    res.json({
      success: true,
      token: token.authentication.token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
