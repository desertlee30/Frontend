# Deployment Changes Summary

## Overview
This document summarizes all the changes made to prepare the Sport Meal Planner application for deployment to Azure App Service.

## Configuration Files Created

1. **web.config**
   - Added IIS configuration for Azure App Service
   - Set up URL rewrite rules for API routes and static content
   - Configured Node.js process management settings

2. **backend/azure-config.js**
   - Created centralized configuration for Azure deployment
   - Set up dynamic port selection (Azure vs local)
   - Configured JWT secret from environment variables
   - Set up data paths compatible with Azure file system structure
   - Added flexible CORS configuration for production and development

## Frontend Code Changes

1. **API URL Configuration in All Frontend Files**
   - Modified `js/login.js`, `js/signup.js`, and `js/meal-planner.js`
   - Changed hardcoded API URL to be environment-aware:
   ```javascript
   const API_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') 
     ? 'http://localhost:3000/api'  // Local development
     : '/api';                      // Production (relative URL)
   ```

## Backend Code Changes

1. **Server Configuration (backend/server.js)**
   - Added import for Azure configuration
   ```javascript
   const config = require('./azure-config');
   ```
   
   - Updated port and JWT secret to use configuration
   ```javascript
   const PORT = config.port;
   const JWT_SECRET = config.jwtSecret;
   ```
   
   - Updated CORS configuration for production
   ```javascript
   app.use(cors({
       origin: function(origin, callback) {
           // Checks against config.allowedOrigins
           // Including regex pattern matching for Azure domains
       },
       methods: ['GET', 'POST', 'PUT', 'DELETE'],
       credentials: true
   }));
   ```
   
   - Updated data path configuration for Azure
   ```javascript
   const dataDir = path.resolve(config.dataPath);
   const usersFilePath = path.join(dataDir, 'users.json');
   
   // Ensure data directory exists
   if (!fs.existsSync(dataDir)) {
       fs.mkdirSync(dataDir, { recursive: true });
   }
   ```

## Documentation Created

1. **AZURE_DEPLOYMENT_GUIDE.md**
   - Comprehensive step-by-step guide for Azure deployment
   - Includes both Portal and CLI deployment options
   - Explains configuration settings and environment variables
   - Provides troubleshooting steps

## Security Enhancements

1. **Environment Variables**
   - Moved sensitive configuration to environment variables
   - JWT secret now sourced from Azure environment settings
   - Proper production/development environment detection

2. **CORS Security**
   - Dynamic CORS configuration based on environment
   - Allows specific domains in production
   - Support for regex pattern matching of allowed domains

## Next Steps Before Deployment

1. Update the Azure domain in `backend/azure-config.js` with your actual domain
2. Set required environment variables in Azure App Service
3. Test the deployment in a staging environment if possible
4. Monitor application logs during initial deployment 