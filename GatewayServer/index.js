const express = require('express');

/**
 * Responsible for API server methods.
 */
class ExpressServer {
    constructor(port) {
        this.port = port;
        this.app = express(); // Create an instance of express
        this.app.use(express.json()); // Use middleware to parse JSON bodies
    }

    /**
     * Initializes the Express server.
     */
    createServer = () => {
        // Define the route for POST request at '/authenticate'
        this.app.post('/authenticate', (req, res) => {
            this.handleAuthentication(req, res);
        });

        // Define the default route for all other requests
        this.app.all('*', (req, res) => {
            res.status(200).send('Welcome to the server.');
        });

        // Start the Express server
        this.app.listen(this.port, () => {
            console.log(`Server is running and listening on port ${this.port}`);
        });
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    handleAuthentication = (req, res) => {
        // TODO: Implement authentication logic here.
        // For example, you can access request body using req.body
    }

    start = () => {
        this.createServer();
    }
}

const myServer = new ExpressServer(process.env.PORT || 8888);

myServer.start();
