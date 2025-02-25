import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [visitorId, setVisitorId] = useState("");
  const [counter, setCounter] = useState(0);
  const [chartData, setChartData] = useState([{ name: "Start", value: 0 }]);
  const [emoji, setEmoji] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const apiKey = "bea7bfa8-31d8-453a-5a5b-c891f749da9b";

    if (!window.pendo) {
      const script = document.createElement("script");
      script.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
      script.async = true;

      script.onload = () => {
        console.log("✅ Pendo script loaded.");
        if (window.pendo && typeof window.pendo.initialize === "function") {
          window.pendo.initialize({ visitor: { id: "anonymous" }, account: { id: "test-account" } });
          console.log("✅ Pendo initialized with anonymous user.");
        }
      };

      document.head.appendChild(script);
    }
  }, []);

  const handleInputChange = (event) => setVisitorId(event.target.value);

  const login = () => {
    if (!window.pendo || !window.pendo.identify) {
      console.error("❌ Pendo is not ready yet!");
      return;
    }

    if (!visitorId) {
      console.warn("⚠️ Please enter a visitor ID.");
      return;
    }

    window.pendo.identify({
      visitor: { id: visitorId },
      account: { id: "test-account" }
    });

    console.log(`✅ Pendo identify called with visitor ID: ${visitorId}`);

    // Show login confirmation
    setLoginSuccess(true);

    // Hide confirmation after 1.5 seconds
    setTimeout(() => setLoginSuccess(false), 1500);
  };

  const updateCounter = (change) => {
    const newCounter = counter + change;
    setCounter(newCounter);

    // Update chart data
    setChartData((prevData) => [
      ...prevData,
      { name: `Step ${prevData.length}`, value: newCounter }
    ]);

    // Show the appropriate emoji
    if (change > 0) {
      setEmoji("🐷"); // Sell -> Money in the bank
    } else {
      setEmoji("💸"); // Buy -> Money with wings
    }

    // Hide the emoji after 1 second
    setTimeout(() => setEmoji(""), 1000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Test App with Pendo</h1>

      <div>
        <input
          type="text"
          value={visitorId}
          onChange={handleInputChange}
          placeholder="Enter Visitor ID..."
          style={{ padding: "10px", margin: "10px" }}
        />
        <button onClick={login} style={{ padding: "10px", marginRight: "10px" }}>
          Set Visitor ID
        </button>

        {/* ✅ Success Message or Checkmark */}
        {loginSuccess && (
          <span
            style={{
              fontSize: "1.2rem",
              color: "green",
              fontWeight: "bold",
              transition: "opacity 0.5s ease-in-out",
              animation: "fadeOut 1.5s ease-out"
            }}
          >
            ✅ Logged in!
          </span>
        )}
      </div>

      {/* Emoji Display Area */}
      <div style={{ position: "relative", height: "50px", marginBottom: "10px" }}>
        {emoji && (
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "3rem",
              opacity: 1,
              animation: "fadeOut 1s ease-out",
            }}
          >
            {emoji}
          </span>
        )}
      </div>

      <div>
        <button onClick={() => updateCounter(1)} style={{ padding: "10px", margin: "5px" }}>
          Sell
        </button>
        <button onClick={() => updateCounter(-1)} style={{ padding: "10px", margin: "5px" }}>
          Buy
        </button>
      </div>

      <h2>Account Balance (millions, USD): {counter}</h2>

      {/* Chart Section */}
      <h3>Account Balance History</h3>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fade-out animation */}
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0px); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
