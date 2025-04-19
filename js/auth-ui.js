/**
 * Authentication UI Handler
 * This file manages the UI changes based on user authentication status
 * across all pages of the application.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth UI initialized');
    
    // Update UI based on authentication status
    updateAuthUI();
    
    // Add logout functionality
    setupLogoutHandler();
});

/**
 * Updates UI elements based on user authentication status
 */
function updateAuthUI() {
    const isLoggedIn = checkIfLoggedIn();
    
    console.log('Auth status:', isLoggedIn ? 'Logged in' : 'Not logged in');

    // Elements to show when logged in
    const loggedInElements = document.querySelectorAll('.show-when-logged-in');
    
    // Elements to hide when logged in
    const loggedOutElements = document.querySelectorAll('.hide-when-logged-in');
    
    // Elements to disable when logged in (specifically the side navigation, NOT the logout button)
    const disableElements = document.querySelectorAll('.side-nav-disabled-when-logged-in');
    
    if (isLoggedIn) {
        const userData = getUserData();
        if (userData) {
            console.log('User:', userData);
        }
        
        // Show elements for logged in users
        loggedInElements.forEach(el => {
            el.style.display = '';
            el.classList.remove('hidden');
        });
        
        // Hide elements for logged out users
        loggedOutElements.forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
        
        // Disable ONLY the side navigation elements, NOT logout button
        disableElements.forEach(el => {
            // Check if the element is not the logout button
            if (!el.classList.contains('logout-btn')) {
                el.classList.add('disabled');
                // Only add disabled attribute for actual buttons/inputs, not links
                if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
                    el.setAttribute('disabled', 'true');
                    el.setAttribute('aria-disabled', 'true');
                }
            }
        });
        
        // Ensure logout button is active and visible
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.classList.remove('disabled');
            logoutBtn.removeAttribute('disabled');
            logoutBtn.setAttribute('aria-disabled', 'false');
            logoutBtn.style.display = '';
        }
        
        // Update user-specific elements (like navbar login button text)
        const loginLink = document.querySelector('.login-link'); // The main Login In button
        if (loginLink && userData && userData.lastName) {
            loginLink.textContent = userData.lastName; // Show last name
            loginLink.href = '#'; // Change link behavior if needed, e.g., to profile page
            loginLink.title = `Logged in as ${userData.firstName || ''} ${userData.lastName}`.trim();
        }
        
    } else {
        // Hide elements for logged in users
        loggedInElements.forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
        
        // Show elements for logged out users
        loggedOutElements.forEach(el => {
            el.style.display = '';
            el.classList.remove('hidden');
        });
        
        // Enable elements
        disableElements.forEach(el => {
            el.classList.remove('disabled');
            el.removeAttribute('disabled');
            el.setAttribute('aria-disabled', 'false');
        });

        // Reset login button text and link
        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
            loginLink.textContent = 'Login In';
            loginLink.href = 'login.html';
            loginLink.title = 'Login to your account';
        }
    }
}

/**
 * Sets up logout functionality 
 */
function setupLogoutHandler() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        console.log('Setting up logout on logout button');
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Logout clicked');
            
            // Clear authentication data from localStorage using the correct keys
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('wellness_users'); // Optional: Clear demo users too
            
            // Show confirmation
            alert('You have been logged out successfully.');
            
            // Update UI immediately
            updateAuthUI();
            
            // Redirect to home page or refresh
            const currentPage = window.location.pathname.split('/').pop();
            // Add any pages here that require login
            const protectedPages = ['profile.html']; 
            
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'index.html';
            } else {
                // Refresh the current page to reflect logged-out state reliably
                window.location.reload(); 
            }
        });
    }
}

// Check if user is logged in using the correct keys
function checkIfLoggedIn() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    return !!(token && userData);
}

// Get user data using the correct key
function getUserData() {
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
        try {
            return JSON.parse(userDataString);
        } catch (error) {
            console.error('Error parsing current user data:', error);
            // Clear potentially corrupted data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            return null;
        }
    }
    return null;
}

// Re-check authentication status when the storage changes (e.g., in another tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'authToken' || e.key === 'currentUser') {
        console.log('Storage changed, updating Auth UI');
        updateAuthUI();
    }
}); 