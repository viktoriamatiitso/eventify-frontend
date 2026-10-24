const ARTISTS_API_URL = 'http://127.0.0.1:8000/api/artists/';

async function fetchArtists() {
    try {
        const response = await fetch(ARTISTS_API_URL);
        if (!response.ok) throw new Error('Помилка завантаження артистів');
        
        const artists = await response.json();
        renderArtists(artists);
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('artists-container').innerHTML = '<p class="error-message">Не вдалося завантажити список артистів.</p>';
    }
}

function renderArtists(artists) {
    const container = document.getElementById('artists-container');
    container.innerHTML = '';

    if (artists.length === 0) {
        container.innerHTML = '<p>Поки немає жодного артиста.</p>';
        return;
    }

    artists.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3><a href="artists_detail.html?id=${artist.id}" class="event-link">${artist.name}</a></h3>
            <p>${artist.description || 'Опис відсутній.'}</p>
        `;
        container.appendChild(card);
    });
}

fetchArtists();