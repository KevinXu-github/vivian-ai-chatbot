// Training system for Vivian AI Chatbot
// This allows you to train custom responses without relying on external APIs

// Training database structure
const trainingDatabase = {
    // Patterns are stored in lowercase for easier matching
    patterns: {},
    
    // Custom responses by personality and mood
    responses: {
        abg: {
            happy: {},
            neutral: {},
            sad: {}
        },
        cute: {
            happy: {},
            neutral: {},
            sad: {}
        },
        sassy: {
            happy: {},
            neutral: {},
            sad: {}
        }
    }
};

// Initialize or load existing training data
function initializeTraining() {
    const savedTraining = localStorage.getItem('vivianTrainingData');
    if (savedTraining) {
        try {
            const parsedData = JSON.parse(savedTraining);
            // Merge with existing structure to ensure backward compatibility
            Object.assign(trainingDatabase.patterns, parsedData.patterns || {});
            
            // Ensure all personality types and moods exist
            for (const personality in trainingDatabase.responses) {
                for (const mood in trainingDatabase.responses[personality]) {
                    trainingDatabase.responses[personality][mood] = {
                        ...(trainingDatabase.responses[personality][mood] || {}),
                        ...((parsedData.responses?.[personality]?.[mood]) || {})
                    };
                }
            }
            
            console.log('Training data loaded successfully');
        } catch (error) {
            console.error('Error loading training data:', error);
            // If there's an error, we'll use the default empty structure
        }
    } else {
        console.log('No existing training data found, using defaults');
        saveTrainingData(); // Save the default structure
    }
}

// Save training data to localStorage
function saveTrainingData() {
    localStorage.setItem('vivianTrainingData', JSON.stringify(trainingDatabase));
}

// Add a new pattern with associated response(s)
function trainPattern(pattern, responses, personality = 'abg', mood = 'neutral') {
    if (!pattern || !responses || !Array.isArray(responses) || responses.length === 0) {
        console.error('Invalid training data');
        return false;
    }
    
    // Convert pattern to lowercase for case-insensitive matching
    const lowerPattern = pattern.toLowerCase();
    
    // Add to patterns database with metadata
    trainingDatabase.patterns[lowerPattern] = {
        personality,
        mood,
        createdAt: Date.now()
    };
    
    // Add responses to the appropriate category
    trainingDatabase.responses[personality][mood][lowerPattern] = responses;
    
    // Save updated training data
    saveTrainingData();
    
    return true;
}

// Remove a pattern and its responses
function forgetPattern(pattern) {
    const lowerPattern = pattern.toLowerCase();
    
    if (trainingDatabase.patterns[lowerPattern]) {
        const { personality, mood } = trainingDatabase.patterns[lowerPattern];
        
        // Remove from patterns
        delete trainingDatabase.patterns[lowerPattern];
        
        // Remove from responses
        if (trainingDatabase.responses[personality]?.[mood]?.[lowerPattern]) {
            delete trainingDatabase.responses[personality][mood][lowerPattern];
        }
        
        // Save updated training data
        saveTrainingData();
        return true;
    }
    
    return false;
}

// Find the best matching pattern for an input message
function findMatchingPattern(message, personality = 'abg', mood = 'neutral') {
    const lowerMessage = message.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    
    // Look for direct matches first
    if (trainingDatabase.patterns[lowerMessage]) {
        return lowerMessage;
    }
    
    // Look for partial matches
    for (const pattern in trainingDatabase.patterns) {
        // Simple fuzzy matching by checking if main keywords are included
        const patternWords = pattern.split(/\s+/);
        const messageWords = lowerMessage.split(/\s+/);
        
        let score = 0;
        for (const word of patternWords) {
            if (word.length > 3 && messageWords.includes(word)) {
                score += 1;
            } else if (lowerMessage.includes(word)) {
                score += 0.5;
            }
        }
        
        // Bonus points for personality match
        if (trainingDatabase.patterns[pattern].personality === personality) {
            score += 0.3;
        }
        
        // Bonus points for mood match
        if (trainingDatabase.patterns[pattern].mood === mood) {
            score += 0.2;
        }
        
        // Normalize score by pattern length to prevent bias toward longer patterns
        const normalizedScore = score / patternWords.length;
        
        if (normalizedScore > 0.5 && normalizedScore > bestScore) {
            bestMatch = pattern;
            bestScore = normalizedScore;
        }
    }
    
    return bestMatch;
}

// Get a response for a given message
function getTrainedResponse(message, personality = 'abg', mood = 'neutral') {
    const matchedPattern = findMatchingPattern(message, personality, mood);
    
    if (matchedPattern) {
        const patternData = trainingDatabase.patterns[matchedPattern];
        const patternPersonality = patternData.personality;
        const patternMood = patternData.mood;
        
        // Get responses for the matched pattern
        const responses = trainingDatabase.responses[patternPersonality][patternMood][matchedPattern];
        
        if (responses && responses.length > 0) {
            // Return a random response from the matching pattern
            return {
                text: responses[Math.floor(Math.random() * responses.length)],
                source: 'trained',
                pattern: matchedPattern
            };
        }
    }
    
    // No match found
    return null;
}

// Process a message with training commands
function processTrainingCommand(message) {
    // Training command format: /train "pattern" "response1" "response2" ...
    if (message.startsWith('/train ')) {
        try {
            // Extract quoted strings
            const matches = [...message.matchAll(/"([^"]+)"/g)].map(m => m[1]);
            
            if (matches.length >= 2) {
                const pattern = matches[0];
                const responses = matches.slice(1);
                
                // Use current personality and mood as default
                const personality = chatbotState.settings.personality;
                const mood = chatbotState.mood;
                
                // Train the pattern
                const success = trainPattern(pattern, responses, personality, mood);
                
                return {
                    isCommand: true,
                    success,
                    response: success 
                        ? `I've learned how to respond to "${pattern}" with ${responses.length} possible responses.`
                        : `Sorry, I couldn't learn that pattern.`
                };
            }
        } catch (error) {
            console.error('Error processing training command:', error);
            return {
                isCommand: true,
                success: false,
                response: `Training format error. Use: /train "pattern" "response1" "response2"...`
            };
        }
    }
    
    // Forget command format: /forget "pattern"
    if (message.startsWith('/forget ')) {
        try {
            // Extract quoted string
            const matches = [...message.matchAll(/"([^"]+)"/g)].map(m => m[1]);
            
            if (matches.length >= 1) {
                const pattern = matches[0];
                const success = forgetPattern(pattern);
                
                return {
                    isCommand: true,
                    success,
                    response: success 
                        ? `I've forgotten how to respond to "${pattern}".`
                        : `I don't have any responses for "${pattern}".`
                };
            }
        } catch (error) {
            console.error('Error processing forget command:', error);
            return {
                isCommand: true,
                success: false,
                response: `Forget format error. Use: /forget "pattern"`
            };
        }
    }
    
    // List patterns command: /patterns
    if (message.trim() === '/patterns') {
        const patterns = Object.keys(trainingDatabase.patterns);
        
        if (patterns.length === 0) {
            return {
                isCommand: true,
                success: true,
                response: `I haven't been trained with any patterns yet.`
            };
        }
        
        return {
            isCommand: true,
            success: true,
            response: `I know ${patterns.length} patterns:\n\n${patterns.slice(0, 10).join('\n')}\n${
                patterns.length > 10 ? `...and ${patterns.length - 10} more` : ''
            }`
        };
    }
    
    // Help command: /help
    if (message.trim() === '/help') {
        return {
            isCommand: true,
            success: true,
            response: `Training commands:
• /train "pattern" "response1" "response2" - Teach me a new pattern
• /forget "pattern" - Make me forget a pattern
• /patterns - List patterns I've learned
• /clear - Clear chat history
• /help - Show this help message`
        };
    }
    
    return { isCommand: false };
}

// Initialize training data when this script loads
initializeTraining();