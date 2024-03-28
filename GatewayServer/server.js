"use strict";
const express = require("express");
const axios = require("axios");

const AuthRootUrl = process.env.AUTH_URL || "http://localhost:8000";
const DBRootUrl = process.env.DB_URL || "http://localhost:8080";
const MLRootUrl = process.env.ML_URL || "http://localhost:8090";

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
    // Define user routes
    this.app.post("/auth/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;
        const user = await axios.get(`${DBRootUrl}/users/${email}`);
        // check if user already exists
        if (user.data.email) {
          res.status(409).send(`User with email "${email}" already exists`);
          return;
        }
        // TODO: get hashed password via AuthServer
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user in database
        const newUser = await axios.post(
          `${DBRootUrl}/users`,
          { name, email, password: hashedPassword },
          { headers: { "Content-Type": "application/json" } }
        );
        if (newUser.status !== 201) {
          res.status(500).send("Error registering user");
          return;
        }
        // TODO: log in user via AuthServer
        res.status(200).json("User registered successfully");
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
      }
    });

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
