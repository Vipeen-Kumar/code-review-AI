const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Centralized configuration for the model
const MODEL_CONFIG = {
  model: "gemini-1.5-flash", // ✅ Corrected model name
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  },
  systemInstruction: `You are an expert code reviewer. Your task is to analyze, review, and suggest improvements for the provided code snippet following specific guidelines for structure and content. Provide detailed, constructive feedback using Markdown.`,
};

// ... rest of the file remains the same

// Initialize the AI model directly with the config object
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel(MODEL_CONFIG);

/**
 * Generates a code review using the Gemini AI model.
 * @param {{ code: string, language: string }} options - The code and its language.
 * @returns {Promise<string>} A promise that resolves to the AI-generated code review.
 */
async function generateContent({ code, language }) {
  // Consolidate validation into a single, modern check
  if (!code?.trim() || !language?.trim()) {
    throw new Error("Inputs 'code' and 'language' must be non-empty strings.");
  }

  const prompt = `Please provide a concise code review for the following ${language} code snippet:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const { response } = await model.generateContent(prompt);
    const text = response?.text(); // Safely access text using optional chaining

    if (!text) {
      throw new Error("Received an empty response from the AI service.");
    }
    return text;
  } catch (error) {
    console.error("Error generating content from AI:", error.message);
    // Re-throw a user-friendly error after logging the original
    throw new Error("Failed to get review from the AI service. Check API key and configuration.");
  }
}

module.exports = generateContent;