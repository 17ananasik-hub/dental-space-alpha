// Переменная-флаг, чтобы избежать двойной отправки
let isSubmitting = false;

document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form');
    if (!form || isSubmitting) return; // Если уже отправляем — выходим

    e.preventDefault();
    isSubmitting = true; // Блокируем повторный вход

    const formData = {
        name: form.querySelector('[name="name"]')?.value || '',
        phone: form.querySelector('[name="phone"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        comment: form.querySelector('[name="comment"]')?.value || '-'
    };

    try {
        const response = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('✅ Заявка успішно відправлена!');
            form.reset();

            // Скрываем модалку
            const backdrop = document.querySelector('[data-modal]');
            if (backdrop) backdrop.classList.add('is-hidden');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        // Разблокируем отправку через секунду (чтобы точно не было дублей)
        setTimeout(() => {
            isSubmitting = false;
        }, 1000);
    }
});