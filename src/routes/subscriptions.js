const express = require('express');
const SubscriptionController = require('../controllers/SubscriptionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Alle Routes erfordern Authentifizierung
router.use(authMiddleware);

/**
 * @route   POST /api/subscriptions
 * @desc    Neues Abonnement erstellen
 * @body    { tier, paymentMethod }
 * @returns { subscription }
 */
router.post('/', SubscriptionController.createSubscription);

/**
 * @route   GET /api/subscriptions
 * @desc    Abonnement des Benutzers abrufen
 * @returns { subscription }
 */
router.get('/', SubscriptionController.getSubscription);

/**
 * @route   PUT /api/subscriptions
 * @desc    Abonnement aktualisieren/upgraden
 * @body    { tier, paymentMethod }
 * @returns { subscription }
 */
router.put('/', SubscriptionController.upgradeSubscription);

/**
 * @route   GET /api/subscriptions/features
 * @desc    Verfügbare Features basierend auf Tier abrufen
 * @returns { tier, features }
 */
router.get('/features', SubscriptionController.getFeatures);

module.exports = router;
