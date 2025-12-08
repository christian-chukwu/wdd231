/* Modal Module - Handle modal dialog functionality */

export function openModal(modalElement, title, content) {
  if (!modalElement) return;

  const titleElement = modalElement.querySelector('#modal-title');
  const bodyElement = modalElement.querySelector('#modal-body');

  if (titleElement) {
    titleElement.textContent = title;
  }

  if (bodyElement) {
    bodyElement.innerHTML = content;
  }

  modalElement.showModal();

  // Focus management
  const closeBtn = modalElement.querySelector('#modal-close');
  if (closeBtn) {
    closeBtn.focus();
  }
}

export function closeModal(modalElement) {
  if (modalElement && modalElement.open) {
    modalElement.close();
  }
}

export function setupModalHandlers(modalElement) {
  if (!modalElement) return;

  const closeBtn = modalElement.querySelector('#modal-close, .modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal(modalElement);
    });
  }

  // Close on backdrop click
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal(modalElement);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElement.open) {
      closeModal(modalElement);
    }
  });
}

export function createModalContent(data, type) {
  if (type === 'vocabulary') {
    return `
      <div class="modal-vocabulary">
        <p><strong>Part of Speech:</strong> ${data.partOfSpeech}</p>
        <p><strong>Definition:</strong> ${data.definition}</p>
        <p><strong>Example:</strong> <em>"${data.example}"</em></p>
        <p><strong>Difficulty:</strong> <span class="difficulty-badge difficulty-${data.difficulty.toLowerCase()}">${data.difficulty}</span></p>
      </div>
    `;
  } else if (type === 'phrases') {
    return `
      <div class="modal-phrase">
        <p><strong>English Translation:</strong> ${data.englishTranslation}</p>
        <p><strong>Pronunciation:</strong> <em>${data.pronunciation}</em></p>
        <p><strong>Context:</strong> ${data.context}</p>
        <p><strong>Category:</strong> <span class="category-badge">${data.category}</span></p>
      </div>
    `;
  }

  return '';
}
