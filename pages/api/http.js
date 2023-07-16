import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

// 根据API Key进行大模型调用的配置
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 对话上下文
let messages = [{
    'role': "system",
    "content": "你是一个小红书的知名博主，擅长发布旅游类贴子吸引流量。"
}];

export default async function (req, res) {
    // if (!configuration.apiKey) {
    //   res.status(500).json({
    //     error: {
    //       message: "OpenAI API key not configured, please follow instructions in README.md",
    //     }
    //   });
    //   return;
    // }

    // 构造HTTP Request中的Authorization项
    const api_key = `Bearer ` + process.env.OPENAI_API_KEY
    console.log(api_key)

    // 获取从用户输入来的描述
    const desc= req.body.desc;

    // 调用库的方法
    // try {
    //   const completion = await openai.createCompletion({
    //     model: "gpt-3.5-turbo",
    //     prompt: generatePrompt(desc),
    //     temperature: 0.6,
    //   });
    //   res.status(200).json({ result: completion.data.choices[0].text });
    // } catch(error) {
    //   // Consider adjusting the error handling logic for your use case
    //   if (error.response) {
    //     console.error(error.response.status, error.response.data);
    //     res.status(error.response.status).json(error.response.data);
    //   } else {
    //     console.error(`Error with OpenAI API request: ${error.message}`);
    //     res.status(500).json({
    //       error: {
    //         message: 'An error occurred during your request.',
    //       }
    //     });
    //   }
    // }


    // 更新Message
    messages.push({
        "role": "user",
        "content": generatePrompt(desc)
    })

    try {
        // 或者用HTTP Request的方式进行交互
        const completion = await axios({
            method: 'post',
            url: 'https://gallerynebula.art/v1/chat/completions',
            headers: {
                'Content-Type': "application/json",
                'Authorization': api_key
            },
            data: {
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "temperature": 0.6,
                // "max_tokens": 4096
            }
        })
        console.log(completion)

        const msg = completion.data.choices[0].message.content
        console.log("Return message is:", msg)
        // 更新对话序列
        messages.push({
            "role": "assistant",
            "content": msg
        })
        // 返回结果
        res.status(200).json({ result: msg });

    } catch (err) {
        // Consider adjusting the error handling logic for your use case
        if (err.response) {
            console.error(err.response.status, err.response.data);
            res.status(err.response.status).json(err.response.data);
        } else {
            console.error(`Error with OpenAI API request`);
            console.log(err)
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }

}

// 提示词构建函数：固定提示词 + 变体提示词
function generatePrompt(description) {
    return `我想写一篇小红书风格的旅游类爆款文案，描述${description}的经历并只输出文案`;
}
