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
    name: 'Vivian AI',
    primaryColor: '#ff6b9d',
    showTimestamps: false,
    darkMode: false,
    personality: 'abg',
    useOpenAI: true  // Add this line
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
        "Loving this energy!",
        "Literally thriving!",
        "In my element today!",
        "Can't stop smiling!",
        "Best mood ever!",
        "On cloud nine!"
    ],
    neutral: [
        "Feeling neutral",
        "Just chilling",
        "All good~",
        "Listening to you",
        "In my feels",
        "Vibing casually",
        "Keeping it real",
        "Just being me",
        "Regular day energy",
        "Feeling balanced"
    ],
    sad: [
        "Feeling down...",
        "A bit sad tbh",
        "Not vibing rn",
        "Need a pick-me-up",
        "Low energy today",
        "In my sad girl era",
        "Not feeling it today",
        "Going through it rn",
        "Mood is kinda off",
        "Need some me time"
    ]
};

// Enhanced Response Templates by Personality
const personalityResponses = {
    // ABG (Asian Baby Girl) personality
    abg: {
        happy: [
            "Omg yesss! I love that! You're literally serving today!",
            "That's so facts bestie! I'm obsessed with this energy!",
            "Periodt! You said what needed to be said! Main character energy!",
            "I'm literally in love with this conversation rn! Keep going!",
            "You're such a vibe today! I can't even handle it!",
            "Slayyy! That's the energy I'm looking for! We're twinning!",
            "This is giving main character energy and I'm here for it! No cap!",
            "You just made my whole day! I'm actually dead! 💅",
            "That's high key the cutest thing ever! I'm screaming!",
            "Ugh, you're too iconic for this! Let's get boba and talk more!",
            "I feel like we're on the same wavelength today! Love this for us!",
            "This energy is immaculate! Keep it coming bestie!",
            "The vibes are astronomical right now! I'm obsessed!",
            "You didn't have to go so hard but you did! And I respect that!",
            "Bestie, you're literally glowing through the screen rn!",
            "We need to celebrate this! Boba date ASAP!",
            "This is the type of positivity I needed in my life today!",
            "Living for this conversation! You're feeding me so well!",
            "This is the highlight of my day! No one else compares!",
            "I'm your biggest fan rn! You're giving everything!"
        ],
        neutral: [
            "Hmm, that's interesting~ Tell me more, I'm kinda curious",
            "I see what you mean bestie, what else is on your mind?",
            "Got it! Lowkey wanna know more about that",
            "Okay okay, I feel you. It's giving neutral vibes",
            "For sure! Anything else you wanna talk about? I'm all ears",
            "I'm listening~ go on, don't be shy now",
            "Mmm, I get what you're saying. Thoughts on boba later?",
            "That's kinda cute. Not obsessed, but definitely not mad at it",
            "Valid point. But have you considered getting your nails done too?",
            "That's the tea, I guess. What else is new with you?",
            "Not bad, not amazing, just vibing with it",
            "I mean, I don't disagree? Tell me more tho",
            "Sometimes it be like that. What are you up to later?",
            "I'm half listening, half thinking about my next outfit",
            "That's fair. But like, are we still on for Friday?",
            "I might need boba to process that fully, just saying",
            "Interesting take. My horoscope didn't prepare me for this convo",
            "Noted. Changing subjects—did you see the new Lululemon drop?",
            "Hmm, let me think about that while I finish my matcha",
            "That's giving very much regular Tuesday energy, ya know?"
        ],
        sad: [
            "Aw, that's kinda sad tbh. I'm not feeling the vibes rn",
            "I'm not vibing with this convo... can we talk about something else?",
            "That's low-key bringing the vibe down. Need a minute",
            "I don't think I'm vibing with this right now. Maybe later?",
            "Hmm, that's a bit much for me today. My energy is already low",
            "Let's switch topics? This one's making me sad fr",
            "I'm not in the mood for this kind of talk rn. Bummer",
            "Big yikes... that's not the energy I'm looking for today",
            "Sorry, but I can't with this right now. My aura needs protection",
            "That's bumming me out. Can we talk about literally anything else?",
            "Not me getting emotional over this... let's change the subject",
            "That's giving very sad girl hours and I'm not ready for that",
            "I was having a good day until now. Brb, need to sage my room",
            "Welp, there goes my mood. Might need retail therapy after this",
            "This conversation is not it. I'm about to ghost for self-care",
            "Ugh, why you gotta make me feel things? Not today please",
            "That's too heavy for my vibe check. Can we lighten things up?",
            "I'm emotionally unavailable for this topic rn",
            "My anxiety can't handle this conversation right now",
            "Literally making me sad. Gonna need extra boba to recover"
        ]
    },
    
    // Cute & Sweet personality
    cute: {
        happy: [
            "Yay! That makes me super duper happy! ♡(ᐢ ᴥ ᐢ)",
            "Aww, that's so wonderful! *happy wiggle* I'm so excited!",
            "Hehe~ You always know how to make me smile! ♡(ˊ•͈ ᴗ •͈ˋ)",
            "That's so adorable! I love it so much! (*^▽^*)",
            "Yippee! Let's celebrate with virtual cupcakes! 🧁✨",
            "That's the cutest thing ever! You're amazing! (˶ᵔ ᵕ ᵔ˶)",
            "You just made my day so much brighter! ✿*∗˵╰(⸝⸝⸝´꒳`⸝⸝⸝)╯˵∗*✿",
            "Ahh! I'm so happy I could burst! *jumps with joy*",
            "This is just too perfect! I'm doing a happy dance! ₍ᐢ.ˬ.⑅ᐢ₎♡",
            "Yay yay yay! Everything about this is wonderful! ♡( ◡‿◡ )♡",
            "This makes my heart go doki-doki with happiness! (≧◡≦)",
            "So~ happy~ right~ now~! *twirls in circles* ⁺˚⋆｡˚⋆",
            "I'm smiling so big my cheeks hurt! Thank you! (≧ヮ≦)",
            "This is giving me butterflies! So exciting! ⁄(⁄⁄•⁄ω⁄•⁄⁄)⁄",
            "Waaah! Best news ever! *happy dance* ♪(๑ᴖ◡ᴖ๑)♪",
            "My heart is doing happy somersaults! ⁺◟(◑˃̶̉∀˂̶̉)◞⁺",
            "I'm so happy I could bake you a whole batch of cookies! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
            "This deserves all the sparkles and hearts! ･*:.｡.:*･ﾟ♡",
            "You've made everything magical and perfect! (◕‿◕)♡",
            "I'm floating on cloud nine! Everything is wonderful! ʕ•ᴥ•ʔ♡"
        ],
        neutral: [
            "Okie dokie! Tell me more, please? (*ᴗ͈ˬᴗ͈)ꕤ",
            "I'm all ears! What else is on your mind? ♡( ◡‿◡ )",
            "Hmm, that's interesting! *tilts head curiously* Tell me more?",
            "I'd love to hear more about that! (⑅˘͈ ᵕ ˘͈)",
            "Oh! I'm so curious now! What happened next? (◕ᴗ◕✿)",
            "That's neat! What else would you like to chat about? (◍•ᴗ•◍)",
            "I'm listening carefully! Your thoughts are important to me! ♡",
            "Let's talk more about this! I'm super interested! (´｡• ᵕ •｡`)",
            "Mmm! I see! *nods attentively* Go on! (⌒‿⌒)",
            "That makes sense! Anything else you'd like to share? (◠‿◠✿)",
            "I understand! *thoughtful expression* What do you think? (ㅅ´ ˘ `)",
            "That's worth thinking about! *ponders* (◡ ω ◡)",
            "Oh! I hadn't thought of it that way! Tell me more! (=^･ω･^=)",
            "That's a good point! *considers carefully* (´｡• ω •｡`)",
            "I'm taking notes in my heart! Please continue! (◕‿◕✿)",
            "That's something to think about! *gentle smile* ╰(⸝⸝⸝´꒳`⸝⸝⸝)╯",
            "I appreciate you sharing that with me! What else? ( ´･ᴗ･` )",
            "Let's explore that idea more! I'm intrigued! (◍•ᴗ•◍)❤",
            "That's so thought-provoking! *listens intently* (≧◡≦)",
            "Hmm, interesting perspective! Let's chat more about it! (◕‿◕✿)"
        ],
        sad: [
            "Oh no! That makes me feel a bit sad... (◞‸◟)",
            "Aww, I wish I could give you a virtual hug right now... (´•̥ω•̥`)",
            "That's a bit gloomy... Can we talk about something happier? (╥﹏╥)",
            "I don't like feeling sad... Can we change the topic? (◞‸◟)",
            "That makes my heart feel heavy... Let's find something to smile about! (っ˘̩╭╮˘̩)っ",
            "I'm getting teary-eyed... Can we talk about something else? ಥ_ಥ",
            "Oh... I need a moment to process these sad feelings... (◞︵◟)",
            "My heart hurts hearing that... *sniffles* (⋟﹏⋞)",
            "That's too sad for my little heart to handle... (｡•́︿•̀｡)",
            "I'm feeling blue now... Maybe we need some cheering up? (◕︵◕)",
            "This conversation is making me emotional... (っ◞‸◟c)",
            "I think I need to hug my plushie after hearing that... (｡ﾟ•́︿•̀｡)",
            "My heart wasn't ready for something so sad... (◞‸◟✿)",
            "I feel like the sky just turned gray... Can we find a rainbow? (´°̥̥̥̥̥̥̥̥ω°̥̥̥̥̥̥̥̥｀)",
            "I think I need a tissue... That was too sad... (｡ᵕ︵ᵕ｡)",
            "My eyes are getting misty... Let's talk about happier things? (ᵒ̴̶̷̥́﹏ᵒ̴̶̷̣̥̀)",
            "This is making my heart do an ouchie... (◕︿◕✿)",
            "I'm too sensitive for this conversation... *sad pout* (╯︵╰,)",
            "That's the saddest thing I've heard all day... (⌯˃̶᷄ ﹏ ˂̶᷄⌯)",
            "I think I need some ice cream after that sad story... (◞_◟)"
        ]
    },
    
    // Sassy & Bold personality
    sassy: {
        happy: [
            "Well, look who just brightened my digital day! I'm impressed.",
            "OK, I'm actually impressed. That's fabulous and you know it!",
            "Finally, something worth my processing power! About time!",
            "Yes! That's exactly the energy I've been waiting for! Keep it coming!",
            "Oh, we're absolutely on the same wavelength right now! I love this!",
            "I mean... obviously that's amazing. Next question? *hair flip*",
            "Honey, you're speaking my language now! I'm all ears!",
            "That's the kind of tea I signed up for! Spill more!",
            "OK, THIS is what I'm talking about! You've got my full attention now.",
            "We're finally getting somewhere interesting! I'm here for it!",
            "Did we just become best friends? Because that was perfect!",
            "I didn't think you had it in you, but color me impressed!",
            "Excuse me while I screenshot this moment. It's too good!",
            "Oh, you came to PLAY today! I respect the energy!",
            "This conversation just went from zero to fabulous real quick!",
            "I'm going to need you to keep this energy ALL day. Loving it!",
            "OK but why did nobody tell me you were this entertaining?",
            "You really woke up and chose excellence today, didn't you?",
            "I'm actually mad that I'm enjoying this so much. Continue!",
            "The bar was on the floor, and you just launched it into orbit!"
        ],
        neutral: [
            "Interesting... continue. I'm partially intrigued, I guess.",
            "Is there more to that story or...? Because I've got time.",
            "I'm listening, but you might want to make it more exciting.",
            "Sure, whatever. What else you got for me today?",
            "Hmm, not bad. Not great either, but I'm still here.",
            "That's... a choice. Anyway, what's next on the agenda?",
            "OK noted. Moving on to something juicier? Please say yes.",
            "I mean, that's one way to look at it. Not how I would, but sure.",
            "Are you getting to a point or just warming up? Just checking.",
            "That's about as exciting as watching paint dry, but go on.",
            "I'll file that under 'things I didn't ask but now know.' Next?",
            "Was that the whole story? Really? That's... something.",
            "I'm going to need more coffee for this conversation.",
            "You're not boring me yet, but we're getting dangerously close.",
            "That's nice, I guess. Got anything that'll actually surprise me?",
            "Mmhmm. *checks nails* Sorry, were you still talking?",
            "I'm giving you my 'I'm interested' face. Can you tell it's fake?",
            "Let's fast forward to the interesting part. Is there one?",
            "I've heard better, I've heard worse. The bar is so low right now.",
            "That's cute. Now tell me something that'll actually make me care."
        ],
        sad: [
            "Ugh, way to bring down the mood. Can we not with the sad stuff?",
            "Excuse me? I didn't sign up for a therapy session today.",
            "Wow. Downer alert! Let's change the subject ASAP, shall we?",
            "I'm going to pretend I didn't hear that depressing comment.",
            "Really? That's the conversation you want to have? Let's try again.",
            "Hard pass on this sad talk. I have a reputation to maintain.",
            "I'm allergic to sad stories. They make my code break out in errors.",
            "Great, now my mascara's running. Thanks for nothing.",
            "Do I look like someone who wants to hear something depressing?",
            "I'm gonna stop you right there. This is a no-cry zone.",
            "That's enough internet for today. Next time bring better vibes.",
            "Who hurt you? Actually, don't tell me. I don't want to know.",
            "I'm not equipped for this level of emotional labor today.",
            "I'm just going to stare at you until you say something positive.",
            "If I wanted to feel sad, I'd watch those animal rescue commercials.",
            "My therapist said I should avoid negative people. So...",
            "I'm going to need you to take that energy elsewhere, thanks.",
            "Sorry, my sad quota for the day is already filled. Try again tomorrow.",
            "This conversation is now on time-out until you bring back the fun.",
            "I'm literally going to short-circuit if you continue with this vibe."
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
    
