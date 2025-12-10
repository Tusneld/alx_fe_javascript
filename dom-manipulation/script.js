// --- Global Variables and Constants ---
let quotes = []; // Local state of quotes
const LOCAL_STORAGE_KEY = 'quotesData';
const LAST_FILTER_KEY = 'lastCategoryFilter'; 
const SERVER_QUOTES_KEY = 'serverQuotesData'; // Used internally for simulation

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatusDisplay = document.getElementById('syncStatus');


// --- Core Data Management Functions ---

/**
 * Saves the current local quotes array to Local Storage.
 */
function saveQuotes() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

/**
 * Loads quotes and the last selected filter from Local Storage.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
         // Initial quotes (Task 0 quotes restored)
         quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Value" }
        ];
        saveQuotes(); 
    }
    
    // Load Last Filter
    const lastFilter = localStorage.getItem(LAST_FILTER_KEY);
    if (lastFilter && categoryFilter) {
        categoryFilter.value = lastFilter;
    }
}


// --- Filtering and DOM Manipulation ---

/**
 * Extracts unique categories and populates the filter dropdown.
 */
function populateCategories() {
    const categories = ['all'];
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    uniqueCategories.forEach(cat => categories.push(cat));

    categoryFilter.innerHTML = ''; 
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : 
            category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    const lastFilter = localStorage.getItem(LAST_FILTER_KEY);
    if (lastFilter && categoryFilter.querySelector(`option[value="${lastFilter}"]`)) {
        categoryFilter.value = lastFilter;
    }
}

/**
 * Filters and updates the displayed quotes based on the selected category.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem(LAST_FILTER_KEY, selectedCategory); 
    const filteredQuotes = selectedCategory === 'all' ? 
        quotes : 
        quotes.filter(quote => quote.category === selectedCategory);
        
    quoteDisplay.innerHTML = '';
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the category: <strong>${selectedCategory}</strong>.</p>`;
        return;
    }
    
    filteredQuotes.forEach(quote => {
        const quoteContainer = document.createElement('div');
        quoteContainer.style.marginBottom = '15px';
        const quoteTextElement = document.createElement('p');
        quoteTextElement.className = 'quote-text';
        // Removed internal 'Local Quote' label from text
        quoteTextElement.textContent = `"${quote.text}"`; 
        const quoteCategoryElement = document.createElement('span');
        quoteCategoryElement.className = 'quote-category';
        quoteCategoryElement.textContent = `Category: ${quote.category}`;
        quoteContainer.appendChild(quoteTextElement);
        quoteContainer.appendChild(quoteCategoryElement);
        quoteDisplay.appendChild(quoteContainer);
    });
}

/**
 * Displays a random quote from the currently filtered set.
 */
function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const availableQuotes = selectedCategory === 'all' ? 
        quotes : 
        quotes.filter(quote => quote.category === selectedCategory);
        
    if (availableQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available in ${selectedCategory} category. Add one!</p>`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const quote = availableQuotes[randomIndex];

    quoteDisplay.innerHTML = '';

    const quoteTextElement = document.createElement('p');
    quoteTextElement.className = 'quote-text';
    quoteTextElement.textContent = `"${quote.text}"`;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.className = 'quote-category';
    quoteCategoryElement.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
}

/**
 * Handles the logic for adding a new quote locally.
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
        saveQuotes(); 
        populateCategories();

        quoteTextInput.value = '';
        categoryInput.value = '';

        // Cleaned up alert message
        alert(`New Quote Added Locally! Click 'Sync' to check for server updates.`); 
        filterQuotes();

    } else {
        alert('Please enter both a quote and a category.');
    }
}


// --- Server Syncing and Conflict Resolution ---

/**
 * Simulates an external change to the server data for testing conflict resolution.
 */
function simulateServerUpdate() {
    const currentServerQuotes = localStorage.getItem(SERVER_QUOTES_KEY);
    let serverQuotes = currentServerQuotes ? JSON.parse(currentServerQuotes) : [];
    
    const newServerQuote = { 
        // Removed 'Server Update' label from text
        text: `New quote added externally at ${new Date().toLocaleTimeString()}`, 
        category: "External" 
    };

    serverQuotes.push(newServerQuote);
    localStorage.setItem(SERVER_QUOTES_KEY, JSON.stringify(serverQuotes));
    
    if (!currentServerQuotes) {
        localStorage.setItem(SERVER_QUOTES_KEY, JSON.stringify([
            { text: "Server Base Quote: Data consistency is key.", category: "Sync" }
        ]));
    }
    
    // Optional: Add a conflicting quote locally that will be overwritten (Server precedence)
    quotes.push({ text: "A conflict will be resolved by the server.", category: "Conflict" });
    saveQuotes();
    
    alert('Simulated a new quote being added to the server data and created a local conflict.');
}

/**
 * Simulates fetching data and implements conflict resolution (Server Precedence).
 */
function syncQuotes() {
    syncStatusDisplay.style.display = 'block';
    syncStatusDisplay.textContent = 'Syncing... Fetching external updates...';
    
    setTimeout(() => {
        
        // Step 1: Simulate Fetching Server Data
        const mockServerData = localStorage.getItem(SERVER_QUOTES_KEY);
        let serverQuotes = mockServerData ? JSON.parse(mockServerData) : [];

        if (serverQuotes.length === 0) {
            // Initial server state
            serverQuotes = [
                { text: "Time to update your local data.", category: "Sync" },
                { text: "Never trust the client side!", category: "Security" }
            ];
            localStorage.setItem(SERVER_QUOTES_KEY, JSON.stringify(serverQuotes));
        }
        
        // Step 2 & 3: Implement Conflict Resolution (Server Precedence)
        let newQuotesAdded = 0;
        let localQuotesMap = new Map();
        
        // Use a map to track existing local quotes for comparison
        quotes.forEach(q => {
            const key = `${q.text.trim()}|${q.category.trim()}`;
            localQuotesMap.set(key, q);
        });
        
        // Iterate through server quotes and add unique ones to local quotes
        serverQuotes.forEach(serverQuote => {
            const key = `${serverQuote.text.trim()}|${serverQuote.category.trim()}`;
            
            if (!localQuotesMap.has(key)) {
                quotes.push(serverQuote);
                newQuotesAdded++;
            }
        });

        let totalQuotes = quotes.length;

        // Step 3: Update Local State and UI Notification
        saveQuotes();
        populateCategories();
        filterQuotes();

        syncStatusDisplay.textContent = 
            `✅ Sync Complete. ${newQuotesAdded} new quote(s) downloaded from server. Total quotes: ${totalQuotes}`;

        // Clear notification after a delay
        setTimeout(() => {
            syncStatusDisplay.style.display = 'none';
        }, 5000);

    }, 1000); 
}


// --- JSON Data Import/Export Functions ---

function exportJsonFile() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories(); 
                alert(`Successfully imported ${importedQuotes.length} quotes!`);
                filterQuotes();
            } else {
                alert('Invalid JSON file format. Expected an array of quote objects.');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    
    if (event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0]);
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load quotes and the last filter setting
    loadQuotes();

    // 2. Populate the category dropdown
    populateCategories();

    // 3. Attach event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    
    // 4. Display quotes filtered by the persistent filter on load
    filterQuotes();
});
