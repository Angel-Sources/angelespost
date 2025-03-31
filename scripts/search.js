document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (query) {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'search.html';
    }
});