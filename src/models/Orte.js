const pool = require('../config/database');
const { generateUUID } = require('../utils/helpers');

const Locations = {
  async create(userId, name, latitude, longitude) {
    const ortId = generateUUID();
    const createdAt = new Date();

    const query = `
      INSERT INTO orte (id, user_id, name, latitude, longitude, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      ortId,
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
      SELECT * FROM orte 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findById(ortId) {
    const query = 'SELECT * FROM orte WHERE id = $1';
    const result = await pool.query(query, [ortId]);
    return result.rows[0];
  },

  async update(ortId, userId, data) {
    const { name, latitude, longitude } = data;
    const query = `
      UPDATE orte 
      SET name = COALESCE($3, name),
          latitude = COALESCE($4, latitude),
          longitude = COALESCE($5, longitude),
          updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [
      ortId,
      userId,
      name,
      latitude,
      longitude,
    ]);

    return result.rows[0];
  },

  async delete(ortId, userId) {
    const query = 'DELETE FROM orte WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [ortId, userId]);
    return result.rowCount > 0;
  },

  async sync(userId, orte) {
    // Geräteübergreifend synchronisiert
    const query = `
      DELETE FROM orte WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);

    // Neue Orte einfügen
    for (const ort of orte) {
      const ortId = generateUUID();
      const createdAt = new Date();

      const insertQuery = `
        INSERT INTO orte (id, user_id, name, latitude, longitude, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;

      await pool.query(insertQuery, [
        ortId,
        userId,
        ort.name,
        ort.latitude,
        ort.longitude,
        createdAt,
        createdAt,
      ]);
    }

    return this.findByUserId(userId);
  },
};

module.exports = Orte;

