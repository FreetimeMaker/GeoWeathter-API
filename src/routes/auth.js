const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Neuen Benutzer registrieren
 * @body    { email, password, name }
 * @returns { user, token, refreshToken }
 */
router.post('/register', AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Benutzer anmelden
 * @body    { email, password }
 * @returns { user, token, refreshToken }
 */
router.post('/login', AuthController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Benutzer abmelden
 * @returns { message }
 */
router.post('/logout', AuthController.logout);

module.exports = router;
