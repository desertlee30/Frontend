// DOM Elements
const filterTagsContainer = document.getElementById('filterTags');
const activeFiltersText = document.getElementById('activeFiltersText');
const clearFiltersButton = document.getElementById('clearFilters');
const recipesGrid = document.getElementById('recipesGrid');
const toastNotification = document.getElementById('toastNotification');
const particlesContainer = document.getElementById('particlesContainer');

// API URL for VM deployment
const API_URL = 'http://20.2.210.82:3000/api';

// Backup recipes data in case both API and local file fail
const backupRecipes = {
  "recipes": [
    {
      "id": 1,
      "title": "Greek Yogurt Protein Bowl",
      "image": "Receipt/GreekBowl.png",
      "time": 15,
      "calories": 320,
      "tags": [
        "High Protein",
        "Low Carb",
        "Quick Meals"
      ],
      "description": "A delicious protein packed breakfast bowl with Greek yogurt, berries, and nuts.",
      "nutrition": {
        "protein": 25,
        "carbs": 20,
        "fat": 12
      },
      "ingredients": [
        "Greek yogurt",
        "Mixed berries",
        "Almonds",
        "Honey"
      ]
    },
    {
      "id": 2,
      "title": "Mediterranean Quinoa Salad",
      "image": "Receipt/MediterraneanSalad.png",
      "time": 25,
      "calories": 410,
      "tags": [
        "Vegan",
        "Family Friendly"
      ],
      "description": "A refreshing and colorful Mediterranean quinoa salad with fresh vegetables and herbs.",
      "nutrition": {
        "protein": 14,
        "carbs": 45,
        "fat": 18
      },
      "ingredients": [
        "Quinoa",
        "Cucumber",
        "Tomatoes",
        "Red onion",
        "Olive oil",
        "Lemon juice"
      ]
    },
    {
      "id": 3,
      "title": "Avocado Chicken Salad",
      "image": "Receipt/AvocadoChicken.png",
      "time": 20,
      "calories": 450,
      "tags": [
        "High Protein",
        "Low Carb"
      ],
      "description": "A creamy and satisfying chicken salad with avocado dressing.",
      "nutrition": {
        "protein": 35,
        "carbs": 12,
        "fat": 28
      },
      "ingredients": [
        "Chicken breast",
        "Avocado",
        "Greek yogurt",
        "Lemon juice",
        "Mixed greens"
      ]
    }
  ]
};

// State
const state = {
  recipes: [],
  allTags: [],
  activeFilters: [],
  savedRecipes: []
};

// Initialize
const init = () => {
  // Load saved recipes from localStorage
  loadSavedRecipesFromStorage();
  
  // Load recipes data
  loadRecipes();
  
  // Set up event listeners
  clearFiltersButton.addEventListener('click', handleClearFilters);
  
  // Set up modal-related event listeners
  setupModalEventListeners();
  
  // Set up auth modal event listeners
  setupAuthModalEventListeners();

  // Set up scroll-to-top functionality
  setupScrollToTop();

  // Set up "more" indicator functionality
  setupMoreIndicator();
  
  // Set up scroll down arrow functionality
  setupScrollDownArrow();
  
  // Set up video background
  setupVideoBackground();
};

// Set up event listeners for modal
const setupModalEventListeners = () => {
  const savedRecipesButton = document.getElementById('savedRecipesButton');
  const modalCloseButton = document.getElementById('modalCloseButton');
  const modalOverlay = document.getElementById('savedRecipesModalOverlay');
  
  savedRecipesButton.addEventListener('click', openSavedRecipesModal);
  modalCloseButton.addEventListener('click', closeSavedRecipesModal);
  modalOverlay.addEventListener('click', closeSavedRecipesModal);
  
  // Allow closing with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSavedRecipesModal();
    }
  });
};

// Open saved recipes modal
const openSavedRecipesModal = () => {
  const modal = document.getElementById('savedRecipesModal');
  const overlay = document.getElementById('savedRecipesModalOverlay');
  
  showSavedRecipes();
  
  modal.classList.add('show');
  overlay.classList.add('show');
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
};

// Close saved recipes modal
const closeSavedRecipesModal = () => {
  const modal = document.getElementById('savedRecipesModal');
  const overlay = document.getElementById('savedRecipesModalOverlay');
  
  modal.classList.remove('show');
  overlay.classList.remove('show');
  
  // Re-enable body scrolling
  document.body.style.overflow = 'auto';
};

// Open auth required modal
const openAuthModal = () => {
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authModalOverlay');
  
  if (!modal || !overlay) {
    console.error('Auth modal elements not found');
    return;
  }
  
  modal.classList.add('show');
  overlay.classList.add('show');
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
};

// Close auth required modal
const closeAuthModal = () => {
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authModalOverlay');
  
  if (!modal || !overlay) {
    console.error('Auth modal elements not found');
    return;
  }
  
  modal.classList.remove('show');
  overlay.classList.remove('show');
  
  // Re-enable body scrolling
  document.body.style.overflow = 'auto';
};

// Check if user is logged in (using the auth-ui.js function)
const isUserLoggedIn = () => {
  const authToken = localStorage.getItem('authToken');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return !!(authToken && currentUser && currentUser.lastName);
};

// Setup auth modal event listeners
const setupAuthModalEventListeners = () => {
  const closeButton = document.getElementById('authModalCloseButton');
  const cancelButton = document.getElementById('authModalCancelButton');
  const overlay = document.getElementById('authModalOverlay');
  
  if (closeButton) {
    closeButton.addEventListener('click', closeAuthModal);
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', closeAuthModal);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeAuthModal);
  }
  
  // Allow closing with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('authModal').classList.contains('show')) {
      closeAuthModal();
    }
  });
};

// Show saved recipes in modal
const showSavedRecipes = () => {
  const savedRecipesGrid = document.getElementById('savedRecipesGrid');
  const noSavedRecipes = document.getElementById('noSavedRecipes');
  
  // Clear current content
  savedRecipesGrid.innerHTML = '';
  
  // Get saved recipes
  const savedRecipes = state.recipes.filter(recipe => state.savedRecipes.includes(recipe.id));
  
  // Show message if no saved recipes
  if (savedRecipes.length === 0) {
    noSavedRecipes.classList.add('show');
    savedRecipesGrid.classList.remove('show');
    return;
  }
  
  // Hide message and show grid if we have saved recipes
  noSavedRecipes.classList.remove('show');
  savedRecipesGrid.classList.add('show');
  
  // Create card for each saved recipe
  savedRecipes.forEach(recipe => {
    const recipeCard = createSavedRecipeCard(recipe);
    savedRecipesGrid.appendChild(recipeCard);
  });
};

// Create a saved recipe card
const createSavedRecipeCard = (recipe) => {
  const cardElement = document.createElement('div');
  cardElement.className = 'recipe-card';
  cardElement.setAttribute('data-id', recipe.id);
  
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
        
        <button class="unsave-button" aria-label="Unsave recipe">
          <i class="fas fa-trash-alt"></i> Unsave Recipe
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
  
  // Unsave button functionality
  const unsaveButton = cardElement.querySelector('.unsave-button');
  unsaveButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card flip
    handleUnsaveRecipe(recipe.id, e);
  });
  
  return cardElement;
};

// Load saved recipes from localStorage
const loadSavedRecipesFromStorage = () => {
  const savedRecipes = localStorage.getItem('savedRecipes');
  if (savedRecipes) {
    state.savedRecipes = JSON.parse(savedRecipes);
    updateSavedCounter();
  }
};

// Update saved recipes counter
const updateSavedCounter = () => {
  const savedCounter = document.getElementById('savedCounter');
  if (savedCounter) {
    savedCounter.textContent = state.savedRecipes.length;
  }
};

// Save recipes to localStorage
const saveRecipesToStorage = () => {
  localStorage.setItem('savedRecipes', JSON.stringify(state.savedRecipes));
  updateSavedCounter();
};

// Load recipes using jQuery AJAX
const loadRecipes = () => {
  console.log(`Loading recipes from API: ${API_URL}/recipes...`);
  
  $.ajax({
    url: `${API_URL}/recipes`,
    type: 'GET',
    timeout: 5000, // Add timeout to prevent long waits
    success: function(data) {
      try {
        // Store recipes and extract all unique tags
        state.recipes = data.recipes;
        extractAllTags();

        // Render UI
        renderFilterTags();
        renderRecipeCards();
        console.log('Successfully loaded recipes from API');

      } catch (error) {
        console.error('Error processing recipe data:', error);
        fallbackToLocalData();
      }
    },
    error: function(xhr, status, error) {
      console.error(`Error loading recipes from ${API_URL}/recipes:`, status, error);
      console.error(`Error details: ${xhr.statusText}`);
      
      // Try loading from local file as fallback
      fallbackToLocalData();
    }
  });
};

// Fallback to local data if API fails
const fallbackToLocalData = () => {
  console.log('Attempting to load recipes from local file...');
  
  // First try loading from a local JSON file
  $.ajax({
    url: 'db/recipes.json',
    type: 'GET',
    dataType: 'json',
    timeout: 3000,
    success: function(data) {
      console.log('Successfully loaded recipes from local file');
      state.recipes = data.recipes;
      extractAllTags();
      renderFilterTags();
      renderRecipeCards();
    },
    error: function(xhr, status, error) {
      console.log('Local file load failed, using backup recipes data');
      console.error(`Error details: ${xhr.statusText}`);
      
      // Use the embedded backup data as last resort
      if (backupRecipes && backupRecipes.recipes) {
        console.log('Using embedded backup recipes');
        state.recipes = backupRecipes.recipes;
        extractAllTags();
        renderFilterTags();
        renderRecipeCards();
      } else {
        console.error('No backup recipes available - please check the data sources');
        // Show error message to user
        alert('Unable to load recipe data. Please try again later.');
      }
    }
  });
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
  
  // Check if user is not logged in and trying to save more than 2 recipes
  if (!isUserLoggedIn() && state.savedRecipes.length >= 2) {
    // Show auth required modal
    openAuthModal();
    return;
  }
  
  // Save recipe ID
  state.savedRecipes.push(recipe.id);
  
  // Save to localStorage
  saveRecipesToStorage();
  
  // Show toast notification
  showToast('Recipe saved successfully!');
  
  // Create particles at button location
  createParticles(event);
};

// Remove a recipe from saved recipes
const handleUnsaveRecipe = (recipeId, event) => {
  // Remove recipe ID from saved recipes
  state.savedRecipes = state.savedRecipes.filter(id => id !== recipeId);
  
  // Save updated list to localStorage
  saveRecipesToStorage();
  
  // Show toast notification
  showToast('Recipe removed from saved recipes');
  
  // Create particles at button location if event provided
  if (event) {
    createParticles(event);
  }
  
  // Update saved recipes modal if open
  if (document.getElementById('savedRecipesModal').classList.contains('show')) {
    showSavedRecipes();
  }
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
  const colors = ['#f5bc00', '#fabe70', '#ff6b6b'];
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

// Add: Scroll to Top Button Logic
const setupScrollToTop = () => {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const recipesGrid = document.getElementById('recipesGrid');
  const mainContainer = document.getElementById('main-container'); // Target for scrolling

  if (!scrollToTopBtn || !recipesGrid || !mainContainer) {
    console.warn('Scroll to top button, recipes grid, or main container not found.');
    return;
  }

  const handleScroll = () => {
    // Get the top position of the recipes grid relative to the viewport
    const recipesGridTop = recipesGrid.getBoundingClientRect().top + window.scrollY;

    // Show button if scrolled past the top of the recipes grid
    if (window.scrollY > recipesGridTop) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  };

  const handleScrollToTopClick = () => {
    mainContainer.scrollIntoView({ behavior: 'smooth' });
  };

  window.addEventListener('scroll', handleScroll);
  scrollToTopBtn.addEventListener('click', handleScrollToTopClick);
};

// Add: "More" Indicator Logic
const setupMoreIndicator = () => {
  const moreIndicator = document.getElementById('moreIndicator');
  const recipesGrid = document.getElementById('recipesGrid');
  const heroSection = document.querySelector('.meal-hero'); // Get the hero section

  if (!moreIndicator || !recipesGrid || !heroSection) {
    console.warn('More indicator, recipes grid, or hero section not found.');
    return;
  }

  let heroBottom = 0;
  let gridScrollThreshold = 0;

  // Function to calculate the thresholds
  const calculateThresholds = () => {
    const firstCard = recipesGrid.querySelector('.recipe-card');
    heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    
    if (!firstCard) { 
        gridScrollThreshold = heroBottom + 500; // Estimate if no cards yet
    } else {
        const cardHeight = firstCard.offsetHeight;
        // Disappear threshold: When top of viewport is ~1.5 card heights below the top of the grid
        gridScrollThreshold = recipesGrid.offsetTop + (cardHeight * 1.5); 
    }
  };

  const handleMoreIndicatorScroll = () => {
    const currentScroll = window.scrollY;

    // Show if scrolled past the hero bottom BUT before the grid threshold
    if (currentScroll > heroBottom && currentScroll < gridScrollThreshold) {
      moreIndicator.classList.add('show');
    } else {
      moreIndicator.classList.remove('show');
    }
  };

  // Initial calculation and setup with delay
  setTimeout(() => {
    calculateThresholds();
    handleMoreIndicatorScroll(); // Initial check
    window.addEventListener('scroll', handleMoreIndicatorScroll);
  }, 500); // Delay ensures elements are rendered

  // Recalculate on resize
  window.addEventListener('resize', () => {
      calculateThresholds();
      handleMoreIndicatorScroll(); // Re-check visibility
  });

};

// Set up scroll down arrow functionality
const setupScrollDownArrow = () => {
  const scrollArrow = document.getElementById('scroll-down-arrow');
  if (!scrollArrow) {
    console.warn('Scroll down arrow element not found');
    return;
  }
  
  // Add click event listener to smooth scroll to main container
  scrollArrow.addEventListener('click', () => {
    console.log('Scroll arrow clicked');
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
      mainContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Add fade-out effect on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    // Start fading out the arrow after 50px of scrolling
    if (scrollPosition > 50) {
      const opacity = Math.max(0, 1 - (scrollPosition - 50) / 200);
      scrollArrow.style.opacity = opacity;
    } else {
      scrollArrow.style.opacity = 1;
    }
  });
  
  console.log('Scroll down arrow functionality initialized');
};

// Set up video background to try multiple paths
const setupVideoBackground = () => {
  console.log('Setting up video background');
  
  // The video element should already be in the HTML with sources
  const videoElement = document.querySelector('.meal-hero video');
  
  if (!videoElement) {
    console.warn('Video element not found in the hero section');
    return;
  }
  
  // Log that we found the video element
  console.log('Video element found, setting up event listeners');
  
  // Add error event listener to detect if sources fail to load
  videoElement.addEventListener('error', (e) => {
    console.warn('Video error occurred:', e);
  });
  
  // Add loaded data event listener to confirm successful loading
  videoElement.addEventListener('loadeddata', () => {
    console.log('Video loaded successfully');
  });
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