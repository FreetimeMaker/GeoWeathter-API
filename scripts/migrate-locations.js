require('dotenv').config();
const pool = require('../src/config/database');

const migrations = [
  // Rename orte → locations
  `ALTER TABLE orte RENAME TO locations`,
  `ALTER INDEX idx_orte_user_id RENAME TO idx_locations_user_id`,
];

async function runRename() {
  try {
    console.log('Starte Orte → Locations Migration...');

    for (const migration of migrations) {
      await pool.query(migration);
      console.log('✓ Migration ausgeführt:', migration);
    }

    console.log('✓ Locations Migration erfolgreich');
    process.exit(0);
  } catch (error) {
    console.error('✗ Fehler:', error);
    process.exit(1);
  }
}

runRename();

