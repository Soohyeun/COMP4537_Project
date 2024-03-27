"use strict";
const mysql = require("mysql2/promise");
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
  // TODO: add timestamps?
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

  // User CRUD methods

  async getUsers() {
    return await this.db.query("SELECT * FROM user");
  }

  async getUser(id) {
    const results = await this.db.query("SELECT * FROM user WHERE id = ?", [
      id,
    ]);
    return results[0].length ? results[0][0] : {};
  }

  async createUser(email, name, password) {
    // TODO: handle password hashing
    return await this.db.query(
      "INSERT INTO user (email, name, password) VALUES (?, ?)",
      [email, name, password]
    );
  }

  async updateUser(id, name, email, password) {
    // TODO: handle missing fields (and password hashing)
    return await this.db.query(
      "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, id]
    );
  }

  async deleteUser(id) {
    return await this.db.query("DELETE FROM user WHERE id = ?", [id]);
  }

  // Prompt CRUD methods

  async getPrompts() {
    return await this.db.query("SELECT * FROM prompt");
  }

  async createPrompt(userId, question, answer) {
    return await this.db.query(
      "INSERT INTO prompt (user_id, question, answer) VALUES (?, ?, ?)",
      [userId, question, answer]
    );
  }

  async deletePrompt(id) {
    return await this.db.query("DELETE FROM prompt WHERE id = ?", [id]);
  }
}

module.exports = Database;
