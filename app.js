// app.js

// DOM Elements
const chatBox = document.getElementById('chat-area'); // Corrected ID from your HTML
const userInput = document.getElementById('message-input'); // Corrected ID from your HTML
const sendBtn = document.getElementById('send-btn');
const aiAvatar = document.querySelector('.emotion-avatar'); // Corrected selector
const moodText = document.getElementById('emotion-state'); // Corrected ID from your HTML
const chatbotNameElement = document.getElementById('chatbot-name');
const clearBtn = document.getElementById('clear-btn'); // Assuming you have a clear button
const settingsBtn = document.getElementById('settings-btn'); // Assuming you have a settings button

// Default settings for Mia
const defaultSettings = {
    name: 'Mia',
    primaryColor: '#5a67d8',
    showTimestamps: false,
    darkMode: false,
    useOpenAI: true
};

// Chatbot State
const chatbotState = {
    mood: 'sad', // Start in a sad/bored state to give the user a goal
    messages: [], // Store chat history
    settings: { ...defaultSettings }
};

// Avatar sources (ensure you have these images in an /assets folder)
const avatars = {
    happy: 'assets/happy.png',
    neutral: 'assets/neutral.png',
    sad: 'assets/sad.png'
};

// Mood phrases for the UI
const moodPhrases = {
    happy: ["Feeling great!", "Couldn't be better!", "Feeling pretty awesome now."],
    neutral: ["Just thinking...", "Okay, what's on your mind?", "I'm listening."],
    sad: ["Feeling a bit down...", "Kinda bored.", "Not the best day."]
};

// Local fallback responses for Mia
const personalityResponses = {
    happy: [
        "Haha, that's actually pretty funny! You made me smile.",
        "Wow, thank you! That's a really nice thing to say.",
        "You just made my day a little better, thanks!"
    ],
    neutral: [
        "Hey there.",
        "Oh, hi. What's up?",
        "I'm listening."
    ],
    sad: [
        "Ugh, another day...",
        "Sorry, just not really feeling it right now.",
        "Got anything interesting? I'm bored."
    ]
};

// Keywords to detect mood from user's message
const moodKeywords = {
    happy: ['love', 'happy', 'amazing', 'great', 'awesome', 'funny', 'joke', 'cool', 'thanks', 'thank you', 'perfect', 'beautiful'],
    sad: ['sad', 'upset', 'depressed', 'angry', 'hate', 'awful', 'worst', 'bad', 'boring', 'stuck', 'problem']
};


// --- Core Application Logic ---

function determineMood(message) {
    const lowerMessage = message.toLowerCase();
    let happyScore = 0;
    let sadScore = 0;
    moodKeywords.happy.forEach(keyword => lowerMessage.includes(keyword) && happyScore++);
    moodKeywords.sad.forEach(keyword => lowerMessage.includes(keyword) && sadScore++);
    if (happyScore > sadScore) return 'happy';
    if (sadScore > happyScore) return 'sad';
    return 'neutral';
}

function getLocalResponse() {
    const responses = personalityResponses[chatbotState.mood];
    return responses[Math.floor(Math.random() * responses.length)];
}

function addMessageToUI(text, isUser, mood = chatbotState.mood) {
    const messageObj = { text, isUser, mood, timestamp: Date.now() };
    if (!isUser || chatbotState.messages.length === 0) {
        chatbotState.messages.push(messageObj);
        saveMessageHistory();
    }
    
    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : ''}`;

    // Create avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>`;
    if (!isUser) {
        const avatarImg = document.createElement('img');
        avatarImg.src = avatars[mood] || avatars.neutral;
        avatarDiv.innerHTML = '';
        avatarDiv.appendChild(avatarImg);
    }

    // Create content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    const paragraph = document.createElement('p');
    paragraph.className = 'message-text';
    paragraph.textContent = text;
    contentDiv.appendChild(paragraph);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === '') return;

    addMessageToUI(messageText, true);
    // Add user message to history for API calls
    chatbotState.messages.push({ text: messageText, isUser: true, mood: 'neutral', timestamp: Date.now() });
    saveMessageHistory();

    userInput.value = '';

    const newMood = determineMood(messageText);
    chatbotState.mood = newMood;
    updateMoodDisplay(newMood);
    
    showTypingIndicator();
    
    let aiResponse = null;
    if (chatbotState.settings.useOpenAI && typeof getOpenAIResponse === 'function') {
        try {
            const historyForAPI = chatbotState.messages.slice(-6); // Send last 3 pairs of messages
            aiResponse = await getOpenAIResponse(messageText, chatbotState.mood, historyForAPI);
        } catch (error) {
            console.error("Error with OpenAI, using local fallback:", error);
        }
    }

    if (!aiResponse) {
        aiResponse = getLocalResponse();
    }
    
    removeTypingIndicator();
    addMessageToUI(aiResponse, false, chatbotState.mood);
    // Add AI response to history
    chatbotState.messages.push({ text: aiResponse, isUser: false, mood: chatbotState.mood, timestamp: Date.now() });
    saveMessageHistory();
}

function updateMoodDisplay(mood) {
    if (!['happy', 'neutral', 'sad'].includes(mood)) mood = 'neutral';

    // Update main avatar icon (this could be an image too)
    const avatarIcon = aiAvatar.querySelector('i');
    if (avatarIcon) {
        avatarIcon.className = `fas ${mood === 'happy' ? 'fa-smile-beam' : mood === 'sad' ? 'fa-frown' : 'fa-meh'}`;
    }
    
    // Update mood text
    const phrases = moodPhrases[mood];
    moodText.textContent = phrases[Math.floor(Math.random() * phrases.length)];

    // Update CSS classes for styling
    aiAvatar.className = `emotion-avatar ${mood === 'happy' ? 'positive' : mood === 'sad' ? 'negative' : 'neutral'}`;

    // Link to the verification system
    if (typeof window.notifyMoodChange === 'function') {
        window.notifyMoodChange(mood);
    }
}


// --- Utility and History Functions ---

function saveMessageHistory() {
    localStorage.setItem('miaChatHistory', JSON.stringify(chatbotState.messages));
}

function loadMessageHistory() {
    const savedMessages = localStorage.getItem('miaChatHistory');
    chatBox.innerHTML = ''; // Clear chat area before loading

    if (savedMessages && JSON.parse(savedMessages).length > 0) {
        chatbotState.messages = JSON.parse(savedMessages);
    } else {
        const welcomeMessage = {
            text: "Hey... it's been a long day. I'm feeling a bit down. Think you can make me smile?",
            isUser: false,
            mood: 'sad',
            timestamp: Date.now()
        };
        chatbotState.messages = [welcomeMessage];
        saveMessageHistory();
    }
    
    chatbotState.messages.forEach(msg => addMessageToUI(msg.text, msg.isUser, msg.mood));
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'message';
    indicator.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content"><p class="message-text">...</p></div>
    `;
    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}


// --- Initialization ---

function initialize() {
    loadMessageHistory();
    const lastMessage = chatbotState.messages[chatbotState.messages.length - 1];
    chatbotState.mood = lastMessage && !lastMessage.isUser ? lastMessage.mood : 'sad';
    updateMoodDisplay(chatbotState.mood);

    userInput.focus();

    if (typeof startVerification === 'function') {
        startVerification();
    }
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
}

document.addEventListener('DOMContentLoaded', initialize);