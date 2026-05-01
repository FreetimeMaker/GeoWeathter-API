const { Pool } = require('pg');

// Vercel Postgres uses POSTGRES_CONNECTION_STRING env variable
// Trim and check if connection string is valid
const rawConnectionString = process.env.POSTGRES_CONNECTION_STRING || process.env.DATABASE_URL;
const connectionString = rawConnectionString ? rawConnectionString.trim() : '';

// Check if we have valid connection config
const hasValidConnection = connectionString.length > 0 || 
  (process.env.DB_HOST && process.env.DB_HOST.length > 0);

// Fallback to individual env vars for local development
const poolConfig = connectionString
  ? { connectionString }
  : {
      user: process.env.DB_USER || 'geoweather_user',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'geoweather',
    };

// Only create pool if we have valid connection config
let pool = null;

if (hasValidConnection) {
  pool = new Pool({
    ...poolConfig,
    // Vercel serverless optimization
    max: process.env.NODE_ENV === 'production' ? 1 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
}

// Health check for database connection
const healthCheck = async () => {
  // If no connection string is configured, skip DB check
  if (!pool) {
    return null;
  }
  
  try {
    const result = await pool.query('SELECT 1');
    return result.rowCount === 1;
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return false;
  }
};

// Export pool or a proxy object
const dbProxy = pool || {
  query: async () => { throw new Error('Database not configured'); },
  end: async () => {},
};

// Attach healthCheck to proxy
dbProxy.healthCheck = healthCheck;

module.exports = dbProxy;
