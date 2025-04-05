/**
 * Recipe Migration Script
 * Copies recipe data from db/recipes.json to backend/data/recipes.json
 */

const fs = require('fs');
const path = require('path');
const Recipe = require('../models/Recipe');

// Paths for old and new recipe data
const oldRecipesPath = path.join(__dirname, '..', '..', 'db', 'recipes.json');
const dataDir = path.join(__dirname, '..', 'data');
const newRecipesPath = path.join(dataDir, 'recipes.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('Created data directory');
}

// Check if old recipes file exists
if (fs.existsSync(oldRecipesPath)) {
    try {
        console.log('Found old recipes.json file, migrating data...');
        
        // Read the old recipes data
        const oldRecipesData = fs.readFileSync(oldRecipesPath, 'utf8');
        const recipesJson = JSON.parse(oldRecipesData);
        
        // Write data to the new location
        fs.writeFileSync(newRecipesPath, JSON.stringify(recipesJson, null, 2));
        
        console.log('Recipe data migrated successfully');
        console.log(`- Source: ${oldRecipesPath}`);
        console.log(`- Destination: ${newRecipesPath}`);
        
        const recipeCount = recipesJson.recipes ? recipesJson.recipes.length : 0;
        console.log(`- ${recipeCount} recipes migrated`);
        
    } catch (error) {
        console.error('Error migrating recipe data:', error);
    }
} else {
    console.log('No old recipes.json file found, creating empty recipes.json');
    
    // Create an empty recipes file
    const emptyRecipes = { recipes: [] };
    fs.writeFileSync(newRecipesPath, JSON.stringify(emptyRecipes, null, 2));
    
    console.log('Empty recipes.json file created');
}

console.log('Recipe migration complete'); 