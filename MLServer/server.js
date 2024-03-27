const express = require("express");
const OpenAIWrapper = require("./openAIWrapper");

/**
 * Responsible for the server methods the calls the Open AI api wrapper.
 */
class MLServer {
    /**
     * Constructs a MLServer object.
     * @param {*} port the port number
     */
    constructor(port) {
        this.port = port;
        this.app = express();
        this.app.use(express.json());
        this.openAIWrapper = new OpenAIWrapper();
        this.createServer()
    }

    /**
     * Initializes the Express server.
     */
    createServer = () => {
        // const response = await this.openAIWrapper.getAnswer("What is computer science");
        // console.log(response.choices[0].message.content);

        // Define user routes.
        this.app.post("/getAnswer", async (req, res) => {
            try {
                const question = req.body.question;
                const answer = await this.openAIWrapper.getAnswer(question);
                const jsonResponse = {
                    "question": question,
                    "answer": answer
                };
                res.status(200).json(jsonResponse);
            } catch (error) {
                console.error("Error getting answer: ", error);
                res.status(500).send("Error getting answer");
            }
        })

        this.app.all("*", (req, res) => {
            res.status(200).send("Welcome to the server at " + new Date());
        })

        // Start the Express server
        this.app.listen(this.port, () => {
            console.log(`Server is running and listening on port ${this.port}`);
        });
    }
}

const mlServer = new MLServer(process.env.port || 8090);