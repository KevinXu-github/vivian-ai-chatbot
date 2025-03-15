// OpenAI API integration for Vivian AI

// Function to get response from OpenAI API
async function getOpenAIResponse(userMessage, personality, mood) {
    try {
      console.log("Getting OpenAI response for:", userMessage);
      
      // Create the request payload
      const payload = {
        message: userMessage,
        personality: personality,
        mood: mood,
        conversationHistory: conversationHistory // Using the existing global conversationHistory object
      };
      
      const response = await fetch('/api/openai', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      // Log the status code for debugging
      console.log(`OpenAI API response status: ${response.status}`);
      
      if (!response.ok) {
        console.log(`OpenAI API error (${response.status}), falling back to other methods`);
        return null;
      }
      
      const data = await response.json();
      
      if (data && data.generated_text) {
        const processedResponse = data.generated_text.trim();
        console.log("Processed OpenAI response:", processedResponse);
        
        // Update conversation history
        updateConversationHistory(processedResponse, userMessage);
        
        return processedResponse;
      } else {
        console.log("Unexpected response format from OpenAI:", data);
        return null;
      }
    } catch (error) {
      console.error("Error getting OpenAI response:", error);
      return null;
    }
  }
  
  // Make the function accessible globally
  window.getOpenAIResponse = getOpenAIResponse;