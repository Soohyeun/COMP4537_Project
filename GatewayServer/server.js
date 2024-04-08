"use strict";
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const validator = require("validator");
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
const attachUserData = (req, id, email, isAdmin) => {
  req.userData = {
    id,
    email,
    isAdmin,
  };
};

const isAuthenticatedMiddleware = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.jwt;
    const authResult = await axiosAuth.post(`/auth/verifyUser`, {
      token: jwtToken,
    });

    if (Object.keys(authResult.data).length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    attachUserData(
      req,
      authResult.data.id,
      authResult.data.email,
      authResult.data.isAdmin
    );

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

const isAdminMiddleware = (req, res, next) => {
  if (!req.userData.isAdmin) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
  next();
};

const getApiCallData = (req) => {
  const path = req.originalUrl;
  const match = path.match(/\/\w+\/api\/v\d+(\/\w+)/);

  return {
    route: match ? match[1] : path,
    method: req.method,
  };
};

const incrementApiUsage = async (req, res) => {
  const { route, method } = getApiCallData(req);
  const response = await axiosDB.put(`/api-calls/${req.userData.id}`, {
    route,
    method,
  });
  if (response.data.api_calls) {
    res.setHeader("X-Api-Calls", response.data.api_calls);
    res.setHeader("X-Api-Calls-Exceeded", response.data.api_calls >= 20);
  }
};

const incrementApiUsageMiddleware = async (req, res, next) => {
  if (req.method !== "OPTIONS" && req.userData) {
    await incrementApiUsage(req, res);
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
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(incrementApiUsageMiddleware);
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

        if (!validator.isEmail(email)) {
          res.status(400).send("Email is invalid");
          return;
        }

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
        if (userInfo === null || Object.keys(userInfo.data).length === 0) {
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
          id,
          email,
          password,
          hashedPassword,
          isAdmin,
        });
        res.cookie("jwt", authResult.data.accessToken, {
          secure: true,
          httpOnly: true,
          maxAge: 3600000,
          sameSite: "none",
        });

        attachUserData(req, id, email, isAdmin);
        await incrementApiUsage(req, res);

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
    router.use(isAuthenticatedMiddleware);

    router.post("/prompts", async (req, res) => {
      try {
        const question = req.body.query;

        const MLResponse = await axiosML.post("/getAnswer", { question });
        if (MLResponse.status !== 200) {
          res.status(500).send("Error getting answer");
          return;
        }
        const answer = MLResponse.data.answer;
        const response = await axiosDB.post("/prompts", {
          userId: req.userData.id,
          question,
          answer,
        });
        res.status(201).send(MLResponse.data);
      } catch (error) {
        console.error("Error getting answer:", error);
        res.status(500).send("Error getting answer");
      }
    });

    router.get("/prompts", async (req, res) => {
      try {
        const userId = req.userData.id;
        const response = await axiosDB.get(`/prompts/${userId}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting prompts:", error);
        res.status(500).send("Error getting prompts");
      }
    });

    router.post("/logout", async (req, res) => {
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
    router.use(isAuthenticatedMiddleware);
    router.use(isAdminMiddleware);

    router.get("/users", async (req, res) => {
      try {
        const response = await axiosDB.get("/users");
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    router.delete("/users/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const response = await axiosDB.delete(`/users/${id}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    router.get("/prompts/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        const response = await axiosDB.get(`/prompts/${userId}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting prompts:", error);
        res.status(500).send("Error getting prompts");
      }
    });

    router.patch("/api-calls/:id/reset", async (req, res) => {
      try {
        const { id } = req.params;
        const response = await axiosDB.patch(`/api-calls/${id}/reset`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    router.get("/api-calls", async (req, res) => {
      try {
        const response = await axiosDB.get("/api-calls");
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
