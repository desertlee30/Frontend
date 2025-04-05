# Sport Meal Planner

A web application for athletes to plan and track their meals based on their fitness goals.

## Features

- User authentication (signup/login)
- Meal planning based on fitness goals
- Calorie and nutrition tracking
- User profile management

## Project Structure

```
├── backend/            # Node.js server with Express
│   ├── server.js       # Main server file
│   ├── azure-config.js # Azure deployment configuration
│   └── data/           # Data storage directory
│       └── users.json  # User data
├── js/                 # Frontend JavaScript
│   ├── login.js        # Login functionality
│   ├── signup.js       # Registration functionality
│   └── meal-planner.js # Main application logic
├── css/                # Stylesheets
├── web.config          # IIS configuration for Azure
├── AZURE_DEPLOYMENT_GUIDE.md # Deployment instructions
└── DEPLOYMENT_SUMMARY.md     # Changes made for deployment
```

## Local Development Setup

1. **Prerequisites**
   - Node.js and npm installed
   - Git (optional, for version control)

2. **Install Backend Dependencies**
   ```bash
   # From the project root
   cd backend
   npm install
   ```

3. **Start the Backend Server**
   ```bash
   # From the backend directory
   npm start
   ```
   The server will start on http://localhost:3000

4. **Access the Frontend**
   - Open the login.html file in your browser
   - Or use a local server like Live Server in VS Code

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Authenticate a user and receive a JWT token

### User Data

- `GET /api/user` - Get user profile information (requires authentication)
- `PUT /api/user` - Update user profile (requires authentication)

## Deployment

This application can be deployed to Azure App Service. See the detailed instructions in [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md).

For a summary of all changes made to prepare the app for deployment, see [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md).

### Quick Deployment Steps

1. Configure Azure-specific settings in `backend/azure-config.js`
2. Set up environment variables in Azure App Service
3. Deploy code to Azure using Azure Portal or Azure CLI

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed with bcrypt
- CORS is configured for secure cross-origin requests
- Environment variables are used for sensitive data

## Browser Compatibility

The application is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the ISC License 