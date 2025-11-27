/**
 * Database Configuration
 * 
 * This module provides database configuration settings for the HR Management System.
 * Configuration can be loaded from environment variables or default values.
 */

// Load environment variables if available
require('dotenv').config();

const config = {
  // Development configuration
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'hrms_development',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    
    // Connection pool settings
    pool: {
      min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 2000,
    },
    
    // SSL settings (disabled for development)
    ssl: false,
    
    // Logging
    logging: true,
  },
  
  // Test configuration
  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT, 10) || 5432,
    database: process.env.TEST_DB_NAME || 'hrms_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    
    pool: {
      min: 1,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 2000,
    },
    
    ssl: false,
    logging: false,
  },
  
  // Production configuration
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    pool: {
      min: parseInt(process.env.DB_POOL_MIN, 10) || 5,
      max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 5000,
    },
    
    // SSL settings for production
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      ca: process.env.DB_SSL_CA || undefined,
    } : false,
    
    logging: process.env.DB_LOGGING === 'true',
  },
};

/**
 * Get configuration for the current environment
 * @returns {Object} Database configuration object
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  return config[env] || config.development;
}

/**
 * Get PostgreSQL connection string
 * @param {Object} cfg - Configuration object (optional, uses current env if not provided)
 * @returns {string} PostgreSQL connection string
 */
function getConnectionString(cfg = null) {
  const dbConfig = cfg || getConfig();
  const ssl = dbConfig.ssl ? '?sslmode=require' : '';
  return `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}${ssl}`;
}

module.exports = {
  config,
  getConfig,
  getConnectionString,
  
  // Export individual configs for convenience
  development: config.development,
  test: config.test,
  production: config.production,
};
