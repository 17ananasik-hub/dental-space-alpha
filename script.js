let isSubmitting = false;

document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form');
    if (!form || isSubmitting) return;

    e.preventDefault();
    isSubmitting = true;

    const formData = {
        name: form.querySelector('[name="name"]')?.value || '',
        phone: form.querySelector('[name="phone"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        comment: form.querySelector('[name="comment"]')?.value || '-'
    };

    try {
        // Теперь запрос идет на относительный путь Vercel
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('✅ Заявка успішно відправлена!');
            form.reset();
            const backdrop = document.querySelector('[data-modal]');
            if (backdrop) backdrop.classList.add('is-hidden');
        } else {
            alert('❌ Ошибка при отправке. Попробуйте позже.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось связаться с сервером.');
    } finally {
        setTimeout(() => { isSubmitting = false; }, 1000);
    }
});
