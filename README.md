# AIHAT-RAG-POC-SERVER

This repository supports the article:  
**“AI RAG as Your Friendly Financial Advisor”**  
by [Vincenzo Giacchina](https://www.linkedin.com/company/aihat/)

---

## 📘 What This Project Is

This is a practical demo created to accompany an article about using **RAG (Retrieval-Augmented Generation)** to enrich AI-based financial reasoning.  
The question that started it all:

> _“What happens if we ask an AI whether we should sell our Apple Inc. stocks?”_

With a simple Node.js setup, this project shows how injecting external context into a prompt can improve an AI’s financial suggestions.

---

## 🧠 What You’ll Find Here

- A RAG-enabled prompt (`shouldSellStockPrompt.js`)
- A Node.js API endpoint (`/api/v1/rag-test`) to test prompt + context
- Manual injection of context (e.g. market news or events)
- JSON output that simulates an AI financial assistant
- Support for model cutoff handling (with or without context)

---

## 📌 Why This Matters

This project is not about delegating decisions to AI —  
It’s about using AI to add **a second perspective** in complex topics like personal finance.  
We believe this kind of reasoning will become more powerful — and more useful — as LLMs evolve.

---

## ▶️ How to Run It

git https://github.com/vgflutter/AiHat-rag-poc-server.git
cd AiHat-rag-poc-server
npm install
npm run dev

# Create a .env file in the root directory and add the following environment variables:

PORT=3000
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"

## Running the Server

Start the API server with:

npm run dev

The server will be available at `http://localhost:3000` by default.

## 📝 License

This project is open source and licensed under the [MIT License](./LICENSE).
