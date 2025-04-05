# Azure Web App Deployment Guide

This guide provides step-by-step instructions for deploying the Sport Meal Planner application to Azure Web App.

## Prerequisites

1. Azure account with an active subscription
2. Your code repository prepared (with changes already implemented)
3. Azure CLI installed (optional for command line deployment)

## Deployment Methods

### Option 1: Azure Portal Deployment

1. **Create a Web App in Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for "Web App" and click "Create"
   - Fill out the basic details:
     - **Subscription**: Your subscription
     - **Resource Group**: Create new or use existing
     - **Name**: Choose a unique name (will be part of the URL)
     - **Publish**: Code
     - **Runtime stack**: Node.js 16 LTS (or latest LTS version)
     - **Operating System**: Windows (recommended for this app)
     - **Region**: Choose closest to your users
   - Click "Review + create" and then "Create"

2. **Configure Application Settings**
   - In your web app resource, go to "Configuration" → "Application settings"
   - Add the following settings:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: `your-secure-random-string` (generate a secure random string)
   - Click "Save"

3. **Deploy Your Code**
   - In your web app resource, go to "Deployment Center"
   - Choose your source control (GitHub, Azure Repos, Bitbucket, etc.)
   - Follow the steps to connect to your repository
   - Configure the build provider (Kudu/App Service build service is recommended)
   - Complete the setup and trigger initial deployment

### Option 2: GitHub Actions (Recommended)

1. **Create a Web App in Azure Portal** (as described above)

2. **Set Up GitHub Actions**
   - In your web app resource, go to "Deployment Center"
   - Select "GitHub Actions"
   - Connect to your GitHub account and select your repository
   - Azure will generate a workflow file for you
   - Commit the workflow file to your repository

3. **Add Secrets to GitHub Repository**
   - In your GitHub repository, go to "Settings" → "Secrets"
   - Add the following secrets:
     - `AZURE_WEBAPP_NAME`: The name of your Azure Web App
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: Copy from the Azure Portal (in Web App → Overview → Get publish profile)

## Post-Deployment Tasks

1. **Verify Your Application**
   - Visit your Azure Web App URL (`https://your-app-name.azurewebsites.net`)
   - Test login and signup functionality
   - Check that the meal planner features work properly

2. **Monitor Application**
   - In Azure Portal, check "Log stream" for real-time logs
   - Set up "Application Insights" for comprehensive monitoring
   - Configure alerts for error rates or performance issues

## Troubleshooting

If your application doesn't start correctly:

1. **Check Application Logs**
   - In Azure Portal, go to your Web App → "Diagnose and solve problems"
   - Check "Application logs" for detailed error messages

2. **Verify Environment Variables**
   - Make sure all required environment variables are correctly set

3. **Check for Port Configuration**
   - Ensure your server is listening on the port provided by Azure (`process.env.PORT`)

4. **Debug Locally with the Same Configuration**
   - Set the same environment variables locally
   - Run `NODE_ENV=production node backend/server.js` to simulate production

## Data Persistence

The current implementation stores user data in a JSON file. For a production environment:

1. **Consider Using Azure Database Services**
   - Azure Cosmos DB for NoSQL
   - Azure SQL Database for relational data
   - Update your server code to use these services

2. **Set Up Backup Strategies**
   - Regular database backups
   - Export/import functionality for users 