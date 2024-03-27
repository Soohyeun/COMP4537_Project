const OpenAi = require("openai");
require("dotenv").config();

/**
 * Responsible for the Open AI api wrapper methods.
 */
class OpenAIWrapper {
    /**
     * Constructs a OpenAIWrapper object.
     */
    constructor() {
        this.model = "gpt-3.5-turbo";
        this.openai = new OpenAi({
            apiKey: process.env.API_SECRET_KEY,
        })
    }

    /**
     * Get an answer to the question.
     * @param {*} question the question to send to OpenAI api.
     */
    getAnswer = async (question) => {
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return response.choices[0].message.content;
    }
}

module.exports = OpenAIWrapper;