"use strict";
const express = require("express");
const Database = require("./database");

/**
 * Responsible for Database API server methods.
 */
class DatabaseServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.app.use(express.json());
    this.db = new Database();
    this.createServer();
  }

  /**
   * Initializes the Express server.
   */
  createServer() {

    // Define user routes
    this.app.get("/users", async (req, res) => {});
    this.app.get("/users/:id", async (req, res) => {});
    this.app.post("/users", async (req, res) => {});
    this.app.patch("/users/:id", async (req, res) => {});
    this.app.delete("/users/:id", async (req, res) => {});

    // Define prompt routes
    this.app.post("/prompts", async (req, res) => {});
    this.app.get("/prompts", async (req, res) => {});
    this.app.delete("/prompts", async (req, res) => {});

    // Define the default route for all other requests
    this.app.all("*", (req, res) => {
      res.status(200).send("Welcome to the server at " + new Date());
    });

    // Start the Express server
    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  }
}

const databaseServer = new DatabaseServer(process.env.PORT || 8080);
