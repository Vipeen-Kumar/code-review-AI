import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    // --- Set loading to true when starting ---
    setLoading(true);
    setReview(''); // Clear previous review immediately
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("Sorry, something went wrong. Please try again.");
    } finally {
      // --- Set loading to false when done ---
      setLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
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
            onClick={!loading ? reviewCode : undefined} // --- Prevent clicking while loading ---
            // --- Dynamically add a 'loading' class ---
            className={`review ${loading ? 'loading' : ''}`}
          >
            {/* --- Change button text based on loading state --- */}
            {loading ? 'Reviewing...' : 'Review'}
          </div>
        </div>
        {/* --- Add a class when review has content to trigger animation --- */}
        <div className={`right ${review ? 'visible' : ''}`}>
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