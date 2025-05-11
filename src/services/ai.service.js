import axios from 'axios';

import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    if (AIService.instance) {
      return AIService.instance;
    }

    this.openAiKey = process.env.OPENAI_API_KEY;
    this.geminiKey = process.env.GEMINI_API_KEY;

    if (!this.openAiKey || !this.geminiKey) {
      throw new Error('OpenAI and Gemini API keys must be defined in environment variables!');
    }

    this.geminiClient = new GoogleGenerativeAI(this.geminiKey);
    AIService.instance = this;
    return this;
  }

  async callChatGPT(model, prompt, content) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: content },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.openAiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error('Error API OpenAI:', error.response?.data || error.message);
      throw new Error('Error API OpenAI');
    }
  }

  async callGemini(model, prompt) {
    try {
      const modelInstance = this.geminiClient.getGenerativeModel({ model });
      const result = await modelInstance.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Errore API Gemini:', error);
      throw new Error('Error API Gemini');
    }
  }

  async invokeAI(aiSetup, prompt, content) {
    if (!aiSetup || !aiSetup.engine || !aiSetup.model) {
      throw new Error("error missing fields'.");
    }

    if (aiSetup.engine.toLowerCase() === 'chatgpt') {
      return await this.callChatGPT(aiSetup.model, prompt, content);
    } else if (aiSetup.engine.toLowerCase() === 'gemini') {
      return await this.callGemini(aiSetup.model, prompt);
    } else {
      throw new Error(` AI model not supported: ${aiSetup.engine}`);
    }
  }

  static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
}

export default AIService;
