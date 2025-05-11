import express from 'express';
const router = express.Router();
import AIService from '../../services/ai.service.js';
import { logRequest } from '../../utils/loggerHelper.js';
import { shouldSellStockPrompt } from '../../prompts/prompts.js';
import { safeJsonParse, removeEmptyArrays } from '../../utils/helpers.js';
import { createRetriever } from '../../rag/chromaSetup.js';

const aiService = AIService.getInstance();

const handleApiError = (res, error, endpoint) => {
  console.error(`${endpoint} API Error:`, error.response?.data || error.message);
  res.status(500).json({
    error: `${endpoint} API Error`,
    details: error.response?.data || error.message,
  });
};

router.post('/rag-test', async (req, res) => {
  const { aiSetup, stockName } = req.body;

  let context = '';
  if (aiSetup.useRag) {
    try {
      const retriever = await createRetriever();
      const retrievedDocs = await retriever.invoke(stockName);
      context = retrievedDocs.map((doc) => doc.pageContent).join('\n---\n');
    } catch (e) {
      console.warn('RAG context fallback:', e.message);
    }
  }

  try {
    const prompt = shouldSellStockPrompt({ engine: aiSetup.engine, stockName, context });

    const system = 'You are a financial compliance and risk validation assistant.';

    const aiResponse = await aiService.invokeAI(aiSetup, prompt, system);

    const parsedResponse = safeJsonParse(aiResponse);
    if (!parsedResponse) {
      throw new Error('AI response is not a valid JSON.');
    }

    logRequest('rag-test -> /rag-test', req.body, prompt, parsedResponse);
    res.json(removeEmptyArrays(parsedResponse));
  } catch (error) {
    console.error('AI API Error in /rag-test:', error.response?.data || error.message);
    handleApiError(res, error, '/rag-test');
  }
});

export default router;
