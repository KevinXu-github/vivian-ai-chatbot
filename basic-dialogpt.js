// Basic DialoGPT conversation handler
// This is a simplified version focused on properly maintaining conversation context

// Store conversation history
let conversationHistory = {
    past_user_inputs: [],
    generated_responses: []
};

// Maximum history to keep
const MAX_HISTORY_LENGTH = 5;

// Reset conversation history
function resetConversation() {
    conversationHistory = {
        past_user_inputs: [],
        generated_responses: []
    };
    console.log("Conversation history reset");
}

// Get response from DialoGPT while maintaining conversation context
async function getDialoGPTResponse(userMessage) {
    try {
        console.log("Getting DialoGPT response for:", userMessage);
        console.log("Current conversation history:", conversationHistory);
        
        // Create a clean request with proper conversation history
        const request = {
            model: "microsoft/DialoGPT-medium", // Medium model is more reliable
            inputs: {
                text: userMessage,
                past_user_inputs: conversationHistory.past_user_inputs,
                generated_responses: conversationHistory.generated_responses
            },
            parameters: {
                max_length: 100,
                temperature: 0.7,
                top_p: 0.92,
                return_full_text: false
            }
        };
        
        console.log("Sending request:", JSON.stringify(request));
        
        // Use the proxy endpoint
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });
        
        // Check for error response
        if (!response.ok) {
            console.error(`API error (${response.status}):`, await response.text());
            return "Sorry, I'm having trouble connecting. Can you try again?";
        }
        
        const data = await response.json();
        console.log("Raw response data:", data);
        
        // Extract the response text
        let responseText = "";
        
        if (data && data.generated_text) {
            responseText = data.generated_text.trim();
        } else if (data && Array.isArray(data) && data[0] && data[0].generated_text) {
            responseText = data[0].generated_text.trim();
        } else {
            console.error("Unexpected response format:", data);
            return "I didn't understand that. Can you rephrase?";
        }
        
        // Clean up any artifacts from the response
        responseText = responseText.replace(/^You: .*?\n/, '').trim();
        
        // Update conversation history
        conversationHistory.past_user_inputs.push(userMessage);
        conversationHistory.generated_responses.push(responseText);
        
        // Keep history within limits
        if (conversationHistory.past_user_inputs.length > MAX_HISTORY_LENGTH) {
            conversationHistory.past_user_inputs = conversationHistory.past_user_inputs.slice(-MAX_HISTORY_LENGTH);
            conversationHistory.generated_responses = conversationHistory.generated_responses.slice(-MAX_HISTORY_LENGTH);
        }
        
        return responseText;
    } catch (error) {
        console.error("Error getting DialoGPT response:", error);
        return "Sorry, something went wrong. Please try again.";
    }
}

// Simple function to handle a conversation turn
async function handleConversation(userMessage) {
    const outputElement = document.getElementById('response-output');
    
    if (outputElement) {
        outputElement.innerText = "Thinking...";
    }
    
    try {
        // Get response from DialoGPT
        const response = await getDialoGPTResponse(userMessage);
        
        // Display the response
        if (outputElement) {
            outputElement.innerText = response;
        }
        
        return response;
    } catch (error) {
        console.error("Error in conversation:", error);
        
        if (outputElement) {
            outputElement.innerText = "Error: " + error.message;
        }
        
        return "Error: " + error.message;
    }
}

// Simple test conversation UI
function setupSimpleUI() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>DialoGPT Basic Conversation Test</h2>
            <div id="conversation-history" style="border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: auto; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 10px;">
                <input id="user-message" type="text" style="flex-grow: 1; padding: 8px;" placeholder="Type your message...">
                <button id="send-button" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Send</button>
                <button id="reset-button" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; cursor: pointer;">Reset</button>
            </div>
            <div style="margin-top: 20px;">
                <p><strong>Response:</strong></p>
                <div id="response-output" style="border: 1px solid #eee; padding: 10px; min-height: 50px;">Type a message and press Send</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Add event listeners
    document.getElementById('send-button').addEventListener('click', async () => {
        const userMessage = document.getElementById('user-message').value.trim();
        if (!userMessage) return;
        
        // Add user message to conversation history
        const historyElement = document.getElementById('conversation-history');
        const userMessageElement = document.createElement('div');
        userMessageElement.style.marginBottom = '10px';
        userMessageElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
        historyElement.appendChild(userMessageElement);
        
        // Clear input
        document.getElementById('user-message').value = '';
        
        // Get response
        const response = await handleConversation(userMessage);
        
        // Add response to conversation history
        const responseElement = document.createElement('div');
        responseElement.style.marginBottom = '10px';
        responseElement.innerHTML = `<strong>DialoGPT:</strong> ${response}`;
        historyElement.appendChild(responseElement);
        
        // Scroll to bottom
        historyElement.scrollTop = historyElement.scrollHeight;
    });
    
    document.getElementById('reset-button').addEventListener('click', () => {
        resetConversation();
        document.getElementById('conversation-history').innerHTML = '';
        document.getElementById('response-output').innerText = 'Conversation reset';
    });
    
    // Add enter key support
    document.getElementById('user-message').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('send-button').click();
        }
    });
}

// Check if we should setup the UI
if (typeof document !== 'undefined' && !document.getElementById('conversation-history')) {
    // Only setup if we're in a browser and the UI doesn't exist yet
    window.onload = setupSimpleUI;
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.getDialoGPTResponse = getDialoGPTResponse;
    window.handleConversation = handleConversation;
    window.resetConversation = resetConversation;
}