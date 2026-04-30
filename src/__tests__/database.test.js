const pool = require('../config/database');

describe('Database Connection', () => {
  test('should connect to database', async () => {
    try {
      const result = await pool.query('SELECT 1');
      expect(result.rows[0]).toEqual({ '?column?': 1 });
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    await pool.end();
  });
});
