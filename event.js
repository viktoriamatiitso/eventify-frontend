const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

const API_URL = `http://127.0.0.1:8000/api/events/${eventId}`;

async function fetchEventDetail() {
    if (!eventId) {
        document.getElementById('event-detail-container').innerHTML = '<p class="error-message">Подію не знайдено в параметрах запиту.</p>';
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Помилка завантаження даних події');
        
        const event = await response.json();
        renderEventDetail(event);
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('event-detail-container').innerHTML = '<p class="error-message">Не вдалося завантажити деталі події з сервера.</p>';
    }
}

function renderEventDetail(event) {
    const container = document.getElementById('event-detail-container');
    
    const formattedPrice = parseFloat(event.price).toString();
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const categoryName = event.category?.name || event.category || 'Не вказано';
    const artistName = event.artist?.name || event.artist || 'Не вказано';
    const venueName = event.venue?.name || event.venue || 'Не вказано';
    const venueCity = event.venue?.city ? `, м. ${event.venue.city}` : '';

    container.innerHTML = `
        <h1>${event.title}</h1>
        <p class="event-description-large">${event.description}</p>
        <div class="event-info-box">
            <p><strong>📅 Дата та час:</strong> ${formattedDate}</p>
            <p><strong>💰 Вартість квитка:</strong> ${formattedPrice} грн</p>
            <p><strong>🎭 Категорія:</strong> ${categoryName}</p>
            <p><strong>🎤 Артист:</strong> ${artistName}</p>
            <p><strong>📍 Майданчик:</strong> ${venueName}${venueCity}</p>
        </div>
        <div class="event-buttons">
            <button class="buy-ticket-btn">Купити квиток</button>
            <a href="index.html" class="back-btn">← Назад до каталогу</a>
        </div>
    `;
}

fetchEventDetail();