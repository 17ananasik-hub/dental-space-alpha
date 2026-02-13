// diploma-modal.js
const diplomaModal = document.querySelector('.diploma-backdrop');
const diplomaBtnOpen = document.querySelector('.modal-diploma-btn-open');
const diplomaBtnClose = document.querySelector('.modal-diploma-btn-close');

const toggleDiplomaModal = () => diplomaModal.classList.toggle('is-hidden');

// Открытие и закрытие через кнопки
diplomaBtnOpen.addEventListener('click', toggleDiplomaModal);
diplomaBtnClose.addEventListener('click', toggleDiplomaModal);

// Закрытие при клике на backdrop
diplomaModal.addEventListener('click', (event) => {
    // Если кликнули именно на backdrop, а не на содержимое модалки
    if (event.target === diplomaModal) {
        toggleDiplomaModal();
    }
});