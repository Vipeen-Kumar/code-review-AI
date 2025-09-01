import { useState, useEffect } from 'react';
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Import language definitions for Prism to work
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
// ✅ Correct line
import "prismjs/components/prism-markup";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import LanguageSelector from './LanguageSelector'; // --- Import new component ---
import './App.css';
import './LanguageSelector.css'; // --- Import its CSS ---

const defaultCode = {
  javascript: `function sum(a, b) {\n  return a + b;\n}`,
  python: `def get_user(id):\n  # Fetch user from database\n  user = db.find(id)\n  return user`,
  java: `class Solution {\n  public int sum(int a, int b) {\n    return a + b;\n  }\n}`,
};

function App() {
  const [language, setLanguage] = useState('javascript'); // --- State for language ---
  const [code, setCode] = useState(defaultCode.javascript);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, [code, language]);

  // --- Update code editor when language changes ---
  useEffect(() => {
    setCode(defaultCode[language] || `// Write your ${language} code here`);
    setReview(''); // Clear previous review
  }, [language]);

  async function reviewCode() {
    setLoading(true);
    setReview('');
    setError(null);
    try {
      // --- Send both code and language to the backend ---
      const response = await axios.post('http://localhost:3000/ai/get-review', { code, language });
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      const errorMessage = "Sorry, something went wrong. Please try again.";
      setReview(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // --- Dynamic highlighting based on state ---
  const highlightCode = (code) => {
    if (prism.languages[language]) {
      return prism.highlight(code, prism.languages[language], language);
    }
    return prism.highlight(code, prism.languages.clike, 'clike'); // Fallback
  };

  return (
    <>
      <main>
        <div className="left">
          {/* --- Add the LanguageSelector component here --- */}
          <LanguageSelector language={language} setLanguage={setLanguage} />
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={highlightCode}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                minHeight: "100%",
                minWidth: "100%"
              }}
            />
          </div>
          <div
            onClick={!loading ? reviewCode : undefined}
            className={`review ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Reviewing...' : 'Review'}
          </div>
        </div>
        <div className={`right ${review ? 'visible' : ''}`}>
          {error && <div className="error-message">{error}</div>}
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >
            {review}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;