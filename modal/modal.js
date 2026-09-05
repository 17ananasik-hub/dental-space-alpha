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

class UniversalCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.cards = [...this.track.children];
        this.left = container.querySelector('.carousel-btn-left');
        this.right = container.querySelector('.carousel-btn-right');

        this.index = 0;
        this.offset = 0;
        this.startX = 0;
        this.dragging = false;

        this.init();
    }

    center(index) {
        const card = this.cards[index];
        return -(card.offsetLeft + card.offsetWidth / 2 - this.container.offsetWidth / 2);
    }

    move(smooth = true) {
        this.index = Math.max(0, Math.min(this.index, this.cards.length - 1));
        this.offset = this.center(this.index);

        this.track.style.transition = smooth
            ? 'transform .5s cubic-bezier(.25,1,.5,1)'
            : 'none';

        this.track.style.transform = `translateX(${this.offset}px)`;

        this.cards.forEach((card, i) =>
            card.classList.toggle('is-active', i === this.index)
        );
    }

    start(e) {
        this.dragging = true;
        this.startX = e.touches?.[0].clientX ?? e.clientX;
        this.track.style.transition = 'none';
    }

    drag(e) {
        if (!this.dragging) return;

        const x = e.touches?.[0].clientX ?? e.clientX;
        const diff = x - this.startX;
        let offset = this.offset + diff;

        const min = this.center(this.cards.length - 1);
        const max = this.center(0);

        if (offset > max) offset = max + diff * .25;
        if (offset < min) offset = min + (offset - min) * .25;

        this.track.style.transform = `translateX(${offset}px)`;
    }

    end(e) {
        if (!this.dragging) return;

        this.dragging = false;

        const x = e.changedTouches?.[0].clientX ?? e.clientX;
        const diff = x - this.startX;

        if (Math.abs(diff) > 50)
            this.index += diff < 0 ? 1 : -1;

        this.move();
    }

    init() {
        this.right?.addEventListener('click', () => {
            this.index++;
            this.move();
        });

        this.left?.addEventListener('click', () => {
            this.index--;
            this.move();
        });

        this.container.addEventListener('touchstart', e => this.start(e), { passive: true });
        this.container.addEventListener('touchmove', e => this.drag(e), { passive: true });
        this.container.addEventListener('touchend', e => this.end(e));

        this.container.addEventListener('mousedown', e => this.start(e));
        window.addEventListener('mousemove', e => this.drag(e));
        window.addEventListener('mouseup', e => this.end(e));

        window.addEventListener('resize', () => {
            if (this.index === 0) {
                this.track.style.transform = 'translateX(0)';
            } else {
                this.move(false);
            }
        });

        // Первая карточка у левого края
        this.track.style.transform = 'translateX(0)';
        this.cards[0].classList.add('is-active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel-container')
        .forEach(carousel => new UniversalCarousel(carousel));
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


document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-help-close')) {
        const contentBox = document.querySelector('[data-modal-content]');
        const priceTemplate = document.querySelector('#modal-price');

        if (contentBox && priceTemplate) {
            // Возвращаем контент прайса на место (делаем шаг назад)
            contentBox.innerHTML = priceTemplate.innerHTML;
        }
    }
});

const helpModal = document.querySelector('#modal-help');

if (helpModal) {
    // Находим сами ссылки <a>, которые лежат внутри кнопок .help-btn
    const helpLinks = document.querySelectorAll('.help-btn a[href^="#help-"]');

    helpLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Отменяем стандартный мгновенный прыжок браузера по ссылке
            e.preventDefault();

            // Безопасно берем ID из атрибута href
            const anchorId = link.getAttribute('href').substring(1);
            const targetElement = helpModal.querySelector(`#${anchorId}`);

            if (!targetElement) return;

            // Ждём открытия модалки
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Перезапускаем анимацию при каждом клике
                targetElement.classList.remove('help-highlight');
                void targetElement.offsetWidth; // Магия для сброса анимации
                targetElement.classList.add('help-highlight');

                // Убираем подсветку через 4 секунды
                setTimeout(() => {
                    targetElement.classList.remove('help-highlight');
                }, 4000);

            }, 300);
        });
    });
}
