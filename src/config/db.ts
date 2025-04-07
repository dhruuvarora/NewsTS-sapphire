// src/config/db.ts
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import dotenv from 'dotenv';
import { Database } from '../types';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'DbName',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432')
});

// Test the connection
pool.connect()
  .then(() => console.log('PostgreSQL database connected'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Create and export Kysely instance
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});