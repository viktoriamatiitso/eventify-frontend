const EVENTS_API_URL = 'http://127.0.0.1:8000/api/events/';

async function fetchEvents() {
    try {
        const response = await fetch(EVENTS_API_URL);
        if (!response.ok) throw new Error('Помилка завантаження подій');
        
        const events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error('Помилка:', error);
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = '<p>Поки немає жодної події</p>';
        return;
    }

    events.forEach(event => {
        const formattedPrice = parseFloat(event.price).toString();
        const eventDate = new Date(event.date);
        const day = String(eventDate.getDate()).padStart(2, '0');
        const month = String(eventDate.getMonth() + 1).padStart(2, '0');
        const year = eventDate.getFullYear();
        const hours = String(eventDate.getHours()).padStart(2, '0');
        const minutes = String(eventDate.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
        <h3><a href="event.html?id=${event.id}" class="event-link">${event.title}</a></h3>
        <p>${event.description}</p>
        <p><strong>Ціна:</strong> ${formattedPrice} грн</p>
        <p><strong>Дата:</strong> ${formattedDate}</p>
        `;
        container.appendChild(card);
    });
}

async function apiFetch(url, options = {}) {
    let accessToken = localStorage.getItem('access_token');
    
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
            window.location.href = 'login.html';
            return response;
        }

        const refreshResponse = await fetch('http://127.0.0.1:8000/api/auth/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            localStorage.setItem('access_token', refreshData.access);

            options.headers['Authorization'] = `Bearer ${refreshData.access}`;
            response = await fetch(url, options);
        } else {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }

    return response;
}

function checkAuthStatus() {
    const accessToken = localStorage.getItem('access_token');
    const authNav = document.getElementById('auth-nav');

    if (!authNav) return;

    if (accessToken) {
        authNav.innerHTML = `
            <a href="profile.html">Мій профіль</a>
            <a href="#" id="logout-link" style="color: #94a3b8; text-decoration: none; transition: color 0.2s ease;">Вийти</a>
        `;

        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear(); 
            window.location.reload(); 
        });
    } else {
        authNav.innerHTML = `
            <a href="login.html">Увійти</a>
            <a href="register.html">Реєстрація</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

fetchEvents();