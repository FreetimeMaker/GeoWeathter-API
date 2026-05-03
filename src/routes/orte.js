const express = require('express');
const OrteController = require('../controllers/OrteController');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

// Use optional authentication (supports anonymous free plan)
router.use(optionalAuth);

/**
 * @route   POST /api/orte
 * @desc    Erstelle neuen Ort (auch anonym, free plan Limit 4)
 * @body    { name, latitude, longitude }
 * @returns { ort }
 */
router.post('/', OrteController.create);

/**
 * @route   GET /api/orte
 * @desc    Hole alle Orte des Users/Anons
 * @returns { orte[] }
 */
router.get('/', OrteController.getAll);

/**
 * @route   GET /api/orte/:id
 * @desc    Hole Ort by ID
 * @returns { ort }
 */
router.get('/:id', OrteController.getById);

/**
 * @route   PUT /api/orte/:id
 * @desc    Update Ort
 * @body    { name, latitude, longitude }
 * @returns { ort }
 */
router.put('/:id', OrteController.update);

/**
 * @route   DELETE /api/orte/:id
 * @desc    Lösche Ort
 * @returns { message }
 */
router.delete('/:id', OrteController.delete);

/**
 * @route   POST /api/orte/sync
 * @desc    Synchronisiere Orte geräteübergreifend
 * @body    { orte[] }
 * @returns { orte[] }
 */
router.post('/sync', OrteController.sync);

module.exports = router;

