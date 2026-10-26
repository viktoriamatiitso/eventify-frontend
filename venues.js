const VENUES_API_URL = 'http://127.0.0.1:8000/api/venues/';

async function fetchVenues() {
    try {
        const response = await fetch(VENUES_API_URL);
        if (!response.ok) throw new Error('Помилка завантаження майданчиків');
        
        const venues = await response.json();
        renderVenues(venues);
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('venues-container').innerHTML = '<p class="error-message">Не вдалося завантажити список майданчиків.</p>';
    }
}

function renderVenues(venues) {
    const container = document.getElementById('venues-container');
    container.innerHTML = '';

    if (venues.length === 0) {
        container.innerHTML = '<p>Поки немає жодного майданчика.</p>';
        return;
    }

    venues.forEach(venue => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3><a href="venues_detail.html?id=${venue.id}" class="event-link">${venue.name}</a></h3>
            <p>📍 ${venue.address || 'Адреса відсутня.'}</p>
        `;
        container.appendChild(card);
    });
}

fetchVenues();