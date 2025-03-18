// happiness-verification.js - Verify humans by making Vivian happy

// Verification state
window.verificationState = {
  isVerified: false,
  verificationStarted: false,
  pendingVerification: false,
  attemptCount: 0,
  maxAttempts: 10,
  happinessLevel: 0,
  happinessThreshold: 3, // Need this many happiness points to verify
  verificationMsg: "Make me happy to prove you're human! Try compliments, jokes, or positive conversation.",
  messageHistory: [],
  previousMood: null, // Track previous mood to detect changes
  lastHappinessUpdate: 0, // Timestamp of last happiness update to prevent duplicates
  pendingPointAward: false // Flag to track if a point is pending award
};

// Start verification process
function startVerification() {
  verificationState.verificationStarted = true;
  verificationState.pendingVerification = true;
  verificationState.happinessLevel = 0;
  verificationState.attemptCount = 0;
  verificationState.previousMood = null;
  verificationState.lastHappinessUpdate = 0;
  verificationState.pendingPointAward = false;
  
  // Add notification element if it doesn't exist
  updateHappinessIndicator();
  
  console.log("Verification started. Initial state:", JSON.stringify({
    happinessLevel: verificationState.happinessLevel,
    threshold: verificationState.happinessThreshold,
    pendingVerification: verificationState.pendingVerification
  }));
  
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

// ★ IMPORTANT: This is now the ONLY function that should update happiness level ★
function awardHappinessPoint() {
  // Prevent duplicate awards within a short time period (1 second debounce)
  const now = Date.now();
  if (now - verificationState.lastHappinessUpdate < 1000) {
    console.log("Debouncing happiness point award - too soon after last award");
    return false;
  }
  
  // Update happiness level
  verificationState.happinessLevel += 1;
  verificationState.lastHappinessUpdate = now;
  verificationState.pendingPointAward = false;
  
  console.log("⭐ HAPPINESS POINT AWARDED! New level:", verificationState.happinessLevel);
  
  // Update the UI
  updateHappinessIndicator();
  
  // Check if verification threshold reached
  if (verificationState.happinessLevel >= verificationState.happinessThreshold) {
    verificationState.isVerified = true;
    verificationState.pendingVerification = false;
    console.log("✅ Verification successful!");
  }
  
  return true;
}

// Process a user response for verification
function processVerificationResponse(message) {
  if (!verificationState.pendingVerification) return { isValidating: false };
  
  console.log("Processing verification response for message:", message);
  
  // Add to message history
  verificationState.messageHistory.push({
    message: message,
    timestamp: Date.now()
  });
  
  // Check if the message made Vivian happy
  const chatbotMood = window.chatbotState ? window.chatbotState.mood : 'neutral';
  let response = "";
  
  console.log("Current mood:", chatbotMood, "Previous mood:", verificationState.previousMood);
  
  // IMPORTANT: Do NOT award points here directly!
  // Instead, set a flag for notifyMoodChange to handle
  if (chatbotMood === 'happy' && verificationState.previousMood !== 'happy') {
    console.log("Happy mood detected during verification response processing");
    verificationState.pendingPointAward = true;
    response = "Yay! You're making me happy! Keep going!";
  } else if (chatbotMood === 'happy') {
    // Already happy, encourage them
    response = "I'm feeling happy! Keep the good vibes coming!";
  } else {
    response = "I'm not feeling happier yet. Try saying something nice or fun!";
  }
  
  // Update verification status
  verificationState.attemptCount++;
  
  console.log("After processing - Happiness level:", verificationState.happinessLevel, 
              "Attempts:", verificationState.attemptCount, 
              "Pending award:", verificationState.pendingPointAward);
  
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
  
  // Store current mood for next comparison - but don't overwrite it if
  // notifyMoodChange has already been called (racing condition)
  if (!verificationState.pendingPointAward) {
    verificationState.previousMood = chatbotMood;
  }
  
  // Give feedback based on current progress
  if (verificationState.happinessThreshold - verificationState.happinessLevel <= 1) {
    response += " You're almost there! Keep going!";
  }
  
  return {
    isValidating: true,
    passed: false,
    nextQuestion: response,
    verified: false
  };
}

// This gets called from app.js's updateMoodDisplay function
function notifyMoodChange(mood) {
  console.log("📣 Mood change notification received:", mood, 
              "Previous mood:", verificationState.previousMood,
              "Pending verification:", verificationState.pendingVerification);
  
  if (verificationState.pendingVerification && !verificationState.isVerified) {
    // Award a point for making Vivian happy
    if (mood === 'happy' && verificationState.previousMood !== 'happy') {
      console.log("Happy mood change detected! Awarding point...");
      // Use the centralized point awarding function
      awardHappinessPoint();
    } else if (verificationState.pendingPointAward && mood === 'happy') {
      // Handle the case where processVerificationResponse detected happiness first
      console.log("Processing pending happiness point award...");
      awardHappinessPoint();
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
  verificationState.lastHappinessUpdate = 0;
  verificationState.pendingPointAward = false;
  
  // Reset progress bar
  updateHappinessIndicator();
  
  console.log("Verification reset to initial state");
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

// Auto-start verification when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
      console.log("Auto-starting verification process");
      window.startVerification();
  }, 500); // Short delay to ensure everything else is loaded first
});