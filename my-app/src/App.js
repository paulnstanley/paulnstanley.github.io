import React, { useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [counter, setCounter] = useState(0);

  const handleInputChange = (event) => setInputValue(event.target.value);
  const handleSubmit = () => {
    setSubmittedText(inputValue);
    setInputValue(""); // Clear input after submission
  };
  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => setCounter(counter - 1);

  useEffect(() => {
    const apiKey = "bea7bfa8-31d8-453a-5a5b-c891f749da9b";

    // Ensure Pendo is not already loaded
    if (!window.pendo) {
      const script = document.createElement("script");
      script.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
      script.async = true;

      script.onload = () => {
        console.log("✅ Pendo script loaded.");
        
        // Initialize Pendo after script loads
        if (window.pendo && typeof window.pendo.initialize === "function") {
          window.pendo.initialize({
            visitor: {
              id: "VISITOR-UNIQUE-ID" // Use real visitor ID or "anonymous"
            },
            account: {
              id: "ACCOUNT-ID" // Use a real account ID
            }
          });
          console.log("✅ Pendo initialized.");
        } else {
          console.error("❌ Pendo failed to initialize.");
        }
      };

      document.head.appendChild(script);
    }
  }, []); // Runs only once when component mounts

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Test App with Pendo</h1>

      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter text..."
          style={{ padding: "10px", margin: "10px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "10px" }}>
          Submit
        </button>
      </div>

      {submittedText && <p>Submitted: {submittedText}</p>}

      <div>
        <button onClick={incrementCounter} style={{ padding: "10px", margin: "5px" }}>
          Increment
        </button>
        <button onClick={decrementCounter} style={{ padding: "10px", margin: "5px" }}>
          Decrement
        </button>
      </div>

      <h2>Counter: {counter}</h2>
    </div>
  );
}

export default App;
