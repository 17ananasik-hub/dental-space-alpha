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
