const Orte = require('../models/Orte');
const Subscription = require('../models/Subscription');
const { generateUUID } = require('../utils/helpers');

const OrteController = {
  async create(req, res) {
    try {
      const { name, latitude, longitude } = req.body;
      let userId = req.user.userId;

      // Anonymous user handling
      if (req.isAnonymous) {
        userId = 'anon_' + generateUUID().slice(0,8);
        req.user.userId = userId; // Persist for session
      }

      if (!name || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ 
          message: 'Name, Latitude and Longitude required' 
        });
      }

      // Check subscription limits (free for anon)
      const tier = req.isAnonymous ? Subscription.TIERS.FREE : (await Subscription.getSubscription(userId))?.tier || Subscription.TIERS.FREE;
      const maxOrte = Subscription.FEATURES[tier].maxOrte;

      const userOrte = await Orte.findByUserId(userId);
      if (userOrte.length >= maxOrte) {
        return res.status(403).json({ 
          message: `Maximum number of Orte (${maxOrte}) erreicht` 
        });
      }

      const ort = await Orte.create(userId, name, latitude, longitude);

      res.status(201).json({
        message: 'Ort erfolgreich erstellt',
        ort,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const orte = await Orte.findByUserId(userId);

      res.status(200).json({
        message: 'Orte abgerufen',
        count: orte.length,
        orte,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const ort = await Orte.findById(id);
      if (!ort || ort.user_id !== userId) {
        return res.status(404).json({ message: 'Ort not found' });
      }

      res.status(200).json(ort);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { name, latitude, longitude } = req.body;

      const ort = await Orte.findById(id);
      if (!ort || ort.user_id !== userId) {
        return res.status(404).json({ message: 'Ort not found' });
      }

      const updatedOrt = await Orte.update(id, userId, {
        name,
        latitude,
        longitude,
      });

      res.status(200).json({
        message: 'Ort aktualisiert',
        ort: updatedOrt,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const ort = await Orte.findById(id);
      if (!ort || ort.user_id !== userId) {
        return res.status(404).json({ message: 'Ort not found' });
      }

      await Orte.delete(id, userId);

      res.status(200).json({ message: 'Ort gelöscht' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async sync(req, res) {
    try {
      const userId = req.user.userId;
      const { orte } = req.body;

      if (!Array.isArray(orte)) {
        return res.status(400).json({ 
          message: 'Orte must be an array' 
        });
      }

      const syncedOrte = await Orte.sync(userId, orte);

      res.status(200).json({
        message: 'Orte synchronisiert',
        orte: syncedOrte,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = OrteController;

