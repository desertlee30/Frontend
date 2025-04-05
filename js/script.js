/**
 * General site functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script.js loaded');
    
    // Initialize any global site functionality here
    
    // Fix any links that need to be active based on current page
    setActiveNavLinks();
});

/**
 * Set active class on navigation links based on current page
 */
function setActiveNavLinks() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Set active class based on href
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pageName || 
            (pageName === '' && href === 'index.html') || 
            (pageName === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
} 