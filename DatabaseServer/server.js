"use strict";
const express = require("express");
const Database = require("./database");

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

    this.app = express();
    this.app.use(express.json());
    this.app.use(validateApiKey);

    this.db = new Database();
    this.createServer();
  }

  /**
   * Initializes the Express server.
   */
  createServer() {
    // Define user routes
    this.app.get("/users", async (req, res) => {
      try {
        const [rows] = await this.db.getUsers();
        res.status(200).json(rows);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send("Error getting users");
      }
    });

    this.app.get("/users/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const user = await this.db.getUser(email);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
      }
    });

    this.app.post("/users", async (req, res) => {
      try {
        const { email, name, password } = req.body;
        const newUser = await this.db.createUser(email, name, password);
        res.status(201).send({ id: newUser[0].insertId });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
      }
    });

    this.app.patch("/users/:id", async (req, res) => {
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
    
    this.app.delete("/users/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await this.db.deleteUser(id);
        res.status(200).send("User deleted");
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
      }
    });

    // Define prompt routes
    this.app.get("/prompts", async (req, res) => {
      try {
        const [rows] = await this.db.getPrompts();
        res.status(200).json(rows);
      } catch (error) {
        console.error("Error getting prompts:", error);
      }
    });

    this.app.post("/prompts", async (req, res) => {
      try {
        const { userId, question, answer } = req.body;
        await this.db.createPrompt(userId, question, answer);
        res.status(201).send("Prompt created");
      } catch (error) {
        console.error("Error creating prompt:", error);
        res.status(500).send("Error creating prompt");
      }
    });

    this.app.delete("/prompts/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await this.db.deletePrompt(id);
        res.status(200).send("Prompt deleted");
      } catch (error) {
        console.error("Error deleting prompt:", error);
        res.status(500).send("Error deleting prompt");
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
  }
}

const databaseServer = new DatabaseServer(process.env.PORT || 8080);
