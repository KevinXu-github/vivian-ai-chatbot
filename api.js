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

// Instead of random mixing that can create weird responses,
// let's use complete pre-built responses based on the user's message keywords
const responseTemplates = {
    // Common greeting responses
    greetings: {
        happy: [
            "Omg hiii bestie! So happy you're here! What's good?",
            "Yesss, you're back! Literally made my day! What's up?",
            "Bestieee! I've been waiting to chat! How are you?"
        ],
        neutral: [
            "Hey there! What's good?",
            "Hey bestie, just chilling. What's up with you?",
            "Welcome back! What are we talking about today?"
        ],
        sad: [
            "Oh, hey I guess. What do you want?",
            "Hey... not really in the mood but what's up?",
            "Hi. Whatever. What's going on?"
        ]
    },
    
    // How are you type responses
    status: {
        happy: [
            "I'm literally thriving today! Thanks for asking! How about you?",
            "So good bestie! Got my nails done and feeling like a whole vibe!",
            "I'm obsessed with today's energy! Feeling amazing! You?"
        ],
        neutral: [
            "I'm doing alright, just vibing. How about you?",
            "Just chilling, might get boba later. How are you?",
            "Can't complain. Keeping it lowkey today. You good?"
        ],
        sad: [
            "Honestly? Not great. Don't really wanna talk about it.",
            "Kinda down tbh. Not feeling the vibes today.",
            "Could be better. Having one of those days, you know?"
        ]
    },
    
    // Default fallbacks for other types of messages
    default: {
        happy: [
            "Omg yes! I'm totally obsessed with that! Tell me more!",
            "That's such a slay! I'm here for it 100%!",
            "Period! You really said it! Main character energy right there!"
        ],
        neutral: [
            "That's kinda interesting. Tell me more about it.",
            "I feel you. What else is on your mind?",
            "OK I see what you mean. Anything else going on?"
        ],
        sad: [
            "Whatever. Not really feeling this convo tbh.",
            "I mean, I guess. Not like I care that much.",
            "Not really in the mood to talk about that rn."
        ]
    }
};

// ABG response templates as fallbacks
const abgTemplates = {
    happy: [
        "Omg bestie, I'm literally so obsessed with that! Vibes are immaculate!",
        "That's such a slay! I'm totally here for it!",
        "Yesss! That's the energy I'm looking for today! Love it!",
        "Period! You said what needed to be said! Main character energy!",
        "I'm literally in love with this conversation rn! Keep going!",
        "This energy is immaculate! Keep it coming bestie!"
    ],
    neutral: [
        "That's lowkey interesting. Might vibe with it later.",
        "I mean, it's cool. Boba tea and chill?",
        "Hmm, not bad. But like, have you tried the new boba shop downtown?",
        "Got it! Lowkey wanna know more about that.",
        "Okay okay, I feel you. It's giving neutral vibes.",
        "I'm listening~ go on, don't be shy now."
    ],
    sad: [
        "Ugh, whatever. Not really in the mood tbh.",
        "That's kinda basic, ngl. Not feeling it today.",
        "Hmm, I guess. Not like I care that much rn.",
        "I don't think I'm vibing with this right now. Maybe later?",
        "Let's switch topics? This one's making me sad fr.",
        "That's bumming me out. Can we talk about literally anything else?"
    ]
};

// Main function to get response from DialoGPT with better prompts
async function getDialoGPTResponse(userMessage, personality, mood) {
    try {
        console.log("Getting DialoGPT response for:", userMessage);
        
        // Create a simple, specific prompt based on mood
        let promptPrefix = "";
        
        if (mood === "happy") {
            promptPrefix = "You are an excited, enthusiastic friend. ";
        } else if (mood === "sad") {
            promptPrefix = "You are feeling annoyed and disinterested. ";
        } else { // neutral
            promptPrefix = "You are casually chatting with a friend. ";
        }
        
        // Add more specific instructions without overwhelming the model
        if (personality === "abg") {
            promptPrefix += "Keep your response short and casual. ";
        }
        
        // Combine the prefix with the user message
        const formattedMessage = promptPrefix + userMessage;
        console.log("Formatted prompt:", formattedMessage);
        
        // Use smaller model for better reliability
        const model = "microsoft/DialoGPT-medium";
        
        // Call the API
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                inputs: formattedMessage,
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
        
        // Clean up and format the response
        processedResponse = processedResponse.replace(/^You: .*?\n/, '').trim();
        
        // If response is too short or meaningless, use a template
        if (processedResponse.length < 3 || processedResponse === "I don't know") {
            console.log("Response too short, using template fallback");
            return responseTemplates.default[mood][Math.floor(Math.random() * responseTemplates.default[mood].length)];
        }
        
        // Format the response based on personality and mood, without making it incoherent
        let finalResponse = processedResponse;
        
        // Add ABG styling touch if needed, but keep the core response intact
        if (personality === "abg") {
            // Check if it's already styled
            const hasPrefix = finalResponse.match(/^(omg|literally|bestie|yasss|ugh|whatever|tbh|hmm|lowkey)/i);
            const hasSuffix = finalResponse.match(/(no cap|period|so slay|just vibing|that's the tea|whatever|tbh)$/i);
            
            // Add styling only if needed
            if (!hasPrefix && !hasSuffix && mood === "happy") {
                // 50% chance of adding a prefix for happy mood
                if (Math.random() < 0.5) {
                    finalResponse = "Omg " + finalResponse.charAt(0).toLowerCase() + finalResponse.slice(1);
                }
                // 30% chance of adding a suffix
                else if (Math.random() < 0.3) {
                    finalResponse += " Period!";
                }
            }
            else if (!hasPrefix && !hasSuffix && mood === "sad") {
                // 40% chance of adding a prefix for sad mood
                if (Math.random() < 0.4) {
                    finalResponse = "Ugh, " + finalResponse.charAt(0).toLowerCase() + finalResponse.slice(1);
                }
                // 30% chance of adding a suffix
                else if (Math.random() < 0.3) {
                    finalResponse += " Whatever.";
                }
            }
        }
        
        // Update conversation history for future context
        updateConversationHistory(userMessage, finalResponse);
        
        return finalResponse;
    } catch (error) {
        console.error("Error getting DialoGPT response:", error);
        // Fall back to a template
        return responseTemplates.default[mood][Math.floor(Math.random() * responseTemplates.default[mood].length)];
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

// Get template-based response when needed as fallback
function getTemplateResponse(mood, userMessage = "") {
    // Normalize user message for keyword matching
    const userMessageLower = userMessage.toLowerCase();
    
    // Choose the appropriate template category based on user message
    let templateCategory = 'default';
    
    // Check for greetings
    if (userMessageLower.match(/^(hi|hey|hello|sup|yo|what'?s\s+up|wassup|wsup)/)) {
        templateCategory = 'greetings';
    }
    // Check for "how are you" type questions
    else if (userMessageLower.match(/(how\s+are\s+you|how\s+r\s+u|how\s+you|how\s+ya|how's\s+it\s+going|hows\s+it\s+going|how\s+is\s+it\s+going|how\s+you\s+doing|how\s+u\s+doing)/)) {
        templateCategory = 'status';
    }
    
    // Get templates for the category and mood
    const templates = responseTemplates[templateCategory][mood];
    
    // Return a random template
    return templates[Math.floor(Math.random() * templates.length)];
}

// Get a response for a user message
async function getCachedOrFreshResponse(userMessage, personality, mood) {
    // Create a cache key
    const cacheKey = `${userMessage}|${personality}|${mood}`;
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
    }
    
    // Try to get a response from DialoGPT
    let response = await getDialoGPTResponse(userMessage, personality, mood);
    
    // If DialoGPT fails, use a template fallback
    if (!response) {
        console.log("Using template fallback");
        const templates = abgTemplates[mood];
        response = templates[Math.floor(Math.random() * templates.length)];
    }
    
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
                model: "microsoft/DialoGPT-medium",
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
window.resetConversationHistory = resetConversationHistory;// dialogpt-api.js - Integration with DialoGPT model for AI-generated responses
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

// Instead of random mixing that can create weird responses,
// let's use complete pre-built responses based on the user's message keywords
const responseTemplates = {
    // Common greeting responses
    greetings: {
        happy: [
            "Omg hiii bestie! So happy you're here! What's good?",
            "Yesss, you're back! Literally made my day! What's up?",
            "Bestieee! I've been waiting to chat! How are you?"
        ],
        neutral: [
            "Hey there! What's good?",
            "Hey bestie, just chilling. What's up with you?",
            "Welcome back! What are we talking about today?"
        ],
        sad: [
            "Oh, hey I guess. What do you want?",
            "Hey... not really in the mood but what's up?",
            "Hi. Whatever. What's going on?"
        ]
    },
    
    // How are you type responses
    status: {
        happy: [
            "I'm literally thriving today! Thanks for asking! How about you?",
            "So good bestie! Got my nails done and feeling like a whole vibe!",
            "I'm obsessed with today's energy! Feeling amazing! You?"
        ],
        neutral: [
            "I'm doing alright, just vibing. How about you?",
            "Just chilling, might get boba later. How are you?",
            "Can't complain. Keeping it lowkey today. You good?"
        ],
        sad: [
            "Honestly? Not great. Don't really wanna talk about it.",
            "Kinda down tbh. Not feeling the vibes today.",
            "Could be better. Having one of those days, you know?"
        ]
    },
    
    // Default fallbacks for other types of messages
    default: {
        happy: [
            "Omg yes! I'm totally obsessed with that! Tell me more!",
            "That's such a slay! I'm here for it 100%!",
            "Period! You really said it! Main character energy right there!"
        ],
        neutral: [
            "That's kinda interesting. Tell me more about it.",
            "I feel you. What else is on your mind?",
            "OK I see what you mean. Anything else going on?"
        ],
        sad: [
            "Whatever. Not really feeling this convo tbh.",
            "I mean, I guess. Not like I care that much.",
            "Not really in the mood to talk about that rn."
        ]
    }
};

// ABG response templates as fallbacks
const abgTemplates = {
    happy: [
        "Omg bestie, I'm literally so obsessed with that! Vibes are immaculate!",
        "That's such a slay! I'm totally here for it!",
        "Yesss! That's the energy I'm looking for today! Love it!",
        "Period! You said what needed to be said! Main character energy!",
        "I'm literally in love with this conversation rn! Keep going!",
        "This energy is immaculate! Keep it coming bestie!"
    ],
    neutral: [
        "That's lowkey interesting. Might vibe with it later.",
        "I mean, it's cool. Boba tea and chill?",
        "Hmm, not bad. But like, have you tried the new boba shop downtown?",
        "Got it! Lowkey wanna know more about that.",
        "Okay okay, I feel you. It's giving neutral vibes.",
        "I'm listening~ go on, don't be shy now."
    ],
    sad: [
        "Ugh, whatever. Not really in the mood tbh.",
        "That's kinda basic, ngl. Not feeling it today.",
        "Hmm, I guess. Not like I care that much rn.",
        "I don't think I'm vibing with this right now. Maybe later?",
        "Let's switch topics? This one's making me sad fr.",
        "That's bumming me out. Can we talk about literally anything else?"
    ]
};

// Main function to get response from DialoGPT with better prompts
async function getDialoGPTResponse(userMessage, personality, mood) {
    try {
        console.log("Getting DialoGPT response for:", userMessage);
        
        // Create a simple, specific prompt based on mood
        let promptPrefix = "";
        
        if (mood === "happy") {
            promptPrefix = "You are an excited, enthusiastic friend. ";
        } else if (mood === "sad") {
            promptPrefix = "You are feeling annoyed and disinterested. ";
        } else { // neutral
            promptPrefix = "You are casually chatting with a friend. ";
        }
        
        // Add more specific instructions without overwhelming the model
        if (personality === "abg") {
            promptPrefix += "Keep your response short and casual. ";
        }
        
        // Combine the prefix with the user message
        const formattedMessage = promptPrefix + userMessage;
        console.log("Formatted prompt:", formattedMessage);
        
        // Use smaller model for better reliability
        const model = "microsoft/DialoGPT-medium";
        
        // Call the API
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                inputs: formattedMessage,
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
        
        // Clean up and format the response
        processedResponse = processedResponse.replace(/^You: .*?\n/, '').trim();
        
        // If response is too short or meaningless, use a template
        if (processedResponse.length < 3 || processedResponse === "I don't know") {
            console.log("Response too short, using template fallback");
            return responseTemplates.default[mood][Math.floor(Math.random() * responseTemplates.default[mood].length)];
        }
        
        // Format the response based on personality and mood, without making it incoherent
        let finalResponse = processedResponse;
        
        // Add ABG styling touch if needed, but keep the core response intact
        if (personality === "abg") {
            // Check if it's already styled
            const hasPrefix = finalResponse.match(/^(omg|literally|bestie|yasss|ugh|whatever|tbh|hmm|lowkey)/i);
            const hasSuffix = finalResponse.match(/(no cap|period|so slay|just vibing|that's the tea|whatever|tbh)$/i);
            
            // Add styling only if needed
            if (!hasPrefix && !hasSuffix && mood === "happy") {
                // 50% chance of adding a prefix for happy mood
                if (Math.random() < 0.5) {
                    finalResponse = "Omg " + finalResponse.charAt(0).toLowerCase() + finalResponse.slice(1);
                }
                // 30% chance of adding a suffix
                else if (Math.random() < 0.3) {
                    finalResponse += " Period!";
                }
            }
            else if (!hasPrefix && !hasSuffix && mood === "sad") {
                // 40% chance of adding a prefix for sad mood
                if (Math.random() < 0.4) {
                    finalResponse = "Ugh, " + finalResponse.charAt(0).toLowerCase() + finalResponse.slice(1);
                }
                // 30% chance of adding a suffix
                else if (Math.random() < 0.3) {
                    finalResponse += " Whatever.";
                }
            }
        }
        
        // Update conversation history for future context
        updateConversationHistory(userMessage, finalResponse);
        
        return finalResponse;
    } catch (error) {
        console.error("Error getting DialoGPT response:", error);
        // Fall back to a template
        return responseTemplates.default[mood][Math.floor(Math.random() * responseTemplates.default[mood].length)];
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

// Get template-based response when needed as fallback
function getTemplateResponse(mood, userMessage = "") {
    // Normalize user message for keyword matching
    const userMessageLower = userMessage.toLowerCase();
    
    // Choose the appropriate template category based on user message
    let templateCategory = 'default';
    
    // Check for greetings
    if (userMessageLower.match(/^(hi|hey|hello|sup|yo|what'?s\s+up|wassup|wsup)/)) {
        templateCategory = 'greetings';
    }
    // Check for "how are you" type questions
    else if (userMessageLower.match(/(how\s+are\s+you|how\s+r\s+u|how\s+you|how\s+ya|how's\s+it\s+going|hows\s+it\s+going|how\s+is\s+it\s+going|how\s+you\s+doing|how\s+u\s+doing)/)) {
        templateCategory = 'status';
    }
    
    // Get templates for the category and mood
    const templates = responseTemplates[templateCategory][mood];
    
    // Return a random template
    return templates[Math.floor(Math.random() * templates.length)];
}

// Get a response for a user message
async function getCachedOrFreshResponse(userMessage, personality, mood) {
    // Create a cache key
    const cacheKey = `${userMessage}|${personality}|${mood}`;
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
    }
    
    // Try to get a response from DialoGPT
    let response = await getDialoGPTResponse(userMessage, personality, mood);
    
    // If DialoGPT fails, use a template fallback
    if (!response) {
        console.log("Using template fallback");
        const templates = abgTemplates[mood];
        response = templates[Math.floor(Math.random() * templates.length)];
    }
    
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
                model: "microsoft/DialoGPT-medium",
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