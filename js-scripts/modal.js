
// --- 1. МОДАЛЬНЫЕ ОКНА ---
function setupModal(backdropSelector, openSelector, closeSelector) {
    const backdrop = document.querySelector(backdropSelector);
    const openBtns = document.querySelectorAll(openSelector);
    const closeBtn = document.querySelector(closeSelector);

    if (!backdrop || openBtns.length === 0) return;

    const toggle = () => backdrop.classList.toggle('is-hidden');

    openBtns.forEach(btn => btn.addEventListener('click', toggle));
    if (closeBtn) closeBtn.addEventListener('click', toggle);

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) toggle();
    });
}

setupModal('.backdrop', '.modal-btn-open', '.modal-btn-close');
setupModal('.price-backdrop', '.modal-price-btn-open', '.price-backdrop .modal-btn-close');
setupModal('.procedures-backdrop', '.modal-procedures-btn-open', '.modal-procedures-btn-close');
setupModal('.diploma-backdrop', '.modal-diploma-btn-open', '.modal-diploma-btn-close');


// --- 2. УНИВЕРСАЛЬНАЯ КАРУСЕЛЬ С ЖИВЫМ СВАЙПОМ ---
class UniversalCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.btnL = container.querySelector('.carousel-btn-left');
        this.btnR = container.querySelector('.carousel-btn-right');
        this.cards = this.track.children;
        this.index = 0;

        if (this.cards.length > 0) this.init();
    }

    getStep() {
        const card = this.cards[0];
        const style = getComputedStyle(card);
        return card.offsetWidth + parseFloat(style.marginRight || 0) + parseFloat(style.marginLeft || 0);
    }

    move() {
        const step = this.getStep();
        const visible = Math.round(this.container.offsetWidth / step);
        const maxIndex = Math.max(0, this.cards.length - visible);

        this.index = Math.max(0, Math.min(this.index, maxIndex));

        this.track.style.transition = 'transform 0.4s ease-out';
        this.track.style.transform = `translateX(${-this.index * step}px)`;

        if (this.btnL) this.btnL.style.opacity = this.index === 0 ? '0.3' : '1';
        if (this.btnR) this.btnR.style.opacity = this.index >= maxIndex ? '0.3' : '1';
    }

    init() {
        this.btnR?.addEventListener('click', () => { this.index++; this.move(); });
        this.btnL?.addEventListener('click', () => { this.index--; this.move(); });

        let startX = 0;
        let currentTranslate = 0;

        // Касание пальцем
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentTranslate = -this.index * this.getStep();
            this.track.style.transition = 'none';
        }, { passive: true });

        // Движение пальца (карточки едут вслед)
        this.container.addEventListener('touchmove', (e) => {
            const diff = e.touches[0].clientX - startX;
            this.track.style.transform = `translateX(${currentTranslate + diff}px)`;
        }, { passive: true });

        // Конец касания
        this.container.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.index-- : this.index++;
            }
            this.move();
        });

        window.addEventListener('resize', () => {
            this.track.style.transition = 'none';
            this.move();
        });

        this.move();
    }
}

// --- 3. ЗАПУСК ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel-container').forEach(container => {
        new UniversalCarousel(container);
    });
});

// section animations //
const sections = document.querySelectorAll('.workflow, .advantages-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting);
    });
}, {
    threshold: 0.4
});

sections.forEach(section => observer.observe(section));

// burger //


// --- 4. МОБИЛЬНОЕ МЕНЮ ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const headerNavigation = document.getElementById('header-navigation');
const menuLinks = document.querySelectorAll('.header-menu .link');

if (mobileMenuBtn && headerNavigation) {
    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('is-open'); // Для анимации иконок (крестика)
        headerNavigation.classList.toggle('is-open'); // Для открытия самого меню
        document.body.classList.toggle('no-scroll'); // Чтобы сайт не крутился под меню
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Закрываем меню при клике на любую ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (headerNavigation.classList.contains('is-open')) toggleMenu();
        });
    });
}