# The Empathy Test: A Human Verification Challenge

This project demonstrates a novel approach to human verification. Instead of traditional CAPTCHAs, it challenges a user to prove they are human by holding a positive, empathetic conversation with a conversational AI.

![Chatbot Screenshot](./screenshots/chatbot-screenshot.png)

## The Core Concept: Verification Through Conversation

This system moves beyond simple puzzle-solving and explores a more natural, engaging verification method. The goal is to "cheer up" an AI that starts the conversation feeling bored or down.

This approach is designed to:
- **Feel Natural**: The test is framed as a simple conversation rather than an arbitrary task.
- **Engage the User**: It encourages positive and thoughtful interaction from the very beginning.
- **Provide a Unique Challenge**: It requires nuanced communication skills that are difficult for simple bots to simulate.
- **Teach AI Interaction**: It subtly teaches users how to interact effectively with an emotionally responsive AI.

The core verification logic is handled in `happiness-verification.js`, which tracks emotional state changes and awards points toward successful verification.

## How It Works

The verification process is straightforward and transparent to the user.

1.  **The Challenge**: The user is greeted by an AI assistant who is feeling down. The initial prompt makes the goal clear: cheer the AI up to prove you're human.
2.  **Emotional Progress**: The system analyzes the user's messages for positive keywords and sentiment.
3.  **Earning Points**: A "happiness point" is awarded when a user's message causes a positive shift in the AI's mood (e.g., from `sad` to `happy`). This is tracked via a `happinessLevel` that must reach a `happinessThreshold`.
4.  **Visual Feedback**: A progress bar in the UI shows the user how close they are to passing the test.
5.  **Passing the Test**: Once the `happinessThreshold` is met, the user is successfully verified.

## Features

- **Dynamic Emotional State**: The AI's mood and avatar change in real-time based on the conversation's tone.
- **Real-time Verification Progress**: The UI provides instant feedback on the user's progress toward verification.
- **Conversation-Based Challenge**: The core mechanic relies on natural language and empathy.
- **Optional OpenAI Integration**: The app can be connected to a backend to provide more dynamic, generative responses via the OpenAI API.
- **Local Fallback System**: If API connections are unavailable, the chatbot seamlessly falls back to a set of pre-defined responses to ensure a consistent experience.

## Project Structure

This is the file structure for the project:
- `empathy-test/`
  - `assets/`: Contains avatar images for different emotional states.
  - `happiness-verification.js`: Core verification system implementation.
  - `app.js`: Main chatbot logic and mood detection.
  - `index.html`: UI structure with verification components.
  - `openai-api.js`: Optional AI integration for enhanced responses.
  - `server.js`: Node.js server for handling API connections.


## Setup Instructions

### Quick Start (Local Fallback Mode)

1.  Clone the repository.
2.  Create an `assets` folder and add avatar images: `happy.png`, `neutral.png`, and `sad.png`.
3.  Open `index.html` in a modern web browser.

### Full Setup (With AI-Enhanced Responses)

1.  Install Node.js dependencies: `npm install`
2.  Create a `.env` file in the root directory and add your `OPENAI_API_KEY`.
3.  Start the server: `npm start`
4.  Open `http://localhost:3000` in your browser.

## Customization

The verification system can be easily customized:
- **Difficulty Level**: Adjust the `happinessThreshold` value in `happiness-verification.js` to require more positive interactions.
- **Mood Keywords**: Modify the `moodKeywords` object in `app.js` to change how the AI detects emotions.
- **Dialogue**: Change the chatbot's responses in the `personalityResponses` object in `app.js`.