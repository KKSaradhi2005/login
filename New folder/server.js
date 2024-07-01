const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Temporary user database
const users = [];

// Secret key for JWT
const secretKey = 'your_secret_key';

// Registration endpoint
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json('User already exists');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save the user
    users.push({ name, email, password: hashedPassword });
    res.json('Registration successful');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json('User not found');
    }

    // Check the password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json('Invalid password');
    }

    // Generate JWT
    const token = jwt.sign({ id: user.email }, secretKey, {
        expiresIn: 86400 // 24 hours
    });

    res.json({ auth: true, token, message: 'Login successful' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
