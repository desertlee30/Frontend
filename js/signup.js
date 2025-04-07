/**
 * Signup Form Handler
 * This file manages user registration functionality
 */

$(document).ready(function() {
    console.log('Signup script initialized');
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    // Store redirect URL in session storage for later use
    if (redirectUrl) {
        sessionStorage.setItem('redirectAfterAuth', redirectUrl);
    }
    
    // Setup password toggle visibility
    setupPasswordToggles();
    
    // Setup form validation and submission
    setupSignupForm();
});

/**
 * Sets up password visibility toggles
 */
function setupPasswordToggles() {
    $('.toggle-password').on('click keypress', function(e) {
        // Handle both click and keyboard events (Enter and Space)
        if (e.type === 'keypress' && e.which !== 13 && e.which !== 32) {
            return;
        }
        
        const passwordField = $(this).siblings('input');
        const icon = $(this).find('i');
        
        // Toggle password visibility
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
}

/**
 * Sets up signup form validation and submission
 */
function setupSignupForm() {
    const $form = $('#signupForm');
    const $emailInput = $('#signupEmail');
    const $passwordInput = $('#signupPassword');
    const $confirmPasswordInput = $('#confirmPassword');
    const $emailError = $('#emailError');
    const $passwordError = $('#passwordError');
    const $confirmPasswordError = $('#confirmPasswordError');
    const $loadingSpinner = $('#loadingSpinner');
    
    // Form submission handler
    $form.on('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        resetErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading spinner
        $loadingSpinner.show();
        
        // Simulate API call with timeout
        setTimeout(function() {
            // Create user object
            const user = {
                firstName: $('#firstName').val().trim(),
                lastName: $('#lastName').val().trim(),
                email: $emailInput.val().trim(),
                dateOfBirth: $('#dateOfBirth').val(),
                password: $passwordInput.val() // In a real app, never store raw passwords
            };
            
            // Generate fake auth token
            const authToken = generateFakeToken();
            
            // Store in localStorage (In a real app, this would come from a server)
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }));
            
            // Hide spinner
            $loadingSpinner.hide();
            
            // Show success message
            alert('Account created successfully! You are now logged in.');
            
            // Redirect to index page or previous page
            const redirectUrl = getRedirectUrl();
            window.location.href = redirectUrl;
        }, 1500);
    });
    
    // Input event listeners for real-time validation
    $emailInput.on('blur', validateEmail);
    $passwordInput.on('input', validatePassword);
    $confirmPasswordInput.on('input', validateConfirmPassword);
    
    /**
     * Validates the entire form
     * @returns {boolean} Whether the form is valid
     */
    function validateForm() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        return isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }
    
    /**
     * Validates the email field
     * @returns {boolean} Whether the email is valid
     */
    function validateEmail() {
        const email = $emailInput.val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            $emailError.text('Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            $emailError.text('Please enter a valid email address');
            return false;
        }
        
        $emailError.text('');
        return true;
    }
    
    /**
     * Validates the password field
     * @returns {boolean} Whether the password is valid
     */
    function validatePassword() {
        const password = $passwordInput.val();
        
        if (!password) {
            $passwordError.text('Password is required');
            return false;
        }
        
        // Check password length
        if (password.length < 6) {
            $passwordError.text('Password must be at least 6 characters');
            return false;
        }
        
        // Check for uppercase, lowercase, number, and special character
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
            $passwordError.text('Password must include uppercase, lowercase, number, and special character');
            return false;
        }
        
        $passwordError.text('');
        return true;
    }
    
    /**
     * Validates the confirm password field
     * @returns {boolean} Whether the confirm password is valid
     */
    function validateConfirmPassword() {
        const password = $passwordInput.val();
        const confirmPassword = $confirmPasswordInput.val();
        
        if (!confirmPassword) {
            $confirmPasswordError.text('Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            $confirmPasswordError.text('Passwords do not match');
            return false;
        }
        
        $confirmPasswordError.text('');
        return true;
    }
    
    /**
     * Resets all error messages
     */
    function resetErrors() {
        $emailError.text('');
        $passwordError.text('');
        $confirmPasswordError.text('');
    }
}

/**
 * Generates a fake auth token for demo purposes
 * @returns {string} A random string token
 */
function generateFakeToken() {
    return 'auth_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Gets the URL to redirect to after successful signup
 * @returns {string} The URL to redirect to
 */
function getRedirectUrl() {
    // Check for stored redirect URL from login page
    const storedRedirect = sessionStorage.getItem('redirectAfterAuth');
    if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterAuth'); // Clean up
        return storedRedirect;
    }
    
    // Check for a redirect parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    // If there's a redirect parameter, use it
    if (redirect) {
        return decodeURIComponent(redirect);
    }
    
    // Otherwise, redirect to the home page
    return 'index.html';
} 