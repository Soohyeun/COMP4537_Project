const express = require("express");

/**
 * Responsible for API server methods.
 */
class ExpressServer {
  constructor(port) {
    this.port = port;
    this.axios = require("axios");
    this.app = express(); // Create an instance of express
    this.app.use(express.json()); // Use middleware to parse JSON bodies
    this.bcrypt = require("bcrypt");
    this.jwt = require("jsonwebtoken");
    this.dbRoot = "http://localhost:8080"; //Todo: Change URL
    this.TOKEN_SECRET = require("crypto").randomBytes(64).toString("hex");
    this.createServer();
  }

  /**
   * Initializes the Express server.
   */
  createServer = () => {
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length"
      );
      next();
    });

    // Create new user
    this.app.post("/auth/createAccount", async (req, res) => {
      const { username, email, password } = req.body;
      const salt = await this.bcrypt.genSalt(10);
      const hashedPassword = await this.bcrypt.hash(password, salt);
      const userData = {
        email: email,
        name: username,
        password: hashedPassword,
      };

      try {
        const user = await this.axios.post(this.dbRoot + "/users", userData);
        console.log("User created");
        res.status(200).send("User created");
      } catch (error) {
        console.error(error.response.data);
        res.status(500).send(error.response.data);
      }
    });

    this.app.post("/auth/login", (req, res) => {
      const { email, password } = req.body;
    });

    this.app.get("/auth/logout", (req, res) => {
      //TODO
    });

    // Define the default route for all other requests
    this.app.all("*", (req, res) => {
      res.status(200).send("Welcome to the server.");
    });

    // Start the Express server
    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  };

}

const myServer = new ExpressServer(process.env.PORT || 8000);
