const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Persistent encryption key storage
const ENCRYPTION_KEY_FILE = 'encryption_key.txt';
let ENCRYPTION_KEY;

// Load or create the encryption key
if (fs.existsSync(ENCRYPTION_KEY_FILE)) {
    ENCRYPTION_KEY = fs.readFileSync(ENCRYPTION_KEY_FILE, 'utf8');
} else {
    ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(ENCRYPTION_KEY_FILE, ENCRYPTION_KEY);
}
ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY, 'hex');


const IV_LENGTH = 16; // Initialization vector length

// Encryption function
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Decryption function
function decrypt(text) {
    try {
        const [iv, encryptedText] = text.split(':');
        if (!iv || !encryptedText) throw new Error('Invalid data format');

        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            Buffer.from(iv, 'hex')
        );

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        throw new Error('Decryption failed');
    }
}

// Store encrypted data in a JSON file
const DATA_FILE = 'database.json';

function saveData(data) {
    let existingData = [];
    if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
    }
    existingData.push(data);
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2), 'utf8');
}


function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
            return fileContent.trim() ? JSON.parse(fileContent) : []; // Handle empty file
        }
    } catch (error) {
        console.error('Error reading the database file:', error.message);
    }
    return []; // Return an empty array if the file doesn't exist or is invalid
}


// Routes
// Sign-Up Route
app.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validate input data
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const users = loadData();
    const existingUser = users.find((u) => decrypt(u.email) === email || decrypt(u.phone) === phone);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email or phone number.' });
    }

    // Encrypt data
    const encryptedData = {
        name: encrypt(name),
        email: encrypt(email),
        phone: encrypt(phone),
        password: encrypt(password),
    };

    try {
        saveData(encryptedData);
        res.json({ message: 'Sign-Up Successful! Data has been securely stored.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save user data.' });
    }
});


// Login Route
app.post('/login', (req, res) => {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
        return res.status(400).json({ message: 'Email/Phone and password are required.' });
    }

    const users = loadData();

    // Find the user by email or phone
    const user = users.find(
        (u) => (email && decrypt(u.email) === email) || (phone && decrypt(u.phone) === phone)
    );

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    try {
        // Validate the password
        if (decrypt(user.password) === password) {
            // Decrypt name and email before sending the response
            const decryptedName = decrypt(user.name);
            const decryptedEmail = decrypt(user.email);
            const decryptedPhone = decrypt(user.phone);
            console.log(decryptedName);
            console.log(decryptedEmail);
            console.log(decryptedPhone);

            return res.json({
                message: 'Login Successful!',
                name: decryptedName,
                email: decryptedEmail,
            });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    }

    res.status(401).json({ message: 'Invalid credentials!' });
});

// console.log('Encrypted data:', encryptedData);
// console.log('Decrypted name:', decrypt(user.name));



// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
