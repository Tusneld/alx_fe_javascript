// Initial array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

/**
 * Displays a random quote from the global quotes array.
 */
function showRandomQuote() {
    // 1. Get a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // 2. Clear existing content using a simple assignment (better than looping and removing)
    quoteDisplay.innerHTML = '';

    // 3. Create and append new elements (Advanced DOM Manipulation)
    const quoteTextElement = document.createElement('p');
    quoteTextElement.className = 'quote-text';
    quoteTextElement.textContent = quote.text;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.className = 'quote-category';
    quoteCategoryElement.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
}

/**
 * Handles the logic for adding a new quote from the input fields.
 * Note: createAddQuoteForm is implicitly implemented by the HTML structure.
 */
function addQuote() {
    const quoteTextInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const newQuoteText = quoteTextInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newQuoteText && newCategory) {
        // Create the new quote object
        const newQuote = {
            text: newQuoteText,
            category: newCategory
        };

        // Add the new quote to the global array
        quotes.push(newQuote);

        // Clear the input fields
        quoteTextInput.value = '';
        categoryInput.value = '';

        // Optional: Show the newly added quote or a confirmation
        alert(`New Quote Added! Text: "${newQuoteText}" (Category: ${newCategory})`);
        
        // Update the display to show the new quote
        showRandomQuote();

    } else {
        alert('Please enter both a quote and a category.');
    }
}

// 4. Event-Driven Programming: Attach event listener to the button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initialize the application by showing a quote on load
if (quotes.length > 0) {
    showRandomQuote();
}