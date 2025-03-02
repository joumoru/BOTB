const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request Body:', req.body);
  next();
});

// Mock responses for development (in case OpenAI API fails)
const MOCK_RESPONSES = {
  ebay: [
    "I can help you find the best deals on eBay. What are you looking to buy or sell?",
    "Based on recent listings, similar items are selling for around $50-$100.",
    "To improve your selling success, try adding high-quality photos and detailed descriptions.",
  ],
  nfl: [
    "The NFL regular season consists of 17 games. Would you like to know more about a specific team?",
    "The Kansas City Chiefs won Super Bowl LVIII in 2024.",
    "That player had an outstanding season with impressive stats. What specific information would you like to know?",
  ],
  homedepot: [
    "For that DIY project, I'd recommend starting with these basic tools...",
    "When painting interior walls, always start with a good primer and use quality brushes.",
    "The best material for your project would depend on your budget and intended use. Let's discuss the options.",
  ],
};

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Bot prompts
const BOT_PROMPTS = {
  ebay: "You are an eBay shopping assistant. Help users with shopping, selling, and price comparisons.",
  nfl: "You are an NFL expert. Provide accurate information about football, teams, players, and statistics.",
  homedepot: "You are a Home Depot DIY expert. Help users with home improvement projects and product recommendations.",
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/chat', (req, res) => {
  res.json({ 
    message: 'Chat API is running. Please use POST method for chat requests.',
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat'
    }
  });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message, botType } = req.body;

    // Validate request
    if (!message || !botType) {
      return res.status(400).json({ 
        error: 'Message and botType are required',
        received: { message, botType }
      });
    }

    // Validate botType
    if (!BOT_PROMPTS[botType]) {
      return res.status(400).json({ 
        error: 'Invalid bot type',
        validTypes: Object.keys(BOT_PROMPTS)
      });
    }

    try {
      // Attempt to use OpenAI API
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
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      
      // Fall back to mock responses if OpenAI fails
      const mockResponses = MOCK_RESPONSES[botType];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      res.json({
        message: randomResponse,
        note: 'Using fallback response due to API issues'
      });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Something went wrong',
    details: err.message 
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`For local access use: http://localhost:${port}`);
  console.log(`For network access use: http://192.168.0.85:${port}`);
  console.log('Available endpoints:');
  console.log('- GET  /api/health');
  console.log('- GET  /api/chat');
  console.log('- POST /api/chat');
});