# ABG AI Chatbot

A simple, interactive chatbot with an ABG (Asian Baby Girl) personality built using vanilla JavaScript. The chatbot simulates conversations and changes its avatar based on the detected mood.

## Features

- **User Interaction**: Send messages to the chatbot and receive responses
- **Mood Detection**: The AI detects the mood of your messages using keyword analysis
- **Avatar Changes**: The chatbot's avatar changes based on its current mood (happy, neutral, sad)
- **Responsive Design**: Works well on both desktop and mobile devices

## Project Structure

- `index.html`: The main HTML structure for the chatbot interface
- `styles.css`: CSS styling for the chatbot UI
- `app.js`: JavaScript logic for handling interactions and responses
- `assets/`: Folder containing avatar images (add these yourself)
  - `happy.png`: Avatar for happy mood
  - `neutral.png`: Avatar for neutral mood
  - `sad.png`: Avatar for sad mood

## Setup Instructions

1. Clone or download this repository
2. Create an `assets` folder in the root directory
3. Add your avatar images to the `assets` folder:
   - `happy.png`
   - `neutral.png`
   - `sad.png`
4. Open `index.html` in a web browser to use the chatbot

## Customization

You can customize the chatbot by:

- Changing the avatar images in the `assets` folder
- Modifying the response templates in `app.js`
- Adjusting the mood keywords in `app.js`
- Updating the colors and styling in `styles.css`

## Future Enhancements

- Integration with AI backends (like GPT-3/4) for more intelligent responses
- More sophisticated emotion detection
- Additional avatar expressions and animations
- User customization options
- Message history storage

## License

This project is available as open source under the terms of the MIT License.