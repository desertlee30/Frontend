// DOM Elements
const filterTagsContainer = document.getElementById('filterTags');
const activeFiltersText = document.getElementById('activeFiltersText');
const clearFiltersButton = document.getElementById('clearFilters');
const recipesGrid = document.getElementById('recipesGrid');
const toastNotification = document.getElementById('toastNotification');
const particlesContainer = document.getElementById('particlesContainer');

// State
const state = {
  recipes: [],
  allTags: [],
  activeFilters: [],
  savedRecipes: []
};

// Initialize
const init = () => {
  loadRecipes();
  
  // Event listeners
  clearFiltersButton.addEventListener('click', handleClearFilters);
};

// Load recipes - embedded data instead of fetch to avoid CORS issues
const loadRecipes = async () => {
  try {
    // Embedded recipes data
    const recipesData = {
      "recipes": [
        {
          "id": 1,
          "title": "Greek Yogurt Protein Bowl",
          "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 15,
          "calories": 320,
          "tags": ["High-Protein", "Low-Carb", "Quick Meals"],
          "description": "A delicious protein-packed breakfast bowl with Greek yogurt, berries, and nuts.",
          "nutrition": {
            "protein": 25,
            "carbs": 20,
            "fat": 12
          },
          "ingredients": ["Greek yogurt", "Mixed berries", "Almonds", "Honey"]
        },
        {
          "id": 2,
          "title": "Mediterranean Quinoa Salad",
          "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 25,
          "calories": 410,
          "tags": ["Vegan", "Family-Friendly"],
          "description": "A refreshing and colorful Mediterranean quinoa salad with fresh vegetables and herbs.",
          "nutrition": {
            "protein": 14,
            "carbs": 45,
            "fat": 18
          },
          "ingredients": ["Quinoa", "Cucumber", "Tomatoes", "Red onion", "Olive oil", "Lemon juice"]
        },
        {
          "id": 3,
          "title": "Avocado Chicken Salad",
          "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 20,
          "calories": 450,
          "tags": ["High-Protein", "Low-Carb"],
          "description": "A creamy and satisfying chicken salad with avocado dressing.",
          "nutrition": {
            "protein": 35,
            "carbs": 12,
            "fat": 28
          },
          "ingredients": ["Chicken breast", "Avocado", "Greek yogurt", "Lemon juice", "Mixed greens"]
        },
        {
          "id": 4,
          "title": "Chocolate Peanut Butter Protein Smoothie",
          "image": "https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 10,
          "calories": 380,
          "tags": ["High-Protein", "Quick Meals"],
          "description": "A creamy and satisfying protein smoothie that tastes like dessert.",
          "nutrition": {
            "protein": 30,
            "carbs": 35,
            "fat": 14
          },
          "ingredients": ["Banana", "Protein powder", "Peanut butter", "Cocoa powder", "Almond milk"]
        },
        {
          "id": 5,
          "title": "Keto Breakfast Egg Muffins",
          "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 30,
          "calories": 280,
          "tags": ["Keto", "High-Protein", "Low-Carb"],
          "description": "Easy make-ahead breakfast egg muffins packed with protein and veggies.",
          "nutrition": {
            "protein": 22,
            "carbs": 4,
            "fat": 20
          },
          "ingredients": ["Eggs", "Spinach", "Bell peppers", "Cheese", "Bacon"]
        },
        {
          "id": 6,
          "title": "Vegan Buddha Bowl",
          "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 35,
          "calories": 520,
          "tags": ["Vegan", "Family-Friendly"],
          "description": "A nutrient-packed vegan buddha bowl with roasted vegetables and tahini dressing.",
          "nutrition": {
            "protein": 15,
            "carbs": 68,
            "fat": 22
          },
          "ingredients": ["Quinoa", "Sweet potato", "Chickpeas", "Avocado", "Kale", "Tahini"]
        },
        {
          "id": 7,
          "title": "Zucchini Noodles with Pesto",
          "image": "https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 20,
          "calories": 310,
          "tags": ["Low-Carb", "Quick Meals", "Vegan"],
          "description": "Light and fresh zucchini noodles tossed with homemade pesto sauce.",
          "nutrition": {
            "protein": 10,
            "carbs": 12,
            "fat": 26
          },
          "ingredients": ["Zucchini", "Fresh basil", "Pine nuts", "Garlic", "Olive oil"]
        },
        {
          "id": 8,
          "title": "Keto Bacon Cheeseburger Soup",
          "image": "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          "time": 45,
          "calories": 590,
          "tags": ["Keto", "High-Protein", "Family-Friendly"],
          "description": "A hearty and satisfying keto soup that tastes just like a bacon cheeseburger.",
          "nutrition": {
            "protein": 38,
            "carbs": 6,
            "fat": 48
          },
          "ingredients": ["Ground beef", "Bacon", "Cheddar cheese", "Onion", "Heavy cream"]
        }
      ]
    };
    
    // Store recipes and extract all unique tags
    state.recipes = recipesData.recipes;
    extractAllTags();
    
    // Render UI
    renderFilterTags();
    renderRecipeCards();
    
  } catch (error) {
    console.error('Error loading recipes:', error);
    recipesGrid.innerHTML = `<div class="recipe-placeholder">Error loading recipes. Please try again later.</div>`;
  }
};

// Extract all unique tags from recipes
const extractAllTags = () => {
  const tagsSet = new Set();
  
  state.recipes.forEach(recipe => {
    recipe.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  
  state.allTags = Array.from(tagsSet).sort();
};

// Render filter tags
const renderFilterTags = () => {
  filterTagsContainer.innerHTML = '';
  
  state.allTags.forEach(tag => {
    const isActive = state.activeFilters.includes(tag);
    const tagElement = document.createElement('div');
    tagElement.className = `filter-tag${isActive ? ' active' : ''}`;
    tagElement.textContent = tag;
    tagElement.setAttribute('tabindex', '0');
    tagElement.setAttribute('aria-label', `Filter by ${tag}`);
    
    // Event listeners
    tagElement.addEventListener('click', () => handleFilterTagClick(tag));
    tagElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFilterTagClick(tag);
      }
    });
    
    filterTagsContainer.appendChild(tagElement);
  });
  
  updateActiveFiltersText();
};

// Handle filter tag click
const handleFilterTagClick = (tag) => {
  if (state.activeFilters.includes(tag)) {
    // Remove tag if already active
    state.activeFilters = state.activeFilters.filter(t => t !== tag);
  } else {
    // Add tag to active filters
    state.activeFilters.push(tag);
  }
  
  // Update UI
  renderFilterTags();
  applyFilters();
};

// Update active filters text
const updateActiveFiltersText = () => {
  if (state.activeFilters.length === 0) {
    activeFiltersText.textContent = 'None';
  } else {
    activeFiltersText.textContent = state.activeFilters.join(', ');
  }
};

// Handle clear filters
const handleClearFilters = () => {
  state.activeFilters = [];
  renderFilterTags();
  applyFilters();
};

// Render recipe cards
const renderRecipeCards = () => {
  recipesGrid.innerHTML = '';
  
  state.recipes.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipesGrid.appendChild(recipeCard);
  });
};

// Create recipe card
const createRecipeCard = (recipe) => {
  const cardElement = document.createElement('div');
  cardElement.className = 'recipe-card';
  cardElement.setAttribute('data-id', recipe.id);
  
  // Check if recipe matches active filters
  const matchesFilters = state.activeFilters.length === 0 || 
    state.activeFilters.every(tag => recipe.tags.includes(tag));
  
  if (matchesFilters) {
    cardElement.classList.add('filter-active');
  } else {
    cardElement.classList.add('filter-inactive');
  }
  
  // Card inner elements (front and back)
  cardElement.innerHTML = `
    <div class="recipe-card-inner">
      <!-- Front of card -->
      <div class="recipe-card-front">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
        <div class="recipe-content">
          <h3 class="recipe-title">${recipe.title}</h3>
          <div class="recipe-stats">
            <div class="stat">
              <span class="stat-value">${recipe.time}</span>
              <span class="stat-label">mins</span>
            </div>
            <div class="stat">
              <span class="stat-value">${recipe.calories}</span>
              <span class="stat-label">kcal</span>
            </div>
          </div>
          <div class="recipe-tags">
            ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      
      <!-- Back of card -->
      <div class="recipe-card-back">
        <h3 class="back-title">${recipe.title}</h3>
        <p class="recipe-description">${recipe.description}</p>
        
        <div class="nutrition-facts">
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.protein}g</span>
            <span class="nutrition-label">Protein</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.carbs}g</span>
            <span class="nutrition-label">Carbs</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-value">${recipe.nutrition.fat}g</span>
            <span class="nutrition-label">Fat</span>
          </div>
        </div>
        
        <div class="ingredients-list">
          <h4>Ingredients</h4>
          <div class="ingredients">
            ${recipe.ingredients.map(ingredient => `<span class="ingredient">${ingredient}</span>`).join('')}
          </div>
        </div>
        
        <button class="save-button" aria-label="Save recipe">
          <i class="fas fa-bookmark"></i> Save Recipe
        </button>
      </div>
    </div>
  `;
  
  // Event listeners
  const cardInner = cardElement.querySelector('.recipe-card-inner');
  
  // Flip card
  cardInner.addEventListener('click', () => {
    cardElement.classList.toggle('flipped');
  });
  
  // Keyboard accessibility for flipping
  cardInner.setAttribute('tabindex', '0');
  cardInner.setAttribute('aria-label', `Recipe: ${recipe.title}. Press Enter to see details`);
  cardInner.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cardElement.classList.toggle('flipped');
    }
  });
  
  // Save button functionality
  const saveButton = cardElement.querySelector('.save-button');
  saveButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card flip
    handleSaveRecipe(recipe, e);
  });
  
  return cardElement;
};

// Apply filters to recipe cards
const applyFilters = () => {
  const recipeCards = document.querySelectorAll('.recipe-card');
  
  recipeCards.forEach(card => {
    const recipeId = parseInt(card.getAttribute('data-id'));
    const recipe = state.recipes.find(r => r.id === recipeId);
    
    const matchesFilters = state.activeFilters.length === 0 || 
      state.activeFilters.every(tag => recipe.tags.includes(tag));
    
    // Add or remove appropriate classes
    if (matchesFilters) {
      card.classList.remove('filter-inactive');
      card.classList.add('filter-active');
    } else {
      card.classList.remove('filter-active');
      card.classList.add('filter-inactive');
    }
  });
  
  // Use GSAP for smooth animation
  gsap.to('.filter-active', {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.4,
    stagger: 0.05
  });
  
  gsap.to('.filter-inactive', {
    opacity: 0.5,
    scale: 0.95,
    filter: 'blur(2px)',
    duration: 0.4,
    stagger: 0.05
  });
};

// Handle save recipe
const handleSaveRecipe = (recipe, event) => {
  // Check if already saved
  if (state.savedRecipes.includes(recipe.id)) {
    showToast('Recipe already saved!');
    return;
  }
  
  // Save recipe ID
  state.savedRecipes.push(recipe.id);
  
  // Show toast notification
  showToast('Recipe saved successfully!');
  
  // Create particles at button location
  createParticles(event);
};

// Show toast notification
const showToast = (message) => {
  const toastMessage = toastNotification.querySelector('.toast-message');
  toastMessage.textContent = message;
  
  // Show and then hide toast
  toastNotification.classList.add('show');
  
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3000);
};

// Create particle effects
const createParticles = (event) => {
  const numParticles = 15;
  const colors = ['#4e54c8', '#8f94fb', '#ff6b6b'];
  const buttonRect = event.target.getBoundingClientRect();
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  
  // Create particles
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 8 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Position at button center
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    
    // Style particle
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    particlesContainer.appendChild(particle);
    
    // Animate with GSAP
    gsap.to(particle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      duration: 1 + Math.random(),
      ease: 'power2.out',
      onComplete: () => {
        particle.remove();
      }
    });
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

// jQuery implementation for those who prefer jQuery
$(document).ready(function() {
  // Additional jQuery functionality can be added here
  
  // Example: Hover effect for filter tags with jQuery
  $(document).on('mouseenter', '.filter-tag', function() {
    $(this).css('transform', 'translateY(-2px)');
  });
  
  $(document).on('mouseleave', '.filter-tag', function() {
    $(this).css('transform', 'translateY(0)');
  });
  
  // Example: Add jQuery hover-based filtering
  let hoverTimeout;
  
  $(document).on('mouseenter', '.filter-tag', function() {
    const tag = $(this).text();
    
    // Clear any existing timeout
    clearTimeout(hoverTimeout);
    
    // Set a timeout for preview filtering
    hoverTimeout = setTimeout(() => {
      // Preview filter without actually setting it
      $('.recipe-card').each(function() {
        const recipeId = parseInt($(this).data('id'));
        const recipe = state.recipes.find(r => r.id === recipeId);
        
        if (recipe.tags.includes(tag)) {
          $(this).addClass('filter-active').removeClass('filter-inactive');
        } else {
          $(this).addClass('filter-inactive').removeClass('filter-active');
        }
      });
      
      // Animate with GSAP
      gsap.to('.filter-active', {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.3
      });
      
      gsap.to('.filter-inactive', {
        opacity: 0.5,
        scale: 0.95,
        filter: 'blur(2px)',
        duration: 0.3
      });
    }, 300); // Delay for hover preview
  });
  
  $(document).on('mouseleave', '.filter-tag', function() {
    // Clear the timeout
    clearTimeout(hoverTimeout);
    
    // Restore original filter state after a short delay
    setTimeout(() => {
      applyFilters();
    }, 200);
  });
}); 