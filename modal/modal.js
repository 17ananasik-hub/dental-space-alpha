const backdrop = document.querySelector('[data-modal]');
const contentBox = document.querySelector('[data-modal-content]');

// Функция для закрытия модалки
const closeModal = () => {
    backdrop.classList.add('is-hidden');
    contentBox.innerHTML = '';
    document.body.style.overflow = ''; // Возвращаем скролл
    window.removeEventListener('keydown', onEscPress); // Убираем слушатель Esc
};

// Обработчик нажатия Esc
const onEscPress = (e) => {
    if (e.code === 'Escape') {
        closeModal();
    }
};
document.addEventListener('click', (e) => {
    // ОТКРЫТЬ
    const btn = e.target.closest('[data-open]'); // Находим кнопку (даже если кликнули по тексту внутри)

    if (btn) {
        const template = document.querySelector(btn.dataset.open);
        const anchorId = btn.getAttribute('data-anchor'); // Получаем ID якоря

        contentBox.innerHTML = template.innerHTML;
        backdrop.classList.remove('is-hidden');

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onEscPress);

        // ЯКОРЬ: выполняем скролл
        if (anchorId) {
            // Задержка 10мс дает браузеру время вставить HTML в contentBox
            setTimeout(() => {
                const targetElement = contentBox.querySelector(`#${anchorId}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 10);
        }
    }

    // ЗАКРЫТЬ
    if (e.target.closest('[data-close]') || e.target === backdrop) {
        closeModal();
    }
});

document.querySelectorAll('.button[data-anchor]').forEach(button => {
    button.addEventListener('click', function () {
        const modalId = this.getAttribute('data-open');
        const anchorId = this.getAttribute('data-anchor');
        const modal = document.querySelector(modalId);

        if (modal) {
            // 1. Код открытия вашей модалки (зависит от вашего плагина/скрипта)
            modal.classList.add('is-open');

            // 2. Находим целевой блок внутри модалки
            const targetElement = modal.querySelector(`#${anchorId}`);

            if (targetElement) {
                // Небольшая задержка, чтобы модалка успела отрисоваться
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // 3. Подсветка
                    targetElement.classList.add('highlight');

                    // Удаляем класс через 2 секунды, чтобы можно было подсветить снова
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 2000);
                }, 300);
            }
        }
    });
});
// --- 2. КИНЕТИЧЕСКАЯ КАРУСЕЛЬ С 3D-ЦЕНТРИРОВАНИЕМ (ИСПРАВЛЕННАЯ) ---
class UniversalCarousel {
    constructor(container) {
        if (!container) return;
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.btnL = container.querySelector('.carousel-btn-left');
        this.btnR = container.querySelector('.carousel-btn-right');
        this.cards = this.track ? this.track.children : [];

        this.index = 0;
        this.startX = 0;
        this.currentOffset = 0;
        this.isDragging = false;

        if (this.cards.length > 0) this.init();
    }

    // Точный расчет позиции для центрирования карточки
    getCenterPosition(idx) {
        const card = this.cards[idx];
        if (!card) return 0;

        const containerWidth = this.container.offsetWidth;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;

        // Центрируем карточку математически относительно контейнера
        return -(cardLeft - (containerWidth / 2) + (cardWidth / 2));
    }

    move(smooth = true) {
        if (this.cards.length === 0) return;

        this.index = Math.max(0, Math.min(this.index, this.cards.length - 1));
        this.currentOffset = this.getCenterPosition(this.index);

        this.track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        this.track.style.transform = `translateX(${this.currentOffset}px)`;

        // Обновляем классы активности для 3D-эффекта
        Array.from(this.cards).forEach((card, idx) => {
            if (idx === this.index) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        });

        // Управление стрелками
        if (this.btnL) this.btnL.style.opacity = this.index === 0 ? '0.2' : '1';
        if (this.btnR) this.btnR.style.opacity = this.index === this.cards.length - 1 ? '0.2' : '1';
    }

    start(e) {
        this.isDragging = true;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.track.style.transition = 'none';

        if (e.type === 'mousedown') e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diffX = currentX - this.startX;

        let dragOffset = this.currentOffset + diffX;
        const minOffset = this.getCenterPosition(this.cards.length - 1);
        const maxOffset = this.getCenterPosition(0);

        // Сопротивление по краям
        if (dragOffset > maxOffset) {
            dragOffset = maxOffset + (diffX * 0.25);
        } else if (dragOffset < minOffset) {
            dragOffset = minOffset + ((dragOffset - minOffset) * 0.25);
        }

        this.track.style.transform = `translateX(${dragOffset}px)`;
    }

    end(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const diffX = endX - this.startX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && this.index > 0) {
                this.index--;
            } else if (diffX < 0 && this.index < this.cards.length - 1) {
                this.index++;
            }
        }

        this.move(true);
    }

    init() {
        this.btnR?.addEventListener('click', () => { this.index++; this.move(true); });
        this.btnL?.addEventListener('click', () => { this.index--; this.move(true); });

        this.container.addEventListener('touchstart', (e) => this.start(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.drag(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.end(e));

        this.container.addEventListener('mousedown', (e) => this.start(e));
        window.addEventListener('mousemove', (e) => this.drag(e));
        window.addEventListener('mouseup', (e) => this.end(e));

        let resizeDebounce;
        window.addEventListener('resize', () => {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => this.move(false), 100);
        });

        this.move(false);
    }
}

// Инициализация карусели (безопасный запуск)
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.querySelector('.carousel-container');
    if (carouselElement) {
        new UniversalCarousel(carouselElement);
    }
});


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
        mobileMenuBtn.classList.toggle('is-open');
        headerNavigation.classList.toggle('is-open');
        document.body.classList.toggle('no-scroll');
    };

    // Открытие/закрытие по клику на саму кнопку бургера
    mobileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Останавливаем всплытие, чтобы глобальный клик ниже не сработал сразу
        toggleMenu();
    });

    // Закрываем меню при клике на любую ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (headerNavigation.classList.contains('is-open')) toggleMenu();
        });
    });

    // ГЛОБАЛЬНЫЙ КЛИК: Следим за кликами по всему сайту
    document.addEventListener('click', (event) => {
        // Проверяем, открыто ли меню
        const isMenuOpen = headerNavigation.classList.contains('is-open');

        // Клик пришелся НА САМО меню?
        const clickedInsideMenu = headerNavigation.contains(event.target);

        // Клик пришелся НА КНОПКУ бургера?
        const clickedOnBurgerBtn = mobileMenuBtn.contains(event.target);

        // Если меню ОТКРЫТО, и пользователь кликнул ВНЕ меню и ВНЕ кнопки бургера — закрываем
        if (isMenuOpen && !clickedInsideMenu && !clickedOnBurgerBtn) {
            toggleMenu();
        }
    });
}

// Используем глобальное делегирование событий (работает для динамических модалок)
const prefix = '+380';

// 1. Обрабатываем фокус / клик на инпуте телефона
document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target && target.matches('input[name="phone"]')) {
        if (!target.value) {
            target.value = prefix;
        }
    }
});

// 2. Обрабатываем потерю фокуса
document.addEventListener('focusout', (event) => {
    const target = event.target;
    if (target && target.matches('input[name="phone"]')) {
        if (target.value === prefix) {
            target.value = '';
        }
    }
});

// 3. Контролируем ввод символов (валидация на лету)
document.addEventListener('input', (event) => {
    const target = event.target;
    if (target && target.matches('input[name="phone"]')) {
        // Запрещаем стирать префикс
        if (!target.value.startsWith(prefix)) {
            target.value = prefix;
        }

        // Оставляем только цифры после префикса
        const digits = target.value.substring(prefix.length).replace(/\D/g, '');

        // Ограничиваем длину префиксом + 9 цифр
        target.value = prefix + digits.substring(0, 9);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Проверяем, сохранил ли пользователь тему ранее, или берем системную
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Определяем стартовую тему
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Устанавливаем тему при загрузке
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Обработчик клика по кнопке
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});
