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

//procedures-modal//

const proceduresModal = document.querySelector('.procedures-backdrop');
const proceduresBtnOpen = document.querySelectorAll('.modal-procedures-btn-open');
const proceduresBtnClose = document.querySelector('.modal-procedures-btn-close');

const toggleProceduresModal = () => {
    proceduresModal.classList.toggle('is-hidden');
};

// Открытие с двух кнопок
proceduresBtnOpen.forEach(btn => {
    btn.addEventListener('click', toggleProceduresModal);
});

// Закрытие через кнопку
proceduresBtnClose.addEventListener('click', toggleProceduresModal);

// Закрытие по клику на backdrop
proceduresModal.addEventListener('click', (event) => {
    if (event.target === proceduresModal) {
        toggleProceduresModal();
    }
});

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

// carousel //
const carousel = document.querySelector('.carousel');
const cards = document.querySelectorAll('.card');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

let index = 1; // текущий центральный элемент
const gap = 20; // gap между карточками

function updateCarousel() {
    const cardWidth = cards[1].offsetWidth;
    const wrapperWidth = document.querySelector('.carousel-wrapper').offsetWidth;

    // смещение для центрирования карточки
    const offset = (wrapperWidth - cardWidth) / 3;

    carousel.style.transform = `translateX(${-index * (cardWidth + gap) + offset}px)`;
}

btnRight.addEventListener('click', () => {
    index++;
    if (index >= cards.length) index = 0; // цикл
    updateCarousel();
});

btnLeft.addEventListener('click', () => {
    index--;
    if (index < 0) index = cards.length - 1;
    updateCarousel();
});


