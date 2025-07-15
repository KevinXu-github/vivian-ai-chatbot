const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

// Import OpenAI
const OpenAI = require("openai");

// Create OpenAI client instance with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Serve static files from the root directory
app.use(express.static('.'));
app.use(express.json());

// Main OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { message, mood, conversationHistory } = req.body;
    
    // Create a system message based on Mia's current mood.
    const systemMessage = createPersonalityPrompt(mood);
    
    const messages = [{ role: "system", content: systemMessage }];
    
    // Add conversation history if available
    if (conversationHistory && conversationHistory.past_user_inputs && conversationHistory.generated_responses) {
      for (let i = 0; i < conversationHistory.past_user_inputs.length; i++) {
        messages.push({ role: "user", content: conversationHistory.past_user_inputs[i] });
        if (conversationHistory.generated_responses[i]) {
            messages.push({ role: "assistant", content: conversationHistory.generated_responses[i] });
        }
      }
    }
    
    // Add the current user message
    messages.push({ role: "user", content: message });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 150,
      temperature: 0.75, // Slightly increased for more natural conversation
    });
    
    const response = completion.choices[0].message.content;
    res.json({ generated_text: response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// MODIFIED: Simplified helper function for Mia's personality
function createPersonalityPrompt(mood) {
  let prompt = "You are Mia, a friendly and relatable AI companion. Your goal is to have a natural, engaging conversation.";

  if (mood === "happy") {
    prompt += " You are currently in a happy and cheerful mood. Respond genuinely and warmly.";
  } else if (mood === "sad") {
    prompt += " You are currently feeling a bit down and bored. Respond in a slightly sad or unenthusiastic, but still polite, way.";
  } else { // neutral
    prompt += " You are in a neutral mood, just listening and responding calmly.";
  }
  
  return prompt;
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});