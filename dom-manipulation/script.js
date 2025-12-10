// Initial array of quote objects - will be overridden by localStorage if data exists.
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" }
];

const LOCAL_STORAGE_KEY = 'quotesData';
const SESSION_STORAGE_KEY = 'lastViewedQuote'; // For session storage demo

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');


/**
 * Saves the current quotes array to Local Storage.
 */
function saveQuotes() {
    // Stringify the JavaScript array and save it
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

/**
 * Loads quotes from Local Storage on application startup.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript array
        quotes = JSON.parse(storedQuotes);
    }
    // If local storage is empty, the initial array is used.
}

/**
 * Displays a random quote from the global quotes array.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        // Optional: clear session storage if no quotes are left
        sessionStorage.removeItem(SESSION_STORAGE_KEY); 
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = ''; // Clear existing content

    const quoteTextElement = document.createElement('p');
    quoteTextElement.className = 'quote-text';
    quoteTextElement.textContent = quote.text;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.className = 'quote-category';
    quoteCategoryElement.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
    
    // **Using Session Storage (Optional Step 1 Demo)**
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

/**
 * Handles the logic for adding a new quote, and saves the updated array.
 */
function addQuote() {
    const quoteTextInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const newQuoteText = quoteTextInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newQuoteText && newCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newCategory
        };

        quotes.push(newQuote);

        // **Update Local Storage**
        saveQuotes(); 

        // Clear the input fields
        quoteTextInput.value = '';
        categoryInput.value = '';

        alert(`New Quote Added and Saved Locally!`);
        showRandomQuote();

    } else {
        alert('Please enter both a quote and a category.');
    }
}

// --- JSON Data Import/Export Functions ---

/**
 * Exports all quotes to a downloadable JSON file.
 */
function exportJsonFile() {
    // 1. Convert the quotes array to a JSON string
    const jsonString = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing

    // 2. Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 3. Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // 4. Create a temporary anchor element for download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json'; 

    // 5. Programmatically click the link to trigger the download
    document.body.appendChild(a);
    a.click();
    
    // 6. Clean up the temporary URL and element
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Reads and imports quotes from a selected JSON file.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
        try {
            // Parse the imported JSON string
            const importedQuotes = JSON.parse(e.target.result);
            
            // Basic validation: ensure it's an array of objects with required properties
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                
                // Add imported quotes to the existing array (merging)
                quotes.push(...importedQuotes);
                
                // **Save updated array to Local Storage**
                saveQuotes();
                
                alert(`Successfully imported ${importedQuotes.length} quotes!`);
                showRandomQuote();
            } else {
                alert('Invalid JSON file format. Expected an array of quote objects.');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    
    // Read the selected file as text
    if (event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0]);
    }
}

// --- Initialization ---

// 1. Load quotes from Local Storage immediately
loadQuotes();

// 2. Attach event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// 3. Attach event listener to the Export button (requires HTML update)
//    We will initialize the rest of the app after DOM is ready

// 4. Display a quote on load
if (quotes.length > 0) {
    showRandomQuote();
}
