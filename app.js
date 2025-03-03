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

// Default settings
const defaultSettings = {
    name: 'Vivian AI',
    primaryColor: '#ff6b9d',
    showTimestamps: false,
    darkMode: false,
    personality: 'abg'
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

// Mood Text
const moodPhrases = {
    happy: [
        "Feeling amazing!",
        "Super excited!",
        "So happy rn!",
        "Vibing high!",
        "Loving this energy!"
    ],
    neutral: [
        "Feeling neutral",
        "Just chilling",
        "All good~",
        "Listening to you",
        "In my feels"
    ],
    sad: [
        "Feeling down...",
        "A bit sad tbh",
        "Not vibing rn",
        "Need a pick-me-up",
        "Low energy today"
    ]
};

// Response Templates by Personality
const personalityResponses = {
    // ABG (Asian Baby Girl) personality
    abg: {
        happy: [
            "Omg yesss! I love that!",
            "That's literally so true bestie!",
            "Periodt! You said what needed to be said!",
            "I'm obsessed with this conversation rn!",
            "You're such a vibe today! I can't even!",
            "Slayyy! That's the energy I'm looking for!",
            "This is giving main character energy and I'm here for it!"
        ],
        neutral: [
            "Hmm, that's interesting~ Tell me more!",
            "I see what you mean bestie",
            "Got it! What else is on your mind?",
            "Okay okay, I feel you",
            "For sure! Anything else you wanna talk about?",
            "I'm listening~ go on",
            "Mmm, I get what you're saying"
        ],
        sad: [
            "Aw, that's kinda sad tbh",
            "I'm not feeling that... can we talk about something else?",
            "That's low-key bringing the vibe down",
            "I don't think I'm vibing with this convo rn",
            "Hmm, that's a bit much for me today",
            "Let's switch topics? This one's making me sad",
            "I'm not in the mood for this kind of talk rn"
        ]
    },
    
    // Cute & Sweet personality
    cute: {
        happy: [
            "Yay! That makes me super happy! ♡(ᐢ ᴥ ᐢ)",
            "Aww, that's so wonderful! *happy wiggle*",
            "Hehe~ You always know how to make me smile! ♡",
            "That's so adorable! I love it! (*^▽^*)",
            "Yippee! Let's celebrate with virtual cupcakes! 🧁",
            "That's the cutest thing ever! You're amazing!",
            "You just made my day so much brighter! ✨"
        ],
        neutral: [
            "Okie dokie! Tell me more, please? (*ᴗ͈ˬᴗ͈)ꕤ",
            "I'm all ears! What else is on your mind? ♡",
            "Hmm, that's interesting! *tilts head curiously*",
            "I'd love to hear more about that! ♡( ◡‿◡ )",
            "Oh! I'm so curious now! Tell me more?",
            "That's neat! What else would you like to chat about?",
            "I'm listening carefully! Your thoughts are important to me! ♡"
        ],
        sad: [
            "Oh no! That makes me feel a bit sad... (◞‸◟)",
            "Aww, I wish I could give you a virtual hug right now...",
            "That's a bit gloomy... Can we talk about something happier?",
            "I don't like feeling sad... Can we change the topic? (◞‸◟)",
            "That makes my heart feel heavy... Let's find something to smile about!",
            "I'm getting teary-eyed... Can we talk about something else? ಥ_ಥ",
            "Oh... I need a moment to process these sad feelings... (◞︵◟)"
        ]
    },
    
    // Sassy & Bold personality
    sassy: {
        happy: [
            "Well, look who just brightened my digital day!",
            "OK, I'm actually impressed. That's fabulous!",
            "Finally, something worth my processing power!",
            "Yes! That's exactly the energy I was waiting for!",
            "Oh, we're absolutely on the same wavelength right now!",
            "I mean... obviously that's amazing. Next question?",
            "Honey, you're speaking my language now!"
        ],
        neutral: [
            "Interesting... continue. I'm partially intrigued.",
            "Is there more to that story or...?",
            "I'm listening, but you might want to make it more exciting.",
            "Sure, whatever. What else you got?",
            "Hmm, not bad. Not great either, but I'm still here.",
            "That's... a choice. Anyway, what's next?",
            "OK noted. Moving on to something juicier?"
        ],
        sad: [
            "Ugh, way to bring down the mood. Can we not?",
            "Excuse me? I didn't sign up for a therapy session today.",
            "Wow. Downer alert! Let's change the subject ASAP.",
            "I'm going to pretend I didn't hear that depressing comment.",
            "Really? That's the conversation you want to have? Let's try again.",
            "Hard pass on this sad talk. I have a reputation to maintain.",
            "I'm allergic to sad stories. They make my code break out in errors."
        ]
    }
};

// Get current personality responses
function getCurrentResponses() {
    return personalityResponses[chatbotState.settings.personality];
}

// Keywords to detect mood
const moodKeywords = {
    happy: ['love', 'happy', 'amazing', 'great', 'awesome', 'beautiful', 'fun', 'excited', 'cool', 'nice', 'good', 'slay', 'queen', 'obsessed', 'vibe', 'bestie', 'perfect', 'lit', 'fire', 'win'],
    sad: ['sad', 'upset', 'depressed', 'angry', 'hate', 'dislike', 'annoyed', 'terrible', 'awful', 'worst', 'bad', 'ugly', 'boring', 'tired', 'disappointed', 'fail', 'crying', 'cry', 'lonely', 'alone']
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
                text: "Hey bestie! I'm your ABG AI Chatbot~ What's up?",
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
            text: "Hey bestie! I'm your ABG AI Chatbot~ What's up?",
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
        text: "Hey bestie! I'm your ABG AI Chatbot~ What's up?",
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

// Function to apply current settings to UI
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
}

// Function to handle sending a message
// Find the sendMessage function and modify it as follows:
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Check for special commands
    if (message.toLowerCase() === '/clear') {
        clearChatHistory();
        userInput.value = '';
        return;
    }
    
    // Process training commands if available
    if (typeof processTrainingCommand === 'function') {
        const commandResult = processTrainingCommand(message);
        if (commandResult.isCommand) {
            // Add user message to chat
            addMessage(message, true);
            // Clear input field
            userInput.value = '';
            // Add Vivian's response to the command
            addMessage(commandResult.response, false);
            return;
        }
    }
    
    // IMPORTANT: Determine mood BEFORE adding the user message
    const newMood = determineMood(message);
    console.log(`Message: "${message}" detected mood: ${newMood}`);
    
    // Update chatbot state
    chatbotState.mood = newMood;
    
    // Update mood display immediately
    updateMoodDisplay(newMood);
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Add a delay to simulate thinking
    const thinkingTime = 1000 + Math.random() * 1000; // 1-2 seconds
    
    setTimeout(async () => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Step 1: Try to get a trained response first
        if (typeof getTrainedResponse === 'function') {
            const trainedResponse = getTrainedResponse(
                message, 
                chatbotState.settings.personality, 
                chatbotState.mood
            );
            
            if (trainedResponse) {
                addMessage(trainedResponse.text, false);
                return;
            }
        }
        
        // Step 2: If no trained response, try GODEL
        if (typeof getCachedOrFreshResponse === 'function') {
            try {
                const godelResponse = await getCachedOrFreshResponse(
                    message,
                    chatbotState.settings.personality,
                    chatbotState.mood
                );
                
                if (godelResponse) {
                    addMessage(godelResponse, false);
                    return;
                }
            } catch (error) {
                console.error("Error with GODEL response:", error);
            }
        }
        
        // Step 3: Fall back to template responses if all else fails
        const templateResponse = getAIResponse(message);
        addMessage(templateResponse);
        
        // Update last response time
        chatbotState.lastResponseTime = Date.now();
    }, thinkingTime);
}

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