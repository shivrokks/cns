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
        if (result.encryptedName && result.encryptedEmail) {
            document.getElementById('message').innerText = `
                Login Successful!
                Name: ${result.encryptedName}
                Email: ${result.encryptedEmail}`;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Login Failed!';
    }
});
