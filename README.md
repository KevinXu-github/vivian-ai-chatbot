# ABG AI Chatbot

A simple, interactive chatbot with an ABG (Asian Baby Girl) personality built using vanilla JavaScript. The chatbot simulates conversations and changes its avatar based on the detected mood of messages, offering personalized responses that match the ABG aesthetic.

## Features

- **User Interaction**: Send messages to the chatbot and receive personality-driven responses
- **Mood Detection**: The AI detects the mood of your messages using keyword analysis
- **Avatar Changes**: The chatbot's avatar changes based on its current mood (happy, neutral, sad)
- **Human Verification**: Simple happiness-based verification system to prove users are human
- **Multiple Personalities**: Choose between ABG, Cute & Sweet, or Sassy & Bold personality types
- **Dark Mode**: Toggle between light and dark themes
- **Customizable Interface**: Change the chatbot's name and theme colors
- **API Integration**: Optional integration with OpenAI and Hugging Face for more intelligent responses
- **Message History**: Saves conversation history between sessions
- **Responsive Design**: Works well on both desktop and mobile devices

## Project Structure

- `index.html`: The main HTML structure for the chatbot interface
- `styles.css`: CSS styling for the chatbot UI
- `app.js`: JavaScript logic for handling interactions and responses
- `happiness-verification.js`: Contains the human verification system logic
- `openai-api.js`: Integration with OpenAI's API for enhanced responses
- `server.js`: Node.js server for API proxy functionality
- `AvatarImagesGuide.md`: Instructions for creating or sourcing avatar images
- `assets/`: Folder containing avatar images (add these yourself)
  - `happy.png`: Avatar for happy mood
  - `neutral.png`: Avatar for neutral mood
  - `sad.png`: Avatar for sad mood

## Setup Instructions

### Basic Setup (Client-Only Mode)
1. Clone or download this repository
2. Create an `assets` folder in the root directory
3. Add your avatar images to the `assets` folder:
   - `happy.png`
   - `neutral.png`
   - `sad.png`
4. Open `index.html` in a web browser to use the chatbot in client-only mode

### Full Setup (With API Integration)
1. Follow the basic setup steps above
2. Install Node.js if you don't have it already
3. Run `npm install` to install the required dependencies
4. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```
5. Run `npm start` to start the server
6. Open `http://localhost:3000` in your browser

## Customization

### Basic Customization
You can customize the chatbot by:
- Changing the avatar images in the `assets` folder
- Using the built-in settings panel to:
  - Change the chatbot's name
  - Select a different personality type
  - Choose a different theme color
  - Toggle timestamps and dark mode

### Advanced Customization
- Modify the response templates in `app.js` to alter the chatbot's vocabulary
- Adjust the mood keywords in `app.js` to change how the AI detects emotions
- Update the verification system in `happiness-verification.js`
- Customize the styling in `styles.css`
- Modify the server endpoints in `server.js` to use different AI models

## Human Verification System

The chatbot includes a simple verification system that:
1. Asks the user to make Vivian (the chatbot) happy
2. Tracks happiness points when the mood changes from neutral/sad to happy
3. Verifies the user as human after reaching a happiness threshold
4. Shows verification progress through a visual indicator

## API Integration

The chatbot can use external AI services for more intelligent responses:

- **OpenAI**: Configure with your OpenAI API key to use GPT models
- **Hugging Face**: Use DialoGPT and other conversational models as fallbacks
- **Fallback Mechanism**: If API calls fail, the chatbot falls back to template-based responses

## Development Notes

- The chatbot uses local storage to save settings and conversation history
- The verification system prevents double-counting of happiness points
- Multiple personality types provide varied interaction styles
- Server.js includes retry logic and error handling for API calls

## Future Enhancements

- Support for voice input and speech synthesis
- More sophisticated emotion detection using sentiment analysis
- Additional avatar expressions and animations
- User account system for personalized experiences
- Mobile app version using web technologies
- Training interface for customizing responses

## License

This project is available as open source under the terms of the MIT License.