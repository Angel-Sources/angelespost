document.addEventListener('DOMContentLoaded', function() {
    const accountDropdown = document.getElementById('account-dropdown');
    const accountMenu = document.getElementById('account-menu');
    const displayName = document.getElementById('display-name');
    const logoutBtn = document.getElementById('logout');

    accountDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        accountMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target)) {
            accountMenu.classList.remove('show');
        }
    });

    checkLoginState();

    // Save username changes
    displayName.addEventListener('blur', function() {
        const newUsername = displayName.textContent.trim();
        if (newUsername) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            user.username = newUsername;
            localStorage.setItem('currentUser', JSON.stringify(user));
            checkLoginState();
        }
    });

    logoutBtn.addEventListener('click', logout);
});

function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('display-name').textContent = user.username;
        document.getElementById('display-email').textContent = user.email;
    } else {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}