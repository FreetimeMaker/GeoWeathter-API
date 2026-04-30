const express = require('express');
const authMiddleware = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const WeatherDataService = require('../services/WeatherDataService');
const MapTileService = require('../services/MapTileService');

const router = express.Router();

router.use(authMiddleware);

/**
 * @route   POST /api/premium/weather-sources
 * @desc    Wetterdaten von mehreren Quellen abrufen (Premium)
 * @body    { latitude, longitude, sources: ['openweather', 'weatherapi'] }
 */
router.post('/weather-sources', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check Premium-Zugriff
    const hasAccess = await Subscription.checkFeatureAccess(userId, 'multiple_sources');
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Feature erfordert Premium-Abonnement',
      });
    }

    const { latitude, longitude, sources } = req.body;

    if (!latitude || !longitude || !sources) {
      return res.status(400).json({
        message: 'Latitude, Longitude und Quellen erforderlich',
      });
    }

    const weatherData = await WeatherDataService.getAggregatedWeather(
      latitude,
      longitude,
      sources
    );

    res.status(200).json({
      message: 'Aggregierte Wetterdaten',
      data: weatherData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/premium/map-layers
 * @desc    Premium-Kartenebenen abrufen (Radar, Satellit, etc.)
 * @query   { latitude, longitude, zoom }
 */
router.get('/map-layers', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check Premium-Zugriff
    const hasAccess = await Subscription.checkFeatureAccess(userId, 'map_layers');
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Feature erfordert Premium-Abonnement',
      });
    }

    const { latitude, longitude, zoom } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude und Longitude erforderlich',
      });
    }

    const mapLayers = await MapTileService.getPremiumMapLayers(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(zoom) || 10
    );

    res.status(200).json({
      message: 'Kartenebenen abgerufen',
      layers: mapLayers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/premium/weather-alert
 * @desc    Push-Benachrichtigung für Wetterwarnungen (Premium)
 * @body    { latitude, longitude, alertType, message }
 */
router.post('/weather-alert', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check Premium-Zugriff
    const hasAccess = await Subscription.checkFeatureAccess(userId, 'push_notifications');
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Feature erfordert Premium-Abonnement',
      });
    }

    const { latitude, longitude, alertType, message } = req.body;

    if (!latitude || !longitude || !alertType) {
      return res.status(400).json({
        message: 'Koordinaten und Warntyp erforderlich',
      });
    }

    const PushNotificationService = require('../services/PushNotificationService');
    const notification = await PushNotificationService.sendWeatherAlert(
      userId,
      latitude,
      longitude,
      alertType,
      message
    );

    res.status(201).json({
      message: 'Benachrichtigung gesendet',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
