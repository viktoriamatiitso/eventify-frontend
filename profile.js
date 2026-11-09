document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('access_token');
    const container = document.getElementById('profile-container');

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const parseJwt = (token) => {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch (e) {
                return null;
            }
        };

        const decodedToken = parseJwt(accessToken);
        const userId = decodedToken ? decodedToken.user_id : null;

        if (!userId) {
            throw new Error("Не вдалося отримати ID користувача з токена");
        }

        const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const user = await response.json();
            
            container.innerHTML = `
                <form id="profile-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #cbd5e1; font-size: 14px;">Username:</label>
                        <input type="text" id="username" value="${user.username}" disabled style="padding: 10px; background: #1e1b4b; border: 1px solid #4c1d95; color: #94a3b8; border-radius: 6px;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #cbd5e1; font-size: 14px;">Ім'я:</label>
                        <input type="text" id="first_name" value="${user.first_name || ''}" style="padding: 10px; background: #0f172a; border: 1px solid #7c3aed; color: white; border-radius: 6px;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #cbd5e1; font-size: 14px;">Прізвище:</label>
                        <input type="text" id="last_name" value="${user.last_name || ''}" style="padding: 10px; background: #0f172a; border: 1px solid #7c3aed; color: white; border-radius: 6px;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="color: #cbd5e1; font-size: 14px;">Email:</label>
                        <input type="email" id="email" value="${user.email}" style="padding: 10px; background: #0f172a; border: 1px solid #7c3aed; color: white; border-radius: 6px;">
                    </div>
                    
                    <button type="submit" style="margin-top: 10px; background-color: #22c55e; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Зберегти зміни</button>
                    <div id="update-message" style="font-size: 14px; margin-top: 5px;"></div>
                </form>

                <div style="margin-top: 30px; border-top: 1px solid #4c1d95; padding-top: 20px;">
                    <h3 style="color: #d8b4fe; margin-bottom: 10px; font-size: 18px;">🎫 Історія купівлі квитків</h3>
                    <p style="color: #94a3b8; font-style: italic;">Тут відображатимуться ваші куплені квитки.</p>
                </div>
            `;

            const form = document.getElementById('profile-form');
            const msgDiv = document.getElementById('update-message');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                msgDiv.textContent = "Зберігаємо...";
                msgDiv.style.color = "#cbd5e1";

                const updatedData = {
                    username: document.getElementById('username').value,
                    first_name: document.getElementById('first_name').value,
                    last_name: document.getElementById('last_name').value,
                    email: document.getElementById('email').value
                };

                try {
                    const updateResponse = await fetch(`http://127.0.0.1:8000/api/auth/users/${userId}/`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if (updateResponse.ok) {
                        msgDiv.textContent = "Профіль успішно оновлено!";
                        msgDiv.style.color = "#4ade80";
                    } else {
                        const errData = await updateResponse.json();
                        msgDiv.textContent = "Помилка оновлення: " + JSON.stringify(errData);
                        msgDiv.style.color = "#ef4444";
                    }
                } catch (err) {
                    msgDiv.textContent = "Помилка з'єднання з сервером.";
                    msgDiv.style.color = "#ef4444";
                }
            });

        } else {
            container.innerHTML = `<p style="color: #ef4444;">Не вдалося завантажити профіль (статус ${response.status}).</p>`;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="color: #ef4444;">Помилка обробки токена або з'єднання.</p>`;
    }

    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});