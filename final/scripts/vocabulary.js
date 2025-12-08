/* Vocabulary Page Script - Fetch and display vocabulary with filtering */

import { initializeNavigation, initializeFooter, setActiveNav } from './navigation.js';
import { fetchData, handleFetchError } from './dataFetcher.js';
import { saveToStorage, getFromStorage, updateLearningProgress } from './storage.js';
import { renderVocabularyItems, attachItemClickHandlers, removeLoadingState } from './renderer.js';
import { openModal, closeModal, setupModalHandlers, createModalContent } from './modal.js';
import { filterByProperty, sortAlphabetically, sortByDifficulty } from './arrayUtils.js';

let allVocabulary = [];
let filteredVocabulary = [];

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();
  initializeFooter();
  setActiveNav('vocabulary.html');

  const container = document.getElementById('vocab-list');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const sortSelect = document.getElementById('sort-select');
  const saveProgressBtn = document.getElementById('save-progress-btn');
  const modal = document.getElementById('word-modal');

  setupModalHandlers(modal);

  try {
    // Fetch vocabulary data with async/await and error handling
    allVocabulary = await fetchData('./data/vocabulary.json');
    filteredVocabulary = [...allVocabulary];

    // Remove loading indicator
    removeLoadingState(container);

    // Render initial vocabulary
    renderVocabularyItems(filteredVocabulary, container);

    // Setup event listeners for filtering
    difficultyFilter?.addEventListener('change', () => {
      applyFiltersAndSort();
    });

    sortSelect?.addEventListener('change', () => {
      applyFiltersAndSort();
    });

    // Setup save progress button
    saveProgressBtn?.addEventListener('click', saveProgress);

    // Setup vocabulary item click handlers
    attachItemClickHandlers(container, (item) => {
      const itemId = parseInt(item.getAttribute('data-id'));
      const vocabItem = allVocabulary.find(v => v.id === itemId);

      if (vocabItem) {
        updateLearningProgress('vocabulary', itemId);
        const modalContent = createModalContent(vocabItem, 'vocabulary');
        openModal(modal, vocabItem.word, modalContent);
      }
    });

  } catch (error) {
    handleFetchError(error, container);
  }
});

function applyFiltersAndSort() {
  const difficultyFilter = document.getElementById('difficulty-filter');
  const sortSelect = document.getElementById('sort-select');
  const difficulty = difficultyFilter?.value || '';
  const sortBy = sortSelect?.value || 'alphabetical';

  // Apply filter
  filteredVocabulary = difficulty
    ? filterByProperty(allVocabulary, 'difficulty', difficulty)
    : [...allVocabulary];

  // Apply sort
  if (sortBy === 'difficulty') {
    filteredVocabulary = sortByDifficulty(filteredVocabulary);
  } else {
    filteredVocabulary = sortAlphabetically(filteredVocabulary, 'word');
  }

  // Re-render
  const container = document.getElementById('vocab-list');
  renderVocabularyItems(filteredVocabulary, container);

  // Re-attach click handlers
  const modal = document.getElementById('word-modal');
  attachItemClickHandlers(container, (item) => {
    const itemId = parseInt(item.getAttribute('data-id'));
    const vocabItem = allVocabulary.find(v => v.id === itemId);

    if (vocabItem) {
      updateLearningProgress('vocabulary', itemId);
      const modalContent = createModalContent(vocabItem, 'vocabulary');
      openModal(modal, vocabItem.word, modalContent);
    }
  });
}

function saveProgress() {
  const progress = getFromStorage('learning_progress', {});
  const message = `You've learned ${progress.visitedVocabulary?.length || 0} vocabulary words. Progress saved!`;

  saveToStorage('vocabulary_progress', {
    savedAt: new Date().toISOString(),
    itemsLearned: progress.visitedVocabulary?.length || 0
  });

  alert(message);
}
