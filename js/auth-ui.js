/**
 * Authentication UI Handler
 * This file manages the UI changes based on user authentication status
 * across all pages of the application.
 */

$(document).ready(function() {
    console.log('Auth UI initialized');
    
    // Update UI based on authentication status
    updateAuthUI();
    
    // Add logout functionality
    setupLogout();
});

/**
 * Updates UI elements based on user authentication status
 */
function updateAuthUI() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isLoggedIn = authToken && currentUser && currentUser.lastName;
    
    console.log('Auth status:', isLoggedIn ? 'Logged in' : 'Not logged in');
    if (isLoggedIn) {
        console.log('User:', currentUser);
    }
    
    // Get all login buttons across the site
    const $loginBtn = $('.login-btn, .nav-login-btn');
    const $loginLink = $('.login-link');
    
    // Get logout button
    const $logoutBtn = $('.logout-btn');
    
    // Get side navigation buttons that should be disabled when logged in
    const $sideButtons = $('.side-nav-disabled-when-logged-in');
    
    if (isLoggedIn) {
        // User is logged in
        
        // Update login button text to show user's last name
        if ($loginBtn.length) {
            $loginBtn.text(currentUser.lastName);
            $loginBtn.addClass('logged-in');
        }
        
        // Update login link href to profile page (if it exists)
        if ($loginLink.length) {
            $loginLink.attr('href', 'profile.html');
            $loginLink.attr('title', `Logged in as ${currentUser.firstName} ${currentUser.lastName}`);
        }
        
        // Ensure logout button is visible
        if ($logoutBtn.length) {
            console.log('Making logout button visible');
            $logoutBtn.show();
        }
        
        // Disable side buttons
        if ($sideButtons.length) {
            $sideButtons.addClass('disabled');
            $sideButtons.attr('disabled', 'disabled');
            $sideButtons.attr('aria-disabled', 'true');
        }
        
        // Show elements that should only be visible when logged in
        $('.show-when-logged-in').removeClass('hidden').show();
        
        // Hide elements that should be hidden when logged in
        $('.hide-when-logged-in').addClass('hidden').hide();
    } else {
        // User is not logged in
        
        // Ensure login button shows "Login"
        if ($loginBtn.length) {
            $loginBtn.text('Login');
            $loginBtn.removeClass('logged-in');
        }
        
        // Ensure login link goes to login page
        if ($loginLink.length) {
            $loginLink.attr('href', 'login.html');
            $loginLink.attr('title', 'Login to your account');
        }
        
        // Hide logout button
        if ($logoutBtn.length) {
            console.log('Hiding logout button');
            $logoutBtn.hide();
        }
        
        // Enable side buttons
        if ($sideButtons.length) {
            $sideButtons.removeClass('disabled');
            $sideButtons.removeAttr('disabled');
            $sideButtons.attr('aria-disabled', 'false');
        }
        
        // Hide elements that should only be visible when logged in
        $('.show-when-logged-in').addClass('hidden').hide();
        
        // Show elements that should be visible when logged out
        $('.hide-when-logged-in').removeClass('hidden').show();
    }
}

/**
 * Sets up logout functionality 
 */
function setupLogout() {
    // Find all logout buttons
    const $logoutBtn = $('.logout-btn');
    
    console.log('Setting up logout on', $logoutBtn.length, 'buttons');
    
    $logoutBtn.on('click', function(e) {
        e.preventDefault();
        
        console.log('Logout clicked');
        
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Show confirmation
        alert('You have been logged out successfully');
        
        // Update UI
        updateAuthUI();
        
        // Redirect to home page if on a protected page
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['profile.html', 'dashboard.html', 'settings.html'];
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        } else {
            // Just refresh the current page
            location.reload();
        }
    });
} 