const express = require('express');
const axios = require('axios');
const app = express();

// Serve static files
app.use(express.static('.'));
app.use(express.json({ limit: '10mb' })); // Increased limit for larger model responses

// Create a proxy endpoint for Hugging Face with retry logic
app.post('/api/huggingface', async (req, res) => {
  try {
    console.log("Received proxy request for model:", req.body.model);
    
    const { model, inputs, parameters } = req.body;
    const API_KEY = process.env.HUGGINGFACE_API_KEY || "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";
    
    // Try up to 3 times with exponential backoff
    const maxAttempts = 3;
    let attempt = 0;
    let lastError = null;
    
    while (attempt < maxAttempts) {
      attempt++;
      const waitTime = Math.pow(2, attempt - 1) * 2000; // 2s, 4s, 8s
      
      try {
        console.log(`Attempt ${attempt}/${maxAttempts} for model ${model}`);
        console.log(`Request inputs type: ${typeof inputs}`);
        
        // Determine request format based on model
        const isDeepSeekModel = model.toLowerCase().includes('deepseek');
        const isDialoGPTModel = model.toLowerCase().includes('dialogpt');
        
        let requestData;
        
        if (isDeepSeekModel) {
          // DeepSeek uses a message format
          requestData = { messages: inputs, ...parameters };
          console.log("Using DeepSeek request format");
        } 
        else if (isDialoGPTModel) {
          // DialoGPT expects inputs to be a simple string, not an object
          if (typeof inputs === 'object' && inputs.text) {
            requestData = { inputs: inputs.text, ...parameters };
            console.log("Converting DialoGPT inputs from object to string");
          } else {
            requestData = { inputs, ...parameters };
          }
          console.log("Using DialoGPT request format");
        }
        else {
          // Standard format for other models
          requestData = { inputs, parameters };
          console.log("Using standard request format");
        }
        
        console.log("Request payload:", JSON.stringify(requestData).substring(0, 500) + "...");
        
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          requestData,
          { 
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 60000 // 60 second timeout for larger models
          }
        );
        
        console.log("API response successful");
        console.log("Response data type:", typeof response.data);
        
        // Send the response back to the client
        return res.json(response.data);
      } catch (error) {
        console.error(`Error on attempt ${attempt}:`, error.message);
        
        if (error.response) {
          console.error(`Status: ${error.response.status}`);
          console.error(`Response data:`, error.response.data);
        }
        
        lastError = error;
        
        // Special handling for the "Model is loading" response
        if (error.response && error.response.status === 503) {
          const errorMessage = error.response.data?.error || '';
          console.log(`Model unavailable (503): ${errorMessage}`);
          
          // If the model is loading, wait and retry
          if (errorMessage.includes('loading') || errorMessage.includes('still loading')) {
            console.log(`Model is still loading, waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; // Try again
          }
        }
        
        // Handle format errors (422)
        if (error.response && error.response.status === 422) {
          console.log("Format error detected (422). Trying different format on next attempt.");
          
          // If we have a structured inputs object, try using a simpler format on next attempt
          if (typeof inputs === 'object' && inputs.text) {
            // Next attempt will use the simplified inputs format
            inputs = inputs.text;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; // Try again with simplified format
          }
        }
        
        // Handle "model too large" errors
        if (error.response && error.response.status === 403) {
          const errorMessage = error.response.data?.error || '';
          if (errorMessage.includes('too large')) {
            console.error('Model too large for free tier. Suggesting smaller model...');
            break; // Don't retry for "too large" errors
          }
        }
        
        // Handle other status codes
        if (error.response && error.response.status === 404) {
          console.error('Model not found. Check the model name and ensure it exists on Hugging Face.');
          break; // Don't retry for 404 errors
        }
        
        // Retry for network errors or other retryable errors
        if (!error.response || (error.response.status >= 500 && error.response.status !== 503)) {
          console.log(`Retrying after network or server error, waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // If it's not a retryable error, break out of the loop
        break;
      }
    }
    
    // If we reach here, all attempts failed
    console.error(`All ${maxAttempts} attempts failed for model ${model}`);
    
    if (lastError.response) {
      // If the model is too large, suggest alternatives
      if (lastError.response.status === 403 && 
          lastError.response.data?.error?.includes('too large')) {
        return res.status(403).json({ 
          error: lastError.response.data.error,
          message: "Try using one of these smaller models instead: microsoft/DialoGPT-medium, facebook/blenderbot-400M-distill, or gpt2.",
          suggestedModels: [
            "microsoft/DialoGPT-medium",
            "facebook/blenderbot-400M-distill",
            "gpt2"
          ]
        });
      }
      
      // For format errors, send a clearer message
      if (lastError.response.status === 422) {
        return res.status(422).json({
          error: "Format error: The model expects a different input format",
          details: lastError.response.data,
          suggestion: "Try using a simple string as input instead of an object"
        });
      }
      
      console.error('Final error status:', lastError.response.status);
      // For a cleaner response, don't send the entire HTML
      res.status(502).json({ 
        error: `Service unavailable after ${maxAttempts} attempts`,
        status: lastError.response.status,
        message: lastError.response.data?.error || 
                "The model is currently unavailable. This typically happens when the model needs to be loaded. Please try again later."
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

// Add a fallback endpoint with smaller models that always work
app.post('/api/fallback', async (req, res) => {
  try {
    console.log("Using fallback model");
    const { inputs } = req.body;
    const API_KEY = process.env.HUGGINGFACE_API_KEY || "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";
    
    // Extract text from complex inputs if needed
    let inputText = inputs;
    if (typeof inputs === 'object' && inputs.text) {
      inputText = inputs.text;
    }
    
    // Use DialoGPT-medium as fallback (more reliable than large model)
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium`,
      { inputs: inputText },
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

// Add an endpoint to test available models
app.get('/api/available-models', async (req, res) => {
  try {
    console.log("Checking available models");
    const API_KEY = process.env.HUGGINGFACE_API_KEY || "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";
    
    // Try a few common models
    const modelCheckResults = {};
    const modelsToCheck = [
      "facebook/blenderbot-400M-distill",
      "gpt2",
      "microsoft/DialoGPT-medium",
      "microsoft/DialoGPT-small"
    ];
    
    for (const model of modelsToCheck) {
      try {
        const response = await axios.get(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`
            },
            timeout: 5000
          }
        );
        
        modelCheckResults[model] = {
          available: true,
          status: response.status,
          message: "Model available"
        };
      } catch (error) {
        modelCheckResults[model] = {
          available: false,
          status: error.response?.status || 'No response',
          message: error.response?.data?.error || error.message
        };
      }
    }
    
    res.json({
      message: "Model availability check completed",
      results: modelCheckResults
    });
  } catch (error) {
    console.error('Error checking models:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test DialoGPT at: http://localhost:${PORT}/dialogpt-test.html`);
});