const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Import configuration for Azure deployment
const config = require('./azure-config');

// Import models
const Recipe = require('./models/Recipe');

// Import routes
const recipeRoutes = require('./routes/recipes');

// Initialize Express app
const app = express();

// Azure Web Apps will set process.env.PORT
const PORT = config.port;

// JWT secret key (in production, use an environment variable)
const JWT_SECRET = config.jwtSecret;

// Middleware
// Configure CORS
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (config.allowedOrigins.some(allowedOrigin => {
            // Check for regex pattern
            if (allowedOrigin.startsWith('/') && allowedOrigin.endsWith('/')) {
                return new RegExp(allowedOrigin.slice(1, -1)).test(origin);
            }
            // Direct string match
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
app.use(bodyParser.json());

// Path to users JSON file - updated for Azure
const dataDir = path.resolve(config.dataPath);
const usersFilePath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure users.json exists
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }));
}

// Helper function to read users from JSON file
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return { users: [] };
    }
};

// Helper function to write users to JSON file
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
};

// API Routes

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Authentication API is running' });
});

// Use recipe routes
app.use('/api/recipes', recipeRoutes);

// Signup route
app.post('/api/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, dateOfBirth, password } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !dateOfBirth || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email format validation
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@#$%^&*()_+={}\[\]:;'<>,.?/~]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol' 
            });
        }

        // Check if email already exists
        const { users } = getUsers();
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = {
            id: Date.now().toString(), // Simple ID generation
            firstName,
            lastName,
            email,
            dateOfBirth,
            password: hashedPassword, // Store hashed password
            createdAt: new Date().toISOString()
        };

        // Add to users array and save
        users.push(newUser);
        saveUsers({ users });

        // Create JWT token (optional, could also just respond with success)
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response, without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ 
            message: 'User created successfully',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const { users } = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response, without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ 
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Serve static files from the public directory in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    const staticPath = path.join(__dirname, '..'); // The parent directory containing frontend files
    app.use(express.static(staticPath));
    
    // For any other routes, redirect to the index.html
    app.get('*', (req, res) => {
        // Exclude API routes from this catch-all handler
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(staticPath, 'index.html'));
        }
    });
}

// Initialize recipes from data directory if needed
const recipesDataPath = path.join(__dirname, 'data', 'recipes.json');
const oldRecipesPath = path.join(__dirname, '..', 'db', 'recipes.json');

// If no recipes.json in data directory but old one exists, run the migration script
if (!fs.existsSync(recipesDataPath) && fs.existsSync(oldRecipesPath)) {
    console.log('No recipes found in backend/data. Attempting to migrate from db/recipes.json...');
    try {
        require('./scripts/initialize-recipes');
        console.log('Recipe migration completed during server startup.');
    } catch (error) {
        console.error('Error during recipe migration:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 