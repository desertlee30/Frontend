# Authentication Backend

A simple Node.js/Express backend for user authentication with JWT.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /` - Check if the API is running

### Authentication
- `POST /api/signup` - Register a new user
  - Request body:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe", 
      "email": "john@example.com",
      "dateOfBirth": "1990-01-01",
      "password": "Password123!"
    }
    ```

- `POST /api/login` - Login with email and password
  - Request body:
    ```json
    {
      "email": "john@example.com",
      "password": "Password123!"
    }
    ```

## Security Note

This is a simple implementation for demonstration purposes. In a production environment:

1. Use environment variables for configuration (JWT secret, etc.)
2. Add rate limiting to prevent brute force attacks
3. Consider using a database instead of a JSON file
4. Enable HTTPS
5. Add proper logging and error handling 