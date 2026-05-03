const pool = require('../config/database');
const { generateUUID } = require('../utils/helpers');

const Locations = {
  async create(userId, name, latitude, longitude) {
    const locationId = generateUUID();
    const createdAt = new Date();

    const query = `
      INSERT INTO locations (id, user_id, name, latitude, longitude, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      locationId,
      userId,
      name,
      latitude,
      longitude,
      createdAt,
      createdAt,
    ]);

    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT * FROM locations 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findById(locationId) {
    const query = 'SELECT * FROM locations WHERE id = $1';
    const result = await pool.query(query, [locationId]);
    return result.rows[0];
  },

  async update(locationId, userId, data) {
    const { name, latitude, longitude } = data;
    const query = `
      UPDATE locations 
      SET name = COALESCE($3, name),
          latitude = COALESCE($4, latitude),
          longitude = COALESCE($5, longitude),
          updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [
      locationId,
      userId,
      name,
      latitude,
      longitude,
    ]);

    return result.rows[0];
  },

  async delete(locationId, userId) {
    const query = 'DELETE FROM locations WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [locationId, userId]);
    return result.rowCount > 0;
  },

  async sync(userId, locations) {
    // Cross-device synchronization
    const query = `
      DELETE FROM locations WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);

    // Insert new locations
    for (const location of locations) {
      const locationId = generateUUID();
      const createdAt = new Date();

      const insertQuery = `
        INSERT INTO locations (id, user_id, name, latitude, longitude, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;

      await pool.query(insertQuery, [
        locationId,
        userId,
        location.name,
        location.latitude,
        location.longitude,
        createdAt,
        createdAt,
      ]);
    }

    return this.findByUserId(userId);
  },
};

module.exports = Locations;

