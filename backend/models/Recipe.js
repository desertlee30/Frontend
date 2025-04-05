/**
 * Recipe Model
 * Handles operations related to recipes in the application
 */

const fs = require('fs');
const path = require('path');
const config = require('../azure-config'); // Import the Azure config

// Path to recipes JSON file - use the config dataPath for flexibility
const getRecipesFilePath = () => {
  // Default data paths
  const dataDir = path.resolve(config.dataPath);
  const recipesFilePath = path.join(dataDir, 'recipes.json');
  
  // Create fallback paths to check
  const fallbackPaths = [
    recipesFilePath,
    path.join(__dirname, '..', 'data', 'recipes.json'),
    path.join(__dirname, '..', '..', 'db', 'recipes.json'),
    path.join(process.cwd(), 'db', 'recipes.json'),
    path.join(process.cwd(), 'data', 'recipes.json'),
    path.join(process.cwd(), 'backend', 'data', 'recipes.json')
  ];
  
  // Log search paths for debugging
  console.log('Searching for recipes.json in these locations:');
  fallbackPaths.forEach(p => console.log(` - ${p}`));
  
  // Find the first path that exists
  for (const checkPath of fallbackPaths) {
    if (fs.existsSync(checkPath)) {
      console.log(`Found recipes.json at: ${checkPath}`);
      return checkPath;
    }
  }
  
  // If no file exists, default to the config path (we'll create it)
  console.log(`No existing recipes.json found. Will create at: ${recipesFilePath}`);
  return recipesFilePath;
};

// Ensure recipes.json exists
const ensureRecipesFile = () => {
    const dataDir = path.resolve(config.dataPath);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`Created data directory at: ${dataDir}`);
    }
    
    const recipesFilePath = getRecipesFilePath();
    
    // Create recipes.json with sample data if it doesn't exist
    if (!fs.existsSync(recipesFilePath)) {
        // Sample recipe data
        const sampleRecipes = {
            recipes: [
                {
                    id: 1,
                    title: "Sample Healthy Salad",
                    description: "A nutritious salad with mixed greens, grilled chicken, and light vinaigrette.",
                    image: "https://via.placeholder.com/300x200?text=Salad",
                    time: 15,
                    calories: 320,
                    nutrition: { protein: 28, carbs: 12, fat: 15 },
                    tags: ["healthy", "quick", "high-protein"],
                    ingredients: ["Mixed greens", "Grilled chicken", "Cherry tomatoes", "Cucumber", "Olive oil", "Balsamic vinegar", "Salt", "Pepper"]
                },
                {
                    id: 2,
                    title: "Protein Smoothie Bowl",
                    description: "Refreshing smoothie bowl loaded with fruits and protein powder.",
                    image: "https://via.placeholder.com/300x200?text=Smoothie",
                    time: 10,
                    calories: 280,
                    nutrition: { protein: 22, carbs: 35, fat: 5 },
                    tags: ["breakfast", "high-protein", "vegetarian"],
                    ingredients: ["Frozen banana", "Frozen berries", "Protein powder", "Almond milk", "Chia seeds", "Granola"]
                }
            ]
        };
        
        fs.writeFileSync(recipesFilePath, JSON.stringify(sampleRecipes, null, 2));
        console.log(`Created recipes.json with sample data at: ${recipesFilePath}`);
    }
    
    return recipesFilePath;
};

// Get all recipes
const getAllRecipes = () => {
    try {
        const recipesFilePath = ensureRecipesFile();
        console.log(`Reading recipes from: ${recipesFilePath}`);
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
        const recipesFilePath = ensureRecipesFile();
        fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));
        console.log(`Saved recipes to: ${recipesFilePath}`);
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