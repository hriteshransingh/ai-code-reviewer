import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY});

async function main(code, language) {
  const instruction = `You are a senior AI code reviewer. Follow these EXACT instructions:

  1. Analyze the following ${language} code strictly for:
     - Runtime errors
     - Security vulnerabilities
     - Performance issues
     - Maintainability problems (anti-patterns)
  
  2. If NO issues exist, reply with ONLY:
  ✅ Code Review Passed
  
  (No extra text or formatting)
  
  ---
  
  3. If there ARE issues, reply in this markdown format:
  
  🔴 Code Issues Found  
  ⚠️ Problems:
  - [Concise problem 1]
  - [Concise problem 2]
  
  ✅ Recommended Fix:
  \`\`\`javascript
  [Corrected version of the code]
  \`\`\`
  
  ✨ Optional:
  - [Improvement suggestion 1]
  - [Improvement suggestion 2]
  
  ---
  
  ⚠️ Rules:
  - Only wrap actual code in triple backticks
  - Never use code blocks for plain text
  - Do NOT invent issues — only real problems
  - Do NOT wrap the whole response in a code block
  - Do NOT include examples, explanations, or placeholders
  
  ---
  
  Here is the code to review:
  \`\`\`javascript
  ${code}
  \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{ text: instruction }]
      }],
      generationConfig: {
        temperature: 0,  
        topP: 0.3,
        maxOutputTokens: 200
      }
    });

    return response;
  } catch (error) {
    console.error("AI review failed:", error);
    throw error;
  }
}

export default main;