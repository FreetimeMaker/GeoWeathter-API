const express = require('express');
const SubscriptionController = require('../controllers/SubscriptionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 * @body    { tier, paymentMethod }
 * @returns { subscription }
 */
router.post('/', SubscriptionController.createSubscription);

/**
 * @route   GET /api/subscriptions
 * @desc    Get user's subscription
 * @returns { subscription }
 */
router.get('/', SubscriptionController.getSubscription);

/**
 * @route   PUT /api/subscriptions
 * @desc    Update/upgrade subscription
 * @body    { tier, paymentMethod }
 * @returns { subscription }
 */
router.put('/', SubscriptionController.upgradeSubscription);

/**
 * @route   GET /api/subscriptions/features
 * @desc    Get available features based on tier
 * @returns { tier, features }
 */
router.get('/features', SubscriptionController.getFeatures);

module.exports = router;
