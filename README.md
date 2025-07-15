# Mia: A Conversational AI Companion

This project features Mia, a conversational AI companion with a dynamic personality. The primary goal is to create a natural, engaging chat experience where the user's conversation directly impacts the AI's mood.

It also includes a unique proof-of-concept for human verification, where users can "pass a test" simply by having a positive conversation and making Mia happy.

![Chatbot Screenshot](./screenshots/chatbot-screenshot.png)

## The Core Concept: A Dynamic Personality

Mia is designed to feel more like a person than a simple bot. The AI's mood shifts from sad, to neutral, to happy based on the user's input, creating a more realistic and interactive experience.

- **Dynamic Mood**: Mia's avatar and responses change in real-time to reflect its emotional state.
- **Engaging Interaction**: The user is encouraged to have a positive and thoughtful conversation.
- **Implicit Verification**: The project includes a background verification system that authenticates the user once they've made Mia happy, demonstrating a seamless, CAPTCHA-free alternative.

## How It Works

1.  **Initial State**: The user is greeted by Mia, who is feeling bored or down.
2.  **Conversation**: The user chats with Mia. The system analyzes messages for positive keywords and sentiment.
3.  **Mood Shift**: A positive conversation will improve Mia's mood. When the mood shifts from `sad` or `neutral` to `happy`, a `happinessLevel` point is awarded.
4.  **Verification**: Once the `happinessThreshold` is met, the user is seamlessly verified in the background.

## Project Structure

This is the file structure for the project:
- `mia-chatbot/`
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
2.  Create a `.env` file and add your `OPENAI_API_KEY`.
3.  Start the server: `npm start`
4.  Open `http://localhost:3000` in your browser.