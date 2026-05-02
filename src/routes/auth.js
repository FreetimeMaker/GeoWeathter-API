const express = require('express');
const AuthController = require('../controllers/AuthController');
const passport = require('passport');

const router = express.Router();

// GitHub OAuth - Start authentication
/**
 * @route   GET /api/auth/github
 * @desc    Login with GitHub (redirects to GitHub)
 * @returns { redirect to GitHub }
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth - Callback
/**
 * @route   GET /api/auth/github/callback
 * @desc    GitHub OAuth callback
 * @returns { user, token, refreshToken }
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  AuthController.githubCallback
);

module.exports = router;
