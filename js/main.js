// Scroll effects for the website

// Variables to track scroll position and state
let lastScrollY = window.scrollY;
let ticking = false;

// Function to handle navbar visibility based on scroll position
function handleNavbarVisibility() {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('.about-section');
    // Ensure aboutSection exists before trying to get its offsetTop
    if (!aboutSection) return;
    const aboutSectionTop = aboutSection.offsetTop;
    const scrollY = window.scrollY;
    
    // If we've scrolled past the about section
    if (scrollY >= aboutSectionTop - 100) {
        // Hide navbar when scrolling down
        if (scrollY > lastScrollY) {
            navbar.classList.add('hidden');
        } 
        // Show navbar when scrolling up
        else {
            navbar.classList.remove('hidden');
        }
    } else {
        // Always show navbar before the about section
        navbar.classList.remove('hidden');
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

// Function to handle parallax effects
function handleParallaxEffects() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Hero parallax effect (content moving)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrollY < windowHeight) {
        heroContent.style.transform = `translateY(-${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrollY * 0.002);
    }
    
    // Background position parallax for About and Food sections
    applyBackgroundParallax('.about-image');
    applyBackgroundParallax('.food-image');
}

// Helper function for background position parallax
function applyBackgroundParallax(elementSelector) {
    const element = document.querySelector(elementSelector);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if the element is in the viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate the element's center position relative to the viewport center
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        
        // Calculate the difference (negative when element center is above viewport center)
        const diff = viewportCenter - elementCenter;
        
        // Calculate the parallax factor (adjust this multiplier for intensity)
        // A smaller multiplier means less movement
        const parallaxFactor = 0.1;
        const backgroundOffsetY = 50 + (diff * parallaxFactor); // Start at 50% and adjust
        
        // Clamp the value between 0% and 100% to prevent excessive movement
        const clampedOffsetY = Math.max(0, Math.min(100, backgroundOffsetY));
        
        // Apply the background position
        element.style.backgroundPosition = `center ${clampedOffsetY}%`;
    } 
    // Optional: Reset position when outside viewport if needed
    // else {
    //     element.style.backgroundPosition = `center 50%`;
    // }
}

// Initial call to set correct state on page load
handleParallaxEffects(); 

// Attach scroll event listener with throttling for better performance
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleNavbarVisibility();
            handleParallaxEffects();
        });
        ticking = true;
    }
}); 