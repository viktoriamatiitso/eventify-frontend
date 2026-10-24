const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('id');

const ARTIST_API_URL = `http://127.0.0.1:8000/api/artists/${artistId}/`;

async function fetchArtistDetail() {
    if (!artistId) {
        document.getElementById('artist-detail-container').innerHTML = '<p class="error-message">Артиста не знайдено в параметрах запиту.</p>';
        return;
    }

    try {
        const response = await fetch(ARTIST_API_URL);
        if (!response.ok) throw new Error('Помилка завантаження даних артиста');
        
        const artist = await response.json();
        renderArtistDetail(artist);
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('artist-detail-container').innerHTML = '<p class="error-message">Не вдалося завантажити деталі артиста з сервера.</p>';
    }
}

function renderArtistDetail(artist) {
    const container = document.getElementById('artist-detail-container');

    let eventsHtml = '<p>У цього артиста поки немає запланованих подій.</p>';
    
    if (artist.events && artist.events.length > 0) {
        eventsHtml = '<ul class="artist-events-list" style="list-style-type: none; padding: 0; display: flex; flex-direction: column; gap: 10px;">';
        artist.events.forEach(event => {
            const eventDate = new Date(event.date).toLocaleString('uk-UA', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            eventsHtml += `
                <li style="background: #171721; padding: 10px 15px; border-radius: 6px; border: 1px solid #2d2d3f;">
                    <a href="event.html?id=${event.id}" class="event-link"><strong>${event.title}</strong></a> 
                    <span style="color: #94a3b8; font-size: 14px;">(${eventDate} - ${parseFloat(event.price)} грн)</span>
                </li>
            `;
        });
        eventsHtml += '</ul>';
    }

    container.innerHTML = `
        <h1>${artist.name}</h1>
        <p class="event-description-large">${artist.description || 'Біографія відсутня.'}</p>
        
        <div class="event-info-box">
            <h3>🎵 Події за участю артиста:</h3>
            ${eventsHtml}
        </div>

        <div class="event-buttons">
            <a href="artists.html" class="back-btn">← Назад до списку артистів</a>
        </div>
    `;
}

fetchArtistDetail();