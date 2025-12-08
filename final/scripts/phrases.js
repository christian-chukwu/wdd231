/* Phrases Page Script - Fetch and display French phrases with filtering */

import { initializeNavigation, initializeFooter, setActiveNav } from './navigation.js';
import { fetchData, handleFetchError } from './dataFetcher.js';
import { saveToStorage, getFromStorage, updateLearningProgress } from './storage.js';
import { renderPhraseItems, attachItemClickHandlers, removeLoadingState } from './renderer.js';
import { openModal, closeModal, setupModalHandlers, createModalContent } from './modal.js';
import { filterByProperty, sortAlphabetically, getUniqueValues } from './arrayUtils.js';

let allPhrases = [];
let filteredPhrases = [];

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();
  initializeFooter();
  setActiveNav('phrases.html');

  const container = document.getElementById('phrases-list');
  const categoryFilter = document.getElementById('category-filter');
  const saveProgressBtn = document.getElementById('save-progress-btn');
  const modal = document.getElementById('phrase-modal');

  setupModalHandlers(modal);

  try {
    // Fetch phrases data with async/await and error handling
    allPhrases = await fetchData('./data/phrases.json');
    filteredPhrases = [...allPhrases];

    // Remove loading indicator
    removeLoadingState(container);

    // Populate category filter dynamically
    populateCategoryFilter();

    // Render initial phrases
    renderPhraseItems(filteredPhrases, container);

    // Setup event listeners for filtering
    categoryFilter?.addEventListener('change', () => {
      applyFiltersAndSort();
    });

    // Setup save progress button
    saveProgressBtn?.addEventListener('click', saveProgress);

    // Setup phrase item click handlers
    attachItemClickHandlers(container, (item) => {
      const itemId = parseInt(item.getAttribute('data-id'));
      const phraseItem = allPhrases.find(p => p.id === itemId);

      if (phraseItem) {
        updateLearningProgress('phrases', itemId);
        const modalContent = createModalContent(phraseItem, 'phrases');
        openModal(modal, phraseItem.phrase, modalContent);
      }
    });

  } catch (error) {
    handleFetchError(error, container);
  }
});

function populateCategoryFilter() {
  const categoryFilter = document.getElementById('category-filter');
  if (!categoryFilter) return;

  const categories = getUniqueValues(allPhrases, 'category').sort();

  // Keep existing default option, add new options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function applyFiltersAndSort() {
  const categoryFilter = document.getElementById('category-filter');
  const category = categoryFilter?.value || '';

  // Apply filter
  filteredPhrases = category
    ? filterByProperty(allPhrases, 'category', category)
    : [...allPhrases];

  // Sort alphabetically by phrase
  filteredPhrases = sortAlphabetically(filteredPhrases, 'phrase');

  // Re-render
  const container = document.getElementById('phrases-list');
  renderPhraseItems(filteredPhrases, container);

  // Re-attach click handlers
  const modal = document.getElementById('phrase-modal');
  attachItemClickHandlers(container, (item) => {
    const itemId = parseInt(item.getAttribute('data-id'));
    const phraseItem = allPhrases.find(p => p.id === itemId);

    if (phraseItem) {
      updateLearningProgress('phrases', itemId);
      const modalContent = createModalContent(phraseItem, 'phrases');
      openModal(modal, phraseItem.phrase, modalContent);
    }
  });
}

function saveProgress() {
  const progress = getFromStorage('learning_progress', {});
  const message = `You've learned ${progress.visitedPhrases?.length || 0} French phrases. Progress saved!`;

  saveToStorage('phrases_progress', {
    savedAt: new Date().toISOString(),
    itemsLearned: progress.visitedPhrases?.length || 0
  });

  alert(message);
}
