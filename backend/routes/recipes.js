/**
 * Recipe Routes
 * API endpoints for recipe operations
 */

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const path = require('path');

// Get all recipes
router.get('/', (req, res) => {
    try {
        const { recipes } = Recipe.getAllRecipes();
        res.json({ recipes });
    } catch (error) {
        console.error('Error getting recipes:', error);
        res.status(500).json({ error: 'Server error while retrieving recipes' });
    }
});

// Get recipe by ID
router.get('/:id', (req, res) => {
    try {
        const recipe = Recipe.getRecipeById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        res.json({ recipe });
    } catch (error) {
        console.error('Error getting recipe by ID:', error);
        res.status(500).json({ error: 'Server error while retrieving recipe' });
    }
});

// Add a new recipe (requires authentication - to be implemented)
router.post('/', (req, res) => {
    try {
        // Extract recipe data from request body
        const { title, description, image, time, calories, nutrition, tags, ingredients } = req.body;
        
        // Basic validation
        if (!title || !description || !image || !tags || !ingredients) {
            return res.status(400).json({ error: 'Missing required recipe fields' });
        }
        
        // Create recipe
        const newRecipe = Recipe.addRecipe({
            title,
            description,
            image,
            time: time || 0,
            calories: calories || 0,
            nutrition: nutrition || { protein: 0, carbs: 0, fat: 0 },
            tags: Array.isArray(tags) ? tags : [],
            ingredients: Array.isArray(ingredients) ? ingredients : []
        });
        
        if (!newRecipe) {
            return res.status(500).json({ error: 'Failed to create recipe' });
        }
        
        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Server error while creating recipe' });
    }
});

// Update a recipe (requires authentication - to be implemented)
router.put('/:id', (req, res) => {
    try {
        const recipeId = req.params.id;
        
        // Check if recipe exists
        const existingRecipe = Recipe.getRecipeById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        // Extract recipe data from request body
        const { title, description, image, time, calories, nutrition, tags, ingredients } = req.body;
        
        // Update recipe
        const updatedRecipe = Recipe.updateRecipe(recipeId, {
            title,
            description,
            image,
            time,
            calories,
            nutrition,
            tags,
            ingredients
        });
        
        if (!updatedRecipe) {
            return res.status(500).json({ error: 'Failed to update recipe' });
        }
        
        res.json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Server error while updating recipe' });
    }
});

// Delete a recipe (requires authentication - to be implemented)
router.delete('/:id', (req, res) => {
    try {
        const recipeId = req.params.id;
        
        // Check if recipe exists
        const existingRecipe = Recipe.getRecipeById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        // Delete recipe
        const deleted = Recipe.deleteRecipe(recipeId);
        
        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete recipe' });
        }
        
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Server error while deleting recipe' });
    }
});

module.exports = router; 