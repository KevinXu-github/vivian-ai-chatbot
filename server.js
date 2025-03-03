const express = require('express');
const axios = require('axios');
const app = express();

// Serve static files
app.use(express.static('.'));
app.use(express.json());

// Create a proxy endpoint for Hugging Face with retry logic
app.post('/api/huggingface', async (req, res) => {
  try {
    console.log("Received proxy request for model:", req.body.model);
    
    const { model, inputs, parameters } = req.body;
    const API_KEY = "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";
    
    // Try up to 3 times with exponential backoff
    const maxAttempts = 3;
    let attempt = 0;
    let lastError = null;
    
    while (attempt < maxAttempts) {
      attempt++;
      const waitTime = Math.pow(2, attempt - 1) * 2000; // 2s, 4s, 8s
      
      try {
        console.log(`Attempt ${attempt}/${maxAttempts} for model ${model}`);
        
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          { inputs, parameters },
          { 
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );
        
        console.log("API response successful");
        return res.json(response.data);
      } catch (error) {
        lastError = error;
        
        if (error.response && error.response.status === 503) {
          console.log(`Model unavailable (503), waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Try again
        }
        
        // If it's not a 503 error, break out of the loop
        break;
      }
    }
    
    // If we reach here, all attempts failed
    console.error(`All ${maxAttempts} attempts failed for model ${model}`);
    
    if (lastError.response) {
      console.error('Final error status:', lastError.response.status);
      // For a cleaner response, don't send the entire HTML
      res.status(502).json({ 
        error: `Service unavailable after ${maxAttempts} attempts`,
        status: lastError.response.status,
        message: "The model is currently unavailable. This typically happens when the model needs to be loaded. Please try again later."
      });
    } else {
      res.status(500).json({ 
        error: lastError.message
      });
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add a fallback endpoint for simpler models
app.post('/api/fallback', async (req, res) => {
  try {
    console.log("Using fallback model");
    const { inputs } = req.body;
    const API_KEY = "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";
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/gpt2`,
      { inputs },
      { 
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Fallback response successful");
    res.json(response.data);
  } catch (error) {
    console.error('Fallback error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});