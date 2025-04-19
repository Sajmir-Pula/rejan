const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Adjust for security if needed


app.get("/", (req, res) => {
    res.send("✅ Dostoevsky API is running.");
});

// Load API key from .env file
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!GOOGLE_AI_API_KEY) {
    console.error("❌ Error: Missing GOOGLE_AI_API_KEY in environment variables.");
    process.exit(1); // Stop the server if API key is missing
}

app.post("/ask-dostoevsky", async (req, res) => {
    const userMessage = req.body.message?.trim();

    if (!userMessage) {
        return res.status(400).json({ error: "❌ Missing 'message' in request body." });
    }

    try {
        // Google AI Studio API Request (Updated Model Name)
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GOOGLE_AI_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("⚠️ Google AI API Error:", errorData);
            return res.status(response.status).json({ error: errorData.error.message || "❌ AI API request failed." });
        }

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No valid response from AI.";

        res.json({ reply: botReply });
    } catch (error) {
        console.error("🔥 Server Error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


