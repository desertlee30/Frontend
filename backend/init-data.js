/**
 * Data Initialization Script for Azure
 * Ensures all required data directories and files exist
 */

const fs = require('fs');
const path = require('path');
const config = require('./azure-config');

console.log('Running data initialization script...');

// Create or validate data directory
const ensureDataDirectory = () => {
  // Get data directory path from config
  const dataDir = path.resolve(config.dataPath);
  console.log(`Checking data directory: ${dataDir}`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`Created data directory: ${dataDir}`);
    } catch (error) {
      console.error(`Error creating data directory ${dataDir}:`, error);
      throw error;
    }
  } else {
    console.log(`Data directory already exists: ${dataDir}`);
  }

  return dataDir;
};

// Create sample recipes.json if it doesn't exist
const ensureRecipesFile = (dataDir) => {
  const recipesFilePath = path.join(dataDir, 'recipes.json');
  console.log(`Checking recipes file: ${recipesFilePath}`);

  if (!fs.existsSync(recipesFilePath)) {
    try {
      // Sample recipes data
      const sampleRecipes = {
        "recipes": [
          {
            "id": 1,
            "title": "Grilled Chicken Salad",
            "description": "A healthy and protein-rich salad with grilled chicken breast, mixed greens, and a light lemon dressing.",
            "image": "https://via.placeholder.com/300x200?text=GrilledChickenSalad",
            "time": 20,
            "calories": 350,
            "nutrition": {
              "protein": 30,
              "carbs": 15,
              "fat": 12
            },
            "tags": ["high-protein", "low-carb", "keto", "lunch"],
            "ingredients": ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon juice", "Salt", "Pepper"]
          },
          {
            "id": 2,
            "title": "Protein Smoothie Bowl",
            "description": "A delicious post-workout smoothie bowl with protein powder, berries, and banana.",
            "image": "https://via.placeholder.com/300x200?text=SmoothieBowl",
            "time": 10,
            "calories": 320,
            "nutrition": {
              "protein": 25,
              "carbs": 40,
              "fat": 8
            },
            "tags": ["breakfast", "high-protein", "vegetarian", "quick"],
            "ingredients": ["Protein powder", "Frozen berries", "Banana", "Greek yogurt", "Almond milk", "Honey", "Granola", "Chia seeds"]
          },
          {
            "id": 3,
            "title": "Baked Salmon with Vegetables",
            "description": "Oven-baked salmon fillet with roasted vegetables and herbs.",
            "image": "https://via.placeholder.com/300x200?text=BakedSalmon",
            "time": 35,
            "calories": 420,
            "nutrition": {
              "protein": 35,
              "carbs": 25,
              "fat": 20
            },
            "tags": ["dinner", "high-protein", "omega-3", "fish"],
            "ingredients": ["Salmon fillet", "Asparagus", "Bell peppers", "Cherry tomatoes", "Olive oil", "Garlic", "Lemon", "Fresh herbs"]
          }
        ]
      };

      fs.writeFileSync(recipesFilePath, JSON.stringify(sampleRecipes, null, 2));
      console.log(`Created sample recipes file: ${recipesFilePath}`);
    } catch (error) {
      console.error(`Error creating recipes file ${recipesFilePath}:`, error);
      throw error;
    }
  } else {
    console.log(`Recipes file already exists: ${recipesFilePath}`);
  }
};

// Create users.json if it doesn't exist
const ensureUsersFile = (dataDir) => {
  const usersFilePath = path.join(dataDir, 'users.json');
  console.log(`Checking users file: ${usersFilePath}`);

  if (!fs.existsSync(usersFilePath)) {
    try {
      // Empty users array
      const emptyUsers = { "users": [] };
      fs.writeFileSync(usersFilePath, JSON.stringify(emptyUsers, null, 2));
      console.log(`Created empty users file: ${usersFilePath}`);
    } catch (error) {
      console.error(`Error creating users file ${usersFilePath}:`, error);
      throw error;
    }
  } else {
    console.log(`Users file already exists: ${usersFilePath}`);
  }
};

// Check environment
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Script directory: ${__dirname}`);

try {
  // Ensure the data directory exists
  const dataDir = ensureDataDirectory();
  
  // Ensure recipes and users files exist
  ensureRecipesFile(dataDir);
  ensureUsersFile(dataDir);
  
  console.log('Data initialization completed successfully!');
} catch (error) {
  console.error('Data initialization failed:', error);
  process.exit(1); // Exit with error code
}

module.exports = {
  ensureDataDirectory,
  ensureRecipesFile,
  ensureUsersFile
}; 