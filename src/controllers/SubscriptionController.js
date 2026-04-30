const Subscription = require('../models/Subscription');
const User = require('../models/User');

const SubscriptionController = {
  async createSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { tier, paymentMethod } = req.body;

      if (!tier || !Object.values(Subscription.TIERS).includes(tier)) {
        return res.status(400).json({ 
          message: 'Ungültiger Abonnementtier' 
        });
      }

      const subscription = await Subscription.createSubscription(userId, tier, paymentMethod);

      res.status(201).json({
        message: 'Abonnement erstellt',
        subscription,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const subscription = await Subscription.getSubscription(userId);

      if (!subscription) {
        return res.status(200).json({
          message: 'Benutzer hat kein Premium-Abonnement',
          subscription: {
            tier: Subscription.TIERS.FREE,
            features: Subscription.FEATURES[Subscription.TIERS.FREE],
          },
        });
      }

      res.status(200).json({
        message: 'Abonnement abgerufen',
        subscription: {
          ...subscription,
          features: Subscription.FEATURES[subscription.tier],
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async upgradeSubscription(req, res) {
    try {
      const userId = req.user.userId;
      const { tier, paymentMethod } = req.body;

      const currentSubscription = await Subscription.getSubscription(userId);
      if (!currentSubscription) {
        return res.status(404).json({ 
          message: 'Kein Abonnement gefunden' 
        });
      }

      const updatedSubscription = await Subscription.updateSubscription(
        currentSubscription.id,
        tier
      );

      res.status(200).json({
        message: 'Abonnement aktualisiert',
        subscription: {
          ...updatedSubscription,
          features: Subscription.FEATURES[updatedSubscription.tier],
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getFeatures(req, res) {
    try {
      const userId = req.user.userId;
      const subscription = await Subscription.getSubscription(userId);
      const tier = subscription?.tier || Subscription.TIERS.FREE;

      const features = Subscription.FEATURES[tier];

      res.status(200).json({
        message: 'Features abgerufen',
        tier,
        features,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SubscriptionController;
