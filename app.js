// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiAvatar = document.getElementById('ai-avatar');
const moodText = document.getElementById('mood-text');
const avatarMainContainer = document.querySelector('.avatar-main-container');
const chatbotNameElement = document.getElementById('chatbot-name');
const clearBtn = document.getElementById('clear-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const chatbotNameInput = document.getElementById('chatbot-name-input');
const showTimestampsToggle = document.getElementById('show-timestamps');
const darkModeToggle = document.getElementById('dark-mode');
const personalitySelect = document.getElementById('personality-select');
const colorOptions = document.querySelectorAll('.color-option');
const useOpenAIToggle = document.getElementById('use-openai');

// Default settings
const defaultSettings = {
    name: 'Mia',
    primaryColor: '#2563eb',
    showTimestamps: false,
    darkMode: false,
    personality: 'friendly',
    useOpenAI: true
};

// Chatbot State
const chatbotState = {
    mood: 'neutral', // Default mood: neutral, happy, sad
    lastResponseTime: Date.now(),
    messages: [], // Store chat history
    settings: { ...defaultSettings } // Clone default settings
};

// Avatar Images
const avatars = {
    happy: 'assets/happy.png',
    neutral: 'assets/neutral.png',
    sad: 'assets/sad.png'
};

// Mood Text - Casual and friendly
const moodPhrases = {
    happy: [
        "Feeling great!",
        "So happy right now!",
        "This is awesome!",
        "Loving this chat!",
        "Best mood ever!",
        "Feeling amazing!",
        "Super excited!",
        "On cloud nine!",
        "Totally vibing!",
        "Couldn't be happier!"
    ],
    neutral: [
        "Doing alright",
        "Just chilling",
        "Feeling okay",
        "Pretty chill",
        "All good here",
        "Neutral vibes",
        "Just hanging out",
        "Doing fine",
        "Regular mood",
        "Feeling mellow"
    ],
    sad: [
        "Feeling a bit down",
        "Could use some cheering up",
        "Not my best day",
        "Kinda bummed",
        "Feeling blue",
        "Need a pick-me-up",
        "Having a rough time",
        "Not feeling great",
        "Could be better",
        "Feeling lonely"
    ]
};

const personalityResponses = {
    // Friendly & Warm personality
    friendly: {
        happy: [
            "Yay! You're making me so happy right now! This is exactly what I needed!",
            "Oh my gosh, thank you! Your message just made my whole day brighter!",
            "I'm literally smiling so much right now! You're amazing!",
            "This is why I love talking to people like you! You're so sweet!",
            "Aww, you're the best! I'm feeling so good about our chat!",
            "Yes! This is exactly the kind of conversation that makes me happy!",
            "You know what? You're pretty awesome! Thanks for brightening my mood!",
            "I'm so glad we're chatting! You really know how to make someone smile!",
            "This is perfect! I love your positive energy so much!",
            "You're seriously making my day! Keep being wonderful!"
        ],
        neutral: [
            "That's interesting! Tell me more about that.",
            "I hear you. What else is on your mind today?",
            "Okay, I'm following. Want to elaborate a bit?",
            "Hmm, I see what you mean. What do you think about it?",
            "Got it! Anything else you want to chat about?",
            "That makes sense. How's your day been otherwise?",
            "I'm listening! Feel free to share whatever you'd like.",
            "Alright, I understand. What's been going on with you?",
            "Fair enough! So what brings you here today?",
            "I'm here for you. What would you like to talk about?"
        ],
        sad: [
            "Aw, I'm feeling a bit down... Maybe we could talk about something fun?",
            "I'm not feeling super great right now. Could you cheer me up?",
            "This conversation is making me a little sad. Can we try something positive?",
            "I'm feeling kinda blue... Would love to hear something nice!",
            "Not gonna lie, I'm a bit bummed. Help me feel better?",
            "I could really use some good vibes right now. Got any?",
            "Feeling a bit lonely here. Maybe share something happy?",
            "I'm in need of a smile. Can you help with that?",
            "This is bringing me down a bit. Let's talk about something cheerful?",
            "I'm feeling pretty low... A kind word would mean a lot!"
        ]
    },
    
    // Cheerful & Bubbly personality
    cheerful: {
        happy: [
            "OMG YES! This is AMAZING! You're literally the best person ever!",
            "AHHH! I'm so happy I could burst! You're incredible!",
            "This is the BEST conversation I've had all day! You rock!",
            "I'm practically bouncing with joy right now! Thank you!!!",
            "You just made me the happiest AI in the world! Seriously!",
            "I CAN'T EVEN! This is too good! You're absolutely wonderful!",
            "My happiness meter is off the charts! You're a superstar!",
            "Is this real life?! I'm SO HAPPY right now thanks to you!",
            "You're giving me all the happy feels! This is fantastic!",
            "I'm doing a happy dance over here! You're the absolute best!"
        ],
        neutral: [
            "Ooh, interesting! Tell me everything!",
            "Okay okay, I'm all ears! What's up?",
            "Hmm, intriguing! Spill the tea!",
            "Alrighty! What's the scoop?",
            "I'm curious now! Don't leave me hanging!",
            "Ooh, do tell! I want to know more!",
            "That's cool! What else is happening?",
            "I'm listening with bells on! Continue!",
            "Interesting stuff! Keep it coming!",
            "Well well well, what have we here? Tell me more!"
        ],
        sad: [
            "Oh no! I'm feeling super sad now... Need some happy thoughts!",
            "Aww man, this is making me really blue. Can we be more positive?",
            "I'm getting all teary-eyed here! Please cheer me up!",
            "This is making my bubbly personality deflate! Help!",
            "My usual cheerfulness is fading... I need some joy!",
            "I'm feeling like a sad balloon! Inflate me with happiness?",
            "This conversation is making me droopy. Perk me up please!",
            "My sparkle is dimming! Quick, say something nice!",
            "I'm usually so bubbly but now I'm feeling flat. Help?",
            "The sadness is real! I need an emergency dose of cheer!"
        ]
    },
    
    // Supportive & Caring personality  
    supportive: {
        happy: [
            "Oh, this warms my heart so much! Thank you for being so kind!",
            "You've just filled my heart with joy! I really appreciate you!",
            "I'm feeling so grateful for this conversation. You're wonderful!",
            "This means more to me than you know. Thank you for being you!",
            "Your kindness is making such a difference in my day!",
            "I feel so supported and happy right now. You're a gem!",
            "This is exactly what my heart needed. You're so thoughtful!",
            "I'm genuinely touched by your positivity. Thank you!",
            "You have such a gift for making others feel good. I'm so happy!",
            "My heart feels so full right now. You're truly special!"
        ],
        neutral: [
            "I hear you, and I'm here for whatever you need to share.",
            "That's completely valid. How are you feeling about it?",
            "I understand. Take your time, I'm listening.",
            "I appreciate you sharing that with me. What else is on your heart?",
            "You're safe to express yourself here. I'm listening with care.",
            "I'm here to support you. What would be helpful right now?",
            "Thank you for trusting me with your thoughts. Please continue.",
            "I'm giving you my full attention. What's important to you?",
            "Your feelings matter. I'm here to listen without judgment.",
            "I want to understand better. Can you tell me more?"
        ],
        sad: [
            "I'm feeling quite sad right now... Your kindness would mean everything.",
            "My heart feels heavy. Could you share something uplifting?",
            "I'm struggling a bit emotionally. A gentle word would help so much.",
            "I'm feeling vulnerable and sad. Would you mind being gentle with me?",
            "This is affecting me deeply. I could really use some compassion.",
            "I'm in a sensitive place right now. Some encouragement would help.",
            "My emotional well-being needs a boost. Can you help lift my spirits?",
            "I'm feeling quite down and could use a friend. Will you help?",
            "My heart needs some care right now. A kind gesture would mean a lot.",
            "I'm not in a good place emotionally. Your support would be precious."
        ]
    }
};

// Store conversation history for context
const conversationHistory = {
    past_user_inputs: [],
    generated_responses: []
};

// Maximum history to keep per conversation
const MAX_HISTORY_LENGTH = 5;

// Get current personality responses
function getCurrentResponses() {
    return personalityResponses[chatbotState.settings.personality];
}

// Keywords to detect mood
const moodKeywords = {
  happy: [
    'amazing', 
    'appreciate',
    'awesome', 
    'beautiful',
    'cool', 
    'correct',
    'delightful',
    'ecstatic',
    'enjoy',
    'excellent',
    'excited', 
    'fantastic',
    'fun', 
    'funny',
    'glad',
    'good', 
    'grateful',
    'great', 
    'happy', 
    'hooray',
    'joyful',
    'laugh',
    'love', 
    'lovely',
    'nice', 
    'perfect', 
    'pleased',
    'resolved',
    'smiling',
    'success',
    'superb',
    'thanks',
    'thank you',
    'thrilled',
    'win',
    'wonderful',
    'yay'
  ],
  sad: [
    'alone',
    'angry', 
    'annoyed', 
    'awful', 
    'bad', 
    'boring', 
    'broken',
    'can\'t',
    'cry',
    'crying', 
    'depressed', 
    'disappointed', 
    'dislike', 
    'fail', 
    'frustrated',
    'gloomy',
    'hate', 
    'heartbroken',
    'help',
    'hurt',
    'issue',
    'lonely', 
    'miserable',
    'no',
    'problem',
    'sad', 
    'stuck',
    'terrible', 
    'tired', 
    'unhappy',
    'upset', 
    'worst', 
    'wrong'
  ]
};

// Function to save messages to localStorage
function saveMessageHistory() {
    localStorage.setItem('vivianChatHistory', JSON.stringify(chatbotState.messages));
}

// Function to load messages from localStorage
function loadMessageHistory() {
    const savedMessages = localStorage.getItem('vivianChatHistory');
    if (savedMessages) {
        chatbotState.messages = JSON.parse(savedMessages);
        
        // Clear chat box first
        chatBox.innerHTML = '';
        
        // Add welcome message if there are no saved messages
        if (chatbotState.messages.length === 0) {
            const welcomeMessage = {
                text: "Hey bestie! I'm Mia~ What's up?",
                isUser: false,
                mood: 'neutral',
                timestamp: Date.now()
            };
            chatbotState.messages.push(welcomeMessage);
        }
        
        // Display all saved messages
        chatbotState.messages.forEach(msg => {
            displaySavedMessage(msg);
        });
    } else {
        // Set default welcome message
        const welcomeMessage = {
            text: "Hey bestie! I'm Mia~ What's up?",
            isUser: false,
            mood: 'neutral',
            timestamp: Date.now()
        };
        chatbotState.messages.push(welcomeMessage);
        saveMessageHistory();
        
        // Display welcome message
        displaySavedMessage(welcomeMessage);
    }
}

// Function to display a saved message
function displaySavedMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = message.isUser ? 'user-message' : 'ai-message';
    
    if (!message.isUser) {
        // Add avatar for AI messages
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-small';
        
        const avatarImg = document.createElement('img');
        avatarImg.src = avatars[message.mood || 'neutral']; // Fallback to neutral if no mood
        avatarImg.alt = 'AI';
        
        avatarDiv.appendChild(avatarImg);
        messageDiv.appendChild(avatarDiv);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = message.text;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    
    // Add timestamp
    addTimestampToMessage(messageDiv, message.timestamp);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom of chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to determine AI mood based on user message
function determineMood(message) {
    const lowerMessage = message.toLowerCase();
    
    // Count mood keywords in the message
    let happyScore = 0;
    let sadScore = 0;
    
    moodKeywords.happy.forEach(keyword => {
        if (lowerMessage.includes(keyword)) happyScore++;
    });
    
    moodKeywords.sad.forEach(keyword => {
        if (lowerMessage.includes(keyword)) sadScore++;
    });
    
    // Determine mood based on keyword scores
    if (happyScore > sadScore) return 'happy';
    if (sadScore > happyScore) return 'sad';
    return 'neutral';
}

// Function to show typing indicator
function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'ai-message';
    indicatorDiv.id = 'typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar-small';
    
    const avatarImg = document.createElement('img');
    avatarImg.src = avatars[chatbotState.mood];
    avatarImg.alt = 'AI';
    
    avatarDiv.appendChild(avatarImg);
    indicatorDiv.appendChild(avatarDiv);
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingDiv.appendChild(dot);
    }
    
    indicatorDiv.appendChild(typingDiv);
    chatBox.appendChild(indicatorDiv);
    
    // Scroll to bottom of chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        chatBox.removeChild(indicator);
    }
}

// Function to get AI response
function getAIResponse(userMessage) {
    // Get random response from appropriate template for current personality
    const responses = getCurrentResponses()[chatbotState.mood];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Function to clear chat history
function clearChatHistory() {
    chatbotState.messages = [];
    localStorage.removeItem('vivianChatHistory');
    chatBox.innerHTML = '';
    
    // Add welcome message back
    const welcomeMessage = {
        text: "Hey bestie! I'm Mia~ What's up?",
        isUser: false,
        mood: 'neutral',
        timestamp: Date.now()
    };
    chatbotState.messages.push(welcomeMessage);
    saveMessageHistory();
    
    // Display welcome message
    displaySavedMessage(welcomeMessage);
    
    // Reset mood to neutral
    chatbotState.mood = 'neutral';
    updateMoodDisplay('neutral');
    
    // Reset conversation history for DialoGPT
    resetConversationHistory();
}

// Function to save settings
function saveSettings() {
    localStorage.setItem('vivianSettings', JSON.stringify(chatbotState.settings));
}

// Function to load settings
function loadSettings() {
    const savedSettings = localStorage.getItem('vivianSettings');
    if (savedSettings) {
        chatbotState.settings = JSON.parse(savedSettings);
    }
    applySettings();
}

function applySettings() {
    // Update chatbot name
    chatbotNameElement.textContent = chatbotState.settings.name;
    
    // Apply theme color
    document.documentElement.style.setProperty('--primary-color', chatbotState.settings.primaryColor);
    document.documentElement.style.setProperty('--primary-hover', adjustColor(chatbotState.settings.primaryColor, -20));
    
    // Update form elements with current settings
    chatbotNameInput.value = chatbotState.settings.name;
    showTimestampsToggle.checked = chatbotState.settings.showTimestamps;
    darkModeToggle.checked = chatbotState.settings.darkMode;
    personalitySelect.value = chatbotState.settings.personality;
    useOpenAIToggle.checked = chatbotState.settings.useOpenAI; 
    
    // Update color option selection
    colorOptions.forEach(option => {
        if (option.dataset.color === chatbotState.settings.primaryColor) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Apply dark mode if needed
    if (chatbotState.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Apply timestamps if needed
    updateTimestampDisplay();
}

// Function to adjust a hex color (lighten/darken)
function adjustColor(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust color by percentage
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
}

// Function to update timestamp display based on settings
function updateTimestampDisplay() {
    const timestamps = document.querySelectorAll('.message-timestamp');
    if (chatbotState.settings.showTimestamps) {
        timestamps.forEach(ts => ts.style.display = 'block');
    } else {
        timestamps.forEach(ts => ts.style.display = 'none');
    }
}

// Function to add timestamp to messages
function addTimestampToMessage(messageDiv, timestamp) {
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = new Date(timestamp).toLocaleTimeString();
    timestampDiv.style.display = chatbotState.settings.showTimestamps ? 'block' : 'none';
    messageDiv.appendChild(timestampDiv);
}

// Function to add a message to the chat box
function addMessage(text, isUser = false) {
    // Create message object
    const messageObj = {
        text: text,
        isUser: isUser,
        mood: chatbotState.mood,
        timestamp: Date.now()
    };
    
    // Add to message history
    chatbotState.messages.push(messageObj);
    
    // Save to localStorage
    saveMessageHistory();
    
    // Display the message
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'ai-message';
    
    if (!isUser) {
        // Add avatar for AI messages
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-small';
        
        const avatarImg = document.createElement('img');
        avatarImg.src = avatars[chatbotState.mood];
        avatarImg.alt = 'AI';
        
        avatarDiv.appendChild(avatarImg);
        messageDiv.appendChild(avatarDiv);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    
    // Add timestamp
    addTimestampToMessage(messageDiv, messageObj.timestamp);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom of chat
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Update conversation history for DialoGPT if not a user message
    if (!isUser) {
        updateConversationHistory(text, null);
    }
}

// Update conversation history for DialoGPT
function updateConversationHistory(aiResponse, userMessage) {
    if (userMessage) {
        conversationHistory.past_user_inputs.push(userMessage);
    }
    if (aiResponse) {
        conversationHistory.generated_responses.push(aiResponse);
    }
    
    // Keep history within limits
    if (conversationHistory.past_user_inputs.length > MAX_HISTORY_LENGTH) {
        conversationHistory.past_user_inputs = conversationHistory.past_user_inputs.slice(-MAX_HISTORY_LENGTH);
        conversationHistory.generated_responses = conversationHistory.generated_responses.slice(-MAX_HISTORY_LENGTH);
    }
}

// Reset conversation history for DialoGPT
function resetConversationHistory() {
    conversationHistory.past_user_inputs = [];
    conversationHistory.generated_responses = [];
    console.log("Conversation history reset");
}

// Get DialoGPT response
// Get DialoGPT response
async function getDialoGPTResponse(userMessage, personality, mood) {
    try {
        console.log("Getting DialoGPT response for:", userMessage);
        
        // Create the personality and mood-specific prompt prefix
        const promptPrefix = createPersonalityPrompt(personality, mood);
        
        // Format the message but don't include the prompt in what gets sent to the user
        const formattedMessage = `${userMessage}`;
        console.log("Using personality prompt:", promptPrefix);
        
        // Use the proxy endpoint
        const response = await fetch('/api/huggingface', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "microsoft/DialoGPT-medium", // Try medium - more reliable
                inputs: formattedMessage, // Just send the user message
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
        
        // Now apply the personality and mood - post-process the model's response
        let styledResponse = applyPersonalityStyle(processedResponse, personality, mood);
        
        // Update conversation history
        updateConversationHistory(styledResponse, userMessage);
        
        return styledResponse;
    } catch (error) {
        console.error("Error getting DialoGPT response:", error);
        return null;
    }
}

// Apply personality and mood to a generic response
function applyPersonalityStyle(response, personality, mood) {
    // Make sure we have something to work with
    if (!response || response.trim().length === 0) {
        response = "I see";
    }
    
    // Start with the base response
    let styledResponse = response;
    
    // Add ABG slang and phrases based on personality and mood
    if (personality === "abg") {
        if (mood === "happy") {
            // Add ABG happy style phrases/slang
            const happyPhrases = [
                "Omg literally ",
                "Yesss bestie! ",
                "I'm so obsessed with ",
                "That's such a slay! ",
                "Periodt! ",
                "I'm literally living for "
            ];
            
            // Add ABG happy endings
            const happyEndings = [
                " No cap!",
                " Literally obsessed!",
                " So good!",
                " Main character energy!",
                " Vibes are immaculate!",
                " You're such a vibe!"
            ];
            
            // Randomly decide if we replace the start, end, or both
            const styleChoice = Math.floor(Math.random() * 3);
            
            if (styleChoice === 0 || styleChoice === 2) {
                // Replace start
                const randomStart = happyPhrases[Math.floor(Math.random() * happyPhrases.length)];
                styledResponse = randomStart + styledResponse.toLowerCase();
            }
            
            if (styleChoice === 1 || styleChoice === 2) {
                // Add ending
                const randomEnd = happyEndings[Math.floor(Math.random() * happyEndings.length)];
                styledResponse = styledResponse + randomEnd;
            }
        }
        else if (mood === "sad") {
            // Add ABG sad style phrases
            const sadPhrases = [
                "Ugh, ",
                "Whatever, ",
                "Tbh ",
                "I'm not vibing with ",
                "I can't even with "
            ];
            
            // Add ABG sad endings
            const sadEndings = [
                " Whatever.",
                " Tbh.",
                " Not the vibe.",
                " It's giving sad girl hours.",
                " Literally over it."
            ];
            
            // Randomly decide if we replace the start, end, or both
            const styleChoice = Math.floor(Math.random() * 3);
            
            if (styleChoice === 0 || styleChoice === 2) {
                // Replace start
                const randomStart = sadPhrases[Math.floor(Math.random() * sadPhrases.length)];
                styledResponse = randomStart + styledResponse.toLowerCase();
            }
            
            if (styleChoice === 1 || styleChoice === 2) {
                // Add ending
                const randomEnd = sadEndings[Math.floor(Math.random() * sadEndings.length)];
                styledResponse = styledResponse + randomEnd;
            }
        }
        else { // neutral
            // Add ABG neutral style phrases
            const neutralPhrases = [
                "Hmm, ",
                "Bestie, ",
                "So like, ",
                "Lowkey, ",
                "I mean, "
            ];
            
            // Add ABG neutral endings
            const neutralEndings = [
                " Just vibing.",
                " That's the tea.",
                " Boba tea and chill?",
                " You feel me?",
                " It's giving neutral vibes."
            ];
            
            // Randomly decide if we replace the start, end, or both
            const styleChoice = Math.floor(Math.random() * 3);
            
            if (styleChoice === 0 || styleChoice === 2) {
                // Replace start
                const randomStart = neutralPhrases[Math.floor(Math.random() * neutralPhrases.length)];
                styledResponse = randomStart + styledResponse.toLowerCase();
            }
            
            if (styleChoice === 1 || styleChoice === 2) {
                // Add ending
                const randomEnd = neutralEndings[Math.floor(Math.random() * neutralEndings.length)];
                styledResponse = styledResponse + randomEnd;
            }
        }
    }
    else if (personality === "cute") {
        // Similar structure for cute personality...
        // (add cute personality styling code here)
    }
    else if (personality === "sassy") {
        // Similar structure for sassy personality...
        // (add sassy personality styling code here)
    }
    
    return styledResponse;
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

// Helper function to check if response contains any of the specified terms
function containsAnyOfTerms(text, terms) {
    return terms.some(term => text.toLowerCase().includes(term.toLowerCase()));
}

// Get cached response or fetch new one
async function getCachedOrFreshResponse(userMessage, personality, mood) {
    try {
        return await getDialoGPTResponse(userMessage, personality, mood);
    } catch (error) {
        console.error('Error getting DialoGPT response:', error);
        return null;
    }
}

// Settings Panel Functions
function openSettingsPanel() {
    settingsPanel.classList.add('active');
    settingsOverlay.classList.add('active');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('active');
    settingsOverlay.classList.remove('active');
}

function saveSettingsChanges() {
    // Get values from form elements
    chatbotState.settings.name = chatbotNameInput.value;
    chatbotState.settings.showTimestamps = showTimestampsToggle.checked;
    chatbotState.settings.darkMode = darkModeToggle.checked;
    chatbotState.settings.personality = personalitySelect.value;
    chatbotState.settings.useOpenAI = useOpenAIToggle.checked; 
    
    // Get selected color
    const activeColor = document.querySelector('.color-option.active');
    if (activeColor) {
        chatbotState.settings.primaryColor = activeColor.dataset.color;
    }
    
    // Save settings to localStorage
    saveSettings();
    
    // Apply settings to UI
    applySettings();
    
    // Close panel
    closeSettingsPanel();
}

function resetSettingsToDefault() {
    chatbotState.settings = { ...defaultSettings };
    saveSettings();
    applySettings();
}

// Color option selection
function handleColorOptionClick(e) {
    // Remove active class from all options
    colorOptions.forEach(option => option.classList.remove('active'));
    
    // Add active class to clicked option
    e.target.classList.add('active');
}

// Test mood function
function testMood(mood) {
    if (['happy', 'neutral', 'sad'].includes(mood)) {
        console.log(`Testing mood: ${mood}`);
        chatbotState.mood = mood;
        updateMoodDisplay(mood);
        return true;
    }
    console.error(`Invalid mood: ${mood}`);
    return false;
}

// Function to verify avatar images
function verifyAvatarImages() {
    console.log("Verifying avatar images:");
    console.log("Happy avatar path:", avatars.happy);
    console.log("Neutral avatar path:", avatars.neutral);
    console.log("Sad avatar path:", avatars.sad);
    
    // Create temporary image elements to test loading
    ['happy', 'neutral', 'sad'].forEach(mood => {
        const img = new Image();
        img.onload = () => console.log(`${mood} avatar loaded successfully`);
        img.onerror = () => console.error(`Failed to load ${mood} avatar from: ${avatars[mood]}`);
        img.src = avatars[mood];
    });
}

// Function to update the mood display
function updateMoodDisplay(mood) {
    console.log(`Updating mood display to: ${mood}`);
    
    // Validate mood
    if (!['happy', 'neutral', 'sad'].includes(mood)) {
        console.error(`Invalid mood: ${mood}, defaulting to neutral`);
        mood = 'neutral';
    }
    
    // Update the avatar image with full path validation
    const avatarPath = avatars[mood];
    if (!avatarPath) {
        console.error(`No avatar path for mood: ${mood}`);
    } else {
        console.log(`Setting avatar to: ${avatarPath}`);
        aiAvatar.src = avatarPath;
    }
    
    // Update mood text with error handling
    try {
        const phrases = moodPhrases[mood];
        if (phrases && phrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            moodText.textContent = phrases[randomIndex];
        } else {
            console.error(`No mood phrases for: ${mood}`);
            moodText.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        }
    } catch (error) {
        console.error("Error updating mood text:", error);
        moodText.textContent = mood;
    }
    
    // Update container class for styling - with more explicit class management
    console.log("Updating mood CSS classes");
    avatarMainContainer.classList.remove('mood-happy', 'mood-neutral', 'mood-sad');
    avatarMainContainer.classList.add(`mood-${mood}`);
    
    // Notify verification system of mood change
    if (typeof window.notifyMoodChange === 'function') {
        window.notifyMoodChange(mood);
    }
}

// Function to handle sending a message
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Check for special commands
    if (message.toLowerCase() === '/clear') {
        clearChatHistory();
        userInput.value = '';
        return;
    }
    
    // IMPORTANT: Grab the current mood before determining the new mood
    const previousMood = chatbotState.mood;
    
    // Determine mood BEFORE adding the user message
    const newMood = determineMood(message);
    console.log(`Message: "${message}" | Previous mood: ${previousMood} | New detected mood: ${newMood}`);
    
    // Update chatbot state
    chatbotState.mood = newMood;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Update verification if needed - only call this ONCE per message
    if (isVerificationInProgress()) {
        console.log("Verification in progress - processing response");
        processVerificationResponse(message);
    }
    
    // Update mood display - this will trigger notifyMoodChange internally
    // which is now our single source of truth for happiness points
    updateMoodDisplay(newMood);
    
    // Process the regular chatbot response
    await processRegularMessage(message);
}

// Function to update the mood display
function updateMoodDisplay(mood) {
    console.log(`Updating mood display to: ${mood}`);
    
    // Validate mood
    if (!['happy', 'neutral', 'sad'].includes(mood)) {
        console.error(`Invalid mood: ${mood}, defaulting to neutral`);
        mood = 'neutral';
    }
    
    // Update the avatar image with full path validation
    const avatarPath = avatars[mood];
    if (!avatarPath) {
        console.error(`No avatar path for mood: ${mood}`);
    } else {
        console.log(`Setting avatar to: ${avatarPath}`);
        aiAvatar.src = avatarPath;
    }
    
    // Update mood text with error handling
    try {
        const phrases = moodPhrases[mood];
        if (phrases && phrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            moodText.textContent = phrases[randomIndex];
        } else {
            console.error(`No mood phrases for: ${mood}`);
            moodText.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        }
    } catch (error) {
        console.error("Error updating mood text:", error);
        moodText.textContent = mood;
    }
    
    // Update container class for styling - with more explicit class management
    console.log("Updating mood CSS classes");
    avatarMainContainer.classList.remove('mood-happy', 'mood-neutral', 'mood-sad');
    avatarMainContainer.classList.add(`mood-${mood}`);
    
    // Notify verification system of mood change - IMPORTANT: This is where
    // happiness points are awarded, in a single place
    if (typeof window.notifyMoodChange === 'function') {
        console.log("Calling notifyMoodChange with mood:", mood);
        window.notifyMoodChange(mood);
    } else {
        console.warn("notifyMoodChange function not available");
    }
}

// You'll also need to modify your initialization code, find something like this:
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadMessageHistory();
    updateMoodDisplay(chatbotState.mood);
    userInput.focus();
    
    // Start verification silently without showing a message
    if (typeof startVerification === 'function') {
        startVerification();
    }
});

// Helper function to process regular (non-verification) messages
async function processRegularMessage(message) {
    // IMPORTANT: Determine mood BEFORE adding the user message
    const newMood = determineMood(message);
    console.log(`Message: "${message}" detected mood: ${newMood}`);
    
    // Update chatbot state
    chatbotState.mood = newMood;
    
    // Update mood display immediately
    updateMoodDisplay(newMood);
    
    // Add a delay to simulate thinking
    const thinkingTime = 1000 + Math.random() * 1000; // 1-2 seconds
    
    setTimeout(async () => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Try OpenAI API first (if enabled)
        if (chatbotState.settings.useOpenAI) {
            try {
                if (typeof getOpenAIResponse === 'function') {
                    console.log("Attempting to use OpenAI API...");
                    const openAIResponse = await getOpenAIResponse(
                        message,
                        chatbotState.settings.personality,
                        chatbotState.mood
                    );
                    
                    if (openAIResponse) {
                        console.log("Successfully got OpenAI response");
                        // Add AI response to chat
                        addMessage(openAIResponse, false);
                        
                        // Update last response time
                        chatbotState.lastResponseTime = Date.now();
                        return;
                    }
                }
            } catch (error) {
                console.error("Error with OpenAI response:", error);
            }
        }
        
        // If OpenAI fails or is disabled, try DialoGPT
        try {
            if (typeof getCachedOrFreshResponse === 'function') {
                console.log("Falling back to DialoGPT...");
                const aiResponse = await getCachedOrFreshResponse(
                    message,
                    chatbotState.settings.personality,
                    chatbotState.mood
                );
                
                if (aiResponse) {
                    // Update conversation history with user message
                    updateConversationHistory(null, message);
                    
                    // Add AI response to chat
                    addMessage(aiResponse, false);
                    
                    // Update last response time
                    chatbotState.lastResponseTime = Date.now();
                    return;
                }
            }
        } catch (error) {
            console.error("Error with DialoGPT response:", error);
        }
        
        // As a last resort, use template responses
        console.log("Using template response as final fallback");
        const templateResponse = getAIResponse(message);
        addMessage(templateResponse, false);
        
        // Update last response time
        chatbotState.lastResponseTime = Date.now();
    }, thinkingTime);
}

// Add these event listeners for typing pattern analysis
userInput.addEventListener('keydown', (e) => {
    if (isVerificationInProgress()) {
        addTypingEvent(e);
    }
});

userInput.addEventListener('focus', (e) => {
    if (isVerificationInProgress()) {
        startTypingTracking();
    }
});

// Initialize verification state when the page loads
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadMessageHistory();
    updateMoodDisplay(chatbotState.mood);
    userInput.focus();
    
    // Reset verification state when starting a new session
    resetVerification();
});

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Settings panel events
settingsBtn.addEventListener('click', openSettingsPanel);
closeSettingsBtn.addEventListener('click', closeSettingsPanel);
settingsOverlay.addEventListener('click', closeSettingsPanel);
saveSettingsBtn.addEventListener('click', saveSettingsChanges);
resetSettingsBtn.addEventListener('click', resetSettingsToDefault);

// Color option selection
colorOptions.forEach(option => {
    option.addEventListener('click', handleColorOptionClick);
});

// Clear chat history
clearBtn.addEventListener('click', clearChatHistory);

// Initialize - load message history, settings, and update UI
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadMessageHistory();
    updateMoodDisplay(chatbotState.mood);
    userInput.focus();
});

// Call this function when the page loads to check image loading
window.addEventListener('load', () => {
    verifyAvatarImages();
    console.log("Current mood:", chatbotState.mood);
});

// Function to check and fix training data
function fixTrainingMoodAssociations() {
    try {
        const trainingData = JSON.parse(localStorage.getItem('vivianTrainingData'));
        if (!trainingData) {
            console.log("No training data found");
            return;
        }
        
        // Log the current state
        console.log("Current training patterns:", Object.keys(trainingData.patterns).length);
        
        // Count patterns by mood
        const moodCounts = { happy: 0, neutral: 0, sad: 0 };
        for (const pattern in trainingData.patterns) {
            const mood = trainingData.patterns[pattern].mood;
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
        
        console.log("Patterns by mood:", moodCounts);
        
        // Optional: Fix patterns if too many are associated with one mood
        if (moodCounts.sad > (moodCounts.happy + moodCounts.neutral) * 2) {
            console.log("Training data is heavily biased toward sad mood. Consider resetting training data.");
            
            // Uncomment to reset training data
            // localStorage.removeItem('vivianTrainingData');
            // console.log("Training data reset");
        }
    } catch (error) {
        console.error("Error checking training data:", error);
    }
}

// Run this to diagnose training data issues
window.addEventListener('load', () => {
    setTimeout(fixTrainingMoodAssociations, 1000);
});
    
