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
    origin: '*', // Allow all origins - this is fine for a development setup
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true // Allow credentials to be sent
}));

// Use JSON body parser middleware
app.use(bodyParser.json());

// Path to users JSON file
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Log the exact paths being used
console.log(`Server starting with data directory: ${dataDir}`);
console.log(`Users file path: ${usersFilePath}`);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created data directory at: ${dataDir}`);
}

// Ensure users.json exists with empty array
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }), 'utf8');
    console.log(`Created users.json at: ${usersFilePath}`);
} else {
    console.log(`Using existing users.json at: ${usersFilePath}`);
}

// Helper function to get all users
const getUsers = () => {
    try {
        console.log(`Reading users from: ${usersFilePath}`);
        const data = fs.readFileSync(usersFilePath, 'utf8');
        const parsedData = JSON.parse(data);
        console.log(`Successfully read users. Found ${parsedData.users?.length || 0} users.`);
        return parsedData;
    } catch (error) {
        console.error(`Error reading users data from ${usersFilePath}:`, error);
        return { users: [] };
    }
};

// Helper function to save users
const saveUsers = (users) => {
    try {
        console.log(`Saving ${users.users?.length || 0} users to: ${usersFilePath}`);
        const jsonData = JSON.stringify(users, null, 2);
        fs.writeFileSync(usersFilePath, jsonData);
        
        // Verify the file was written correctly
        try {
            const verifyData = fs.readFileSync(usersFilePath, 'utf8');
            const verifyParsed = JSON.parse(verifyData);
            console.log(`Verified users saved successfully. File contains ${verifyParsed.users?.length || 0} users.`);
        } catch (verifyError) {
            console.error(`Error verifying users.json after save:`, verifyError);
        }
        
        return true;
    } catch (error) {
        console.error(`Error saving users data to ${usersFilePath}:`, error);
        console.error('Error details:', error.stack);
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
        console.log('Received signup request');
        
        // Extract user data from request
        const { firstName, lastName, email, dateOfBirth, password } = req.body;
        console.log(`Signup attempt for email: ${email}`);
        
        // Validate required fields
        if (!firstName || !lastName || !email || !dateOfBirth || !password) {
            console.log('Signup validation failed: Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Signup validation failed: Invalid email format');
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Password validation: 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
        if (!passwordRegex.test(password)) {
            console.log('Signup validation failed: Password does not meet requirements');
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character' 
            });
        }
        
        // Get existing users
        const { users } = getUsers();
        console.log(`Retrieved ${users.length} existing users`);
        
        // Check if email already exists
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            console.log(`Signup failed: Email ${email} already in use`);
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        // Hash password
        console.log('Hashing password...');
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
        console.log(`Created new user with ID: ${newUser.id}`);
        
        // Add to users array
        users.push(newUser);
        console.log(`Added user to array. Total users now: ${users.length}`);
        
        // Save users
        const saveResult = saveUsers({ users });
        console.log(`Save result: ${saveResult ? 'Success' : 'Failed'}`);
        
        if (!saveResult) {
            console.error('Failed to save user data');
            return res.status(500).json({ error: 'Server error during registration - Could not save user data' });
        }
        
        // Create JWT token
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        
        const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });
        console.log(`User registered successfully: ${email}`);
        
        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Error in signup:', error);
        console.error('Stack trace:', error.stack);
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

// Debug endpoint to get all users (security risk - remove in production)
app.get('/api/debug/users', (req, res) => {
    try {
        const { users } = getUsers();
        // Return users without passwords
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        res.json({ users: safeUsers });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Debug endpoint to get file paths
app.get('/api/debug/paths', (req, res) => {
    try {
        const paths = {
            currentWorkingDirectory: process.cwd(),
            usersJsonAbsolutePath: path.resolve(usersFilePath),
            dataDirectoryAbsolutePath: path.resolve(dataDir),
            dirname: __dirname
        };
        
        // Check if files exist
        const fileChecks = {
            usersJsonExists: fs.existsSync(usersFilePath),
            dataDirectoryExists: fs.existsSync(dataDir)
        };
        
        // Try to list files in the data directory
        let dataDirectoryContents = [];
        try {
            if (fileChecks.dataDirectoryExists) {
                dataDirectoryContents = fs.readdirSync(dataDir);
            }
        } catch (e) {
            dataDirectoryContents = [`Error listing directory: ${e.message}`];
        }
        
        res.json({
            paths,
            fileChecks,
            dataDirectoryContents
        });
    } catch (error) {
        console.error('Error getting path info:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mount recipe routes
app.use('/api/recipes', recipeRoutes);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://0.0.0.0:${PORT}/api`);
    console.log(`For external access use: http://20.2.210.82:${PORT}/api`);
}); 