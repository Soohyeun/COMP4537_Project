const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DBRoot = "http://localhost:8080"; //Todo: Change to DB hosting page

/**
 * Responsible for API server methods.
 */
class ExpressServer {
    constructor(port) {
        this.port = port;
        this.app = express(); // Create an instance of express
        this.app.use(express.json()); // Use middleware to parse JSON bodies
        this.TOKEN_SECRET = require("crypto").randomBytes(64).toString("hex");
        this.createServer();
    }

    /**
     * Initializes the Express server.
     */
    createServer = () => {
        // Create new user
        this.app.post("/auth/createAccount", async (req, res) => {
            const { username, email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userData = {
                email: email,
                name: username,
                password: hashedPassword,
            };

            try {
                const response = await axios.post(`${DBRoot}/users`, userData);
                console.log(response.data);
                res.status(200).send(response.data);
            } catch (error) {
                console.error(error.response.data);
                res.status(500).send(error.response.data);
            }
        });

        this.app.post("/auth/login", async (req, res) => {
            const { email, password } = req.body;
            try {
                const response = await axios.get(`${DBRoot}/users/${email}`);
                const userInfo = response.data;
                if (userInfo === null || Object.keys(userInfo).length === 0) {
                    res.status(401).json({ message: "User not found" });
                } else {
                    const validPassword = await bcrypt.compare(
                        password,
                        userInfo.password
                    );
                    if (validPassword) {
                        let accessToken = jwt.sign({ data: email }, this.TOKEN_SECRET, {
                            expiresIn: "1h",
                        });
                        res.cookie("jwt", accessToken, {
                            secure: true,
                            httpOnly: true,
                            maxAge: 3600000,
                        });
                        res.status(200).json({
                            message: "Login success!",
                            data: {
                                name: userInfo.name,
                                api_calls: userInfo.api_calls,
                                is_admin: userInfo.is_admin,
                            },
                        });
                    } else {
                        res.status(401).json({ message: "Password error" });
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(error);
            }
        });

        this.app.post("/auth/valifyUser", async (req, res) => {
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

        this.app.get("/auth/logout", async (req, res) => {
            res.clearCookie("jwt");
            res.send("Logout successfully");
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
