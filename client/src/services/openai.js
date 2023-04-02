

import {Configuration,OpenAIApi} from 'openai'

const configuration = new Configuration({
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);

const createImage =async (prompt) => {
    const response = await openai.createImage({
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });
      image_url = response.data.data[0].url;
    console.log(image_url);

}

export {createImage}