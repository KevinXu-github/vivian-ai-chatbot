// app.js

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
const colorOptions = document.querySelectorAll('.color-option');
const useOpenAIToggle = document.getElementById('use-openai');

// NOTE: The personality dropdown is no longer needed and can be removed from index.html
// const personalitySelect = document.getElementById('personality-select');

const defaultSettings = {
    name: 'Alex',
    primaryColor: '#5a67d8', // A friendly, casual color
    showTimestamps: false,
    darkMode: false,
    useOpenAI: true
};

// Chatbot State
const chatbotState = {
    mood: 'sad', // Start in a sad/bored state to give the user a goal
    lastResponseTime: Date.now(),
    messages: [], // Store chat history
    settings: { ...defaultSettings }
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
        "Feeling great!",
        "Couldn't be better!",
        "What a nice day.",
        "Feeling pretty awesome now.",
        "You actually made me smile."
    ],
    neutral: [
        "Just thinking.",
        "Okay, what's on your mind?",
        "I'm listening.",
        "Tell me more.",
        "Feeling alright."
    ],
    sad: [
        "Feeling a bit down...",
        "Kinda bored.",
        "Not the best day.",
        "Ugh, is it Friday yet?",
        "Just feeling a bit 'meh'."
    ]
};

// Dialogue for our single "relatable" personality
const personalityResponses = {
    happy: [
        "Haha, that's actually pretty funny! You made me smile.",
        "Wow, thank you! That's a really nice thing to say.",
        "Okay, you're pretty cool. That was way more interesting than what I was doing.",
        "That's awesome! Tell me more.",
        "You just made my day a little better, thanks!"
    ],
    neutral: [
        "Hey.",
        "Oh, hi. What's up?",
        "I'm listening.",
        "Yeah? Go on.",
        "Okay, what's on your mind?"
    ],
    sad: [
        "Ugh, another day...",
        "Is it Friday yet? This day is dragging.",
        "Sorry, just not really feeling it right now.",
        "Got anything interesting? I'm bored.",
        "That's... nice, I guess."
    ]
};

// Keywords to detect mood from user's message
const moodKeywords = {
    happy: ['love', 'happy', 'amazing', 'great', 'awesome', 'funny', 'joke', 'cool', 'thanks', 'thank you', 'perfect', 'beautiful'],
    sad: ['sad', 'upset', 'depressed', 'angry', 'hate', 'awful', 'worst', 'bad', 'boring', 'stuck', 'problem']
};

// --- Core Application Logic ---

// Function to determine AI mood based on user message
function determineMood(message) {
    const lowerMessage = message.toLowerCase();
    let happyScore = 0;
    let sadScore = 0;

    moodKeywords.happy.forEach(keyword => {
        if (lowerMessage.includes(keyword)) happyScore++;
    });

    moodKeywords.sad.forEach(keyword => {
        if (lowerMessage.includes(keyword)) sadScore++;
    });

    if (happyScore > sadScore) return 'happy';
    if (sadScore > happyScore) return 'sad';
    return 'neutral';
}

// Function to get an AI response from our template
function getAIResponse() {
    const responses = personalityResponses[chatbotState.mood];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Function to add a message to the chat box
function addMessage(text, isUser = false, mood = chatbotState.mood) {
    const messageObj = { text, isUser, mood, timestamp: Date.now() };
    chatbotState.messages.push(messageObj);
    saveMessageHistory();

    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'ai-message';

    if (!isUser) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-small';
        const avatarImg = document.createElement('img');
        avatarImg.src = avatars[mood];
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

    addTimestampToMessage(messageDiv, messageObj.timestamp);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// Function to handle sending a message
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    if (message.toLowerCase() === '/clear') {
        clearChatHistory();
        userInput.value = '';
        return;
    }
    
    addMessage(message, true);
    userInput.value = '';

    const newMood = determineMood(message);
    chatbotState.mood = newMood;

    // This updates the avatar and text, and also notifies the verification script.
    updateMoodDisplay(newMood);
    
    showTypingIndicator();

    // Process the regular chatbot response
    await processRegularMessage(message);
}

// Main function to get and display AI response
async function processRegularMessage(message) {
    const thinkingTime = 1000 + Math.random() * 1000; // 1-2 seconds

    setTimeout(async () => {
        let aiResponse = null;

        // Try OpenAI API first (if enabled)
        if (chatbotState.settings.useOpenAI && typeof getOpenAIResponse === 'function') {
            try {
                aiResponse = await getOpenAIResponse(message, 'relatable', chatbotState.mood);
            } catch (error) {
                console.error("Error with OpenAI response:", error);
            }
        }

        // If OpenAI fails or is disabled, use template responses
        if (!aiResponse) {
            aiResponse = getAIResponse();
        }

        removeTypingIndicator();
        addMessage(aiResponse, false);
        chatbotState.lastResponseTime = Date.now();

    }, thinkingTime);
}

// Function to update the mood display (Avatar, Text, and Verification)
function updateMoodDisplay(mood) {
    if (!['happy', 'neutral', 'sad'].includes(mood)) {
        mood = 'neutral';
    }

    aiAvatar.src = avatars[mood];
    const phrases = moodPhrases[mood];
    moodText.textContent = phrases[Math.floor(Math.random() * phrases.length)];

    avatarMainContainer.classList.remove('mood-happy', 'mood-neutral', 'mood-sad');
    avatarMainContainer.classList.add(`mood-${mood}`);

    // This is the crucial link to the verification system.
    if (typeof window.notifyMoodChange === 'function') {
        window.notifyMoodChange(mood);
    }
}


// --- Utility and History Functions ---

function saveMessageHistory() {
    localStorage.setItem('alexChatHistory', JSON.stringify(chatbotState.messages));
}

function loadMessageHistory() {
    const savedMessages = localStorage.getItem('alexChatHistory');
    chatBox.innerHTML = '';

    if (savedMessages && JSON.parse(savedMessages).length > 0) {
        chatbotState.messages = JSON.parse(savedMessages);
    } else {
        const welcomeMessage = {
            text: "Hey... it's been a long day. Think you can make me smile? To prove you're human, you'll need to cheer me up.",
            isUser: false,
            mood: 'sad',
            timestamp: Date.now()
        };
        chatbotState.messages = [welcomeMessage];
    }
    
    chatbotState.messages.forEach(msg => {
        const mood = msg.isUser ? chatbotState.mood : msg.mood;
        addMessage(msg.text, msg.isUser, mood);
    });
}

function clearChatHistory() {
    chatbotState.messages = [];
    localStorage.removeItem('alexChatHistory');
    chatbotState.mood = 'sad'; // Reset mood
    loadMessageHistory(); // This will add the welcome message
    updateMoodDisplay('sad');
}

// --- Typing Indicator ---

function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.className = 'ai-message';
    indicatorDiv.innerHTML = `
        <div class="avatar-small">
            <img src="${avatars[chatbotState.mood]}" alt="AI">
        </div>
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(indicatorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}


// --- Settings Panel Logic ---

function openSettingsPanel() {
    settingsPanel.classList.add('active');
    settingsOverlay.classList.add('active');
}

function closeSettingsPanel() {
    settingsPanel.classList.remove('active');
    settingsOverlay.classList.remove('active');
}

function applySettings() {
    chatbotNameElement.textContent = chatbotState.settings.name;
    document.documentElement.style.setProperty('--primary-color', chatbotState.settings.primaryColor);
    
    chatbotNameInput.value = chatbotState.settings.name;
    showTimestampsToggle.checked = chatbotState.settings.showTimestamps;
    darkModeToggle.checked = chatbotState.settings.darkMode;
    useOpenAIToggle.checked = chatbotState.settings.useOpenAI;

    document.body.classList.toggle('dark-mode', chatbotState.settings.darkMode);
    updateTimestampDisplay();
}

function saveSettingsChanges() {
    chatbotState.settings.name = chatbotNameInput.value;
    chatbotState.settings.showTimestamps = showTimestampsToggle.checked;
    chatbotState.settings.darkMode = darkModeToggle.checked;
    chatbotState.settings.useOpenAI = useOpenAIToggle.checked;

    const activeColor = document.querySelector('.color-option.active');
    if (activeColor) {
        chatbotState.settings.primaryColor = activeColor.dataset.color;
    }
    
    localStorage.setItem('alexSettings', JSON.stringify(chatbotState.settings));
    applySettings();
    closeSettingsPanel();
}

function resetSettingsToDefault() {
    chatbotState.settings = { ...defaultSettings };
    localStorage.setItem('alexSettings', JSON.stringify(chatbotState.settings));
    applySettings();
}

function loadSettings() {
    const savedSettings = localStorage.getItem('alexSettings');
    if (savedSettings) {
        chatbotState.settings = JSON.parse(savedSettings);
    }
    applySettings();
}

function addTimestampToMessage(messageDiv, timestamp) {
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = new Date(timestamp).toLocaleTimeString();
    messageDiv.appendChild(timestampDiv);
    updateTimestampDisplay(); // Apply visibility based on settings
}

function updateTimestampDisplay() {
    const display = chatbotState.settings.showTimestamps ? 'block' : 'none';
    document.querySelectorAll('.message-timestamp').forEach(ts => ts.style.display = display);
}


// --- Event Listeners and Initialization ---

function initialize() {
    loadSettings();
    loadMessageHistory();
    // Set initial mood based on the last message or default
    const lastMessage = chatbotState.messages[chatbotState.messages.length - 1];
    chatbotState.mood = lastMessage ? lastMessage.mood : 'sad';
    updateMoodDisplay(chatbotState.mood);

    userInput.focus();

    // Start verification silently
    if (typeof startVerification === 'function') {
        startVerification();
    }
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    clearBtn.addEventListener('click', clearChatHistory);
    settingsBtn.addEventListener('click', openSettingsPanel);
    closeSettingsBtn.addEventListener('click', closeSettingsPanel);
    settingsOverlay.addEventListener('click', closeSettingsPanel);
    saveSettingsBtn.addEventListener('click', saveSettingsChanges);
    resetSettingsBtn.addEventListener('click', resetSettingsToDefault);

    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// Wait for the DOM to be fully loaded before running the initialization
document.addEventListener('DOMContentLoaded', initialize);