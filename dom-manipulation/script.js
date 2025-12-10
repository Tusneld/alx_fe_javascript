// --- Global Variables and Constants ---
let quotes = []; // This will be populated by loadQuotes()
const LOCAL_STORAGE_KEY = 'quotesData';
const LAST_FILTER_KEY = 'lastCategoryFilter'; // Key for the filter persistence

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
// Check 1: categoryFilter variable is defined and fetches the element
const categoryFilter = document.getElementById('categoryFilter'); 


/**
 * Saves the current quotes array to Local Storage.
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
         // Initial quotes if nothing is stored
         quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Value" }
        ];
        saveQuotes(); 
    }
    
    // Check 6: Restoring the last selected category when the page loads
    const lastFilter = localStorage.getItem(LAST_FILTER_KEY);
    if (lastFilter && categoryFilter) {
        // We attempt to set the value. If the category hasn't been populated yet, it will be done after populateCategories runs.
        categoryFilter.value = lastFilter;
    }
}

/**
 * Check 2 & 3: Extracts unique categories using map and populates the filter dropdown.
 */
function populateCategories() {
    const categories = ['all']; // Start with 'All Categories'
    
    // Extract unique categories using map and Set
    const uniqueCategories = new Set(quotes.map(quote => quote.category));
    uniqueCategories.forEach(cat => categories.push(cat));

    categoryFilter.innerHTML = ''; // Clear existing options

    // Populate the select element
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : 
            category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Re-apply the last selected filter after populating options
    const lastFilter = localStorage.getItem(LAST_FILTER_KEY);
    if (lastFilter && categoryFilter.querySelector(`option[value="${lastFilter}"]`)) {
        categoryFilter.value = lastFilter;
    }
}


/**
 * Check 4 & 5: Filters the displayed quotes based on the selected category.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    
    // Check 7: Saving the selected category to local storage
    localStorage.setItem(LAST_FILTER_KEY, selectedCategory); 
    
    // Logic to filter and update the displayed quotes
    const filteredQuotes = selectedCategory === 'all' ? 
        quotes : 
        quotes.filter(quote => quote.category === selectedCategory);
        
    quoteDisplay.innerHTML = '';
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the category: <strong>${selectedCategory}</strong>.</p>`;
        return;
    }
    
    // Display all filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteContainer = document.createElement('div');
        quoteContainer.style.marginBottom = '15px'; 
        
        const quoteTextElement = document.createElement('p');
        quoteTextElement.className = 'quote-text';
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
 * Displays a random quote from the currently filtered set of quotes.
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
 * Handles the logic for adding a new quote.
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
        populateCategories(); // Update categories list
        
        quoteTextInput.value = '';
        categoryInput.value = '';

        alert(`New Quote Added and Saved Locally!`);
        filterQuotes(); // Refresh the display

    } else {
        alert('Please enter both a quote and a category.');
    }
}

// --- JSON Data Import/Export Functions (Simplified) ---

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
    // filterQuotes is attached via the HTML 'onchange' attribute.

    // 4. Display quotes filtered by the persistent filter on load
    filterQuotes();
});
