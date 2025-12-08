/* Local Storage Module - Handle client-side data persistence */

const STORAGE_PREFIX = 'blh_';

export function saveToStorage(key, value) {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    return false;
  }
}

export function getFromStorage(key, defaultValue = null) {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error retrieving from local storage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key) {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error removing from local storage:', error);
    return false;
  }
}

export function clearStorage() {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing local storage:', error);
    return false;
  }
}

export function initializeLearningProgress() {
  const progress = getFromStorage('learning_progress', {
    visitedVocabulary: [],
    visitedPhrases: [],
    lastVisited: new Date().toISOString()
  });

  return progress;
}

export function updateLearningProgress(type, itemId) {
  const progress = getFromStorage('learning_progress', {
    visitedVocabulary: [],
    visitedPhrases: [],
    lastVisited: new Date().toISOString()
  });

  if (type === 'vocabulary') {
    if (!progress.visitedVocabulary.includes(itemId)) {
      progress.visitedVocabulary.push(itemId);
    }
  } else if (type === 'phrases') {
    if (!progress.visitedPhrases.includes(itemId)) {
      progress.visitedPhrases.push(itemId);
    }
  }

  progress.lastVisited = new Date().toISOString();
  saveToStorage('learning_progress', progress);

  return progress;
}
