const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const User = {
  async create(email, password, name) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    const query = `
      INSERT INTO users (id, email, password, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [userId, email, hashedPassword, name, createdAt, createdAt]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email bereits registriert');
      }
      throw error;
    }
  },

  async findById(userId) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  async update(userId, data) {
    const { email, name, subscription_tier } = data;
    const query = `
      UPDATE users 
      SET email = COALESCE($2, email),
          name = COALESCE($3, name),
          subscription_tier = COALESCE($4, subscription_tier),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [userId, email, name, subscription_tier]);
    return result.rows[0];
  },

  async delete(userId) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  },
};

module.exports = User;
