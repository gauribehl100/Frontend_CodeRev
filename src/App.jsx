import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false); 

  const getPrismLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      c: "clike",
      cpp: "clike",
      java: "java",
      python: "python",
    };
    return languageMap[lang] || "javascript"; 
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [language]);

  async function reviewCode() {
    setIsLoading(true);
    setReview(""); 
  

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL ||"https://backend-code-8.onrender.com"}/ai/response`, {
        prompt: code,
        language: language,
      });

      setReview(response.data.text);

     
      }
    } catch (error) {
      console.error("Error fetching review:", error);
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <>
      <div className="nav">
        <b>CODE</b>guru
      </div>
      <main>
        <div className="left">
          <div className="code">
            <div className="lang">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(code) => Prism.highlight(code, Prism.languages[getPrismLanguage(language)], language)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 17,
                height: "93.5%",
                width: "100%",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            {isLoading ? "Loading..." : "Review"} 
          </div>
        </div>

        <div className="right">
          
          {isLoading ? (
            <div className="loader-container">
            <div className="loader"></div>
          </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
          
        </div>
      </main>
    </>
  );
}





export default App


