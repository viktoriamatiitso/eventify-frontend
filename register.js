const REGISTER_URL = 'http://127.0.0.1:8000/api/auth/register/';

document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    clearErrors();

    const formData = {
        username: document.getElementById('username').value.trim(),
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value,
    };

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Реєстрація...';

    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = 'Реєстрація успішна! Перенаправлення на сторінку входу...';
            successDiv.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000);
        } else {
            displayErrors(data);
        }
    } catch (error) {
        console.error('Помилка мережі:', error);
        const globalError = document.getElementById('error-message');
        globalError.textContent = 'Не вдалося підключитися до сервера. Спробуйте пізніше.';
        globalError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зареєструватися';
    }
});

function displayErrors(errors) {
    for (const [field, messages] of Object.entries(errors)) {
        if (field === 'non_field_errors') {
            const globalError = document.getElementById('error-message');
            globalError.textContent = messages.join(' ');
            globalError.style.display = 'block';
        } else {
            const errorSpan = document.getElementById(`error-${field}`);
            if (errorSpan) {
                errorSpan.textContent = Array.isArray(messages) ? messages.join(' ') : messages;
            }
        }
    }
}

function clearErrors() {
    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(span => span.textContent = '');

    const globalError = document.getElementById('error-message');
    globalError.style.display = 'none';
    globalError.textContent = '';

    const successDiv = document.getElementById('success-message');
    successDiv.style.display = 'none';
    successDiv.textContent = '';
}