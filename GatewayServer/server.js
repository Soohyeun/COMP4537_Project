"use strict";
const express = require("express");

/**
 * Responsible for API server methods.
 */
class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express(); // Create an instance of express
    this.app.use(express.json()); // Use middleware to parse JSON bodies
    this.createServer();
  }

  /**
   * Initializes the Express server.
   */
  createServer = () => {
    // Define the default route for all other requests
    this.app.all("*", (req, res) => {
      res.status(200).send("Welcome to the server at " + new Date());
    });

    // Start the Express server
    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  };
}

const myServer = new ExpressServer(process.env.PORT || 8888);
