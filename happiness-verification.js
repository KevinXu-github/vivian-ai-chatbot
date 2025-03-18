// happiness-verification.js - Verify humans by making Vivian happy
// Simplified version that uses the chatbot's existing mood detection

// Verification state
const verificationState = {
  isVerified: false,
  verificationStarted: false,
  pendingVerification: false,
  attemptCount: 0,
  maxAttempts: 10,
  happinessLevel: 0,
  happinessThreshold: 3, // Need this many happiness points to verify
  verificationMsg: "Make me happy to prove you're human! Try compliments, jokes, or positive conversation.",
  messageHistory: [],
  previousMood: null // Track previous mood to detect changes
};

// Start verification process
function startVerification() {
  verificationState.verificationStarted = true;
  verificationState.pendingVerification = true;
  verificationState.happinessLevel = 0;
  verificationState.attemptCount = 0;
  verificationState.previousMood = null;
  
  // Add notification element if it doesn't exist
  updateHappinessIndicator();
  
  return verificationState.verificationMsg;
}

// Update the happiness progress bar
function updateHappinessIndicator() {
  const progressBar = document.getElementById('happiness-progress');
  if (progressBar) {
    const percentage = Math.min(100, (verificationState.happinessLevel / verificationState.happinessThreshold) * 100);
    progressBar.style.width = `${percentage}%`;
  }
}

// Process a user response for verification
function processVerificationResponse(message) {
  if (!verificationState.pendingVerification) return { isValidating: false };
  
  // Add to message history
  verificationState.messageHistory.push({
    message: message,
    timestamp: Date.now()
  });
  
  // Check if the message made Vivian happy
  // We'll use the chatbot's mood state which is updated in app.js
  const chatbotMood = window.chatbotState ? window.chatbotState.mood : 'neutral';
  let points = 0;
  let response = "";
  
  // Award points if the chatbot is happy
  if (chatbotMood === 'happy' && verificationState.previousMood !== 'happy') {
    points = 1;
    response = "Yay! You're making me happy! Keep going!";
    console.log("Awarding point for making Vivian happy");
  } else if (chatbotMood === 'happy') {
    // Already happy, encourage them
    response = "I'm feeling happy! Keep the good vibes coming!";
  } else {
    response = "I'm not feeling happier yet. Try saying something nice or fun!";
  }
  
  // Store current mood for next comparison
  verificationState.previousMood = chatbotMood;
  
  // Update happiness level
  verificationState.happinessLevel += points;
  verificationState.attemptCount++;
  
  // Update the happiness indicator
  updateHappinessIndicator();
  
  console.log("Happiness level:", verificationState.happinessLevel, "Threshold:", verificationState.happinessThreshold, "Mood:", chatbotMood);
  
  // Check if user has made Vivian happy enough
  if (verificationState.happinessLevel >= verificationState.happinessThreshold) {
    verificationState.isVerified = true;
    verificationState.pendingVerification = false;
    
    return {
      isValidating: true,
      passed: true,
      message: "OMG you totally made my day! You're definitely human - and awesome! Let's keep chatting!",
      verified: true
    };
  }
  
  // If we've reached max attempts but not verified
  if (verificationState.attemptCount >= verificationState.maxAttempts) {
    verificationState.pendingVerification = false;
    
    return {
      isValidating: true,
      passed: false,
      message: "I'm still not feeling the positive vibes, but let's chat anyway.",
      verified: false // Let them continue even if they fail
    };
  }
  
  // Give feedback based on current progress
  if (points > 0) {
    // If they're getting close to the threshold
    if (verificationState.happinessThreshold - verificationState.happinessLevel <= 1) {
      response += " You're almost there! Keep going!";
    }
  }
  
  return {
    isValidating: true,
    passed: false,
    nextQuestion: response,
    verified: false
  };
}

// Public function for app.js to notify of mood changes
function notifyMoodChange(mood) {
  console.log("Mood change notification received:", mood);
  
  if (verificationState.pendingVerification && !verificationState.isVerified) {
    // Award a point for making Vivian happy
    if (mood === 'happy' && verificationState.previousMood !== 'happy') {
      verificationState.happinessLevel += 1;
      console.log("Happiness point awarded! New level:", verificationState.happinessLevel);
      
      // Update happiness indicator
      updateHappinessIndicator();
      
      // Check if threshold reached
      if (verificationState.happinessLevel >= verificationState.happinessThreshold) {
        verificationState.isVerified = true;
        verificationState.pendingVerification = false;
        console.log("Verification successful!");
      }
    }
    
    // Update previous mood
    verificationState.previousMood = mood;
  }
  
  return verificationState.isVerified;
}
// Check if user is verified
function isUserVerified() {
  return verificationState.isVerified;
}

// Check if verification is in progress
function isVerificationInProgress() {
  return verificationState.pendingVerification;
}

// Reset verification state
function resetVerification() {
  verificationState.isVerified = false;
  verificationState.verificationStarted = false;
  verificationState.pendingVerification = false;
  verificationState.happinessLevel = 0;
  verificationState.attemptCount = 0;
  verificationState.messageHistory = [];
  verificationState.previousMood = null;
  
  // Reset progress bar
  updateHappinessIndicator();
}

// Stub functions to maintain compatibility with existing code
function startTypingTracking() {}
function addTypingEvent() {}

// Export functions to global scope
window.startVerification = startVerification;
window.processVerificationResponse = processVerificationResponse;
window.isUserVerified = isUserVerified;
window.isVerificationInProgress = isVerificationInProgress;
window.resetVerification = resetVerification;
window.startTypingTracking = startTypingTracking;
window.addTypingEvent = addTypingEvent;
window.notifyMoodChange = notifyMoodChange; // Add this to make function available to app.js