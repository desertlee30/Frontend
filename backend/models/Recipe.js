/**
 * Recipe Model
 * Handles operations related to recipes in the application
 */

const fs = require('fs');
const path = require('path');

// Path to recipes JSON file
const recipesFilePath = path.join(__dirname, '..', 'data', 'recipes.json');

// Ensure recipes.json exists
const ensureRecipesFile = () => {
    const dataDir = path.join(__dirname, '..', 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    
    // Create recipes.json with empty array if it doesn't exist
    if (!fs.existsSync(recipesFilePath)) {
        fs.writeFileSync(recipesFilePath, JSON.stringify({ recipes: [] }));
    }
};

// Get all recipes
const getAllRecipes = () => {
    try {
        ensureRecipesFile();
        const data = fs.readFileSync(recipesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading recipes file:', error);
        return { recipes: [] };
    }
};

// Save recipes to file
const saveRecipes = (recipesData) => {
    try {
        ensureRecipesFile();
        fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing recipes file:', error);
        return false;
    }
};

// Get recipe by ID
const getRecipeById = (id) => {
    const { recipes } = getAllRecipes();
    return recipes.find(recipe => recipe.id === parseInt(id));
};

// Add a new recipe
const addRecipe = (recipeData) => {
    try {
        const { recipes } = getAllRecipes();
        
        // Generate a new ID (max ID + 1)
        const newId = recipes.length > 0 
            ? Math.max(...recipes.map(recipe => recipe.id)) + 1 
            : 1;
        
        // Create new recipe with ID and timestamp
        const newRecipe = {
            id: newId,
            ...recipeData,
            createdAt: new Date().toISOString()
        };
        
        // Add to recipes array and save
        recipes.push(newRecipe);
        saveRecipes({ recipes });
        
        return newRecipe;
    } catch (error) {
        console.error('Error adding recipe:', error);
        return null;
    }
};

// Update an existing recipe
const updateRecipe = (id, recipeData) => {
    try {
        const { recipes } = getAllRecipes();
        const index = recipes.findIndex(recipe => recipe.id === parseInt(id));
        
        if (index === -1) {
            return null; // Recipe not found
        }
        
        // Update recipe data but keep ID and created date
        const updatedRecipe = {
            ...recipes[index],
            ...recipeData,
            id: parseInt(id), // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };
        
        recipes[index] = updatedRecipe;
        saveRecipes({ recipes });
        
        return updatedRecipe;
    } catch (error) {
        console.error('Error updating recipe:', error);
        return null;
    }
};

// Delete a recipe
const deleteRecipe = (id) => {
    try {
        const { recipes } = getAllRecipes();
        const index = recipes.findIndex(recipe => recipe.id === parseInt(id));
        
        if (index === -1) {
            return false; // Recipe not found
        }
        
        recipes.splice(index, 1);
        saveRecipes({ recipes });
        
        return true;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return false;
    }
};

// Initialize recipes with seed data if empty
const initializeWithSeedData = (seedDataFile) => {
    try {
        const { recipes } = getAllRecipes();
        
        // Only initialize if recipes array is empty
        if (recipes.length === 0) {
            const seedData = fs.readFileSync(seedDataFile, 'utf8');
            saveRecipes(JSON.parse(seedData));
            console.log('Recipes initialized with seed data');
            return true;
        }
        
        return false; // No initialization needed
    } catch (error) {
        console.error('Error initializing recipes with seed data:', error);
        return false;
    }
};

module.exports = {
    getAllRecipes,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    initializeWithSeedData
}; 