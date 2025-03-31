function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || null;
    const usernameElem = document.getElementById('display-name');
    const userIdElem = document.getElementById('display-email');
    const accountMenu = document.getElementById('account-menu');
    
    if (user) {
        usernameElem.textContent = user.username;
        userIdElem.textContent = user.email;
    } else {
        usernameElem.textContent = 'Guest User';
        userIdElem.textContent = '@guest';
        
        // Redirect to login if not logged in
        document.getElementById('account-dropdown').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Toggle account menu
    document.getElementById('account-dropdown').addEventListener('click', (e) => {
        e.preventDefault();
        accountMenu.classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', displayUserInfo);