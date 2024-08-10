// Constants
const songForm = document.getElementById('song-form');
const songList = document.getElementById('song-list');
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genre-filter');
const sortTitleButton = document.getElementById('sort-title');
const sortArtistButton = document.getElementById('sort-artist');
const sortDurationButton = document.getElementById('sort-duration');
const sortGenreButton = document.getElementById('sort-genre');

let songs = JSON.parse(localStorage.getItem('songs')) || [];
let genres = new Set();

// Add song to playlist
function addSong(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const duration = document.getElementById('duration').value;
    const genre = document.getElementById('genre').value;

    const song = { title, artist, duration, genre };
    songs.push(song);
    genres.add(genre);
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
    updateGenreFilter();
}

// Render songs
function renderSongs() {
    songList.innerHTML = '';
    const searchValue = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filteredSongs = songs
        .filter(song => 
            (song.title.toLowerCase().includes(searchValue) || song.artist.toLowerCase().includes(searchValue)) &&
            (selectedGenre === '' || song.genre === selectedGenre)
        )
        .map(song => `
            <li>
                ${song.title} by ${song.artist} (${song.duration}, ${song.genre})
                <button onclick="deleteSong('${song.title}')">Delete</button>
            </li>
        `).join('');

    songList.innerHTML = filteredSongs;
}

// Delete song
function deleteSong(title) {
    songs = songs.filter(song => song.title !== title);
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

// Update genre filter
function updateGenreFilter() {
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// Sort songs
function sortSongs(key) {
    songs.sort((a, b) => a[key].localeCompare(b[key]));
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

// Event listeners
songForm.addEventListener('submit', addSong);
searchInput.addEventListener('input', renderSongs);
genreFilter.addEventListener('change', renderSongs);
sortTitleButton.addEventListener('click', () => sortSongs('title'));
sortArtistButton.addEventListener('click', () => sortSongs('artist'));
sortDurationButton.addEventListener('click', () => sortSongs('duration'));
sortGenreButton.addEventListener('click', () => sortSongs('genre'));

// Initial render
renderSongs();
updateGenreFilter();
