/* global chrome */
import React, { useState } from "react";

const Home = () => {
  const [question, setQuestion] = useState("");
  const [langElem, setLangElem] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const autoFillQuestion = () => {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GET_QUESTION" },
          (response) => {
            if (chrome.runtime.lastError) {
              alert("Could not connect to content script and refresh the page.");
              setQuestion("");
              setLangElem("");
              return;
            }
            if (response && response.question) {
              setQuestion(response.question);
              setLangElem(response.langElem || "");
            } else {
              setQuestion("");
              setLangElem("");
              alert("Could not extract question from this page.");
            }
          }
        );
      });
    } else {
      alert("Auto-fill only works in the extension popup.");
    }
  };

  const getHint = async () => {
    if (!question.trim()) {
      alert("Please enter or auto-fill a question first.");
      return;
    }
    setLoading(true);
    setHint("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/askQuestion`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({ questionText: question, langElem: langElem })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.question && data.data.question.aiHint) {
        setHint(data.data.question.aiHint);
      } else {
        setHint("No hint found or error from AI API.");
      }
    } catch (err) {
      console.error("Error fetching hint ", err);
      setHint("Error fetching hint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
      
      <div className="bg-white shadow-lg rounded-lg w-full h-full p-4">
      {/* <Navbar /> */}
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">AI Coding Helper</h1>
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <textarea
            id="question"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Paste or auto-fill your coding question here..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          {langElem && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-semibold">Detected Language:</span> {langElem}
            </div>
          )}
          <button
            type="button"
            onClick={autoFillQuestion}
            className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
          >
            Auto-Fill from Page
          </button>
        </div>
        <button
          onClick={getHint}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold mb-4"
          disabled={loading}
        >
          {loading ? "Getting Hint..." : "Get AI Hint"}
        </button>
        <div className="min-h-[60px] bg-gray-50 border border-gray-200 rounded p-3">
          <span className="block text-gray-700 font-medium mb-1">AI Hint:</span>
          <span className="text-gray-900 whitespace-pre-line">{hint}</span>
        </div>
      </div>
  
  );
};

export default Home;