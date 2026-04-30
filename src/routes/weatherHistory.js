const express = require('express');
const WeatherHistoryController = require('../controllers/WeatherHistoryController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Alle Routes erfordern Authentifizierung
router.use(authMiddleware);

/**
 * @route   POST /api/weather-history/record
 * @desc    Wetterdaten aufzeichnen
 * @body    { location, temperature, humidity, pressure, windSpeed, conditions, sensorData }
 * @returns { history }
 */
router.post('/record', WeatherHistoryController.record);

/**
 * @route   GET /api/weather-history
 * @desc    Wetterverlauf in Zeitraum abrufen
 * @query   { startDate, endDate, location? }
 * @returns { records[] }
 */
router.get('/', WeatherHistoryController.getHistory);

/**
 * @route   GET /api/weather-history/analytics/monthly
 * @desc    Monatliche Statistiken abrufen
 * @query   { location, year, month }
 * @returns { analytics }
 */
router.get('/analytics/monthly', WeatherHistoryController.getMonthlyAnalytics);

/**
 * @route   GET /api/weather-history/analytics/yearly
 * @desc    Jährliche Trends abrufen
 * @query   { location, year }
 * @returns { trend[] }
 */
router.get('/analytics/yearly', WeatherHistoryController.getYearlyTrend);

/**
 * @route   GET /api/weather-history/export
 * @desc    Wetterdaten exportieren (nur Premium)
 * @query   { startDate, endDate }
 * @returns { CSV }
 */
router.get('/export', WeatherHistoryController.exportData);

module.exports = router;
