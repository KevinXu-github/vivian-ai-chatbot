// UI-specific code for the Training Panel
// This handles the training interface separate from the core training logic

// DOM Elements for Training UI
const trainingBtn = document.getElementById('training-btn');
const trainingPanel = document.getElementById('training-panel');
const closeTrainingBtn = document.getElementById('close-training');
const patternInput = document.getElementById('pattern-input');
const responseInput = document.getElementById('response-input');
const addResponseBtn = document.getElementById('add-response-btn');
const additionalResponses = document.getElementById('additional-responses');
const currentMoodToggle = document.getElementById('current-mood-toggle');
const moodSelector = document.getElementById('mood-selector');
const moodSelect = document.getElementById('mood-select');
const saveTrainingBtn = document.getElementById('save-training');
const viewPatternsBtn = document.getElementById('view-patterns-btn');
const exportTrainingBtn = document.getElementById('export-training-btn');
const importTrainingBtn = document.getElementById('import-training-btn');
const clearTrainingBtn = document.getElementById('clear-training-btn');
const patternsList = document.getElementById('patterns-list');
const patternsListContent = document.querySelector('.patterns-list-content');

// Additional DOM Elements for CSV functions
const importCSVBtn = document.getElementById('import-csv-btn');
const exportCSVBtn = document.getElementById('export-csv-btn');
const csvTemplateBtn = document.getElementById('csv-template-btn');

// Function to handle CSV import
function handleCSVImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async e => {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }
        
        try {
            // Show loading state
            importCSVBtn.textContent = 'Importing...';
            importCSVBtn.disabled = true;
            
            // Call the importCSVFile function from csv-training.js
            if (typeof importCSVFile === 'function') {
                const result = await importCSVFile(file);
                
                if (result.success) {
                    alert(`Successfully imported ${result.patternsAdded} patterns out of ${result.totalPatterns} from CSV`);
                } else {
                    alert('No patterns were imported from the CSV file');
                }
            } else {
                alert('CSV training system not available');
            }
        } catch (error) {
            console.error('Error importing CSV:', error);
            alert('Error importing CSV: ' + error.message);
        } finally {
            // Reset button
            importCSVBtn.textContent = 'Import CSV';
            importCSVBtn.disabled = false;
        }
    };
    
    input.click();
}

// Function to handle CSV export
function handleCSVExport() {
    try {
        // Call the downloadTrainingAsCSV function from csv-training.js
        if (typeof downloadTrainingAsCSV === 'function') {
            const success = downloadTrainingAsCSV();
            
            if (!success) {
                alert('Failed to export training data as CSV');
            }
        } else {
            alert('CSV training system not available');
        }
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Error exporting CSV: ' + error.message);
    }
}

// Function to get CSV template
function handleCSVTemplate() {
    try {
        // Call the downloadCSVTemplate function from csv-training.js
        if (typeof downloadCSVTemplate === 'function') {
            downloadCSVTemplate();
        } else {
            alert('CSV training system not available');
        }
    } catch (error) {
        console.error('Error downloading CSV template:', error);
        alert('Error downloading CSV template: ' + error.message);
    }
}

// Function to open training panel
function openTrainingPanel() {
    trainingPanel.classList.add('active');
    settingsOverlay.classList.add('active');
    
    // Set mood selector based on current mood
    moodSelect.value = chatbotState.mood;
}

// Function to close training panel
function closeTrainingPanel() {
    trainingPanel.classList.remove('active');
    settingsOverlay.classList.remove('active');
    
    // Reset the form
    resetTrainingForm();
}

// Function to reset the training form
function resetTrainingForm() {
    patternInput.value = '';
    responseInput.value = '';
    additionalResponses.innerHTML = '';
    responseCounter = 0;
    currentMoodToggle.checked = true;
    moodSelector.style.display = 'none';
    patternsList.style.display = 'none';
}

// Function to add a new response input
function addResponseInput() {
    responseCounter++;
    
    const responseItem = document.createElement('div');
    responseItem.className = 'response-item';
    responseItem.innerHTML = `
        <textarea id="response-input-${responseCounter}" rows="2" placeholder="Additional response option"></textarea>
        <button type="button" class="remove-response" data-id="${responseCounter}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    additionalResponses.appendChild(responseItem);
    
    // Add event listener to the remove button
    const removeBtn = responseItem.querySelector('.remove-response');
    removeBtn.addEventListener('click', function() {
        additionalResponses.removeChild(responseItem);
    });
    
    // Focus the new textarea
    responseItem.querySelector('textarea').focus();
}

// Function to toggle mood selector
function toggleMoodSelector() {
    if (currentMoodToggle.checked) {
        moodSelector.style.display = 'none';
    } else {
        moodSelector.style.display = 'block';
    }
}

// Function to save training data
function saveTraining() {
    const pattern = patternInput.value.trim();
    
    if (!pattern) {
        alert('Please enter a pattern');
        patternInput.focus();
        return;
    }
    
    // Get main response
    const mainResponse = responseInput.value.trim();
    if (!mainResponse) {
        alert('Please enter at least one response');
        responseInput.focus();
        return;
    }
    
    // Collect all responses
    const responses = [mainResponse];
    
    // Add additional responses
    const additionalTextareas = additionalResponses.querySelectorAll('textarea');
    additionalTextareas.forEach(textarea => {
        const response = textarea.value.trim();
        if (response) {
            responses.push(response);
        }
    });
    
    // Get personality and mood
    const personality = chatbotState.settings.personality;
    const mood = currentMoodToggle.checked ? chatbotState.mood : moodSelect.value;
    
    // Call the training function
    if (typeof trainPattern === 'function') {
        const success = trainPattern(pattern, responses, personality, mood);
        
        if (success) {
            alert(`Successfully trained Vivian to respond to: "${pattern}"`);
            resetTrainingForm();
        } else {
            alert('Failed to save training data');
        }
    } else {
        alert('Training system not available');
    }
}

// Function to display all trained patterns
function viewPatterns() {
    if (typeof trainingDatabase === 'undefined' || !trainingDatabase.patterns) {
        alert('No training data available');
        return;
    }
    
    const patterns = Object.keys(trainingDatabase.patterns);
    
    if (patterns.length === 0) {
        patternsListContent.innerHTML = '<p>No patterns have been trained yet.</p>';
    } else {
        // Clear previous content
        patternsListContent.innerHTML = '';
        
        // Add each pattern
        patterns.forEach(pattern => {
            const patternData = trainingDatabase.patterns[pattern];
            const personality = patternData.personality;
            const mood = patternData.mood;
            
            const patternItem = document.createElement('div');
            patternItem.className = 'pattern-item';
            patternItem.innerHTML = `
                <div class="pattern-text">"${pattern}" (${personality}/${mood})</div>
                <div class="pattern-actions">
                    <button type="button" class="edit-pattern" data-pattern="${pattern}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-pattern" data-pattern="${pattern}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            patternsListContent.appendChild(patternItem);
            
            // Add event listeners
            const editBtn = patternItem.querySelector('.edit-pattern');
            const deleteBtn = patternItem.querySelector('.delete-pattern');
            
            editBtn.addEventListener('click', function() {
                editPattern(pattern);
            });
            
            deleteBtn.addEventListener('click', function() {
                deletePattern(pattern);
            });
        });
    }
    
    patternsList.style.display = 'block';
}

// Function to edit a pattern
function editPattern(pattern) {
    if (typeof trainingDatabase === 'undefined' || !trainingDatabase.patterns[pattern]) {
        alert('Pattern not found');
        return;
    }
    
    const patternData = trainingDatabase.patterns[pattern];
    const personality = patternData.personality;
    const mood = patternData.mood;
    
    // Get responses
    const responses = trainingDatabase.responses[personality][mood][pattern];
    
    if (!responses || responses.length === 0) {
        alert('No responses found for this pattern');
        return;
    }
    
    // Set form values
    patternInput.value = pattern;
    responseInput.value = responses[0];
    
    // Add additional responses
    additionalResponses.innerHTML = '';
    for (let i = 1; i < responses.length; i++) {
        responseCounter++;
        
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <textarea id="response-input-${responseCounter}" rows="2">${responses[i]}</textarea>
            <button type="button" class="remove-response" data-id="${responseCounter}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        additionalResponses.appendChild(responseItem);
        
        // Add event listener to the remove button
        const removeBtn = responseItem.querySelector('.remove-response');
        removeBtn.addEventListener('click', function() {
            additionalResponses.removeChild(responseItem);
        });
    }
    
    // Set mood
    if (mood === chatbotState.mood) {
        currentMoodToggle.checked = true;
        moodSelector.style.display = 'none';
    } else {
        currentMoodToggle.checked = false;
        moodSelector.style.display = 'block';
        moodSelect.value = mood;
    }
    
    // Hide patterns list
    patternsList.style.display = 'none';
    
    // Remove old pattern after editing
    saveTrainingBtn.setAttribute('data-edit-mode', 'true');
    saveTrainingBtn.setAttribute('data-old-pattern', pattern);
    saveTrainingBtn.textContent = 'Update Training';
}

// Function to delete a pattern
function deletePattern(pattern) {
    if (confirm(`Are you sure you want to delete the pattern: "${pattern}"?`)) {
        if (typeof forgetPattern === 'function') {
            const success = forgetPattern(pattern);
            
            if (success) {
                alert(`Pattern "${pattern}" has been deleted`);
                viewPatterns(); // Refresh the list
            } else {
                alert('Failed to delete pattern');
            }
        } else {
            alert('Training system not available');
        }
    }
}

// Function to export training data
function exportTrainingData() {
    if (typeof trainingDatabase === 'undefined') {
        alert('No training data available');
        return;
    }
    
    try {
        const dataStr = JSON.stringify(trainingDatabase, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportName = 'vivian_training_' + new Date().toISOString().slice(0, 10) + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
        
    } catch (error) {
        console.error('Error exporting training data:', error);
        alert('Failed to export training data');
    }
}

// Function to import training data
function importTrainingData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // Validate data structure
                if (!importedData.patterns || !importedData.responses) {
                    throw new Error('Invalid training data format');
                }
                
                // Confirm import
                if (confirm(`Import ${Object.keys(importedData.patterns).length} patterns? This will merge with existing data.`)) {
                    // Replace training database with imported data
                    Object.assign(trainingDatabase.patterns, importedData.patterns);
                    
                    // Import responses
                    for (const personality in importedData.responses) {
                        for (const mood in importedData.responses[personality]) {
                            if (!trainingDatabase.responses[personality]) {
                                trainingDatabase.responses[personality] = {};
                            }
                            if (!trainingDatabase.responses[personality][mood]) {
                                trainingDatabase.responses[personality][mood] = {};
                            }
                            
                            Object.assign(
                                trainingDatabase.responses[personality][mood],
                                importedData.responses[personality][mood]
                            );
                        }
                    }
                    
                    // Save to localStorage
                    saveTrainingData();
                    
                    alert('Training data imported successfully');
                }
            } catch (error) {
                console.error('Error importing training data:', error);
                alert('Failed to import training data: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Function to clear all training data
function clearAllTrainingData() {
    if (confirm('Are you sure you want to delete ALL training data? This cannot be undone!')) {
        if (confirm('This will reset Vivian to her default state. Really proceed?')) {
            // Initialize empty training database
            trainingDatabase.patterns = {};
            
            for (const personality in trainingDatabase.responses) {
                for (const mood in trainingDatabase.responses[personality]) {
                    trainingDatabase.responses[personality][mood] = {};
                }
            }
            
            // Save to localStorage
            saveTrainingData();
            
            alert('All training data has been reset');
            
            // Hide patterns list
            patternsList.style.display = 'none';
        }
    }
}

// Event Listeners
trainingBtn.addEventListener('click', openTrainingPanel);
closeTrainingBtn.addEventListener('click', closeTrainingPanel);
addResponseBtn.addEventListener('click', addResponseInput);
currentMoodToggle.addEventListener('change', toggleMoodSelector);
saveTrainingBtn.addEventListener('click', saveTraining);
viewPatternsBtn.addEventListener('click', viewPatterns);
exportTrainingBtn.addEventListener('click', exportTrainingData);
importTrainingBtn.addEventListener('click', importTrainingData);
clearTrainingBtn.addEventListener('click', clearAllTrainingData);

// CSV-related event listeners
importCSVBtn.addEventListener('click', handleCSVImport);
exportCSVBtn.addEventListener('click', handleCSVExport);
csvTemplateBtn.addEventListener('click', handleCSVTemplate);