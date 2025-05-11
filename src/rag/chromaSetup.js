import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment variables');
}

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small',
});

export async function createRetriever() {
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: 'stock-insights',
    url: 'http://localhost:8000',
  });

  return vectorStore.asRetriever({ k: 4 });
}
