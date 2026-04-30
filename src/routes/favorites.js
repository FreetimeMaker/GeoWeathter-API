const express = require('express');
const FavoriteController = require('../controllers/FavoriteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Alle Routes erfordern Authentifizierung
router.use(authMiddleware);

/**
 * @route   POST /api/favorites
 * @desc    Neuen Favorit erstellen
 * @body    { name, latitude, longitude }
 * @returns { favorite }
 */
router.post('/', FavoriteController.create);

/**
 * @route   GET /api/favorites
 * @desc    Alle Favoriten des Benutzers abrufen
 * @returns { favorites[] }
 */
router.get('/', FavoriteController.getAll);

/**
 * @route   GET /api/favorites/:id
 * @desc    Favorit nach ID abrufen
 * @returns { favorite }
 */
router.get('/:id', FavoriteController.getById);

/**
 * @route   PUT /api/favorites/:id
 * @desc    Favorit aktualisieren
 * @body    { name, latitude, longitude }
 * @returns { favorite }
 */
router.put('/:id', FavoriteController.update);

/**
 * @route   DELETE /api/favorites/:id
 * @desc    Favorit löschen
 * @returns { message }
 */
router.delete('/:id', FavoriteController.delete);

/**
 * @route   POST /api/favorites/sync
 * @desc    Favoriten geräteübergreifend synchronisieren
 * @body    { favorites[] }
 * @returns { favorites[] }
 */
router.post('/sync', FavoriteController.sync);

module.exports = router;
