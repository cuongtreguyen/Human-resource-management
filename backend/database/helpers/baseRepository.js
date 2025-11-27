/**
 * Base Repository
 * 
 * This module provides a base repository class with common CRUD operations
 * and role-based data access helpers.
 */

const { query, withTransaction } = require('../connection');
const {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  checkDuplicate,
  paginate,
  count,
} = require('./queryHelpers');

/**
 * Base Repository Class
 * Provides common CRUD operations for database tables
 */
class BaseRepository {
  /**
   * Create a new repository instance
   * @param {string} tableName - Database table name
   * @param {Array<string>} uniqueFields - Fields that should be unique
   */
  constructor(tableName, uniqueFields = []) {
    this.tableName = tableName;
    this.uniqueFields = uniqueFields;
  }
  
  /**
   * Find all records with optional filtering
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    const { text, params } = buildSelectQuery(this.tableName, options);
    const result = await query(text, params);
    return result.rows;
  }
  
  /**
   * Find a record by ID
   * @param {string} id - Record ID
   * @param {boolean} includeDeleted - Include soft-deleted records
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id, includeDeleted = false) {
    const { text, params } = buildSelectQuery(this.tableName, {
      where: { id },
      includeDeleted,
    });
    const result = await query(text, params);
    return result.rows[0] || null;
  }
  
  /**
   * Find records by a specific field
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @param {Object} options - Additional query options
   * @returns {Promise<Array>} Array of records
   */
  async findBy(field, value, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, [field]: value },
    });
  }
  
  /**
   * Find a single record by a specific field
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @param {boolean} includeDeleted - Include soft-deleted records
   * @returns {Promise<Object|null>} Record or null
   */
  async findOneBy(field, value, includeDeleted = false) {
    const { text, params } = buildSelectQuery(this.tableName, {
      where: { [field]: value },
      limit: 1,
      includeDeleted,
    });
    const result = await query(text, params);
    return result.rows[0] || null;
  }
  
  /**
   * Create a new record with duplicate checking
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   * @throws {Error} If duplicate exists
   */
  async create(data) {
    // Check for duplicates if unique fields are defined
    if (this.uniqueFields.length > 0) {
      const uniqueData = {};
      for (const field of this.uniqueFields) {
        if (data[field] !== undefined) {
          uniqueData[field] = data[field];
        }
      }
      
      if (Object.keys(uniqueData).length > 0) {
        const existing = await checkDuplicate(this.tableName, uniqueData);
        if (existing) {
          const duplicateField = Object.keys(uniqueData).find(
            key => existing[key] === uniqueData[key]
          );
          throw new Error(`A record with this ${duplicateField} already exists`);
        }
      }
    }
    
    const { text, params } = buildInsertQuery(this.tableName, data);
    const result = await query(text, params);
    return result.rows[0];
  }
  
  /**
   * Update a record by ID with duplicate checking
   * @param {string} id - Record ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object|null>} Updated record or null
   * @throws {Error} If duplicate exists
   */
  async update(id, data) {
    // Check for duplicates if unique fields are defined
    if (this.uniqueFields.length > 0) {
      const uniqueData = {};
      for (const field of this.uniqueFields) {
        if (data[field] !== undefined) {
          uniqueData[field] = data[field];
        }
      }
      
      if (Object.keys(uniqueData).length > 0) {
        const existing = await checkDuplicate(this.tableName, uniqueData, id);
        if (existing) {
          const duplicateField = Object.keys(uniqueData).find(
            key => existing[key] === uniqueData[key]
          );
          throw new Error(`A record with this ${duplicateField} already exists`);
        }
      }
    }
    
    const { text, params } = buildUpdateQuery(this.tableName, data, { id });
    const result = await query(text, params);
    return result.rows[0] || null;
  }
  
  /**
   * Delete a record by ID (soft delete by default)
   * @param {string} id - Record ID
   * @param {boolean} hard - If true, permanently delete
   * @returns {Promise<Object|null>} Deleted record or null
   */
  async delete(id, hard = false) {
    const { text, params } = buildDeleteQuery(this.tableName, { id }, hard);
    const result = await query(text, params);
    return result.rows[0] || null;
  }
  
  /**
   * Restore a soft-deleted record
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>} Restored record or null
   */
  async restore(id) {
    const { text, params } = buildUpdateQuery(
      this.tableName,
      { deleted_at: null },
      { id }
    );
    const result = await query(text, params);
    return result.rows[0] || null;
  }
  
  /**
   * Get paginated records
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(options = {}) {
    return paginate(this.tableName, options);
  }
  
  /**
   * Count records
   * @param {Object} where - Filter conditions
   * @param {boolean} includeDeleted - Include soft-deleted records
   * @returns {Promise<number>} Record count
   */
  async count(where = {}, includeDeleted = false) {
    return count(this.tableName, where, includeDeleted);
  }
  
  /**
   * Check if a record exists
   * @param {Object} where - Filter conditions
   * @returns {Promise<boolean>} True if exists
   */
  async exists(where) {
    const result = await this.findAll({
      where,
      columns: ['id'],
      limit: 1,
    });
    return result.length > 0;
  }
  
  /**
   * Execute a custom query
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async rawQuery(sql, params = []) {
    return query(sql, params);
  }
}

module.exports = BaseRepository;
