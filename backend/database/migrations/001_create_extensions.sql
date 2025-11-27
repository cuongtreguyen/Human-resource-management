-- =====================================================
-- Migration 001: Create PostgreSQL Extensions
-- =====================================================
-- Description: Enable required PostgreSQL extensions for the HR management system
-- Created: 2024
-- =====================================================

-- Enable UUID extension for generating UUIDs as primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing and encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- Rollback Script
-- =====================================================
-- DROP EXTENSION IF EXISTS "pgcrypto";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
