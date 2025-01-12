// Sign-Up Handler
document.getElementById('userForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const data = { name, email, phone, password };

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        document.getElementById('message').innerText = result.message;
        document.getElementById('userForm').reset();
    } catch (error) {
        document.getElementById('message').innerText = 'Sign-Up Failed!';
    }
});

// Login Handler
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const data = { email, password };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok) {
            // Store user data in sessionStorage for dashboard
            sessionStorage.setItem('userData', JSON.stringify({
                name: result.name,
                email: result.email,
                phone: result.phone
            }));
            
            // Show success message
            document.getElementById('message').innerText = 'Login Successful! Redirecting...';
            
            // Redirect to dashboard page
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            // Show error message
            document.getElementById('message').innerText = result.message || 'Login Failed!';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('message').innerText = 'Login Failed! Please try again.';
    }
});