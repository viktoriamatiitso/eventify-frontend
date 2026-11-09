const LOGIN_URL = 'http://127.0.0.1:8000/api/auth/login/';

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;

    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вхід...';

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            successDiv.textContent = 'Успішний вхід! Перенаправлення...';
            successDiv.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);
        } else {
            errorDiv.textContent = 'Невірний username або пароль.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Помилка мережі:', error);
        errorDiv.textContent = 'Помилка підключення до сервера.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Увійти';
    }
});