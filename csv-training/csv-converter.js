const fs = require('fs');

// Get the file path from command line argument or use default
const csvFilePath = process.argv[2] || 'vivian-ai-training-data.csv';
console.log(`Attempting to read CSV from: ${csvFilePath}`);

try {
    // Read CSV file
    const csvText = fs.readFileSync(csvFilePath, 'utf8');
    console.log(`Successfully read CSV file (${csvText.length} bytes)`);

    // Parse the CSV with proper handling for quoted fields
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    console.log(`Found ${lines.length} lines in CSV (including header)`);

    // Function to parse a CSV line with quote handling
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current);
        
        // Remove quotes from fields
        return result.map(field => field.replace(/^"|"$/g, '').trim());
    }

    // Parse header to verify column positions
    const header = parseCSVLine(lines[0]);
    console.log('Header:', header);
    
    // Verify expected columns
    const patternIdx = header.indexOf('pattern');
    const responseIdx = header.indexOf('response');
    const personalityIdx = header.indexOf('personality');
    const moodIdx = header.indexOf('mood');
    
    if (patternIdx === -1 || responseIdx === -1 || personalityIdx === -1 || moodIdx === -1) {
        throw new Error(`Required columns missing. Expected: pattern, response, personality, mood. Found: ${header.join(', ')}`);
    }

    // Initialize training database
    const trainingDatabase = {
        patterns: {},
        responses: {
            abg: { happy: {}, neutral: {}, sad: {} },
            cute: { happy: {}, neutral: {}, sad: {} },
            sassy: { happy: {}, neutral: {}, sad: {} }
        }
    };

    // Process each line
    let processedLines = 0;
    
    for (let i = 1; i < lines.length; i++) {
        try {
            const row = parseCSVLine(lines[i]);
            
            // Get values from correct positions
            const pattern = row[patternIdx];
            const response = row[responseIdx];
            let personality = row[personalityIdx];
            let mood = row[moodIdx];
            
            // Validation and debug
            if (!pattern || !response) {
                console.warn(`Warning: Line ${i+1} has missing pattern or response, skipping...`);
                continue;
            }
            
            // Default values if missing
            if (!personality) personality = 'abg';
            if (!mood) mood = 'neutral';
            
            // Normalize values
            const normalizedPattern = pattern.toLowerCase();
            const normalizedPersonality = personality.toLowerCase();
            const normalizedMood = mood.toLowerCase();
            
            // Validate personality and mood
            if (!['abg', 'cute', 'sassy'].includes(normalizedPersonality)) {
                console.warn(`Warning: Row ${i+1} has invalid personality "${personality}", defaulting to "abg"`);
                normalizedPersonality = 'abg';
            }
            
            if (!['happy', 'neutral', 'sad'].includes(normalizedMood)) {
                console.warn(`Warning: Row ${i+1} has invalid mood "${mood}", defaulting to "neutral"`);
                normalizedMood = 'neutral';
            }
            
            // Add to patterns
            trainingDatabase.patterns[normalizedPattern] = {
                personality: normalizedPersonality,
                mood: normalizedMood,
                createdAt: Date.now()
            };
            
            // Add to responses array for this pattern
            if (!trainingDatabase.responses[normalizedPersonality][normalizedMood][normalizedPattern]) {
                trainingDatabase.responses[normalizedPersonality][normalizedMood][normalizedPattern] = [];
            }
            
            trainingDatabase.responses[normalizedPersonality][normalizedMood][normalizedPattern].push(response);
            processedLines++;
            
            // Debug output for some entries
            if (i <= 5 || i >= lines.length - 5) {
                console.log(`Row ${i}: Pattern="${normalizedPattern}", Response="${response}", Personality="${normalizedPersonality}", Mood="${normalizedMood}"`);
            }
        } catch (lineError) {
            console.error(`Error processing line ${i+1}:`, lineError.message);
        }
    }

    // Write to JSON file
    const outputPath = 'vivian-training-data.json';
    fs.writeFileSync(outputPath, JSON.stringify(trainingDatabase, null, 2));
    console.log(`Conversion complete. JSON file saved as ${outputPath}`);
    console.log(`Successfully processed ${processedLines} training patterns out of ${lines.length - 1} total`);
    
    // Create a browser-ready JavaScript file
    const loaderContent = `
// Vivian AI Training Data Loader
// Run this script in the browser console when on the Vivian AI page

// Training data exported from CSV
const trainingData = ${JSON.stringify(trainingDatabase, null, 2)};

// Function to load training data
function loadTrainingData() {
    try {
        // Save to localStorage
        localStorage.setItem('vivianTrainingData', JSON.stringify(trainingData));
        console.log('Training data loaded successfully!');
        console.log(\`Loaded \${Object.keys(trainingData.patterns).length} patterns with responses\`);
        console.log('Refresh the page to see your trained responses.');
        return true;
    } catch (error) {
        console.error('Error loading training data:', error);
        return false;
    }
}

// Execute the function
const result = loadTrainingData();
console.log('Data loading ' + (result ? 'succeeded' : 'failed'));
`;

    fs.writeFileSync('load-training-data.js', loaderContent);
    console.log('Created browser-ready loader file: load-training-data.js');
    
    // For convenience, also create an HTML loader file
    const htmlLoaderContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vivian AI Training Loader</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #ff6b9d;
            border-bottom: 2px solid #ff6b9d;
            padding-bottom: 10px;
        }
        .instructions {
            background: #f8f8f8;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        button {
            background: #ff6b9d;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #ff4b8d;
        }
        #status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            display: none;
        }
        .success {
            background: #e7f7e7;
            color: #28a745;
            border: 1px solid #28a745;
        }
        .error {
            background: #fae7e7;
            color: #dc3545;
            border: 1px solid #dc3545;
        }
        .code {
            font-family: monospace;
            background: #f1f1f1;
            padding: 2px 5px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <h1>Vivian AI Training Data Loader</h1>
    
    <div class="instructions">
        <h2>Instructions</h2>
        <ol>
            <li>Open your Vivian AI Chatbot in another tab</li>
            <li>Click the "Load Training Data" button below</li>
            <li>Switch to your Vivian AI tab</li>
            <li>Refresh the page to apply the training</li>
        </ol>
        <p><strong>Note:</strong> This will work only when both this page and your Vivian AI Chatbot page are open in the <em>same browser</em>.</p>
    </div>
    
    <button id="loadButton">Load Training Data</button>
    
    <div id="status"></div>

    <script>
        // Training data exported from CSV
        const trainingData = ${JSON.stringify(trainingDatabase)};

        document.getElementById('loadButton').addEventListener('click', function() {
            const statusDiv = document.getElementById('status');
            try {
                // Save to localStorage
                localStorage.setItem('vivianTrainingData', JSON.stringify(trainingData));
                
                statusDiv.className = 'success';
                statusDiv.innerHTML = '<strong>Success!</strong> Training data loaded successfully.<br><br>' + 
                                    \`Loaded \${Object.keys(trainingData.patterns).length} patterns with responses.<br><br>\` +
                                    'Now go to your Vivian AI tab and refresh the page to apply the training.';
                statusDiv.style.display = 'block';
            } catch (error) {
                statusDiv.className = 'error';
                statusDiv.innerHTML = '<strong>Error!</strong> Failed to load training data: ' + error.message + '<br><br>' +
                                     'Make sure you have your Vivian AI page open in another tab of the same browser.';
                statusDiv.style.display = 'block';
                console.error('Error loading training data:', error);
            }
        });
    </script>
</body>
</html>
    `;
    
    fs.writeFileSync('training-loader.html', htmlLoaderContent);
    console.log('Created HTML loader file: training-loader.html');
    
    console.log('\nTo use this data, you have 3 options:');
    console.log('\nOption 1: Direct Console Method');
    console.log('1. Open your Vivian AI chatbot in a browser');
    console.log('2. Open the browser console (F12 or right-click > Inspect > Console)');
    console.log('3. Copy and paste the contents of load-training-data.js into the console');
    console.log('4. Press Enter and refresh the page');
    
    console.log('\nOption 2: HTML Loader Method');
    console.log('1. Open your Vivian AI chatbot in a browser tab');
    console.log('2. Open training-loader.html in another tab of the SAME browser');
    console.log('3. Click the "Load Training Data" button');
    console.log('4. Go back to your Vivian AI tab and refresh the page');
    
    console.log('\nOption 3: localStorage Method');
    console.log('1. Open your Vivian AI chatbot in a browser');
    console.log('2. Open the browser console (F12)');
    console.log('3. Run this command:');
    console.log('   localStorage.setItem("vivianTrainingData", JSON.stringify(' + 
                'require("./vivian-training-data.json")' + '))');
    console.log('4. Refresh the page');
    
} catch (error) {
    console.error('Error processing CSV file:', error.message);
    console.log('\nUsage:');
    console.log('node final-csv-converter.js [path-to-csv-file]');
}