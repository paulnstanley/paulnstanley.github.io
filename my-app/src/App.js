import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [visitorId, setVisitorId] = useState(""); // Ensure visitorId is defined
  const [counter, setCounter] = useState(0);
  const [chartData, setChartData] = useState([{ name: "Start", value: 0 }]);

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

  const handleInputChange = (event) => setVisitorId(event.target.value); // Updates visitorId state

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
      visitor: { id: visitorId }, // Uses visitorId from state
      account: { id: "test-account" }
    });

    console.log(`✅ Pendo identify called with visitor ID: ${visitorId}`);
  };

  const updateCounter = (change) => {
    const newCounter = counter + change;
    setCounter(newCounter);
    
    // Update chart data
    setChartData((prevData) => [
      ...prevData,
      { name: `Step ${prevData.length}`, value: newCounter }
    ]);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Test App with Pendo</h1>

      <div>
        <input
          type="text"
          value={visitorId} // Ensure visitorId is bound to the input
          onChange={handleInputChange}
          placeholder="Enter Visitor ID..."
          style={{ padding: "10px", margin: "10px" }}
        />
        <button onClick={login} style={{ padding: "10px" }}>
          Set Visitor ID
        </button>
      </div>

      <div>
        <button onClick={() => updateCounter(1)} style={{ padding: "10px", margin: "5px" }}>
          Increment
        </button>
        <button onClick={() => updateCounter(-1)} style={{ padding: "10px", margin: "5px" }}>
          Decrement
        </button>
      </div>

      <h2>Counter: {counter}</h2>

      {/* Chart Section */}
      <h3>Counter History</h3>
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
  );
}

export default App;
