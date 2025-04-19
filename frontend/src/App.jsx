import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as darkTheme } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeReviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("python");

  const baseURL = process.env.NODE_ENV === "development"?"http://localhost:3000/api": "/api";


  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const result = await axios.post(`${baseURL}/get-review`, {
        code: code,
        language: language,
      });
      
      setReview(result.data);
    } catch (error) {
      setReview("Error: Could not get review. Please try again.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Code Reviewer</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Input Panel */}
        <div className="w-1/2 p-4 border-r border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your Code</h2>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !code.trim()}
              className={`px-4 py-2 rounded-md font-medium ${
                isLoading || !code.trim()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Review Code"
              )}
            </button>
          </div>
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Review Output Panel */}
        <div className="w-1/2 p-4 bg-gray-800 flex flex-col">
          <h2 className="text-lg font-semibold mb-3">AI Review</h2>
          <div className="flex-1 overflow-auto p-3 bg-gray-900 rounded-md border border-gray-700">
            {review ? (
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={darkTheme}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            background: "#1e1e1e",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-700 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {review}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {isLoading
                  ? "Analyzing your code..."
                  : "Your code review will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
