# Database Setup Guide

This directory contains the PostgreSQL database configuration, migrations, and utilities for the HR Management System.

## Prerequisites

- PostgreSQL 14 or higher
- Node.js 16 or higher
- npm or yarn

## Directory Structure

```
database/
├── migrations/          # SQL migration files
│   ├── 001_create_extensions.sql
│   ├── 002_create_users_and_roles.sql
│   ├── 003_create_departments_and_positions.sql
│   ├── 004_create_employees.sql
│   ├── 005_create_attendance.sql
│   ├── 006_create_salary.sql
│   ├── 007_create_indexes.sql
│   ├── 008_create_functions_and_triggers.sql
│   └── 009_seed_default_data.sql
├── seeds/               # Additional seed data files
├── helpers/             # Query helpers and repositories
│   ├── baseRepository.js
│   ├── queryHelpers.js
│   ├── roleHelpers.js
│   └── index.js
├── config.js            # Database configuration
├── connection.js        # Connection pool management
├── index.js            # Main export file
└── README.md           # This file
```

## Quick Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hrms_development;

# Exit psql
\q
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (or update existing):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_development
DB_USER=postgres
DB_PASSWORD=your_password

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# SSL (for production)
DB_SSL=false

# Logging
DB_LOGGING=true
```

### 3. Run Migrations

You can run migrations manually using `psql` or any PostgreSQL client:

```bash
# Run all migrations in order
psql -U postgres -d hrms_development -f migrations/001_create_extensions.sql
psql -U postgres -d hrms_development -f migrations/002_create_users_and_roles.sql
psql -U postgres -d hrms_development -f migrations/003_create_departments_and_positions.sql
psql -U postgres -d hrms_development -f migrations/004_create_employees.sql
psql -U postgres -d hrms_development -f migrations/005_create_attendance.sql
psql -U postgres -d hrms_development -f migrations/006_create_salary.sql
psql -U postgres -d hrms_development -f migrations/007_create_indexes.sql
psql -U postgres -d hrms_development -f migrations/008_create_functions_and_triggers.sql
psql -U postgres -d hrms_development -f migrations/009_seed_default_data.sql
```

Or run all at once:

```bash
# From the database directory
for file in migrations/*.sql; do
  echo "Running $file..."
  psql -U postgres -d hrms_development -f "$file"
done
```

### 4. Install Node.js Dependencies

```bash
npm install pg dotenv
```

## Usage

### Basic Query

```javascript
const { query } = require('./database');

// Simple query
const result = await query('SELECT * FROM employees WHERE employment_status = $1', ['active']);
console.log(result.rows);
```

### Using Transaction

```javascript
const { withTransaction } = require('./database');

await withTransaction(async (client) => {
  await client.query('INSERT INTO employees (...) VALUES (...)');
  await client.query('INSERT INTO employee_salaries (...) VALUES (...)');
});
```

### Using Repository Pattern

```javascript
const { BaseRepository } = require('./database/helpers');

class EmployeeRepository extends BaseRepository {
  constructor() {
    super('employees', ['employee_code', 'email', 'national_id']);
  }
  
  async findActive() {
    return this.findAll({
      where: { employment_status: 'active' },
      orderBy: 'created_at',
      orderDirection: 'DESC',
    });
  }
}

const employeeRepo = new EmployeeRepository();
const employees = await employeeRepo.findActive();
```

### Role-Based Access Control

```javascript
const { hasPermission, getUserRoles, buildRoleBasedFilter } = require('./database/helpers');

// Check if user has permission
const canEdit = await hasPermission(userId, 'employees', 'update');

// Get user roles
const roles = await getUserRoles(userId);

// Build role-based filter for queries
const filter = await buildRoleBasedFilter(userId, 'employees');
```

## Default Credentials

After running seed data (migration 009):

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | System Administrator |

**Note:** Change the default admin password immediately in production!

## Default Roles

| Role | Description |
|------|-------------|
| admin | Full system access |
| hr_manager | HR management access |
| department_manager | Department-level access |
| employee | Basic employee access |

## Database Tables

### Core Tables
- `users` - User accounts
- `roles` - System roles
- `permissions` - Granular permissions
- `user_roles` - User-role mapping
- `role_permissions` - Role-permission mapping

### HR Tables
- `departments` - Organization departments
- `positions` - Job positions
- `employees` - Employee information

### Attendance Tables
- `attendance` - Daily attendance records
- `leave_requests` - Leave/absence requests
- `holidays` - Company holidays

### Salary Tables
- `salary_grades` - Salary bands
- `employee_salaries` - Employee salary history
- `payrolls` - Monthly payroll records
- `salary_components` - Allowances, deductions, bonuses

### Audit Tables
- `audit_log` - Change tracking

## Key Features

### Soft Delete
Most tables support soft delete via `deleted_at` column. Records are not actually deleted but marked with a timestamp.

```javascript
// Soft delete (default)
await employeeRepo.delete(id);

// Hard delete (permanent)
await employeeRepo.delete(id, true);

// Restore soft-deleted record
await employeeRepo.restore(id);
```

### Duplicate Prevention
Triggers prevent duplicate records for:
- Users (email, username)
- Employees (employee_code, national_id, email)
- Attendance (employee + date)

### Automatic Timestamps
All tables have `created_at` and `updated_at` columns that are automatically managed.

### Audit Trail
Changes to critical tables (employees, payrolls, user_roles) are automatically logged to `audit_log`.

## Rollback Instructions

Each migration file contains rollback SQL at the bottom (commented out). To rollback:

1. Copy the rollback section from the migration file
2. Run the SQL in reverse order (009 first, then 008, etc.)

Example:
```sql
-- Rollback 009_seed_default_data.sql
DELETE FROM holidays WHERE id LIKE '60000000%';
DELETE FROM salary_components WHERE id LIKE '50000000%';
-- ... rest of rollback
```

## Testing

### Create Test Database

```bash
psql -U postgres -c "CREATE DATABASE hrms_test;"
```

### Run Migrations on Test Database

```bash
for file in migrations/*.sql; do
  psql -U postgres -d hrms_test -f "$file"
done
```

### Test Connection

```javascript
const { checkConnection, getPoolStats } = require('./database');

const isConnected = await checkConnection();
console.log('Connected:', isConnected);
console.log('Pool stats:', getPoolStats());
```

## Troubleshooting

### Connection Issues

1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check connection parameters in `.env`

3. Verify database exists:
```bash
psql -U postgres -l | grep hrms
```

### Permission Issues

1. Grant necessary permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE hrms_development TO your_user;
```

2. For extension creation, user may need superuser:
```sql
ALTER USER your_user WITH SUPERUSER;
```

### Migration Issues

1. If a migration fails, check the error message
2. Fix the issue and re-run the specific migration
3. For data issues, use the cleanup functions:
```sql
SELECT cleanup_duplicate_attendance();
SELECT cleanup_orphaned_user_roles();
```

## Performance Considerations

- Indexes are created for frequently queried columns
- Use pagination for large result sets
- Use `EXPLAIN ANALYZE` to optimize slow queries
- Consider partitioning for very large tables (attendance, audit_log)

## Security Best Practices

1. Never commit `.env` files with real credentials
2. Use strong passwords for database users
3. Enable SSL in production (`DB_SSL=true`)
4. Regularly rotate credentials
5. Use least-privilege principle for database users
6. Keep PostgreSQL updated

## Support

For issues or questions, please refer to:
- DATABASE_SCHEMA.md - Detailed schema documentation
- Migration file comments - Specific table documentation
