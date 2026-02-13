const modal = document.querySelector('.backdrop');
const modalBtnOpen = document.querySelectorAll('.modal-btn-open');
const modalBtnClose = document.querySelector('.modal-btn-close');

const toggleModal = () => modal.classList.toggle('is-hidden');

// Открытие модалки через все кнопки
modalBtnOpen.forEach(btn => {
    btn.addEventListener('click', toggleModal);
});

// Закрытие через кнопку закрытия
modalBtnClose.addEventListener('click', toggleModal);

// Закрытие при клике на backdrop
modal.addEventListener('click', (event) => {
    // если кликнули на сам backdrop, а не на контент
    if (event.target === modal) {
        toggleModal();
    }
});
