"use strict";
const express = require("express");

const Database = require("./database");

/**
 * Responsible for Database API server methods.
 */
class DatabaseServer {
  constructor(port) {
    this.port = port;
    this.app = express(); // Create an instance of express
    this.app.use(express.json()); // Use middleware to parse JSON bodies
    this.db = new Database();
  }

  /**
   * Initializes the Express server.
   */
  createServer = () => {
    // Define the default route for all other requests
    this.app.all("*", (req, res) => {
      res.status(200).send("Welcome to the server.");
    });

    // Start the Express server
    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  };

  start = () => {
    this.createServer();
  };
}

const databaseServer = new DatabaseServer(process.env.PORT || 8080);
databaseServer.start();
