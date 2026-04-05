let isSubmitting = false;

document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form');
    if (!form || isSubmitting) return;

    e.preventDefault();
    isSubmitting = true;
    console.log("🚀 Форма отправляется...");

    const formData = {
        name: form.querySelector('[name="name"]')?.value || '',
        phone: form.querySelector('[name="phone"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        comment: form.querySelector('[name="comment"]')?.value || '-'
    };

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            alert('✅ Заявка успішно відправлена!');
            form.reset();
        } else {
            alert('❌ Ошибка на стороне сервера.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось отправить форму.');
    } finally {
        isSubmitting = false;
    }
});
