// CSV Training System for Vivian AI Chatbot
// This allows bulk training from CSV files

// Function to parse CSV data
function parseCSV(csvText) {
    // Split by lines and filter out empty lines
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 2) {
        throw new Error('CSV must contain at least a header row and one data row');
    }
    
    // Parse header
    const header = lines[0].split(',').map(item => item.trim());
    
    // Check required columns
    const patternIndex = header.indexOf('pattern');
    const responseIndex = header.indexOf('response');
    const personalityIndex = header.indexOf('personality');
    const moodIndex = header.indexOf('mood');
    
    if (patternIndex === -1 || responseIndex === -1) {
        throw new Error('CSV must contain at least "pattern" and "response" columns');
    }
    
    // Parse data rows
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        // Handle quoted fields with commas inside
        const row = parseCSVRow(lines[i]);
        
        if (row.length < Math.max(patternIndex, responseIndex) + 1) {
            console.warn(`Skipping invalid row ${i + 1}: insufficient columns`);
            continue;
        }
        
        const pattern = row[patternIndex].trim();
        const response = row[responseIndex].trim();
        
        if (!pattern || !response) {
            console.warn(`Skipping row ${i + 1}: pattern or response is empty`);
            continue;
        }
        
        const personality = personalityIndex !== -1 && row[personalityIndex] 
            ? row[personalityIndex].trim() 
            : 'abg';
            
        const mood = moodIndex !== -1 && row[moodIndex] 
            ? row[moodIndex].trim() 
            : 'neutral';
        
        // Validate personality
        const validPersonality = ['abg', 'cute', 'sassy'].includes(personality.toLowerCase()) 
            ? personality.toLowerCase() 
            : 'abg';
            
        // Validate mood
        const validMood = ['happy', 'neutral', 'sad'].includes(mood.toLowerCase()) 
            ? mood.toLowerCase() 
            : 'neutral';
        
        results.push({
            pattern,
            response,
            personality: validPersonality,
            mood: validMood
        });
    }
    
    return results;
}

// Helper function to properly parse CSV row with quoted fields
function parseCSVRow(row) {
    const result = [];
    let insideQuotes = false;
    let currentToken = '';
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(currentToken);
            currentToken = '';
        } else {
            currentToken += char;
        }
    }
    
    // Add the last token
    result.push(currentToken);
    
    // Clean up quotes from fields
    return result.map(token => token.replace(/^"(.*)"$/, '$1'));
}

// Function to train from CSV data
function trainFromCSV(csvText) {
    try {
        const trainingData = parseCSV(csvText);
        
        if (trainingData.length === 0) {
            throw new Error('No valid training data found in CSV');
        }
        
        // Group responses by pattern, personality, and mood
        const groupedData = {};
        
        trainingData.forEach(item => {
            const key = `${item.pattern}|${item.personality}|${item.mood}`;
            
            if (!groupedData[key]) {
                groupedData[key] = {
                    pattern: item.pattern,
                    personality: item.personality,
                    mood: item.mood,
                    responses: []
                };
            }
            
            groupedData[key].responses.push(item.response);
        });
        
        // Train each pattern with its responses
        let successCount = 0;
        
        for (const key in groupedData) {
            const item = groupedData[key];
            
            // Call the trainPattern function from training.js
            if (typeof trainPattern === 'function') {
                const success = trainPattern(
                    item.pattern,
                    item.responses,
                    item.personality,
                    item.mood
                );
                
                if (success) {
                    successCount++;
                }
            }
        }
        
        return {
            success: successCount > 0,
            patternsAdded: successCount,
            totalPatterns: Object.keys(groupedData).length
        };
    } catch (error) {
        console.error('Error training from CSV:', error);
        throw error;
    }
}

// Function to import training data from a CSV file
function importCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const csvText = event.target.result;
                const result = trainFromCSV(csvText);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading CSV file'));
        };
        
        reader.readAsText(file);
    });
}

// Function to generate a sample CSV template
function generateCSVTemplate() {
    return 'pattern,response,personality,mood\n' +
           '"Hello there","Hey bestie! What\'s up?","abg","neutral"\n' +
           '"How are you?","I\'m literally thriving today!","abg","happy"\n' +
           '"What\'s your name?","I\'m Vivian, your ABG bestie!","abg","neutral"\n' +
           '"I\'m sad","Aww no! That\'s bringing down the vibe...","abg","sad"';
}

// Function to download the CSV template
function downloadCSVTemplate() {
    const templateContent = generateCSVTemplate();
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vivian_training_template.csv';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Export current training data as CSV
function exportTrainingAsCSV() {
    if (typeof trainingDatabase === 'undefined' || !trainingDatabase.patterns) {
        throw new Error('No training data available');
    }
    
    // Create CSV header
    let csvContent = 'pattern,response,personality,mood\n';
    
    // Add each pattern and its responses
    for (const pattern in trainingDatabase.patterns) {
        const patternData = trainingDatabase.patterns[pattern];
        const personality = patternData.personality;
        const mood = patternData.mood;
        
        // Get responses for this pattern
        const responses = trainingDatabase.responses[personality][mood][pattern];
        
        if (responses && responses.length > 0) {
            // Add each response as a separate row
            responses.forEach(response => {
                // Properly quote fields to handle commas and quotes
                const quotedPattern = `"${pattern.replace(/"/g, '""')}"`;
                const quotedResponse = `"${response.replace(/"/g, '""')}"`;
                
                csvContent += `${quotedPattern},${quotedResponse},${personality},${mood}\n`;
            });
        }
    }
    
    return csvContent;
}

// Function to download the training data as CSV
function downloadTrainingAsCSV() {
    try {
        const csvContent = exportTrainingAsCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vivian_training_export.csv';
        link.click();
        
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error exporting training as CSV:', error);
        return false;
    }
}