const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers["api-key"];

    if (!apiKey || apiKey !== (process.env.AUTH_API_KEY || "my-secret")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next(); // API key is valid, proceed to the next middleware
};

/**
 * Responsible for API server methods.
 */
class ExpressServer {
    constructor(port) {
        this.port = port;
        this.app = express(); // Create an instance of express
        this.app.use(express.json()); // Use middleware to parse JSON bodies
        this.app.use(validateApiKey);
        this.TOKEN_SECRET = require("crypto").randomBytes(64).toString("hex");
        this.createServer();
    }

    /**
     * Initializes the Express server.
     */
    createServer = () => {
        // Create new user
        this.app.post("/auth/hashPassword", async (req, res) => {
            try {
                const { password } = req.body;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                res.status(200).send(hashedPassword);
            } catch (error) {
                res.status(500).send("Fail to hash password");
            }
        });

        this.app.post("/auth/login", async (req, res) => {
            const { email, password, hashedPassword } = req.body;
            try {
                const validPassword = await bcrypt.compare(password, hashedPassword);
                if (validPassword) {
                    let accessToken = jwt.sign({ data: email }, this.TOKEN_SECRET, {
                        expiresIn: "1h",
                    });
                    res.status(200).json({
                        message: "Login success!",
                        accessToken: accessToken,
                    });
                } else {
                    res.status(401).json({ message: "Password error" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(error);
            }
        });

        this.app.post("/auth/verifyUser", async (req, res) => {
            const token = req.body.token;
            jwt.verify(token, this.TOKEN_SECRET, (error, decode) => {
                if (!error) {
                    res.send(true);
                } else {
                    console.log("Invalid token");
                    res.send(false);
                }
            });
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