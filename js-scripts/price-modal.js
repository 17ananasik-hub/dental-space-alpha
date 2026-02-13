// price-modal.js
const priceModal = document.querySelector('.price-backdrop');
const priceBtnOpen = document.querySelector('.modal-price-btn-open');
const priceBtnClose = document.querySelector('.modal-btn-close');

const togglePriceModal = () => priceModal.classList.toggle('is-hidden');

// Открытие и закрытие через кнопки
priceBtnOpen.addEventListener('click', togglePriceModal);
priceBtnClose.addEventListener('click', togglePriceModal);

// Закрытие при клике на backdrop
priceModal.addEventListener('click', (event) => {
    // Если кликнули именно на backdrop, а не на содержимое модалки
    if (event.target === priceModal) {
        togglePriceModal();
    }
});
