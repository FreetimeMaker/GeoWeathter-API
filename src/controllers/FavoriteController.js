const Favorite = require('../models/Favorite');
const Subscription = require('../models/Subscription');

const FavoriteController = {
  async create(req, res) {
    try {
      const { name, latitude, longitude } = req.body;
      const userId = req.user.userId;

      if (!name || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ 
          message: 'Name, Latitude und Longitude erforderlich' 
        });
      }

      // Check subscription limits
      const subscription = await Subscription.getSubscription(userId);
      const tier = subscription?.tier || Subscription.TIERS.FREE;
      const maxFavorites = Subscription.FEATURES[tier].maxFavorites;

      const userFavorites = await Favorite.findByUserId(userId);
      if (userFavorites.length >= maxFavorites) {
        return res.status(403).json({ 
          message: `Maximale Anzahl von Favoriten (${maxFavorites}) erreicht` 
        });
      }

      const favorite = await Favorite.create(userId, name, latitude, longitude);

      res.status(201).json({
        message: 'Favorit erfolgreich erstellt',
        favorite,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const favorites = await Favorite.findByUserId(userId);

      res.status(200).json({
        message: 'Favoriten abgerufen',
        count: favorites.length,
        favorites,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const favorite = await Favorite.findById(id);
      if (!favorite || favorite.user_id !== userId) {
        return res.status(404).json({ message: 'Favorit nicht gefunden' });
      }

      res.status(200).json(favorite);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { name, latitude, longitude } = req.body;

      const favorite = await Favorite.findById(id);
      if (!favorite || favorite.user_id !== userId) {
        return res.status(404).json({ message: 'Favorit nicht gefunden' });
      }

      const updatedFavorite = await Favorite.update(id, userId, {
        name,
        latitude,
        longitude,
      });

      res.status(200).json({
        message: 'Favorit aktualisiert',
        favorite: updatedFavorite,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const favorite = await Favorite.findById(id);
      if (!favorite || favorite.user_id !== userId) {
        return res.status(404).json({ message: 'Favorit nicht gefunden' });
      }

      await Favorite.delete(id, userId);

      res.status(200).json({ message: 'Favorit gelöscht' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async sync(req, res) {
    // Geräteübergreifende Synchronisation
    try {
      const userId = req.user.userId;
      const { favorites } = req.body;

      if (!Array.isArray(favorites)) {
        return res.status(400).json({ 
          message: 'Favoriten müssen ein Array sein' 
        });
      }

      const syncedFavorites = await Favorite.sync(userId, favorites);

      res.status(200).json({
        message: 'Favoriten synchronisiert',
        favorites: syncedFavorites,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = FavoriteController;
