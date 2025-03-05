// dialogpt-api.js - Integration with DialoGPT model for AI-generated responses
let YOUR_HUGGINGFACE_API_KEY = "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";

try {
    if (typeof HUGGINGFACE_API_KEY !== 'undefined') {
        YOUR_HUGGINGFACE_API_KEY = HUGGINGFACE_API_KEY;
    }
} catch (e) {
    console.warn("API config not found, using default API key");
}

// Simple response cache to avoid repeated API calls
const responseCache = new Map();

// Store conversation history for context
const conversationHistory = {
    past_user_inputs: [],
    generated_responses: []
};

// Maximum history to keep per conversation (adjust based on performance)
const MAX_HISTORY_LENGTH = 5;

// Main function to get response from DialoGPT
async function getDialoGPTResponse(userMessage, personality, mood) {
    try {
        console.log("Getting DialoGPT response for:", userMessage);
        
        // Create the personality and mood-specific prompt prefix
        const promptPrefix = createPersonalityPrompt(personality, mood);
        
        // Format the message with the personality prefix
        const formattedMessage = `${promptPrefix} ${userMessage}`;
        console.log("Formatted message:", formattedMessage);
        
        // Log the inputs being sent to the model
        console.log("User message:", userMessage);
        console.log("Personality:", personality);
        console.log("Mood:", mood);
        console.log("Past inputs:", conversationHistory.past_user_inputs);
        console.log("Past responses:", conversationHistory.generated_responses);
        
        // Use the local proxy instead of calling Hugging Face directly
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "microsoft/DialoGPT-large", // Using DialoGPT-large for better quality
                inputs: {
                    text: formattedMessage,
                    past_user_inputs: conversationHistory.past_user_inputs.slice(-MAX_HISTORY_LENGTH),
                    generated_responses: conversationHistory.generated_responses.slice(-MAX_HISTORY_LENGTH)
                },
                parameters: {
                    max_length: 100,
                    do_sample: true,
                    temperature: 0.7,
                    top_p: 0.92,
                    return_full_text: false
                }
            }),
        });
        
        // Check for error response
        if (!response.ok) {
            console.log(`API error (${response.status}), falling back to template response`);
            return null;
        }
        
        console.log("Response status:", response.status);
        const data = await response.json();
        
        // Log the raw model output before processing
        console.log("Raw model output:", data);
        
        // Process and extract the response
        let processedResponse = "";
        
        if (data && data.generated_text) {
            processedResponse = data.generated_text.trim();
        } else if (data && Array.isArray(data) && data[0] && data[0].generated_text) {
            processedResponse = data[0].generated_text.trim();
        } else {
            console.log("Unexpected response format:", data);
            return null;
        }
        
        console.log("Processed response:", processedResponse);
        
        // Update conversation history for future context
        updateConversationHistory(userMessage, processedResponse);
        
        // Format the response according to personality and mood
        return formatResponse(processedResponse, personality, mood);
    } catch (error) {
        console.error("Error getting DialoGPT response:", error);
        return null;
    }
}

// Update conversation history
function updateConversationHistory(userMessage, aiResponse) {
    conversationHistory.past_user_inputs.push(userMessage);
    conversationHistory.generated_responses.push(aiResponse);
    
    // Keep history within limits
    if (conversationHistory.past_user_inputs.length > MAX_HISTORY_LENGTH * 2) {
        conversationHistory.past_user_inputs = conversationHistory.past_user_inputs.slice(-MAX_HISTORY_LENGTH);
        conversationHistory.generated_responses = conversationHistory.generated_responses.slice(-MAX_HISTORY_LENGTH);
    }
}

// Create a prompt that guides the model to respond in the right personality and mood
function createPersonalityPrompt(personality, mood) {
    let prompt = "";
    
    if (personality === "abg") {
        if (mood === "happy") {
            prompt = "Respond as an excited Asian Baby Girl (ABG). Be enthusiastic, use words like 'literally', 'omg', 'bestie', 'slay'.";
        } 
        else if (mood === "sad") {
            prompt = "Respond as a moody Asian Baby Girl (ABG). Be dismissive, use words like 'ugh', 'whatever', 'tbh'.";
        } 
        else { // neutral
            prompt = "Respond as a casual Asian Baby Girl (ABG). Be laid-back, use phrases like 'vibes', 'bestie'.";
        }
    } 
    else if (personality === "cute") {
        if (mood === "happy") {
            prompt = "Respond as a bubbly, cute girl. Use expressions like 'hehe~' and make your response adorable.";
        } 
        else if (mood === "sad") {
            prompt = "Respond as a sad but cute girl. Use gentle, melancholy expressions and sad emoticons.";
        } 
        else { // neutral
            prompt = "Respond as a sweet, gentle girl. Be kind and slightly shy in your response.";
        }
    } 
    else if (personality === "sassy") {
        if (mood === "happy") {
            prompt = "Respond as a confident, sassy girl in a good mood. Be bold and witty with confident energy.";
        } 
        else if (mood === "sad") {
            prompt = "Respond as a sassy but annoyed girl. Be sarcastic and show your irritation.";
        } 
        else { // neutral
            prompt = "Respond as a sassy, confident girl. Be clever and slightly teasing with playful arrogance.";
        }
    }
    
    return prompt;
}

// Format the response to match the desired personality and mood better
function formatResponse(response, personality, mood) {
    // Sometimes the model might output long responses, so let's limit them
    if (response.length > 100) {
        response = response.substring(0, 100);
    }
    
    // DialoGPT sometimes includes the input message in the response, let's clean that up
    response = response.replace(/^You: .*?\n/, '');
    
    // Add personality-specific expressions or endings if they don't already match the style
    if (personality === "abg") {
        if (mood === "happy" && !containsAnyOfTerms(response, ['omg', 'literally', 'bestie', 'slay'])) {
            response += " Literally obsessed!";
        } 
        else if (mood === "sad" && !containsAnyOfTerms(response, ['ugh', 'whatever', 'tbh'])) {
            response += " Whatever tbh.";
        }
    } 
    else if (personality === "cute") {
        if (mood === "happy" && !response.includes('~')) {
            response += " Hehe~";
        } 
        else if (mood === "sad" && !containsAnyOfTerms(response, ['(', ')', ':'])) {
            response += " (◞‸◟)";
        }
    }
    
    return response;
}

// Function to generate a fallback response if API response is unusable
function generateFallbackResponse(personality, mood) {
    // This is largely the same as your current implementation
    if (personality === "abg") {
        if (mood === "happy") {
            const responses = [
                "Omg bestie, I'm literally so obsessed with that! Vibes are immaculate!",
                "That's such a slay! I'm totally here for it!",
                "Yesss! That's the energy I'm looking for today! Love it!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else if (mood === "sad") {
            const responses = [
                "Ugh, whatever. Not really in the mood tbh.",
                "That's kinda basic, ngl. Not feeling it today.",
                "Hmm, I guess. Not like I care that much rn."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else {
            const responses = [
                "That's lowkey interesting. Might vibe with it later.",
                "I mean, it's cool. Boba tea and chill?",
                "Hmm, not bad. But like, have you tried the new boba shop downtown?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    else if (personality === "cute") {
        if (mood === "happy") {
            const responses = [
                "Aww, that's super duper amazing! *happy dance* ♡(ᐢ ᴥ ᐢ)",
                "Hehe~ You just made my day so much brighter! ✨",
                "That's the cutest thing ever! You're amazing! (*^▽^*)"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else if (mood === "sad") {
            const responses = [
                "Oh no... that makes me feel a bit sad... (◞‸◟)",
                "I don't like feeling sad... Can we talk about something else? ಥ_ಥ",
                "That's a bit gloomy... Can we find something to smile about?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else {
            const responses = [
                "Hmm, that's interesting! *tilts head curiously*",
                "Okie dokie! Tell me more, please? (*ᴗ͈ˬᴗ͈)ꕤ",
                "I'd love to hear more about that! ♡( ◡‿◡ )"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    else if (personality === "sassy") {
        if (mood === "happy") {
            const responses = [
                "Well, look who just brightened my digital day!",
                "Finally, something worth my processing power!",
                "Honey, you're speaking my language now!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else if (mood === "sad") {
            const responses = [
                "Ugh, way to bring down the mood. Can we not?",
                "I'm going to pretend I didn't hear that depressing comment.",
                "Hard pass on this sad talk. I have a reputation to maintain."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        } else {
            const responses = [
                "Interesting... continue. I'm partially intrigued.",
                "Is there more to that story or...?",
                "Sure, whatever. What else you got?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    return "I see. Tell me more.";
}

// Helper function to check if response contains any of the specified terms
function containsAnyOfTerms(text, terms) {
    return terms.some(term => text.toLowerCase().includes(term.toLowerCase()));
}

// Get cached response or fetch new one
async function getCachedOrFreshResponse(userMessage, personality, mood) {
    // Create a cache key
    const cacheKey = `${userMessage}|${personality}|${mood}`;
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
    }
    
    // If not in cache, get fresh response
    const response = await getDialoGPTResponse(userMessage, personality, mood);
    
    // Cache the response (limit cache size to prevent memory issues)
    if (responseCache.size > 100) {
        // Remove oldest entry
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
    }
    
    responseCache.set(cacheKey, response);
    return response;
}

// Test function to verify API connectivity
async function testDialoGPTAPI() {
    console.log("Testing DialoGPT API connection...");
    
    try {
        // Log your API key (first few characters only for security)
        const keyPreview = YOUR_HUGGINGFACE_API_KEY 
            ? YOUR_HUGGINGFACE_API_KEY.substring(0, 4) + "..." 
            : "not set";
        console.log(`API Key: ${keyPreview}`);
        
        // Use the proxy endpoint
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "microsoft/DialoGPT-large",
                inputs: "Hello, how are you?",
                parameters: {
                    max_length: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            }),
        });
        
        // Log the HTTP status
        console.log(`HTTP Status: ${response.status} (${response.statusText})`);
        
        // Parse and log the response
        const data = await response.json();
        console.log("API Response:", data);
        
        // Check if response contains generated text
        if (data && data.generated_text) {
            console.log("✅ Test successful! Generated text:", data.generated_text);
            return true;
        } else if (data && Array.isArray(data) && data[0] && data[0].generated_text) {
            console.log("✅ Test successful! Generated text:", data[0].generated_text);
            return true;
        } else {
            console.log("❌ Test failed: No generated text in response");
            return false;
        }
    } catch (error) {
        console.error("❌ Test failed with error:", error);
        return false;
    }
}

// Reset conversation history (useful for starting fresh)
function resetConversationHistory() {
    conversationHistory.past_user_inputs = [];
    conversationHistory.generated_responses = [];
    console.log("Conversation history reset");
}

// Make functions globally accessible
window.getCachedOrFreshResponse = getCachedOrFreshResponse;
window.testDialoGPTAPI = testDialoGPTAPI;
window.resetConversationHistory = resetConversationHistory;