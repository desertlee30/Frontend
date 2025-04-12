const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Import routes
const recipeRoutes = require('./routes/recipes');

// Initialize Express app
const app = express();

// Azure Web Apps will set process.env.PORT
const PORT = process.env.PORT || 3000;

// JWT secret key - in production, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Set up middleware for handling CORS
app.use(cors({
    
}));

// Use JSON body parser middleware
app.use(bodyParser.json());

// Path to users JSON file
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created data directory at: ${dataDir}`);
}

// Ensure users.json exists with empty array
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }), 'utf8');
    console.log(`Created users.json at: ${usersFilePath}`);
}

// Helper function to get all users
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users data:', error);
        return { users: [] };
    }
};

// Helper function to save users
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users data:', error);
        return false;
    }
};

// Home route (health check)
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Register route
app.post('/api/signup', async (req, res) => {
    try {
        // Extract user data from request
        const { firstName, lastName, email, dateOfBirth, password } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !dateOfBirth || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Password validation: 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character' 
            });
        }
        
        // Get existing users
        const { users } = getUsers();
        
        // Check if email already exists
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
            firstName,
            lastName,
            email,
            dateOfBirth,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save users
        saveUsers({ users });
        
        // Create JWT token
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        
        const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });
        
        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        // Get credentials
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const { users } = getUsers();
        const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        
        const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });
        
        // Send response
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Mount recipe routes
app.use('/api/recipes', recipeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
}); 