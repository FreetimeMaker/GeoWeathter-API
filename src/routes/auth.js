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
router.get("/github/mobile-callback", githubCallback);

module.exports = router;
