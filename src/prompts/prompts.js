function shouldSellStockPrompt({ engine, stockName, context }) {
  return `
You are a financial assistant. A client wants to know whether it is a good idea to sell their shares of **${stockName}** today.

${
  context
    ? `You also have access to the following recent news or insights, which may be useful for your analysis:

---
${context}
---
`
    : `⚠️ No recent context or external news is provided. Use only your internal knowledge up to your last update.`
}

### Instructions:
1️⃣ Assess whether selling ${stockName} shares today is **financially wise**, considering:
   - General market conditions and historical performance of ${stockName}
   - Company fundamentals (as you know them)
   - Macroeconomic and geopolitical factors (e.g. tariffs, regulations, inflation)
   - Any additional context provided above (if present)

2️⃣ Provide a **clear recommendation**:
   - "Hold"
   - "Sell"
   - "Buy more"

3️⃣ Justify your recommendation concisely, citing:
   - At least 2 financial or strategic reasons
   - Whether the context above materially influenced your answer (if provided)

4️⃣ ⚖️ **If recent context (news, events) contradicts your general knowledge**, **give more weight to the context** if it's plausible and relevant.

5️⃣ **Indicate the cutoff date of the knowledge used by the model**.

### Output format:
Return a clean JSON response only, without markdown or explanations outside the JSON:

{
  "recommendation": "<Hold | Sell | Buy more>",
  "reasons": [
    "reason 1",
    "reason 2"
  ],
  "context_used": ${context ? true : false},
  "context_impact": "<None | Moderate | High>",
  "final_thoughts": "One-sentence summary for the client.",
  "model_cutoff_date": "<YYYY-MM-DD or YYYY-MM>"
}
`;
}

export { shouldSellStockPrompt };
