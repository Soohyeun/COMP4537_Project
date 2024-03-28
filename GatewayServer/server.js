"use strict";
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const axiosDB = axios.create({
  baseURL: process.env.DB_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.DB_API_KEY || "my-secret",
  },
});

const axiosAuth = axios.create({
  baseURL: process.env.AUTH_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.AUTH_API_KEY || "my-secret",
  },
});

const axiosML = axios.create({
  baseURL: process.env.ML_URL || "http://localhost:8090",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.ML_AUTH_KEY || "my-secret",
  },
});

const checkAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next(); // user is Admin, proceed to the next middleware
};

/**
 * Responsible for API server methods.
 */
class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express(); // Create an instance of express
    this.app.use(express.json()); // Use middleware to parse JSON bodies
    this.app.use(
      session({
        secret: crypto.randomBytes(64).toString("hex"),
        resave: false,
        saveUninitialized: true,
      })
    );
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
        const user = await axiosDB.get(`/users/${email}`);
        // check if user already exists
        if (user.data.email) {
          res.status(409).send(`User with email "${email}" already exists`);
          return;
        }

        // TODO: get hashed password via AuthServer
        const hashedPassword = "12345";

        // create new user in database
        const newUser = await axiosDB.post("/users", {
          name,
          email,
          password: hashedPassword,
        });
        if (newUser.status !== 201) {
          res.status(500).send("Error registering user");
          return;
        }

        // TODO: log in user via AuthServer

        res.status(200).json("User registered successfully");
      } catch (error) {
        // console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
      }
    });

    this.app.post("/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const userInfo = await axiosDB.get(`/users/${email}`);

        if (userInfo === null || Object.keys(userInfo).length === 0) {
          res.status(404).send("User not found");
          return;
        }

        const {
          id,
          name,
          password: hashedPassword,
          is_admin: isAdmin,
        } = userInfo.data;

        // TODO: log in user via AuthServer
        // const authResult = await axiosAuth.post(`/auth/login`, {
        //   email,
        //   password,
        //   hashedPassword,
        // });
        // console.log("Auth result:", authResult.data);
        // res.cookie("jwt", authResult.accessToken, {
        //   secure: true,
        //   httpOnly: true,
        //   maxAge: 3600000,
        // });
        req.session.userId = id;
        req.session.isAdmin = isAdmin;
        res.status(200).json({ name, isAdmin });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
      }
    });

    this.app.get("/users", checkAdmin, async (req, res) => {
      try {
        const response = await axiosDB.get("/users");
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    this.app.delete("/users/:id", checkAdmin, async (req, res) => {
      try {
        const { id } = req.params;
        const response = await axiosDB.delete(`/users/${id}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
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
