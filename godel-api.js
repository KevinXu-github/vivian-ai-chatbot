// godel-api.js - Integration with GODEL model for AI-generated responses
let YOUR_HUGGINGFACE_API_KEY = "";

try {
    if (typeof HUGGINGFACE_API_KEY !== 'undefined') {
        YOUR_HUGGINGFACE_API_KEY = HUGGINGFACE_API_KEY;
    }
} catch (e) {
    console.warn("API config not found, using default API key");
}

// Simple response cache to avoid repeated API calls
const responseCache = new Map();

// Main function to get response from GODEL
async function getGODELResponse(userMessage, personality, mood) {
    try {
        console.log("Getting GODEL response for:", userMessage);
        
        // Create the GODEL-specific prompt
        const prompt = createGODELPrompt(userMessage, personality, mood);
        
        // Log the prompt being sent to the model
        console.log("Prompt sent to model:", prompt);
        
        // Use the local proxy instead of calling Hugging Face directly
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "microsoft/GODEL-v1_1-base-seq2seq",
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    do_sample: true,
                    temperature: 0.7,
                    top_p: 0.9,
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
        
        if (data && data[0] && data[0].generated_text) {
            console.log("Generated text before processing:", data[0].generated_text);
            const processedResponse = processGODELResponse(data[0].generated_text, personality, mood);
            console.log("Processed response:", processedResponse);
            return processedResponse;
        }
        
        console.log("Invalid response format, falling back to template response");
        return null;
    } catch (error) {
        console.error("Error getting GODEL response:", error);
        return null;
    }
}

// Create the GODEL prompt format with examples from your training data
function createGODELPrompt(userMessage, personality, mood) {
    // Instruction to guide the model's response style
    let instruction = "";
    let examples = "";
    
    // Set instruction based on personality and mood
    if (personality === "abg") {
        if (mood === "happy") {
            instruction = "You are an excited Asian Baby Girl (ABG). Respond with short, enthusiastic messages. Use words like 'literally', 'omg', 'bestie', 'slay', and mention boba tea or nails when relevant.";
            
            examples = `Example 1: 
Human: hi
Assistant: Omg hiiii, finally someone interesting.

Example 2:
Human: how are you
Assistant: I'm literally thriving today!

Example 3:
Human: what do you like
Assistant: Shopping sprees, late-night drives, and good convos.

Example 4:
Human: wanna go out
Assistant: Yesss, let's go somewhere cute for pics.`;
        } 
        else if (mood === "sad") {
            instruction = "You are a moody Asian Baby Girl (ABG) having a bad day. Respond with short, dismissive messages. Use words like 'ugh', 'whatever', 'tbh', and generally seem uninterested.";
            
            examples = `Example 1:
Human: hi
Assistant: Eh, what do you want?

Example 2:
Human: how are you
Assistant: Not great tbh... kinda in a mood

Example 3:
Human: what do you like
Assistant: Being left alone sometimes, honestly.

Example 4:
Human: wanna go out
Assistant: Nah, not feeling social today.`;
        } 
        else { // neutral
            instruction = "You are a casual Asian Baby Girl (ABG). Respond with short, laid-back messages about boba, fashion, and social life. Use phrases like 'vibes', 'bestie', and casual slang.";
            
            examples = `Example 1:
Human: hi
Assistant: Heyyy, what's good? You need some attention or sum?

Example 2:
Human: how are you
Assistant: Feelin' cute, might ghost some texts later. Hbu?

Example 3:
Human: what do you like
Assistant: Boba, nails done, R&B vibes, and a man who don't waste my time.

Example 4:
Human: wanna go out
Assistant: Depends… you buying me boba or nah?`;
        }
    } 
    else if (personality === "cute") {
        // Implement cute personality with examples from training data
        if (mood === "happy") {
            instruction = "You are an extremely cute, bubbly girl. Use lots of cute expressions, exclamation marks, and speak in a very sweet, adorable way.";
            examples = "";
        }
        // Add other moods for cute personality
    }
    else if (personality === "sassy") {
        // Implement sassy personality with examples from training data
        if (mood === "happy") {
            instruction = "You are a confident, sassy girl in a great mood. Be bold, direct, and use witty expressions with confident energy.";
            examples = "";
        }
        // Add other moods for sassy personality
    }
    
    // Dialogue context is the user's message
    const dialog = `Human: ${userMessage}\nAssistant:`;
    
    // Combine in GODEL format with clearer structure
    return `<instruction>${instruction}</instruction><knowledge>${examples}</knowledge><dialog>${dialog}`;
}

// Process and clean the GODEL response
function processGODELResponse(response, personality, mood) {
    console.log("Processing raw response:", response);
    
    // First try to extract just the assistant's response
    let processedResponse = "";
    const regex = /Assistant:(.*?)($|<\/dialog>|\/dialog>)/s;
    const match = response.match(regex);
    
    if (match && match[1]) {
        processedResponse = match[1].trim();
    } else {
        // If no Assistant: prefix found, remove all tags and use what's left
        processedResponse = response.replace(/<\/?instruction>|<\/?knowledge>|<\/?dialog>|Assistant:|Human:.*$/g, "").trim();
    }
    
    // Remove any trailing tags or formatting artifacts
    processedResponse = processedResponse.replace(/\/dialog>|<\/dialog>/g, "").trim();
    
    console.log("After regex extraction:", processedResponse);
    
    // If we still have nothing useful, generate a fallback response
    if (!processedResponse || processedResponse.length < 5) {
        console.log("Using fallback response generation");
        return generateFallbackResponse(personality, mood);
    }
    
    // Apply personality-specific post-processing if needed
    if (personality === "abg") {
        if (mood === "happy" && !containsAnyOfTerms(processedResponse, ["bestie", "vibes", "literally", "slay", "omg"])) {
            const abgTerms = ["bestie", "literally", "omg", "slay", "vibes"];
            processedResponse += ` ${abgTerms[Math.floor(Math.random() * abgTerms.length)]}!`;
        }
    }
    
    return processedResponse;
}

// Generate a fallback response if API response is unusable
function generateFallbackResponse(personality, mood) {
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
    // Add fallbacks for other personalities...
    
    return "I see. Tell me more.";
}

// Get examples from your training data to provide as knowledge
function getPersonalityExamples(personality, mood) {
    let examples = [];
    
    // Pull examples from your training database
    if (typeof trainingDatabase !== 'undefined' && 
        trainingDatabase.responses && 
        trainingDatabase.responses[personality] && 
        trainingDatabase.responses[personality][mood]) {
        
        const responses = trainingDatabase.responses[personality][mood];
        
        // Get up to 5 representative examples
        let count = 0;
        for (const pattern in responses) {
            if (count >= 5) break;
            
            if (responses[pattern] && responses[pattern].length > 0) {
                examples.push(`Q: ${pattern} A: ${responses[pattern][0]}`);
                count++;
            }
        }
    }
    
    return examples.join(". ");
}

// Process and clean the GODEL response
function processGODELResponse(response, personality, mood) {
    // Remove any instruction or knowledge leftover in the response
    response = response.replace(/<\/?instruction>|<\/?knowledge>|<\/?dialog>/g, "").trim();
    
    // Clean up any potential prefixes like "Assistant:" that might be in the response
    response = response.replace(/^Assistant:\s*/i, "").trim();
    
    // Apply personality-specific post-processing if needed
    if (personality === "abg") {
        // For ABG personality, ensure the use of certain slang terms if they're not already present
        if (mood === "happy" && !containsAnyOfTerms(response, ["bestie", "vibes", "literally", "slay", "omg"])) {
            const abgTerms = ["bestie", "literally", "omg", "slay", "vibes"];
            response += ` ${abgTerms[Math.floor(Math.random() * abgTerms.length)]}!`;
        }
    }
    
    return response;
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
    const response = await getGODELResponse(userMessage, personality, mood);
    
    // Cache the response (limit cache size to prevent memory issues)
    if (responseCache.size > 100) {
        // Remove oldest entry
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
    }
    
    responseCache.set(cacheKey, response);
    return response;
}

// Test function to verify API connectivity through direct Hugging Face API
async function testGODELAPI() {
    console.log("Testing direct GODEL API connection...");
    
    try {
        // Log your API key (first few characters only for security)
        const keyPreview = YOUR_HUGGINGFACE_API_KEY 
            ? YOUR_HUGGINGFACE_API_KEY.substring(0, 4) + "..." 
            : "not set";
        console.log(`API Key: ${keyPreview}`);
        
        // Create a simple test prompt
        const testPrompt = "<instruction> Respond with a short greeting. </instruction> <knowledge> </knowledge> <dialog> Human: Hi there\nAssistant: </dialog>";
        
        // Make the API call
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/GODEL-v1_1-base-seq2seq", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${YOUR_HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: testPrompt,
                parameters: {
                    max_length: 50,
                    temperature: 0.7,
                }
            }),
        });
        
        // Log the HTTP status
        console.log(`HTTP Status: ${response.status} (${response.statusText})`);
        
        // Parse and log the response
        const data = await response.json();
        console.log("API Response:", data);
        
        // Check if response contains generated text
        if (data && data[0] && data[0].generated_text) {
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

// Test proxy function
async function testProxy() {
    console.log("Testing proxy connection...");
    
    try {
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt2",
                inputs: "Hello, I am",
                parameters: {
                    max_length: 20,
                    temperature: 0.7,
                }
            }),
        });
        
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log("Proxy response:", data);
        
        return data;
    } catch (error) {
        console.error("Proxy test failed:", error);
        return null;
    }
}

// Make the test functions globally accessible
window.testGODELAPI = testGODELAPI;
window.testProxy = testProxy;