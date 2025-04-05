# Azure Deployment Guide for Sport Meal Planner App

This guide provides step-by-step instructions for deploying the Sport Meal Planner application to Azure App Service.

## Prerequisites

1. An Azure account with an active subscription
2. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
3. [Node.js](https://nodejs.org/) installed
4. Git for version control

## Configuration Files

The following files have been set up for Azure deployment:

- `web.config`: Configures IIS on Azure App Service
- `backend/azure-config.js`: Contains Azure-specific configuration settings
- `package.json`: Includes scripts for deployment

## Configuration Steps Before Deployment

1. **Update Your Azure Domain**

   Open `backend/azure-config.js` and replace the placeholder domain with your actual Azure domain:

   ```javascript
   allowedOrigins: [
       // Update these with your actual domain once known
       'https://your-app-name.azurewebsites.net' 
   ]
   ```

2. **Set Up Environment Variables**

   You'll need to set up the following environment variables in Azure:
   
   - `NODE_ENV`: Set to "production"
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `WEBSITE_HOSTNAME`: This will be automatically set by Azure

## Deployment Steps

### Option 1: Deploy via Azure Portal

1. **Create an Azure Web App**
   - Log in to the [Azure Portal](https://portal.azure.com)
   - Create a new "Web App" resource
   - Select your subscription and resource group
   - Choose a unique name for your app
   - Select Node.js for the runtime stack
   - Choose your region and plan

2. **Configure Application Settings**
   - Once your Web App is created, go to Configuration → Application Settings
   - Add the following settings:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: `your-secret-key`

3. **Deploy Your Code**
   - In the Azure Portal, navigate to your Web App → Deployment Center
   - Choose your source control (GitHub, Azure Repos, etc.)
   - Follow the wizard to connect to your repository
   - Configure your deployment options and finish setup

### Option 2: Deploy via Azure CLI

1. **Log in to Azure**
   ```bash
   az login
   ```

2. **Create a Resource Group** (if you don't already have one)
   ```bash
   az group create --name YourResourceGroup --location EastUS
   ```

3. **Create an App Service Plan**
   ```bash
   az appservice plan create --name YourAppPlan --resource-group YourResourceGroup --sku B1 --is-linux
   ```

4. **Create a Web App**
   ```bash
   az webapp create --name YourAppName --resource-group YourResourceGroup --plan YourAppPlan --runtime "NODE|16-lts"
   ```

5. **Configure App Settings**
   ```bash
   az webapp config appsettings set --name YourAppName --resource-group YourResourceGroup --settings NODE_ENV=production JWT_SECRET=your-secure-secret
   ```

6. **Deploy Your Code**
   ```bash
   az webapp deployment source config-local-git --name YourAppName --resource-group YourResourceGroup
   ```

7. **Add a Git Remote and Push**
   ```bash
   git remote add azure <git-url-from-previous-command>
   git push azure main
   ```

## Troubleshooting

If you encounter issues during deployment, check the following:

1. **Application Logs**
   - Go to your Web App in Azure Portal
   - Navigate to Monitoring → Log Stream to see real-time logs
   - Check Application Logs for any error messages

2. **CORS Issues**
   - Verify that your Azure domain is correctly set in the allowed origins
   - Check Network tab in browser developer tools for CORS errors

3. **API Connection Issues**
   - Verify that the frontend is using the correct API URL
   - Check that your API routes are being correctly processed by the web.config rules

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Deploy Node.js to Azure](https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [Troubleshoot a Node.js app in Azure](https://docs.microsoft.com/en-us/azure/app-service/tutorial-nodejs-mongodb-app) 