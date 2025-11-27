/**
 * Database Module Index
 * 
 * This module exports all database-related functionality for the HR Management System.
 */

const { pool, query, getClient, withTransaction, checkConnection, getPoolStats, closePool, executeMultiple, getConnectionString } = require('./connection');
const { getConfig, config } = require('./config');
const helpers = require('./helpers');

module.exports = {
  // Connection pool and query functions
  pool,
  query,
  getClient,
  withTransaction,
  checkConnection,
  getPoolStats,
  closePool,
  executeMultiple,
  getConnectionString,
  
  // Configuration
  getConfig,
  config,
  
  // Helpers
  ...helpers,
};
