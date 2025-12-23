/**
 * Database Connection Pool
 * 
 * This module provides PostgreSQL connection pool management for the HR Management System.
 * It supports connection pooling, transaction management, and query execution.
 */

const { Pool } = require('pg');
const { getConfig, getConnectionString } = require('./config');

// Get current environment configuration
const dbConfig = getConfig();

// Create connection pool
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  min: dbConfig.pool.min,
  max: dbConfig.pool.max,
  idleTimeoutMillis: dbConfig.pool.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.pool.connectionTimeoutMillis,
  ssl: dbConfig.ssl,
});

// Pool event handlers
pool.on('connect', (client) => {
  if (dbConfig.logging) {
    console.log('[DB] Client connected to database');
  }
});

pool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client:', err);
});

pool.on('remove', (client) => {
  if (dbConfig.logging) {
    console.log('[DB] Client removed from pool');
  }
});

/**
 * Execute a query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params = []) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    
    if (dbConfig.logging) {
      const duration = Date.now() - start;
      console.log('[DB] Query executed', { text: text.substring(0, 100), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('[DB] Query error:', { text: text.substring(0, 100), error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
async function getClient() {
  const client = await pool.connect();
  
  // Store the original release function
  const originalRelease = client.release.bind(client);
  
  // Track if client has been released
  let released = false;
  
  // Override release to prevent double-release
  client.release = () => {
    if (released) {
      console.warn('[DB] Client already released');
      return;
    }
    released = true;
    originalRelease();
  };
  
  return client;
}

/**
 * Execute a function within a transaction
 * @param {Function} callback - Async function to execute within transaction
 * @returns {Promise<any>} Result of the callback function
 */
async function withTransaction(callback) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check database connection
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
async function checkConnection() {
  try {
    await pool.query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('[DB] Connection check failed:', error.message);
    return false;
  }
}

/**
 * Get pool statistics
 * @returns {Object} Pool statistics
 */
function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

/**
 * Close the pool (graceful shutdown)
 * @returns {Promise<void>}
 */
async function closePool() {
  if (dbConfig.logging) {
    console.log('[DB] Closing connection pool...');
  }
  await pool.end();
  if (dbConfig.logging) {
    console.log('[DB] Connection pool closed');
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {Array<{text: string, params: Array}>} queries - Array of query objects
 * @returns {Promise<Array>} Array of query results
 */
async function executeMultiple(queries) {
  return withTransaction(async (client) => {
    const results = [];
    for (const { text, params } of queries) {
      const result = await client.query(text, params || []);
      results.push(result);
    }
    return results;
  });
}

// Graceful shutdown handlers
// Note: We only close the pool without calling process.exit()
// to allow other shutdown handlers to run properly
let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('[DB] Received SIGINT, closing pool...');
  await closePool();
});

process.on('SIGTERM', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('[DB] Received SIGTERM, closing pool...');
  await closePool();
});

module.exports = {
  pool,
  query,
  getClient,
  withTransaction,
  checkConnection,
  getPoolStats,
  closePool,
  executeMultiple,
  getConnectionString,
};
