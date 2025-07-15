# Mia - Emotion-Based Human Verification Chatbot

A friendly chatbot that verifies users are human by detecting positive emotional engagement in conversation. Users must make Mia happy through positive, engaging messages to complete verification.

## Features

- 🎭 **3 Personality Modes**: Friendly & Warm, Cheerful & Bubbly, Supportive & Caring
- 😊 **Emotion Detection**: Real-time analysis of message sentiment
- 🎨 **Customizable Interface**: Multiple color themes and dark mode
- 💬 **Smart Responses**: OpenAI integration with fallback templates
- 📊 **Visual Progress Tracking**: See your verification progress in real-time
- 💾 **Conversation History**: Saves chat between sessions

## How It Works

1. Users chat with Mia
2. The system analyzes emotional tone of messages
3. Positive interactions that make Mia happy increase verification score
4. Users are verified after reaching the happiness threshold

## Quick Start

### Basic Setup (No API Required)

1. Clone the repository
2. Open `index.html` in a web browser
3. Start chatting with Mia!

### Full Setup (With AI Responses)

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
OPENAI_API_KEY=your_key_here
```

3. Run the server:
```bash
npm start
```

4. Open http://localhost:3000

## Technology Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- Backend: Node.js, Express
- AI: OpenAI API (optional)
- Storage: LocalStorage for chat history

## Configuration

You can customize Mia through the settings panel:
- Change personality type
- Select color theme
- Toggle dark mode
- Enable/disable timestamps
- Rename the chatbot
