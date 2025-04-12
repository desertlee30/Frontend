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
    $form.on('submit', async function(e) {
        e.preventDefault();
        
        // Reset errors
        resetErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading spinner
        if ($loadingSpinner) {
            $loadingSpinner.addClass('active');
        }
        
        // Create user object
        const userData = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            email: $emailInput.val().trim(),
            dateOfBirth: $('#dateOfBirth').val(),
            password: $passwordInput.val()
        };
        
        // Define the API endpoint
        const registerApiUrl = 'http://localhost:3000/api/signup';
        
        try {
            // Make the API call using fetch
            const response = await fetch(registerApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json(); // Try to parse JSON response

            if (response.ok) {
                // Registration successful (e.g., status 200 or 201)
                console.log('Registration successful:', responseData);
                
                // Store token and user data if provided by the backend
                if (responseData.token) {
                    localStorage.setItem('wellness_auth_token', responseData.token);
                }
                
                if (responseData.user) {
                    // Store user data (excluding sensitive info like password)
                    localStorage.setItem('wellness_current_user', JSON.stringify({
                        id: responseData.user.id,
                        firstName: responseData.user.firstName,
                        lastName: responseData.user.lastName,
                        email: responseData.user.email,
                        isLoggedIn: true
                    }));
                } else {
                    // Fallback if user object isn't returned
                    localStorage.setItem('wellness_current_user', JSON.stringify({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        isLoggedIn: true
                    }));
                }
                
                // Hide loading spinner
                if ($loadingSpinner) {
                    $loadingSpinner.removeClass('active');
                }
                
                // Show success message
                alert('Registration successful! You are now logged in.');
                
                // Redirect to appropriate page
                const redirectUrl = getRedirectUrl() || 'index.html';
                window.location.href = redirectUrl;
            } else {
                // Registration failed (e.g., status 400, 409, 500)
                console.error('Registration failed:', responseData);
                let errorMessage = responseData.error || 'Registration failed. Please try again.';
                
                // Specific handling for email exists error (assuming backend sends a specific message)
                if (response.status === 409 || (responseData.error && responseData.error.toLowerCase().includes('email already exists'))) {
                    errorMessage = 'This email is already registered. Please use a different email or login.';
                    $emailError.text(errorMessage);
                    $emailError.css('display', 'block');
                    $emailInput.addClass('error');
                } else {
                    // Show general error
                    alert(errorMessage);
                }
            }
        } catch (error) {
            console.error('Network or other error during registration:', error);
            alert('An error occurred during registration. Please check your connection and try again.');
        } finally {
            // Always hide loading spinner
            if ($loadingSpinner) {
                $loadingSpinner.removeClass('active');
            }
        }
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
            $emailError.css('display', 'block');
            $emailInput.addClass('error');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            $emailError.text('Please enter a valid email address');
            $emailError.css('display', 'block');
            $emailInput.addClass('error');
            return false;
        }
        
        $emailError.text('');
        $emailError.css('display', 'none');
        $emailInput.removeClass('error');
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
            $passwordError.css('display', 'block');
            $passwordInput.addClass('error');
            return false;
        }
        
        // Check password length
        if (password.length < 6) {
            $passwordError.text('Password must be at least 6 characters');
            $passwordError.css('display', 'block');
            $passwordInput.addClass('error');
            return false;
        }
        
        // Check for uppercase, lowercase, number, and special character
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
            $passwordError.text('Password must include uppercase, lowercase, number, and special character');
            $passwordError.css('display', 'block');
            $passwordInput.addClass('error');
            return false;
        }
        
        $passwordError.text('');
        $passwordError.css('display', 'none');
        $passwordInput.removeClass('error');
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
            $confirmPasswordError.css('display', 'block');
            $confirmPasswordInput.addClass('error');
            return false;
        }
        
        if (password !== confirmPassword) {
            $confirmPasswordError.text('Passwords do not match');
            $confirmPasswordError.css('display', 'block');
            $confirmPasswordInput.addClass('error');
            return false;
        }
        
        $confirmPasswordError.text('');
        $confirmPasswordError.css('display', 'none');
        $confirmPasswordInput.removeClass('error');
        return true;
    }
    
    /**
     * Resets all error messages
     */
    function resetErrors() {
        $emailError.text('');
        $emailError.css('display', 'none');
        $emailInput.removeClass('error');
        
        $passwordError.text('');
        $passwordError.css('display', 'none');
        $passwordInput.removeClass('error');
        
        $confirmPasswordError.text('');
        $confirmPasswordError.css('display', 'none');
        $confirmPasswordInput.removeClass('error');
    }
}

/**
 * Generates a fake auth token for demo purposes
 * @returns {string} A random string token
 */
function generateFakeToken() {
    const header = btoa(JSON.stringify({ alg: 'fake', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: Date.now(), iat: Date.now(), exp: Date.now() + 86400000 }));
    const signature = btoa('fakesignature');
    return `${header}.${payload}.${signature}`;
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