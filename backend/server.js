const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Import configuration for Azure deployment
const config = require('./azure-config');

// Run data initialization script at startup
require('./init-data');

// Import models
const Recipe = require('./models/Recipe');

// Import routes
const recipeRoutes = require('./routes/recipes');

// Initialize Express app
const app = express();

// Azure Web Apps will set process.env.PORT
const PORT = config.port;

// JWT secret key - in production, use an environment variable
const JWT_SECRET = config.jwtSecret;

// Set up middleware for handling CORS
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (config.allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.startsWith('/') && allowedOrigin.endsWith('/')) {
                return new RegExp(allowedOrigin.slice(1, -1)).test(origin);
            }
            return allowedOrigin === origin;
        })) {
            callback(null, true);
        } else {
            console.log(`Origin ${origin} not allowed by CORS`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Use JSON body parser middleware
app.use(bodyParser.json());

// Path to users JSON file - updated for Azure
const dataDir = path.resolve(config.dataPath);
const usersFilePath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure users.json exists with empty array
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }));
}

// Helper function to get all users
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data).users;
    } catch (error) {
        console.error('Error reading users data:', error);
        return [];
    }
};

// Helper function to save users
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users data:', error);
        return false;
    }
};

// Home route (health check)
app.get('/', (req, res) => {
    res.send('Authentication API is running');
});

// Register route
app.post('/api/signup', async (req, res) => {
    try {
        // Extract user data from request
        const { firstName, lastName, email, dateOfBirth, password } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !dateOfBirth || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        // Password validation: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' 
            });
        }
        
        // Get all users
        const users = getUsers();
        
        // Check if email already exists
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user object
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
        
        // Save users back to file
        if (saveUsers(users)) {
            // Create JWT token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            // Return success with token and user info (excluding password)
            const { password, ...userWithoutPassword } = newUser;
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: userWithoutPassword
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Error saving user data' 
            });
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during registration' 
        });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        // Extract credentials from request
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Get all users
        const users = getUsers();
        
        // Find user by email
        const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        // If user not found or password doesn't match
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Return success with token and user info (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during login' 
        });
    }
});

// Mount recipe routes
app.use('/api/recipes', recipeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 