const API_URL = 'http://127.0.0.1:8000/api/events/';

async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
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
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Ціна:</strong> ${formattedPrice} грн</p>
            <p><strong>Дата:</strong> ${formattedDate}</p>
        `;
        container.appendChild(card);
    });
}

fetchEvents();