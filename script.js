"use strict";

// Global array to store all word objects loaded from the data file.
let globalArrayOfWords = [];

/**
 * Data Loading and Processing
 * This section is responsible for fetching the data file, parsing it, and populating the global array with word objects.
 * Each word object contains information about a word's variant, headword, homograph, part of speech, and ID.
 */
async function loadData() {
  const response = await fetch("data/ddo_fullforms_2023-10-11.csv"); // Ensure the file path is correct.
  const rawText = await response.text();
  
  globalArrayOfWords = rawText.split("\n").map(line => {
    const parts = line.split("\t");
    return {
      variant: parts[0],
      headword: parts[1],
      homograph: parts[2],
      partofspeech: parts[3],
      id: parts[4]
    };
  });

  console.log(`Data loaded. Total words: ${globalArrayOfWords.length}`);
}

/**
 * Comparison Function for Binary Search
 * Determines the ordering of words for the binary search algorithm.
 * Returns -1 if the search word comes before the array word, 1 if after, and 0 if equal.
 */
function compare(word, wordObject) {
  if (word < wordObject.variant) return -1;
  if (word > wordObject.variant) return 1;
  return 0;
}

/**
 * Binary Search Algorithm
 * Efficiently searches for a word in the sorted global array of word objects.
 * Uses recursion to divide and conquer, narrowing down the search range with each iteration.
 */
function binarySearch(array, word, start, end) {
  if (start > end) return -1; // Word not found.
  
  let mid = Math.floor((start + end) / 2);
  const result = compare(word, array[mid]);
  
  if (result === 0) return mid; // Word found.
  if (result < 0) return binarySearch(array, word, start, mid - 1); // Search left half.
  else return binarySearch(array, word, mid + 1, end); // Search right half.
}

/**
 * User Interface Interaction
 * Handles the search initiated by the user through the HTML interface.
 * Displays either the search results or a not-found message.
 */
function searchWord() {
  const searchInput = document.getElementById('searchInput');
  const word = searchInput.value.trim(); // Trim whitespace from the input value.
  
  if (word === '') {
    document.getElementById('searchResults').textContent = 'Indtast venligst et ord.';
    return;
  }

  // Performance measurement for binary search
  let startTime = performance.now();
  const index = binarySearch(globalArrayOfWords, word, 0, globalArrayOfWords.length - 1);
  let endTime = performance.now();
  console.log(`Binary search took ${endTime - startTime} milliseconds.`);

  // Performance measurement for .find method
  startTime = performance.now();
  globalArrayOfWords.find(wordObject => wordObject.variant === word);
  endTime = performance.now();
  console.log(`.find method took ${endTime - startTime} milliseconds.`);

  displaySearchResults(index);
}

/**
 * Display Search Results
 * Updates the HTML content to show the results of the search operation.
 */
function displaySearchResults(index) {
  const searchResults = document.getElementById('searchResults');
  if (index !== -1) {
    const { variant, partofspeech } = globalArrayOfWords[index];
    searchResults.innerHTML = `Fundet: <strong>${variant}</strong> (${partofspeech})`;
  } else {
    searchResults.textContent = 'Ord ikke fundet.';
  }
}

// Initialize the data loading when the page is fully loaded.
window.onload = loadData;
