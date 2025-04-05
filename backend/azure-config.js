/**
 * Azure Deployment Configuration
 * This file contains settings specific to Azure deployment
 */

module.exports = {
    // Get the port from Azure's environment variable or default to 8080
    port: process.env.PORT || 8080,
    
    // JWT secret - use environment variable in Azure
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    
    // Data paths - Azure App Service may use different paths
    dataPath: process.env.AZURE_DATA_PATH || './data',
    
    // CORS origins
    allowedOrigins: [
        // Main Azure domain
        process.env.WEBSITE_HOSTNAME ? `https://${process.env.WEBSITE_HOSTNAME}` : null,
        
        // Your custom domain if you have one
        process.env.CUSTOM_DOMAIN ? `https://${process.env.CUSTOM_DOMAIN}` : null,
        
        // Default pattern for Azure Websites
        '/\\.azurewebsites\\.net$/',
        
        // Development origins
        ...(process.env.NODE_ENV !== 'production' ? [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ] : [])
    ].filter(Boolean), // Remove null/undefined values
    
    // Database connection in case you move to a database later
    dbConfig: {
        // Use Azure's connection strings if available
        connectionString: process.env.AZURE_COSMOS_CONNECTION_STRING || 
                         process.env.AZURE_SQL_CONNECTION_STRING || 
                         null
    }
}; 