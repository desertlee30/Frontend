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
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`Created data directory at: ${dataDir}`);
    }
    
    // Create recipes.json with empty array if it doesn't exist
    if (!fs.existsSync(recipesFilePath)) {
        // Sample recipe data
        const sampleRecipes = {
            recipes: [
                {
                    id: 1,
                    title: "Grilled Chicken Salad",
                    description: "A healthy and protein-rich salad with grilled chicken breast, mixed greens, and a light lemon dressing.",
                    image: "https://placehold.co/300x200/png?text=GrilledChickenSalad",
                    time: 20,
                    calories: 350,
                    nutrition: {
                        protein: 30,
                        carbs: 15,
                        fat: 12
                    },
                    tags: ["high-protein", "low-carb", "keto", "lunch"],
                    ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon juice", "Salt", "Pepper"]
                },
                {
                    id: 2,
                    title: "Protein Smoothie Bowl",
                    description: "A delicious post-workout smoothie bowl with protein powder, berries, and banana.",
                    image: "https://placehold.co/300x200/png?text=SmoothieBowl",
                    time: 10,
                    calories: 320,
                    nutrition: {
                        protein: 25,
                        carbs: 40,
                        fat: 8
                    },
                    tags: ["breakfast", "high-protein", "vegetarian", "quick"],
                    ingredients: ["Protein powder", "Frozen berries", "Banana", "Greek yogurt", "Almond milk", "Honey", "Granola", "Chia seeds"]
                },
                {
                    id: 3,
                    title: "Baked Salmon with Vegetables",
                    description: "Oven-baked salmon fillet with roasted vegetables and herbs.",
                    image: "https://placehold.co/300x200/png?text=BakedSalmon",
                    time: 35,
                    calories: 420,
                    nutrition: {
                        protein: 35,
                        carbs: 25,
                        fat: 20
                    },
                    tags: ["dinner", "high-protein", "omega-3", "fish"],
                    ingredients: ["Salmon fillet", "Asparagus", "Bell peppers", "Cherry tomatoes", "Olive oil", "Garlic", "Lemon", "Fresh herbs"]
                }
            ]
        };
        
        fs.writeFileSync(recipesFilePath, JSON.stringify(sampleRecipes, null, 2), 'utf8');
        console.log(`Created recipes.json with sample data at: ${recipesFilePath}`);
    }
    
    return recipesFilePath;
};

// Get all recipes
const getAllRecipes = () => {
    try {
        const recipesPath = ensureRecipesFile();
        console.log(`Reading recipes from: ${recipesPath}`);
        const data = fs.readFileSync(recipesPath, 'utf8');
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