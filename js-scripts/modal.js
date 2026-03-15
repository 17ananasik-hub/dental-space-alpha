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
/**
 * Динамическая инициализация карусели для секции .procedures
 * Без изменения HTML и CSS файлов.
 */class ProceduresCarousel {
    constructor(container) {
        this.container = container;
        this.viewport = container.querySelector('.carousel-viewport');
        this.track = container.querySelector('.carousel-track');
        this.cards = Array.from(this.track.querySelectorAll('.procedure-card'));
        this.btnLeft = container.querySelector('.carousel-btn-left');
        this.btnRight = container.querySelector('.carousel-btn-right');

        this.currentIndex = 0;
        this.cardsToShow = 3;
        this.isTransitioning = false;

        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.dragOffset = 0;

        this.init();
    }

    init() {
        this.cloneCards();
        this.updateCardsToShow();
        this.bindEvents();
        this.setPosition(false);
    }

    cloneCards() {
        // Clone cards for infinite loop
        const cardCount = this.cards.length;

        // Clone last cards to beginning
        for (let i = cardCount - 1; i >= Math.max(0, cardCount - 3); i--) {
            const clone = this.cards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            this.track.insertBefore(clone, this.track.firstChild);
        }

        // Clone first cards to end
        for (let i = 0; i < Math.min(3, cardCount); i++) {
            const clone = this.cards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            this.track.appendChild(clone);
        }

        this.allCards = Array.from(this.track.querySelectorAll('.procedure-card'));
        this.cloneCount = Math.min(3, cardCount);
        this.currentIndex = this.cloneCount;
    }

    updateCardsToShow() {
        const width = window.innerWidth;
        if (width <= 600) {
            this.cardsToShow = 1;
        } else if (width <= 900) {
            this.cardsToShow = 2;
        } else {
            this.cardsToShow = 3;
        }
    }

    getCardWidth() {
        const card = this.allCards[0];
        const style = getComputedStyle(card);
        const marginLeft = parseFloat(style.marginLeft);
        const marginRight = parseFloat(style.marginRight);
        return card.offsetWidth + marginLeft + marginRight;
    }

    setPosition(animate = true) {
        const cardWidth = this.getCardWidth();
        const offset = -this.currentIndex * cardWidth;

        if (animate) {
            this.track.style.transition = 'transform 0.4s ease-out';
        } else {
            this.track.style.transition = 'none';
        }

        this.track.style.transform = `translateX(${offset}px)`;
    }

    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex++;
        this.setPosition(true);
    }

    prev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex--;
        this.setPosition(true);
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        const totalOriginal = this.cards.length;
        const maxIndex = this.cloneCount + totalOriginal - 1;
        const minIndex = this.cloneCount;

        // Loop back if we've gone past the clones
        if (this.currentIndex > maxIndex) {
            this.currentIndex = minIndex + (this.currentIndex - maxIndex - 1);
            this.setPosition(false);
        } else if (this.currentIndex < minIndex) {
            this.currentIndex = maxIndex - (minIndex - this.currentIndex - 1);
            this.setPosition(false);
        }
    }

    bindEvents() {
        // Button navigation
        this.btnRight.addEventListener('click', () => this.next());
        this.btnLeft.addEventListener('click', () => this.prev());

        // Transition end
        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

        // Resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCardsToShow();
                this.setPosition(false);
            }, 100);
        });

        // Touch events for mobile swipe
        this.viewport.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.viewport.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.viewport.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse drag for desktop
        this.viewport.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.viewport.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.viewport.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        this.viewport.addEventListener('mouseleave', (e) => this.handleDragEnd(e));

        // Keyboard navigation
        this.container.setAttribute('tabindex', '0');
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    handleTouchStart(e) {
        if (this.isTransitioning) return;
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = true;
        this.track.style.transition = 'none';
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;

        const currentX = e.touches[0].clientX;
        this.dragOffset = currentX - this.touchStartX;

        const cardWidth = this.getCardWidth();
        const baseOffset = -this.currentIndex * cardWidth;
        this.track.style.transform = `translateX(${baseOffset + this.dragOffset}px)`;

        // Prevent vertical scroll when swiping horizontally
        if (Math.abs(this.dragOffset) > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const threshold = this.getCardWidth() * 0.25;

        if (this.dragOffset > threshold) {
            this.prev();
        } else if (this.dragOffset < -threshold) {
            this.next();
        } else {
            this.setPosition(true);
        }

        this.dragOffset = 0;
    }

    handleDragStart(e) {
        if (this.isTransitioning) return;
        e.preventDefault();
        this.touchStartX = e.clientX;
        this.isDragging = true;
        this.track.style.transition = 'none';
        this.viewport.style.cursor = 'grabbing';
    }

    handleDragMove(e) {
        if (!this.isDragging) return;

        const currentX = e.clientX;
        this.dragOffset = currentX - this.touchStartX;

        const cardWidth = this.getCardWidth();
        const baseOffset = -this.currentIndex * cardWidth;
        this.track.style.transform = `translateX(${baseOffset + this.dragOffset}px)`;
    }

    handleDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.viewport.style.cursor = '';

        const threshold = this.getCardWidth() * 0.25;

        if (this.dragOffset > threshold) {
            this.prev();
        } else if (this.dragOffset < -threshold) {
            this.next();
        } else {
            this.setPosition(true);
        }

        this.dragOffset = 0;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.procedures .carousel-container').forEach(container => {
        new ProceduresCarousel(container);
    });
});

/* carousel-dentist */
class DentistCarousel {

    constructor(container) {

        this.container = container
        this.viewport = container.querySelector('.carousel-viewport')
        this.track = container.querySelector('.carousel-track')
        this.cards = Array.from(container.querySelectorAll('.card'))

        this.btnLeft = container.querySelector('.carousel-btn-left')
        this.btnRight = container.querySelector('.carousel-btn-right')

        this.index = 0
        this.isMoving = false

        this.init()

    }

    init() {

        this.cloneCards()
        this.bindEvents()
        this.setPosition(false)

    }

    cloneCards() {

        const count = this.cards.length
        if (count === 0) return

        for (let i = count - 1; i >= count - 3; i--) {
            const clone = this.cards[i].cloneNode(true)
            clone.classList.add('clone')
            this.track.prepend(clone)
        }

        for (let i = 0; i < 3; i++) {
            const clone = this.cards[i].cloneNode(true)
            clone.classList.add('clone')
            this.track.append(clone)
        }

        this.allCards = Array.from(this.track.querySelectorAll('.card'))
        this.index = 3

    }

    getCardWidth() {

        const card = this.allCards[0]
        const gap = parseInt(getComputedStyle(this.track).gap) || 0

        return card.offsetWidth + gap

    }

    setPosition(anim = true) {

        const offset = -(this.index * this.getCardWidth())

        this.track.style.transition = anim ? "transform .4s ease" : "none"
        this.track.style.transform = `translateX(${offset}px)`

    }

    next() {

        if (this.isMoving) return
        this.isMoving = true

        this.index++
        this.setPosition(true)

    }

    prev() {

        if (this.isMoving) return
        this.isMoving = true

        this.index--
        this.setPosition(true)

    }

    transitionEnd() {

        this.isMoving = false

        const original = this.cards.length
        const max = original + 2

        if (this.index > max) {
            this.index = 3
            this.setPosition(false)
        }

        if (this.index < 3) {
            this.index = original + 2
            this.setPosition(false)
        }

    }

    bindEvents() {

        this.btnRight.addEventListener('click', () => this.next())
        this.btnLeft.addEventListener('click', () => this.prev())

        this.track.addEventListener('transitionend', () => this.transitionEnd())

    }

}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.carousel-section .carousel-container').forEach(el => {
        new DentistCarousel(el)
    })

})
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-items');

toggle.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    toggle.classList.toggle('open'); // можно анимировать бургер
});