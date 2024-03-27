const express = require("express");

/**
 * Responsible for the OpenAI API wrapper server methods.
 */
class MLServer {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.app.use(express.json());
        this.createServer()
    }

    createServer = () => {

    }
}

const mlServer = new MLServer(process.env.port || 8090);