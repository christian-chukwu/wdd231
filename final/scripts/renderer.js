/* DOM Rendering Module - Generate and manipulate DOM elements */

export function renderVocabularyItems(items, container) {
  if (!container) return;

  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No vocabulary items found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const article = document.createElement('article');
    article.className = 'vocab-item';
    article.setAttribute('data-id', item.id);
    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Vocabulary word: ${item.word}`);

    article.innerHTML = `
      <h3>${item.word}</h3>
      <div class="vocab-meta">
        <span class="category-badge">${item.partOfSpeech}</span>
        <span class="difficulty-badge difficulty-${item.difficulty.toLowerCase()}">${item.difficulty}</span>
      </div>
      <p>${item.definition.substring(0, 100)}...</p>
    `;

    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

export function renderPhraseItems(items, container) {
  if (!container) return;

  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No phrases found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const article = document.createElement('article');
    article.className = 'phrase-item';
    article.setAttribute('data-id', item.id);
    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `French phrase: ${item.phrase}`);

    article.innerHTML = `
      <h3>${item.phrase}</h3>
      <div class="vocab-meta">
        <span class="category-badge">${item.category}</span>
      </div>
      <p><strong>Translation:</strong> ${item.englishTranslation}</p>
      <p><em>${item.pronunciation}</em></p>
    `;

    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

export function attachItemClickHandlers(container, callback) {
  if (!container) return;

  container.addEventListener('click', (e) => {
    const item = e.target.closest('.vocab-item, .phrase-item');
    if (item) {
      callback(item);
    }
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.vocab-item, .phrase-item');
      if (item) {
        e.preventDefault();
        callback(item);
      }
    }
  });
}

export function removeLoadingState(container) {
  const loadingElement = container.querySelector('.loading');
  if (loadingElement) {
    loadingElement.remove();
  }
}
