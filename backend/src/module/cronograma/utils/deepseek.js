import OpenAI from "openai";
import http from 'http'

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
        timeout: 300000,
        defaultHeaders: {
                'Accept-Language': 'pt-BR',
        },
        httpAgent: new http.Agent({ 
                keepAlive: true,
                keepAliveMsecs: 60000,
                timeout: 0 // Desativa timeout do socket
        }),
        
        fetch: async (url, options) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 280000); // 4:40min
                
                try {
                        const response = await fetch(url, {
                        ...options,
                        signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        return response;
                } catch (error) {
                        clearTimeout(timeoutId);
                        throw error;
                }
        }
});

export { openai };