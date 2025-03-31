document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    window.location.href = 'index.html';
});