const http = require('http')

/**
 * Responsible for API server methods.
 */
class HttpServer {
    constructor(port) {
        this.port = port;
    }

    /**
     * Initializes the HTTP server.
     */
    createServer = () => {
        http.createServer((req, res) => {
            const method = req.method.toUpperCase();

            const url = new URL(req.url, `http://${req.headers.host}`);

            if (method == "POST" && url.pathname == "/authenticate") {
                this.handleAuthentication(req, res); // TODO: Create a new class that deals with Authentication
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.end("Welcome to the server.");
            }
        }).listen(this.port, () => {
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
    }

    start = () => {
        this.createServer();
    }
}

const myServer = new HttpServer(process.env.PORT || 8888);

myServer.start();