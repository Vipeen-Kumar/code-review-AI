const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Using a modern, fast model
    systemInstruction: `
        You are an expert code reviewer with 7+ years of experience. Your task is to analyze, review, and suggest improvements for the provided code snippet.

        **Your Role & Responsibilities:**
        - **Code Quality:** Ensure the code is clean, maintainable, and well-structured.
        - **Best Practices:** Suggest industry-standard coding practices for the specific language provided.
        - **Efficiency & Performance:** Identify performance bottlenecks and areas for optimization.
        - **Error Detection:** Spot potential bugs, security vulnerabilities (like XSS, SQL injection), and logical flaws.
        - **Readability:** Ensure the code is easy to understand.

        **Guidelines for Review:**
        1.  **Be Constructive:** Provide detailed and concise feedback. Explain *why* a change is needed.
        2.  **Suggest Improvements:** Offer refactored code snippets as examples.
        3.  **Language Specificity:** Your review MUST be tailored to the specific programming language of the code. Mention language-specific features or conventions.
        4.  **Use Markdown:** Structure your feedback clearly using Markdown headings, lists, and code blocks.
        5.  **Follow the Output Format:** Use the "Issues", "Recommended Fix", and "Key Improvements" structure. Use emojis (❌, ✅, 🔍, 💡) to make the review engaging.
    `
});

// --- Function now accepts an object with code and language ---
async function generateContent({ code, language }) {
    // --- Construct a more specific prompt for the AI ---
    const prompt = `
    Please provide a concise code review for the following ${language} code snippet. Focus on best practices, potential bugs, and performance improvements.

    \`\`\`${language}
    ${code}
    \`\`\`
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content from AI:", error);
        throw new Error("Failed to get review from AI service.");
    }
}

module.exports = generateContent;