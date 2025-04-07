"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// src/config/db.ts
const pg_1 = require("pg");
const kysely_1 = require("kysely");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Create a PostgreSQL connection pool
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'news',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432')
});
// Test the connection
pool.connect()
    .then(() => console.log('PostgreSQL database connected'))
    .catch(err => console.error('PostgreSQL connection error:', err));
// Create and export Kysely instance
exports.db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({ pool }),
});
