import express, { response } from 'express';
import * as dotenv from 'dotenv';

import { Configuration, OpenAIApi } from 'openai';

dotenv.config()

const router = express.Router()


const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)



router.route('/').get((req, res) => {
    res.status(200).json({ message: "Hello form DALL.E 2.0" })
})
router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body
        console.log(prompt);
        const response = await openai.createImage({
            prompt: "a white siamese cat",
            n: 1,
            size: "1024x1024",
          });

        console.log(response);
        const image = response.data.data[0].b64_json
        res.status(200).json({ photo: image })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "someting went wrong" })
    }
})

export default router