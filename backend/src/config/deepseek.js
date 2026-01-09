import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultHeaders: {
                'Accept-Language': 'pt-BR',
        }
});

export { openai };

// const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "deepseek-chat",
//   });

//   console.log(completion.choices[0].message.content);