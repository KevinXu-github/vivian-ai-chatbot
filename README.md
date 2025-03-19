# ABG AI Chatbot

A modern, interactive chatbot with an ABG (Asian Baby Girl) personality built using vanilla JavaScript. The chatbot analyzes message sentiment, responds with personality-appropriate phrases, and changes its avatar based on detected mood.

![ABG AI Chatbot Screenshot](https://via.placeholder.com/800x400?text=ABG+AI+Chatbot)

## Features

- **Responsive UI**: Clean, mobile-friendly interface with customizable themes
- **Mood Detection**: Analyzes message sentiment to determine happy, neutral, or sad responses
- **Dynamic Avatar**: Avatar changes expression based on detected mood
- **Multiple Personalities**: Choose between ABG, Cute & Sweet, or Sassy & Bold personality types
- **Human Verification**: Simple happiness-based verification system that prompts users to make the chatbot happy
- **Conversation History**: Saves chat history between sessions using localStorage
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Customizable Interface**: Change the chatbot's name, theme colors, and other settings
- **API Integration**: Optional connections to OpenAI GPT and HuggingFace models for enhanced responses
- **Fallback Responses**: Template-based response system when APIs are unavailable

## Project Structure

```
abg-ai-chatbot/
├── assets/                  # Avatar images (to be added by user)
│   ├── happy.png            # Happy mood avatar
│   ├── neutral.png          # Neutral mood avatar
│   └── sad.png              # Sad mood avatar
├── app.js                   # Main application logic
├── happiness-verification.js # Human verification system
├── index.html               # Main HTML structure
├── openai-api.js            # OpenAI API integration
├── server.js                # Node.js server for API proxying
├── styles.css               # CSS styling
├── load-training-data.js    # Training data loader
├── README.md                # Project documentation
├── AvatarImagesGuide.md     # Guide for creating avatars
├── package.json             # Project dependencies
└── .env                     # Environment variables (to be created by user)
```

## Setup Instructions

### Quick Start (Client-Only Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/abg-ai-chatbot.git
   cd abg-ai-chatbot
   ```

2. Create an `assets` folder and add your avatar images:
   - `happy.png` - Avatar with a happy expression
   - `neutral.png` - Avatar with a neutral expression
   - `sad.png` - Avatar with a sad expression

3. Open `index.html` in a web browser to use the chatbot in client-only mode with template responses.

### Full Setup (With API Integration)

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser to use the chatbot with AI-powered responses.

## Human Verification System

The chatbot includes a unique verification system:

1. Users are prompted to make Vivian (the chatbot) happy
2. The system tracks when the user's messages change the chatbot's mood from neutral/sad to happy
3. After accumulating enough "happiness points," the user is verified as human
4. A visual progress bar shows verification progress

## Personality Types

### ABG (Asian Baby Girl)
The default personality with trendy slang, boba references, and a mix of confidence and casualness:
- **Happy**: "Omg yesss! I love that! You're literally serving today!"
- **Neutral**: "Hmm, that's interesting~ Tell me more, I'm kinda curious"
- **Sad**: "Aw, that's kinda sad tbh. I'm not feeling the vibes rn"

### Cute & Sweet
A cutesy, innocent personality with emoticons and gentle speech patterns:
- **Happy**: "Yay! That makes me super duper happy! ♡(ᐢ ᴥ ᐢ)"
- **Neutral**: "Okie dokie! Tell me more, please? (*ᴗ͈ˬᴗ͈)ꕤ"
- **Sad**: "Oh no! That makes me feel a bit sad... (◞‸◟)"

### Sassy & Bold
A confident, witty personality with attitude and directness:
- **Happy**: "Well, look who just brightened my digital day! I'm impressed."
- **Neutral**: "Interesting... continue. I'm partially intrigued, I guess."
- **Sad**: "Ugh, way to bring down the mood. Can we not with the sad stuff?"

## AI Integration

The chatbot uses a tiered approach to generating responses:

1. **OpenAI Integration**: If enabled and API key is provided, uses OpenAI models for intelligent responses
2. **HuggingFace Fallback**: If OpenAI fails or is disabled, falls back to HuggingFace models like DialoGPT
3. **Template Responses**: If both APIs fail, uses predefined template responses based on detected mood

## Customization

### Basic Settings
Access the settings panel by clicking the gear icon:
- Chatbot Name: Change the display name from "Vivian AI"
- Theme Color: Choose from several preset colors
- Personality Type: Select between ABG, Cute, or Sassy personalities
- Dark Mode: Toggle between light and dark themes
- Timestamps: Show/hide message timestamps
- OpenAI API: Enable/disable OpenAI integration

### Advanced Customization
- Modify mood detection keywords in `app.js`
- Edit response templates in the `personalityResponses` object
- Customize the verification system in `happiness-verification.js`
- Adjust styling in `styles.css`

## Training Data

The chatbot includes a training data system that can be loaded via the console:
- Run the browser with the page loaded
- Open the console and load the `load-training-data.js` file
- This populates response templates with predefined patterns

## Development

### Dependencies
- Node.js
- Express.js
- Axios
- OpenAI Node SDK
- dotenv

### Extending the Project
- Add more personality types by extending the `personalityResponses` object
- Enhance mood detection with more sophisticated sentiment analysis
- Add more avatar expressions for a wider range of emotions
- Implement user accounts to save personalized chat experiences

## License

This project is available as open source under the terms of the MIT License.

## Credits

- Font Awesome for icons
- Google Fonts for typography
- OpenAI and HuggingFace for AI models