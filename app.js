const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define bot-specific prompts
const BOT_PROMPTS = {
  ebay: "You are an eBay shopping assistant. Help users with shopping, selling, and price comparisons.",
  nfl: "You are an NFL expert. Provide accurate information about football, teams, players, and statistics.",
  homedepot: "You are a Home Depot DIY expert. Help users with home improvement projects and product recommendations.",
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, botType } = req.body;

    // Validate request
    if (!message || !botType) {
      return res.status(400).json({ 
        error: 'Message and botType are required' 
      });
    }

    // Validate botType
    if (!BOT_PROMPTS[botType]) {
      return res.status(400).json({ 
        error: 'Invalid bot type' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: BOT_PROMPTS[botType] },
        { role: "user", content: message }
      ],
    });

    res.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Something went wrong',
    details: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});