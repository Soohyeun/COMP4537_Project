"use strict";
const express = require("express");
const Database = require("./database");

const apiMountPoint = process.env.API_MOUNT_POINT || "/";

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["api-key"];

  if (!apiKey || apiKey !== (process.env.DB_API_KEY || "my-secret")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next(); // API key is valid, proceed to the next middleware
};

/**
 * Responsible for Database API server methods.
 */
class DatabaseServer {
  constructor(port) {
    this.port = port;
    this.db = new Database();

    this.app = express();
    this.app.use(express.json());
    this.app.use(validateApiKey);
    this.app.use(apiMountPoint, this.createRouter());
    this.createServer();
  }

  createRouter() {
    const router = express.Router();

    /*
    ======================
    Define User routes
    ======================
    */
    router.get("/users", async (req, res) => {
      try {
        const [rows] = await this.db.getUsers();
        res.status(200).json(rows);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    router.get("/users/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const user = await this.db.getUser(email);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    router.post("/users", async (req, res) => {
      try {
        const { email, name, password } = req.body;
        const newUser = await this.db.createUser(email, name, password);
        res.status(201).send({ id: newUser[0].insertId });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
      }
    });

    router.patch("/users/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { email, name, password } = req.body;
        await this.db.updateUser(id, email, name, password);
        res.status(200).send("User updated");
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
      }
    });

    router.delete("/users/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await this.db.deleteUser(id);
        res.status(200).send("User deleted");
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
      }
    });

    router.get("/api-calls", async (req, res) => {
      try {
        const response = await this.db.getTotalApiUsage();
        res.status(200).send(response);
      } catch (error) {
        console.error("Error getting API calls:", error);
        res.status(500).send("Error getting API calls");
      }
    });

    router.get("/api-calls/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const response = await this.db.getUserApiUsage(id);
        res.status(200).send(response);
      } catch (error) {
        console.error("Error getting user API calls:", error);
        res.status(500).send("Error getting user API calls");
      }
    });

    router.put("/api-calls/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log("api-calls req.body", req.body);
        const response = await this.db.incrementUserApiUsage(
          id,
          req.body.route,
          req.body.method
        );
        res.status(200).send({ api_calls: response });
      } catch (error) {
        console.error("Error incrementing user API calls:", error);
        res.status(500).send("Error incrementing user API calls: ");
      }
    });

    router.patch("/api-calls/:id/reset", async (req, res) => {
      try {
        const { id } = req.params;
        await this.db.resetApiUsage(id);
        res.status(200).send("API usage counters reset");
      } catch (error) {
        console.error("Error resetting user API calls:", error);
        res.status(500).send("Error resetting user API calls: ");
      }
    });

    /*
    ======================
    Define Prompt routes
    ======================
    */
    router.get("/prompts/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        const [rows] = await this.db.getPrompts(userId);
        res.status(200).json(rows);
      } catch (error) {
        console.error("Error getting prompts:", error);
      }
    });

    router.post("/prompts", async (req, res) => {
      try {
        const { userId, question, answer } = req.body;
        await this.db.createPrompt(userId, question, answer);
        res.status(201).send("Prompt created");
      } catch (error) {
        console.error("Error creating prompt:", error);
        res.status(500).send("Error creating prompt");
      }
    });

    router.delete("/prompts/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await this.db.deletePrompt(id);
        res.status(200).send("Prompt deleted");
      } catch (error) {
        console.error("Error deleting prompt:", error);
        res.status(500).send("Error deleting prompt");
      }
    });

    return router;
  }

  createServer() {
    this.app.all("*", (req, res) => {
      res.status(404).send("Nothing here!");
    });

    // Start the Express server
    this.app.listen(this.port, () => {
      console.log(`Server is running and listening on port ${this.port}`);
    });
  }
}

const databaseServer = new DatabaseServer(process.env.PORT || 8080);
