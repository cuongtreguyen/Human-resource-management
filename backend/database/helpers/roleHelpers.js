/**
 * Role-Based Access Helpers
 * 
 * This module provides helper functions for role-based access control (RBAC)
 * and data filtering based on user permissions.
 */

const { query } = require('../connection');

/**
 * Get all permissions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of permission objects
 */
async function getUserPermissions(userId) {
  const result = await query(
    `SELECT DISTINCT p.name, p.resource, p.action
     FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     INNER JOIN user_roles ur ON rp.role_id = ur.role_id
     WHERE ur.user_id = $1`,
    [userId]
  );
  return result.rows;
}

/**
 * Get all roles for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of role objects
 */
async function getUserRoles(userId) {
  const result = await query(
    `SELECT r.id, r.name, r.description
     FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = $1`,
    [userId]
  );
  return result.rows;
}

/**
 * Check if a user has a specific permission
 * @param {string} userId - User ID
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {Promise<boolean>} True if user has permission
 */
async function hasPermission(userId, resource, action) {
  const result = await query(
    `SELECT EXISTS (
      SELECT 1
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
        AND (p.resource = $2 OR p.resource = '*')
        AND (p.action = $3 OR p.action = 'manage')
    ) as has_permission`,
    [userId, resource, action]
  );
  return result.rows[0].has_permission;
}

/**
 * Check if a user has a specific role
 * @param {string} userId - User ID
 * @param {string} roleName - Role name
 * @returns {Promise<boolean>} True if user has role
 */
async function hasRole(userId, roleName) {
  const result = await query(
    `SELECT EXISTS (
      SELECT 1
      FROM user_roles ur
      INNER JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1 AND r.name = $2
    ) as has_role`,
    [userId, roleName]
  );
  return result.rows[0].has_role;
}

/**
 * Check if a user has any of the specified roles
 * @param {string} userId - User ID
 * @param {Array<string>} roleNames - Array of role names
 * @returns {Promise<boolean>} True if user has any of the roles
 */
async function hasAnyRole(userId, roleNames) {
  const placeholders = roleNames.map((_, i) => `$${i + 2}`).join(', ');
  const result = await query(
    `SELECT EXISTS (
      SELECT 1
      FROM user_roles ur
      INNER JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1 AND r.name IN (${placeholders})
    ) as has_role`,
    [userId, ...roleNames]
  );
  return result.rows[0].has_role;
}

/**
 * Assign a role to a user
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @param {string} assignedBy - ID of user assigning the role
 * @returns {Promise<Object>} Created user_role record
 */
async function assignRole(userId, roleId, assignedBy = null) {
  const result = await query(
    `INSERT INTO user_roles (user_id, role_id, assigned_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, role_id) DO NOTHING
     RETURNING *`,
    [userId, roleId, assignedBy]
  );
  return result.rows[0];
}

/**
 * Remove a role from a user
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {Promise<boolean>} True if role was removed
 */
async function removeRole(userId, roleId) {
  const result = await query(
    `DELETE FROM user_roles
     WHERE user_id = $1 AND role_id = $2
     RETURNING *`,
    [userId, roleId]
  );
  return result.rowCount > 0;
}

/**
 * Get users with a specific role
 * @param {string} roleName - Role name
 * @returns {Promise<Array>} Array of user objects
 */
async function getUsersWithRole(roleName) {
  const result = await query(
    `SELECT u.id, u.username, u.email, u.full_name
     FROM users u
     INNER JOIN user_roles ur ON u.id = ur.user_id
     INNER JOIN roles r ON ur.role_id = r.id
     WHERE r.name = $1 AND u.deleted_at IS NULL`,
    [roleName]
  );
  return result.rows;
}

/**
 * Get role by name
 * @param {string} name - Role name
 * @returns {Promise<Object|null>} Role object or null
 */
async function getRoleByName(name) {
  const result = await query(
    `SELECT id, name, description
     FROM roles
     WHERE name = $1`,
    [name]
  );
  return result.rows[0] || null;
}

/**
 * Get all permissions for a role
 * @param {string} roleId - Role ID
 * @returns {Promise<Array>} Array of permission objects
 */
async function getRolePermissions(roleId) {
  const result = await query(
    `SELECT p.id, p.name, p.resource, p.action, p.description
     FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = $1`,
    [roleId]
  );
  return result.rows;
}

/**
 * Add a permission to a role
 * @param {string} roleId - Role ID
 * @param {string} permissionId - Permission ID
 * @returns {Promise<Object>} Created role_permission record
 */
async function addPermissionToRole(roleId, permissionId) {
  const result = await query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)
     ON CONFLICT (role_id, permission_id) DO NOTHING
     RETURNING *`,
    [roleId, permissionId]
  );
  return result.rows[0];
}

/**
 * Remove a permission from a role
 * @param {string} roleId - Role ID
 * @param {string} permissionId - Permission ID
 * @returns {Promise<boolean>} True if permission was removed
 */
async function removePermissionFromRole(roleId, permissionId) {
  const result = await query(
    `DELETE FROM role_permissions
     WHERE role_id = $1 AND permission_id = $2
     RETURNING *`,
    [roleId, permissionId]
  );
  return result.rowCount > 0;
}

/**
 * Build a data filter based on user role
 * Used for row-level security based on user's role and department
 * @param {string} userId - User ID
 * @param {string} tableName - Table name to filter
 * @returns {Promise<Object>} Filter conditions
 */
async function buildRoleBasedFilter(userId, tableName) {
  const roles = await getUserRoles(userId);
  const roleNames = roles.map(r => r.name);
  
  // Admin and HR Manager can see all data
  if (roleNames.includes('admin') || roleNames.includes('hr_manager')) {
    return {};
  }
  
  // Department Manager can see their department's data
  if (roleNames.includes('department_manager')) {
    const deptResult = await query(
      `SELECT d.id FROM departments d
       INNER JOIN employees e ON d.manager_id = e.id
       WHERE e.user_id = $1`,
      [userId]
    );
    
    if (deptResult.rows.length > 0) {
      const departmentId = deptResult.rows[0].id;
      
      if (tableName === 'employees') {
        return { department_id: departmentId };
      }
      
      if (tableName === 'attendance' || tableName === 'leave_requests') {
        // Need to join with employees table
        return {
          _join: {
            table: 'employees',
            on: `${tableName}.employee_id = employees.id`,
            filter: { department_id: departmentId },
          },
        };
      }
    }
  }
  
  // Regular employee can only see their own data
  const empResult = await query(
    `SELECT id FROM employees WHERE user_id = $1`,
    [userId]
  );
  
  if (empResult.rows.length > 0) {
    const employeeId = empResult.rows[0].id;
    
    if (tableName === 'employees') {
      return { id: employeeId };
    }
    
    if (tableName === 'attendance' || tableName === 'leave_requests' || 
        tableName === 'employee_salaries' || tableName === 'payrolls') {
      return { employee_id: employeeId };
    }
  }
  
  // Default: no access
  return { _deny: true };
}

/**
 * Check if user can access a specific record
 * @param {string} userId - User ID
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @returns {Promise<boolean>} True if user can access the record
 */
async function canAccessRecord(userId, tableName, recordId) {
  const filter = await buildRoleBasedFilter(userId, tableName);
  
  if (filter._deny) {
    return false;
  }
  
  if (Object.keys(filter).length === 0) {
    return true; // No restrictions
  }
  
  // Build check query
  let checkQuery = `SELECT EXISTS (SELECT 1 FROM ${tableName} WHERE id = $1`;
  const params = [recordId];
  let paramIndex = 2;
  
  for (const [key, value] of Object.entries(filter)) {
    if (!key.startsWith('_')) {
      checkQuery += ` AND ${key} = $${paramIndex++}`;
      params.push(value);
    }
  }
  
  checkQuery += ') as can_access';
  
  const result = await query(checkQuery, params);
  return result.rows[0].can_access;
}

module.exports = {
  getUserPermissions,
  getUserRoles,
  hasPermission,
  hasRole,
  hasAnyRole,
  assignRole,
  removeRole,
  getUsersWithRole,
  getRoleByName,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  buildRoleBasedFilter,
  canAccessRecord,
};
