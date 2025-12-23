/**
 * Query Helpers
 * 
 * This module provides helper functions for building and executing database queries
 * with support for filtering, pagination, and duplicate checking.
 */

const { query, withTransaction } = require('../connection');

/**
 * Build a SELECT query with filtering and pagination
 * @param {string} tableName - Table name
 * @param {Object} options - Query options
 * @returns {Object} Query object with text and params
 */
function buildSelectQuery(tableName, options = {}) {
  const {
    columns = ['*'],
    where = {},
    orderBy = null,
    orderDirection = 'ASC',
    limit = null,
    offset = null,
    includeDeleted = false,
  } = options;
  
  let paramIndex = 1;
  const params = [];
  const conditions = [];
  
  // Build WHERE conditions
  for (const [key, value] of Object.entries(where)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else if (Array.isArray(value)) {
      const placeholders = value.map(() => `$${paramIndex++}`);
      conditions.push(`${key} IN (${placeholders.join(', ')})`);
      params.push(...value);
    } else if (typeof value === 'object' && value.operator) {
      conditions.push(`${key} ${value.operator} $${paramIndex++}`);
      params.push(value.value);
    } else {
      conditions.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }
  
  // Add soft delete filter
  if (!includeDeleted) {
    conditions.push('deleted_at IS NULL');
  }
  
  // Build query
  let text = `SELECT ${columns.join(', ')} FROM ${tableName}`;
  
  if (conditions.length > 0) {
    text += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  if (orderBy) {
    text += ` ORDER BY ${orderBy} ${orderDirection}`;
  }
  
  if (limit !== null) {
    text += ` LIMIT $${paramIndex++}`;
    params.push(limit);
  }
  
  if (offset !== null) {
    text += ` OFFSET $${paramIndex++}`;
    params.push(offset);
  }
  
  return { text, params };
}

/**
 * Build an INSERT query
 * @param {string} tableName - Table name
 * @param {Object} data - Data to insert
 * @param {Array} returning - Columns to return
 * @returns {Object} Query object with text and params
 */
function buildInsertQuery(tableName, data, returning = ['*']) {
  const columns = Object.keys(data);
  const params = Object.values(data);
  const placeholders = columns.map((_, i) => `$${i + 1}`);
  
  const text = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders.join(', ')})
    RETURNING ${returning.join(', ')}
  `;
  
  return { text, params };
}

/**
 * Build an UPDATE query
 * @param {string} tableName - Table name
 * @param {Object} data - Data to update
 * @param {Object} where - WHERE conditions
 * @param {Array} returning - Columns to return
 * @returns {Object} Query object with text and params
 */
function buildUpdateQuery(tableName, data, where, returning = ['*']) {
  let paramIndex = 1;
  const params = [];
  const setClauses = [];
  const conditions = [];
  
  // Build SET clauses
  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex++}`);
    params.push(value);
  }
  
  // Build WHERE conditions
  for (const [key, value] of Object.entries(where)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else {
      conditions.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }
  
  const text = `
    UPDATE ${tableName}
    SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE ${conditions.join(' AND ')}
    RETURNING ${returning.join(', ')}
  `;
  
  return { text, params };
}

/**
 * Build a DELETE query (soft delete by default)
 * @param {string} tableName - Table name
 * @param {Object} where - WHERE conditions
 * @param {boolean} hardDelete - If true, permanently delete
 * @param {Array} returning - Columns to return
 * @returns {Object} Query object with text and params
 */
function buildDeleteQuery(tableName, where, hardDelete = false, returning = ['*']) {
  let paramIndex = 1;
  const params = [];
  const conditions = [];
  
  // Build WHERE conditions
  for (const [key, value] of Object.entries(where)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else {
      conditions.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }
  
  let text;
  if (hardDelete) {
    text = `DELETE FROM ${tableName} WHERE ${conditions.join(' AND ')} RETURNING ${returning.join(', ')}`;
  } else {
    text = `
      UPDATE ${tableName}
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE ${conditions.join(' AND ')}
      RETURNING ${returning.join(', ')}
    `;
  }
  
  return { text, params };
}

/**
 * Check for duplicate records
 * @param {string} tableName - Table name
 * @param {Object} uniqueFields - Fields to check for uniqueness
 * @param {string} excludeId - ID to exclude from check (for updates)
 * @returns {Promise<Object|null>} Existing record or null
 */
async function checkDuplicate(tableName, uniqueFields, excludeId = null) {
  let paramIndex = 1;
  const params = [];
  const orConditions = [];
  
  for (const [key, value] of Object.entries(uniqueFields)) {
    if (value !== null && value !== undefined) {
      orConditions.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }
  
  if (orConditions.length === 0) {
    return null;
  }
  
  let text = `
    SELECT id, ${Object.keys(uniqueFields).join(', ')}
    FROM ${tableName}
    WHERE (${orConditions.join(' OR ')})
    AND deleted_at IS NULL
  `;
  
  if (excludeId) {
    text += ` AND id != $${paramIndex++}`;
    params.push(excludeId);
  }
  
  text += ' LIMIT 1';
  
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Count records with optional filters
 * @param {string} tableName - Table name
 * @param {Object} where - WHERE conditions
 * @param {boolean} includeDeleted - Include soft-deleted records
 * @returns {Promise<number>} Record count
 */
async function count(tableName, where = {}, includeDeleted = false) {
  let paramIndex = 1;
  const params = [];
  const conditions = [];
  
  for (const [key, value] of Object.entries(where)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else {
      conditions.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }
  
  if (!includeDeleted) {
    conditions.push('deleted_at IS NULL');
  }
  
  let text = `SELECT COUNT(*) as count FROM ${tableName}`;
  
  if (conditions.length > 0) {
    text += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  const result = await query(text, params);
  return parseInt(result.rows[0].count, 10);
}

/**
 * Execute a paginated query
 * @param {string} tableName - Table name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated result with data, total, page, pageSize
 */
async function paginate(tableName, options = {}) {
  const {
    page = 1,
    pageSize = 10,
    where = {},
    orderBy = 'created_at',
    orderDirection = 'DESC',
    columns = ['*'],
    includeDeleted = false,
  } = options;
  
  const offset = (page - 1) * pageSize;
  
  // Get total count
  const total = await count(tableName, where, includeDeleted);
  
  // Get paginated data
  const selectQuery = buildSelectQuery(tableName, {
    columns,
    where,
    orderBy,
    orderDirection,
    limit: pageSize,
    offset,
    includeDeleted,
  });
  
  const result = await query(selectQuery.text, selectQuery.params);
  
  return {
    data: result.rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1,
  };
}

/**
 * Execute raw SQL query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function rawQuery(sql, params = []) {
  return query(sql, params);
}

/**
 * Bulk insert records
 * @param {string} tableName - Table name
 * @param {Array<Object>} records - Array of records to insert
 * @param {Array} returning - Columns to return
 * @returns {Promise<Array>} Inserted records
 */
async function bulkInsert(tableName, records, returning = ['*']) {
  if (records.length === 0) {
    return [];
  }
  
  const columns = Object.keys(records[0]);
  const values = [];
  const params = [];
  let paramIndex = 1;
  
  for (const record of records) {
    const placeholders = columns.map(() => `$${paramIndex++}`);
    values.push(`(${placeholders.join(', ')})`);
    params.push(...columns.map(col => record[col]));
  }
  
  const text = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES ${values.join(', ')}
    RETURNING ${returning.join(', ')}
  `;
  
  const result = await query(text, params);
  return result.rows;
}

module.exports = {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  checkDuplicate,
  count,
  paginate,
  rawQuery,
  bulkInsert,
};
