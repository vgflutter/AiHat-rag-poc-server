import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, './data');
const COLLECTION_NAME = 'stock-insights';

const sanitizeMetadata = (metadata) =>
  Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value])
  );

async function loadDocuments(dir) {
  const files = fs.readdirSync(dir);
  const docs = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const fullPath = path.join(dir, file);

    let loader = ext === '.txt' ? new TextLoader(fullPath) : ext === '.pdf' ? new PDFLoader(fullPath) : null;

    if (!loader) {
      console.warn(`Unsupported file: ${file}`);
      continue;
    }

    docs.push(...(await loader.load()));
  }

  return docs.filter((doc) => doc.pageContent?.trim());
}

async function indexDocuments() {
  const rawDocs = await loadDocuments(DATA_DIR);
  if (!rawDocs.length) return console.error('No valid documents found.');

  console.log(`Found ${rawDocs.length} documents`);

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const splitDocs = (await splitter.splitDocuments(rawDocs))
    .filter((doc) => doc.pageContent?.trim().length > 10)
    .map((doc, i) => ({
      ...doc,
      metadata: sanitizeMetadata({
        ...doc.metadata,
        chunk_id: `chunk-${i}`,
        file_name: path.basename(doc.metadata?.source || `doc-${i}`),
      }),
    }));

  console.log(`Chunks after splitting: ${splitDocs.length}`);

  const uniqueChunks = Array.from(new Map(splitDocs.map((doc) => [doc.pageContent.trim(), doc])).values());

  console.log(`Unique chunks to index: ${uniqueChunks.length}`);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  });

  const chromaClient = new ChromaClient({ path: 'http://localhost:8000' });

  try {
    await chromaClient.deleteCollection({ name: COLLECTION_NAME });
    console.log('Deleted existing collection.');
  } catch {
    console.log('No existing collection to delete.');
  }

  await Chroma.fromDocuments(uniqueChunks, embeddings, {
    collectionName: COLLECTION_NAME,
    url: 'http://localhost:8000',
  });

  console.log('Indexing complete.');
}

indexDocuments().catch((err) => {
  console.error('Indexing failed:', err);
  process.exit(1);
});
