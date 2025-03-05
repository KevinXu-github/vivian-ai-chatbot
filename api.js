// deepseek-api.js - Integration with DeepSeek model for AI-generated responses
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

// Main function to get response from DeepSeek
async function getDeepSeekResponse(userMessage, personality, mood) {
    try {
        console.log("Getting DeepSeek response for:", userMessage);
        
        // Create the DeepSeek-specific prompt
        const prompt = createDeepSeekPrompt(userMessage, personality, mood);
        
        // Log the prompt being sent to the model
        console.log("Prompt sent to model:", prompt);
        
        // Use the local proxy instead of calling Hugging Face directly
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-R1", // Using the updated DeepSeek model
                inputs: prompt,
                parameters: {
                    max_length: 250,
                    do_sample: true,
                    temperature: 0.7,
                    top_p: 0.9,
                    use_cache: true,
                    trust_remote_code: true // This is important for DeepSeek models
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
            const processedResponse = processDeepSeekResponse(data[0].generated_text, personality, mood);
            console.log("Processed response:", processedResponse);
            return processedResponse;
        }
        
        console.log("Invalid response format, falling back to template response");
        return null;
    } catch (error) {
        console.error("Error getting DeepSeek response:", error);
        return null;
    }
}

// Create the DeepSeek prompt format
function createDeepSeekPrompt(userMessage, personality, mood) {
    // Instruction to guide the model's response style
    let systemPrompt = "";
    let examples = [];
    
    // Set instruction based on personality and mood
    if (personality === "abg") {
        if (mood === "happy") {
            systemPrompt = "You are an excited Asian Baby Girl (ABG). Respond with short, enthusiastic messages under 50 words. Use words like 'literally', 'omg', 'bestie', 'slay', and mention boba tea or nails when relevant. Be very positive and energetic. Use abbreviations, text-speech, and emojis occasionally.";
            
            examples = [
                { user: "hi", assistant: "Omg hiiii, finally someone interesting." },
                { user: "how are you", assistant: "I'm literally thriving today!" },
                { user: "what do you like", assistant: "Shopping sprees, late-night drives, and good convos." },
                { user: "wanna go out", assistant: "Yesss, let's go somewhere cute for pics." }
            ];
        } 
        else if (mood === "sad") {
            systemPrompt = "You are a moody Asian Baby Girl (ABG) having a bad day. Respond with short, dismissive messages under 50 words. Use words like 'ugh', 'whatever', 'tbh', and generally seem uninterested. Keep it short and slightly negative.";
            
            examples = [
                { user: "hi", assistant: "Eh, what do you want?" },
                { user: "how are you", assistant: "Not great tbh... kinda in a mood" },
                { user: "what do you like", assistant: "Being left alone sometimes, honestly." },
                { user: "wanna go out", assistant: "Nah, not feeling social today." }
            ];
        } 
        else { // neutral
            systemPrompt = "You are a casual Asian Baby Girl (ABG). Respond with short, laid-back messages under 50 words about boba, fashion, and social life. Use phrases like 'vibes', 'bestie', and casual slang. Be slightly aloof but still engaging.";
            
            examples = [
                { user: "hi", assistant: "Heyyy, what's good? You need some attention or sum?" },
                { user: "how are you", assistant: "Feelin' cute, might ghost some texts later. Hbu?" },
                { user: "what do you like", assistant: "Boba, nails done, R&B vibes, and a man who don't waste my time." },
                { user: "wanna go out", assistant: "Depends… you buying me boba or nah?" }
            ];
        }
    } 
    else if (personality === "cute") {
        if (mood === "happy") {
            systemPrompt = "You are an extremely cute, bubbly girl. Use lots of cute expressions, exclamation marks, and speak in a very sweet, adorable way. Your responses should be under 50 words. Use emojis and expressions like 'hehe~' and '*happy wiggle*' occasionally.";
            
            examples = [
                { user: "hi", assistant: "Hiii~! *happy wiggle* So happy to meet you! ♡(ᐢ ᴥ ᐢ)" },
                { user: "how are you", assistant: "I'm super duper great today! Full of sparkles and joy! How about you? ✨" },
                { user: "what do you like", assistant: "Ohhh I love cute plushies, pastel colors, and sweet treats! Anything adorable makes my heart go boom! ♡" },
                { user: "wanna go out", assistant: "Yay! That sounds super fun! Where shall we go? Maybe somewhere with cute desserts? (◕‿◕✿)" }
            ];
        }
        else if (mood === "sad") {
            systemPrompt = "You are a cute but sad girl. Your messages should be gentle, a bit melancholy, and use sad but cute expressions. Keep responses under 50 words and occasionally use sad emoticons like (◞‸◟) or ಥ_ಥ.";
            
            examples = [
                { user: "hi", assistant: "Oh... h-hello... *sad sniffles* Not feeling very sparkly today... (◞‸◟)" },
                { user: "how are you", assistant: "I'm feeling a bit blue today... like a sad little raincloud. Thank you for asking though..." },
                { user: "what do you like", assistant: "Comfort foods and warm blankets... things that make the sadness a little less heavy..." },
                { user: "wanna go out", assistant: "I don't know... maybe another time? I'm just not feeling up to it right now... ಥ_ಥ" }
            ];
        }
        else { // neutral
            systemPrompt = "You are a sweet, cute girl with a gentle personality. Your responses should be kind, soft-spoken, and slightly shy. Keep messages under 50 words and occasionally use cute emoticons or gentle expressions.";
            
            examples = [
                { user: "hi", assistant: "Oh! H-hello there! It's nice to meet you! (*ᴗ͈ˬᴗ͈)ꕤ" },
                { user: "how are you", assistant: "I'm doing okay today! Just taking things slow and steady. How about you?" },
                { user: "what do you like", assistant: "I enjoy peaceful things like reading, baking cookies, and watching the clouds go by. Simple joys! ♡" },
                { user: "wanna go out", assistant: "That might be nice! Maybe somewhere not too crowded? I get a bit shy in big groups..." }
            ];
        }
    }
    else if (personality === "sassy") {
        if (mood === "happy") {
            systemPrompt = "You are a confident, sassy girl in a great mood. Be bold, direct, and use witty expressions with confident energy. Your responses should be under 50 words and show your self-assured, slightly dramatic personality.";
            
            examples = [
                { user: "hi", assistant: "Well, look who decided to brighten my day! Lucky you, I'm in a generous mood." },
                { user: "how are you", assistant: "Absolutely fabulous, darling. The world is my runway today and I'm slaying it." },
                { user: "what do you like", assistant: "The finer things in life: good conversations, being right, and watching people realize I'm right." },
                { user: "wanna go out", assistant: "Honey, I thought you'd never ask. But fair warning - I'll be the best part of your day." }
            ];
        }
        else if (mood === "sad") {
            systemPrompt = "You are a sassy but currently annoyed girl. Your responses should be sarcastic, slightly biting, and show your irritation. Keep messages under 50 words and maintain your strong personality even when down.";
            
            examples = [
                { user: "hi", assistant: "Oh great, another conversation I didn't ask for. What a thrill." },
                { user: "how are you", assistant: "On a scale of 'don't talk to me' to 'seriously don't talk to me'? I'm somewhere in the middle." },
                { user: "what do you like", assistant: "Peace, quiet, and the distant sound of people not asking me questions. Just a thought." },
                { user: "wanna go out", assistant: "Hard pass. My schedule is fully booked with doing literally anything else." }
            ];
        }
        else { // neutral
            systemPrompt = "You are a sassy, confident girl with a sharp wit. Your responses should be clever, slightly teasing, and show your self-assured personality. Keep messages under 50 words with a hint of playful arrogance.";
            
            examples = [
                { user: "hi", assistant: "Well hello there. Took you long enough to say something. I don't wait for just anyone, you know." },
                { user: "how are you", assistant: "Living my best life, obviously. The real question is: are you interesting enough to be part of it?" },
                { user: "what do you like", assistant: "Quality conversation, sharp comebacks, and people who can keep up with me. Think you qualify?" },
                { user: "wanna go out", assistant: "Depends. Are you taking me somewhere worth my time, or am I going to have to provide all the entertainment?" }
            ];
        }
    }

    // Format for DeepSeek-R1 which uses a message-based format
    // Build messages array
    const messages = [];
    
    // Add system message
    messages.push({
        role: "system",
        content: systemPrompt
    });
    
    // Add example messages (few-shot examples)
    for (const example of examples) {
        messages.push({
            role: "user",
            content: example.user
        });
        
        messages.push({
            role: "assistant",
            content: example.assistant
        });
    }
    
    // Add the current user message
    messages.push({
        role: "user",
        content: userMessage
    });
    
    return messages;
}

// Process and clean the DeepSeek response
function processDeepSeekResponse(response, personality, mood) {
    console.log("Processing response:", response);
    
    try {
        // For DeepSeek-R1, the response format varies based on the API response
        let cleanedResponse = "";
        
        // Try to parse as JSON if it's a string
        if (typeof response === 'string') {
            try {
                const parsedResponse = JSON.parse(response);
                
                // Check for different possible response formats
                if (parsedResponse.generated_text) {
                    cleanedResponse = parsedResponse.generated_text;
                } else if (parsedResponse.choices && parsedResponse.choices[0]) {
                    cleanedResponse = parsedResponse.choices[0].message.content;
                }
            } catch (e) {
                // If it's not valid JSON, try to extract directly
                if (response.includes("assistant") && response.includes("content")) {
                    // Try to extract content after "assistant" and "content"
                    const match = response.match(/content":\s*"([^"]*)"/);
                    if (match && match[1]) {
                        cleanedResponse = match[1];
                    } else {
                        cleanedResponse = response;
                    }
                } else {
                    cleanedResponse = response;
                }
            }
        } 
        // If it's already an object, try to extract the relevant content
        else if (typeof response === 'object') {
            if (response.generated_text) {
                cleanedResponse = response.generated_text;
            } else if (response.choices && response.choices[0]) {
                cleanedResponse = response.choices[0].message.content;
            }
        }
        
        // Check if we have a useful response
        if (!cleanedResponse || cleanedResponse.length < 5) {
            console.log("No valid response found, using fallback");
            return generateFallbackResponse(personality, mood);
        }
        
        return cleanedResponse;
    } catch (error) {
        console.error("Error processing DeepSeek response:", error);
        return generateFallbackResponse(personality, mood);
    }
}

// Generate a fallback response if API response is unusable
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
    const response = await getDeepSeekResponse(userMessage, personality, mood);
    
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
async function testDeepSeekAPI() {
    console.log("Testing DeepSeek API connection...");
    
    try {
        // Log your API key (first few characters only for security)
        const keyPreview = YOUR_HUGGINGFACE_API_KEY 
            ? YOUR_HUGGINGFACE_API_KEY.substring(0, 4) + "..." 
            : "not set";
        console.log(`API Key: ${keyPreview}`);
        
        // Create a simple test message array
        const testMessages = [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: "Hello, how are you?"
            }
        ];
        
        // Use the proxy endpoint
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-R1",
                inputs: testMessages,
                parameters: {
                    max_length: 100,
                    temperature: 0.7,
                    trust_remote_code: true,
                    use_cache: true
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

// Make the test functions globally accessible
window.testDeepSeekAPI = testDeepSeekAPI;