// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiAvatar = document.getElementById('ai-avatar');
const moodText = document.getElementById('mood-text');
const avatarMainContainer = document.querySelector('.avatar-main-container');

// Chatbot State
const chatbotState = {
    mood: 'neutral', // Default mood: neutral, happy, sad
    lastResponseTime: Date.now()
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

// ABG AI Response Templates
const responseTemplates = {
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
};

// Keywords to detect mood
const moodKeywords = {
    happy: ['love', 'happy', 'amazing', 'great', 'awesome', 'beautiful', 'fun', 'excited', 'cool', 'nice', 'good', 'slay', 'queen', 'obsessed', 'vibe', 'bestie', 'perfect', 'lit', 'fire', 'win'],
    sad: ['sad', 'upset', 'depressed', 'angry', 'hate', 'dislike', 'annoyed', 'terrible', 'awful', 'worst', 'bad', 'ugly', 'boring', 'tired', 'disappointed', 'fail', 'crying', 'cry', 'lonely', 'alone']
};

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

// Function to update the mood display
function updateMoodDisplay(mood) {
    // Update the avatar image
    aiAvatar.src = avatars[mood];
    
    // Update mood text
    const phrases = moodPhrases[mood];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    moodText.textContent = phrases[randomIndex];
    
    // Update container class for styling
    avatarMainContainer.className = 'avatar-main-container';
    avatarMainContainer.classList.add('mood-' + mood);
}

// Function to add a message to the chat box
function addMessage(text, isUser = false) {
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
    
    chatBox.appendChild(messageDiv);
    
    // Scroll to bottom of chat
    chatBox.scrollTop = chatBox.scrollHeight;
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
    // Determine mood based on user message
    const newMood = determineMood(userMessage);
    chatbotState.mood = newMood;
    
    // Update mood display
    updateMoodDisplay(newMood);
    
    // Get random response from appropriate template
    const responses = responseTemplates[chatbotState.mood];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Function to handle sending a message
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI thinking and responding
    const thinkingTime = 1000 + Math.random() * 1000; // 1-2 seconds
    
    setTimeout(() => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Get and display AI response
        const aiResponse = getAIResponse(message);
        addMessage(aiResponse);
        
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

// Initialize the mood display
updateMoodDisplay(chatbotState.mood);

// Focus input field on page load
userInput.focus();