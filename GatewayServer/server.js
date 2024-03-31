"use strict";
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const apiMountPoint = process.env.API_MOUNT_POINT || "/";

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
    "api-key": process.env.ML_API_KEY || "my-secret",
  },
});

/*
 * Middleware functions
 */
const isAuthenticated = async(req, res, next) => {
  try {
    console.log("cookies:", req.cookies);
    const sessionCookie = req.cookies['connect.sid'];
    console.log("sessionCookie:", sessionCookie);
    const authResult = await axiosAuth.post(`/auth/verifyUser`, {
      'token': sessionCookie
    });
    if(!authResult.data) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();

  } catch(error) {
    return res.status(500).json(error);
  }
};

const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const incrementRequestCount = async (req, res, next) => {
  if (req.session.userId) {
    // req.session.requestCount = (req.user.requestCount || 0) + 1;
    const response = await axiosDB.patch(
      `/users/${req.session.userId}/increment-api-calls`
    );
    console.log("Request count updated:", response.data);
  }
  next();
};

/**
 * Responsible for API server methods.
 */
class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors(
      {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
      }
    ));
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: crypto.randomBytes(64).toString("hex"),
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(incrementRequestCount);
    this.app.use(apiMountPoint, this.createAuthRouter());
    this.app.use(apiMountPoint, this.createAuthenticatedUserRouter());
    this.app.use(apiMountPoint, this.createAdminRouter());

    this.createServer();
  }

  /*
   * Auth routes
   */
  createAuthRouter() {
    const router = express.Router();

    router.post("/auth/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;
        const userInfo = await axiosDB.get(`/users/${email}`);
        if (Object.keys(userInfo.data).length !== 0) {
          res.status(409).send(`User with email "${email}" already exists`);
          return;
        }

        // hash password using AuthServer
        const result = await axiosAuth.post("/auth/hashPassword", {
          password,
        });
        if (result.status !== 200) {
          res.status(500).send("Error hashing password");
          return;
        }
        const hashedPassword = result.data;

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

        res.status(200).json("User registered successfully");
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
      }
    });

    router.post("/auth/login", async (req, res) => {
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

        const authResult = await axiosAuth.post(`/auth/login`, {
          email,
          password,
          hashedPassword,
        });
        res.cookie("jwt", authResult.data.accessToken, {
          secure: true,
          httpOnly: true,
          maxAge: 3600000,
        });

        req.session.userId = id;
        req.session.isAdmin = isAdmin;
        res.status(200).json({ name, isAdmin });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
      }
    });

    return router;
  }

  /*
   * Authenticated user routes
   */
  createAuthenticatedUserRouter() {
    const router = express.Router();
    router.use(isAuthenticated);

    router.post("/prompts", async (req, res) => {
      try {
        const { query } = req.body;

        const MLResponse = await axiosML.post("/getAnswer", { query });
        if (MLResponse.status !== 200) {
          res.status(500).send("Error getting answer");
          return;
        }
        const answer = MLResponse.data.answer;

        const response = await axiosDB.post("/prompts", {
          userId: req.session.userId,
          query,
          answer,
        });
        res.status(201).send(MLResponse.data);
      } catch (error) {
        console.error("Error getting answer:", error);
        res.status(500).send("Error getting answer");
      }
    });

    router.get("/prompts/:userId?", async (req, res) => {
      try {
        // only admin can view prompts for other users
        // if (!req.session.isAdmin && req.params.userId) {
        // res.status(401).json({ error: "Unauthorized" });
        // return;
        // }
        const userId = req.params.userId || req.session.userId;
        console.log("userId:", userId);
        const response = await axiosDB.get(`/prompts/${userId}`);
        console.log("Prompts:", response.data);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting prompts:", error);
        res.status(500).send("Error getting prompts");
      }
    });

    router.get("/logout", async(req, res) => {
      res.clearCookie("jwt");
      res.send("Logout successfully");
    });

    return router;
  }

  /*
   * Admin routes
   */
  createAdminRouter() {
    const router = express.Router();
    router.use(isAdmin);
    router.use(isAuthenticated);

    router.get("/users", isAdmin, async (req, res) => {
      try {
        const response = await axiosDB.get("/users");
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    router.delete("/users/:id", isAdmin, async (req, res) => {
      try {
        const { id } = req.params;
        const response = await axiosDB.delete(`/users/${id}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    return router;
  }

  createServer = () => {
    // Define the default route for all other requests
    this.app.all("*", (req, res) => {
      res.status(404).send("Nothing here!");
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  };
}

const myServer = new ExpressServer(process.env.PORT || 8888);
