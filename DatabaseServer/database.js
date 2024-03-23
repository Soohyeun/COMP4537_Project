"use strict";
const mysql = require("mysql2");
require("dotenv").config();

// get config from .env file
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const dbSchemas = {
  user: `
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    api_calls INT DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT false
  `,
  prompt: `
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT
  `,
};

class Database {
  constructor() {
    // Create MySQL connection pool
    this.db = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Database connection created.");

    this.initTables()
      .then(() => {
        console.log("Tables initialized successfully.");
      })
      .catch((error) => {
        console.error("Error initializing tables:", error);
      });
  }

  async initTables() {
    // Create tables if they don't exist
    this.db.query(`CREATE TABLE IF NOT EXISTS user (${dbSchemas.user})`);
    this.db.query(`CREATE TABLE IF NOT EXISTS prompt (${dbSchemas.prompt})`);
  }
}

module.exports = Database;
