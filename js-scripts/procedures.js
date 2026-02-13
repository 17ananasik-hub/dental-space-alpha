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

