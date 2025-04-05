/**
 * Signup Modal and Form Handling
 * This file manages the signup modal and form validation/submission
 * using jQuery and AJAX.
 */

$(document).ready(function() {
    // API endpoint - updated to handle both local development and production
    const API_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') 
      ? 'http://localhost:3000/api'  // Local development
      : '/api';                      // Production (relative URL)
    
    // DOM Elements
    const $signupModalOverlay = $('#signupModalOverlay');
    const $signupModal = $('.signup-modal');
    const $showSignupBtn = $('#showSignupBtn');
    const $closeSignupModal = $('#closeSignupModal');
    const $signupForm = $('#signupForm');
    const $loadingSpinner = $('#loadingSpinner');
    
    // Error message elements
    const $emailError = $('#emailError');
    const $passwordError = $('#passwordError');
    const $confirmPasswordError = $('#confirmPasswordError');
    
    // Password toggle functionality
    $('.signup-toggle, .confirm-toggle').on('click', function() {
        const $passwordField = $(this).siblings('input');
        const type = $passwordField.attr('type') === 'password' ? 'text' : 'password';
        $passwordField.attr('type', type);
        
        // Toggle eye icon
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });
    
    // Show signup modal
    $showSignupBtn.on('click', function(e) {
        e.preventDefault();
        $signupModalOverlay.addClass('active');
        // Focus first name input after modal animation completes
        setTimeout(() => $('#firstName').focus(), 300);
    });
    
    // Close signup modal
    $closeSignupModal.on('click', function() {
        $signupModalOverlay.removeClass('active');
    });
    
    // Close modal if clicked outside of it
    $signupModalOverlay.on('click', function(e) {
        if ($(e.target).is($signupModalOverlay)) {
            $signupModalOverlay.removeClass('active');
        }
    });
    
    // ESC key to close modal
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $signupModalOverlay.hasClass('active')) {
            $signupModalOverlay.removeClass('active');
        }
    });
    
    // Show loading spinner
    const showLoading = () => {
        $loadingSpinner.addClass('active');
    };
    
    // Hide loading spinner
    const hideLoading = () => {
        $loadingSpinner.removeClass('active');
    };
    
    // Validate password meets requirements
    const validatePassword = (password) => {
        // Regex: 6+ chars, 1 lowercase, 1 uppercase, 1 number, 1 special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@#$%^&*()_+={}\[\]:;'<>,.?/~]).{6,}$/;
        return regex.test(password);
    };
    
    // Handle signup form submission
    $signupForm.on('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        $emailError.text('');
        $passwordError.text('');
        $confirmPasswordError.text('');
        
        // Get form values
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#signupEmail').val().trim();
        const dateOfBirth = $('#dateOfBirth').val();
        const password = $('#signupPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Validation flag
        let isValid = true;
        
        // Basic validation
        if (!firstName || !lastName || !email || !dateOfBirth || !password || !confirmPassword) {
            alert('Please fill in all fields');
            isValid = false;
            return;
        }
        
        // Email format validation
        if (!email.match(/.+@.+\..+/)) {
            $emailError.text('Please enter a valid email address');
            isValid = false;
        }
        
        // Password requirements validation
        if (!validatePassword(password)) {
            $passwordError.text('Password must be 6+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol');
            isValid = false;
        }
        
        // Confirm password match
        if (password !== confirmPassword) {
            $confirmPasswordError.text('Passwords do not match');
            isValid = false;
        }
        
        // If validation passes, submit to API
        if (isValid) {
            try {
                showLoading();
                
                // Prepare user data
                const userData = {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    password
                };
                
                // Send signup request to API
                $.ajax({
                    url: `${API_URL}/signup`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function(response) {
                        // Store token in localStorage for future authenticated requests
                        localStorage.setItem('authToken', response.token);
                        
                        // Store basic user info (no sensitive data)
                        if (response.user) {
                            localStorage.setItem('currentUser', JSON.stringify({
                                id: response.user.id,
                                firstName: response.user.firstName,
                                lastName: response.user.lastName,
                                email: response.user.email
                            }));
                        }
                        
                        // Reset form
                        $signupForm[0].reset();
                        
                        // Close modal
                        $signupModalOverlay.removeClass('active');
                        
                        // Show success message and redirect to index.html
                        alert('Account created successfully! Redirecting to homepage...');
                        
                        // Redirect to index page
                        window.location.href = 'index.html';
                        
                        hideLoading();
                    },
                    error: function(xhr) {
                        // Parse and display error message
                        let errorMessage = 'An error occurred during sign up.';
                        
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response && response.error) {
                                errorMessage = response.error;
                                
                                // Display specific errors in the appropriate fields
                                if (errorMessage.includes('Email is already registered')) {
                                    $emailError.text('This email address is already registered');
                                } else if (errorMessage.includes('Password must be')) {
                                    $passwordError.text(errorMessage);
                                } else {
                                    alert(errorMessage);
                                }
                            } else {
                                alert(errorMessage);
                            }
                        } catch (e) {
                            alert(errorMessage);
                        }
                        
                        hideLoading();
                    }
                });
                
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during sign up. Please try again.');
                hideLoading();
            }
        }
    });
}); 