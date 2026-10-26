const urlParams = new URLSearchParams(window.location.search);
const venueId = urlParams.get('id');

const VENUE_API_URL = `http://127.0.0.1:8000/api/venues/${venueId}/`;

async function fetchVenueDetail() {
    if (!venueId) {
        document.getElementById('venue-detail-container').innerHTML = '<p class="error-message">Майданчик не знайдено в параметрах запиту.</p>';
        return;
    }

    try {
        const response = await fetch(VENUE_API_URL);
        if (!response.ok) throw new Error('Помилка завантаження даних майданчика');
        
        const venue = await response.json();
        renderVenueDetail(venue);
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('venue-detail-container').innerHTML = '<p class="error-message">Не вдалося завантажити деталі майданчика з сервера.</p>';
    }
}

function renderVenueDetail(venue) {
    const container = document.getElementById('venue-detail-container');

    let eventsHtml = '<p>На цьому майданчику поки немає запланованих подій.</p>';
    
    if (venue.events && venue.events.length > 0) {
        eventsHtml = '<ul class="artist-events-list" style="list-style-type: none; padding: 0; display: flex; flex-direction: column; gap: 10px;">';
        venue.events.forEach(event => {
            const eventDate = new Date(event.date).toLocaleString('uk-UA', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            eventsHtml += `
                <li style="background: #171721; padding: 10px 15px; border-radius: 6px; border: 1px solid #2d2d3f;">
                    <a href="event.html?id=${event.id}" class="event-link"><strong>${event.title}</strong></a> 
                    <span style="color: #94a3b8; font-size: 14px;">(${eventDate})</span>
                </li>
            `;
        });
        eventsHtml += '</ul>';
    }

    container.innerHTML = `
        <h1>${venue.name}</h1>
        <p class="event-description-large">${venue.description || 'Немає опису'}</p>
        <p class="event-description-large"><strong>Адреса:</strong> ${venue.address || 'Не вказана'}</p>
        
        <div class="event-info-box" style="margin-top: 20px;">
            <h3>📅 Події на цьому майданчику:</h3>
            ${eventsHtml}
        </div>

        <div class="event-buttons" style="margin-top: 20px;">
            <a href="venues.html" class="back-btn">← Назад до списку майданчиків</a>
        </div>
    `;
}

fetchVenueDetail();