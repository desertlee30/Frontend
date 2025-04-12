// Window load event to ensure all elements are properly loaded
window.addEventListener('load', function() {
    console.log('Window fully loaded - initializing signup modal functionality');
    
    // Re-initialize signup modal elements
    const showSignupBtn = document.getElementById('showSignupBtn');
    const signupModalOverlay = document.getElementById('signupModalOverlay');
    const closeSignupModal = document.getElementById('closeSignupModal');
    
    // Debug log to verify elements are found
    console.log('Signup elements found:', {
        showSignupBtn: !!showSignupBtn,
        signupModalOverlay: !!signupModalOverlay,
        closeSignupModal: !!closeSignupModal
    });
    
    // Ensure showSignupBtn is properly attached with event listener
    if (showSignupBtn && signupModalOverlay) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Showing signup modal');
            signupModalOverlay.classList.add('active');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // API endpoint - updated to handle both local development and production
    const API_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') 
      ? 'http://localhost:3000/api'  // Local development
      : '/api';                      // Production (relative URL)
    
    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const showSignup = urlParams.get('signup') === 'true';
    const redirectUrl = urlParams.get('redirect');
    
    // Store redirect URL in session storage for later use
    if (redirectUrl) {
        sessionStorage.setItem('redirectAfterAuth', redirectUrl);
    }
    
    // Show signup modal if the signup parameter is present
    if (showSignup) {
        setTimeout(() => {
            const showSignupBtn = document.getElementById('showSignupBtn');
            if (showSignupBtn) {
                showSignupBtn.click();
            }
        }, 500); // Small delay to ensure the page is loaded
    }
    
    // Image zoom effect elements
    const imageContainer = document.querySelector('.login-image-container');
    const personImage = document.querySelector('.person-image');
    
    // Page cursor element (may be null)
    const pageCursor = document.querySelector('.page-cursor');
    
    // Combined zoom effect for both page background and person image
    const handleGlobalZoom = (e) => {
        // Get mouse position relative to the viewport
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Get image container position and dimensions
        const imageRect = imageContainer.getBoundingClientRect();
        const imageX = imageRect.left + imageRect.width / 2; // X center of image
        const imageY = imageRect.top + imageRect.height / 2;  // Y center of image
        
        // Calculate distances relative to the image center
        const distFromImageX = (mouseX - imageX) / window.innerWidth;
        const distFromImageY = (mouseY - imageY) / window.innerHeight;
        const distFromImage = Math.sqrt(distFromImageX * distFromImageX + distFromImageY * distFromImageY);
        
        // Calculate zoom based on distance from image center (not from mouse position)
        // Max zoom is 1.18, min zoom is 1.0
        const zoomFactor = 1.18 - (Math.min(distFromImage, 0.6) * 0.3);
        
        // Apply transform to person image
        personImage.style.transform = `scale(${zoomFactor})`;
        
        // Calculate movement based on mouse distance but with limits
        // Limit the movement to prevent background from showing
        // The higher the zoom, the less we need to move to avoid showing background
        const maxMoveX = 20; // Maximum pixels to move horizontally
        const maxMoveY = 20; // Maximum pixels to move vertically
        
        // Use a curve that reduces movement as distance increases
        const moveFactorX = Math.min(Math.abs(distFromImageX), 0.3) * (distFromImageX < 0 ? -1 : 1);
        const moveFactorY = Math.min(Math.abs(distFromImageY), 0.3) * (distFromImageY < 0 ? -1 : 1);
        
        const moveX = -moveFactorX * maxMoveX * (zoomFactor - 1) * 5; // Scale movement by zoom
        const moveY = -moveFactorY * maxMoveY * (zoomFactor - 1) * 5; // Scale movement by zoom
        
        personImage.style.objectPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
        
        // Calculate position as percentage of viewport size for page background effect
        const posX = mouseX / window.innerWidth;
        const posY = mouseY / window.innerHeight;
        
        // Calculate distance from center of viewport
        const distFromCenterX = posX - 0.5;
        const distFromCenterY = posY - 0.5;
        const distFromCenter = Math.sqrt(distFromCenterX * distFromCenterX + distFromCenterY * distFromCenterY);
        
        // Calculate zoom for background
        const bgZoomFactor = 1.08 - (distFromCenter * 0.1);
        
        // Apply transform to background using CSS variables
        document.documentElement.style.setProperty('--bg-scale', bgZoomFactor);
        document.documentElement.style.setProperty('--bg-move-x', `${-distFromCenterX * 20}px`);
        document.documentElement.style.setProperty('--bg-move-y', `${-distFromCenterY * 20}px`);
        
        // Update page cursor (if it exists)
        if (pageCursor) {
            if (mouseX >= imageRect.left && mouseX <= imageRect.right && 
                mouseY >= imageRect.top && mouseY <= imageRect.bottom) {
                // Hide page cursor when over image (use default cursor)
                pageCursor.style.opacity = 0;
            } else {
                // Show page cursor
                pageCursor.style.opacity = 1;
                pageCursor.style.left = `${mouseX}px`;
                pageCursor.style.top = `${mouseY}px`;
                
                // Size cursor relative to background zoom
                const pageCursorSize = 40 + ((bgZoomFactor - 1) * 300);
                pageCursor.style.width = `${pageCursorSize}px`;
                pageCursor.style.height = `${pageCursorSize}px`;
            }
        }
    };
    
    const handleMouseLeave = () => {
        // Reset transforms
        personImage.style.transform = 'scale(1)';
        personImage.style.objectPosition = '50% 50%';
        document.documentElement.style.setProperty('--bg-scale', 1);
        document.documentElement.style.setProperty('--bg-move-x', '0px');
        document.documentElement.style.setProperty('--bg-move-y', '0px');
        
        // Hide page cursor if it exists
        if (pageCursor) {
            pageCursor.style.opacity = 0;
        }
    };
    
    // Add global event listeners
    document.addEventListener('mousemove', handleGlobalZoom);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Toggle password visibility
    const handleTogglePassword = () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const eyeIcon = togglePassword.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    };
    
    // Event listeners for password toggle (click and keyboard)
    togglePassword.addEventListener('click', handleTogglePassword);
    togglePassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTogglePassword();
        }
    });
    
    // Loading spinner references
    const $loadingSpinner = $('#loadingSpinner');
    
    // Show/hide loading spinner
    const showLoading = () => $loadingSpinner.addClass('active');
    const hideLoading = () => $loadingSpinner.removeClass('active');
    
    // Handle login form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in both email and password');
            return;
        }
        
        try {
            showLoading();
            
            // DEMO MODE: Check credentials against localStorage instead of backend API
            setTimeout(() => {
                // Get stored user from localStorage (if exists)
                const storedUser = localStorage.getItem('currentUser');
                const storedUsers = localStorage.getItem('demo_users');
                // Get user.json data (simulated)
                const userJsonData = localStorage.getItem('user_json_data');
                
                let isValid = false;
                let userData = null;
                
                // First check user.json data (highest priority)
                if (userJsonData) {
                    try {
                        const users = JSON.parse(userJsonData);
                        console.log(`Checking login against ${users.length} users in user.json`);
                        
                        // Find user with matching email and password
                        const matchedUser = users.find(user => 
                            user.email === email && user.password === password
                        );
                        
                        if (matchedUser) {
                            console.log('Found matching user in user.json:', matchedUser.email);
                            isValid = true;
                            userData = {
                                id: matchedUser.id,
                                firstName: matchedUser.firstName,
                                lastName: matchedUser.lastName,
                                email: matchedUser.email,
                                dateCreated: matchedUser.dateCreated
                            };
                        } else {
                            console.log('No matching user found in user.json for email:', email);
                        }
                    } catch (e) {
                        console.error('Error parsing user.json data', e);
                    }
                }
                
                // If not found in user.json, try demo_users
                if (!isValid && storedUsers) {
                    try {
                        const users = JSON.parse(storedUsers);
                        console.log(`Checking login against ${users.length} stored users in localStorage`);
                        
                        // Find user with matching email
                        const matchedUser = users.find(user => user.email === email);
                        
                        if (matchedUser) {
                            console.log('Found matching user in localStorage:', matchedUser.email);
                            isValid = true;
                            userData = matchedUser;
                        } else {
                            console.log('No matching user found in localStorage for email:', email);
                        }
                    } catch (e) {
                        console.error('Error parsing stored users', e);
                    }
                } 
                // Fallback to single user login if no multi-user list exists
                else if (!isValid && storedUser) {
                    try {
                        userData = JSON.parse(storedUser);
                        console.log('Checking against single stored user:', userData.email);
                        isValid = userData.email === email;
                    } catch (e) {
                        console.error('Error parsing stored user data', e);
                    }
                } else if (!isValid) {
                    // For demo purposes - auto-accept first login if no users exist
                    console.log('No stored users found, accepting any login for demo');
                    isValid = true;
                    userData = {
                        id: 'demo-' + Date.now(),
                        firstName: 'Demo',
                        lastName: 'User',
                        email: email
                    };
                }
                
                if (isValid) {
                    // Generate a fake token
                    const authToken = 'demo_token_' + Math.random().toString(36).substring(2);
                    
                    // Store auth data
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Reset form
                    loginForm.reset();
                    
                    // Show success message
                    alert('Login successful! Redirecting...');
                    
                    // Redirect to home page or previous page
                    const redirectTarget = sessionStorage.getItem('redirectAfterAuth') || 'index.html';
                    sessionStorage.removeItem('redirectAfterAuth'); // Clean up
                    window.location.href = redirectTarget;
                } else {
                    // Show helpful error message for demo mode
                    const errorMessage = `Invalid email or password. 

DEMO MODE TIPS:
• Did you sign up first? Try creating an account.
• Your exact email address must match what you used during signup.
• In this demo, passwords aren't actually verified (any password works).
• You can create a new account with the same email if needed.`;
                    
                    alert(errorMessage);
                }
                
                hideLoading();
            }, 1000); // Add a delay to simulate network request
            
            /* COMMENTED OUT REAL API CALL
            $.ajax({
                url: `${API_URL}/login`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
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
                    loginForm.reset();
                    
                    // Show success message and redirect (in a real app)
                    alert('Login successful! Redirecting...');
                    
                    // Redirect to stored URL or home page after successful login
                    const redirectTarget = sessionStorage.getItem('redirectAfterAuth') || 'index.html';
                    sessionStorage.removeItem('redirectAfterAuth'); // Clean up
                    window.location.href = redirectTarget;
                },
                error: function(xhr) {
                    // Parse and display error message
                    let errorMessage = 'Invalid email or password.';
                    
                    console.log('Login error status:', xhr.status);
                    console.log('Response text:', xhr.responseText);
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response && response.error) {
                            errorMessage = response.error;
                            console.log('Parsed error:', response.error);
                        }
                    } catch (e) {
                        console.error('Error parsing response:', e);
                    }
                    
                    alert(errorMessage);
                },
                complete: function() {
                    hideLoading();
                }
            });
            */
            
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
            hideLoading();
        }
    };
    
    // Add form submission event listener
    loginForm.addEventListener('submit', handleLoginSubmit);
    
    // Handle social login buttons
    const handleSocialLogin = (platform) => {
        console.log(`Login with ${platform} clicked`);
        alert(`${platform} login not implemented in this demo`);
    };
    
    // Add event listeners to social buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    if (facebookBtn) facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
    
    // Signup modal functionality
    const showSignupBtn = document.getElementById('showSignupBtn');
    const signupModalOverlay = document.getElementById('signupModalOverlay');
    const closeSignupModal = document.getElementById('closeSignupModal');
    
    // Show signup modal when "Sign up" is clicked
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (signupModalOverlay) {
                signupModalOverlay.classList.add('active');
                // Focus first form field for accessibility
                const firstInput = document.querySelector('.signup-modal input');
                if (firstInput) setTimeout(() => firstInput.focus(), 100);
            }
        });
    }
    
    // Close signup modal when close button is clicked
    if (closeSignupModal) {
        closeSignupModal.addEventListener('click', () => {
            if (signupModalOverlay) {
                signupModalOverlay.classList.remove('active');
            }
        });
    }
    
    // Close signup modal when clicking outside the modal content
    if (signupModalOverlay) {
        signupModalOverlay.addEventListener('click', (e) => {
            // Only close if clicking the overlay itself, not the modal content
            if (e.target === signupModalOverlay) {
                signupModalOverlay.classList.remove('active');
            }
        });
    }
    
    // Close signup modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && signupModalOverlay && signupModalOverlay.classList.contains('active')) {
            signupModalOverlay.classList.remove('active');
        }
    });
    
    // Focus the email input when the page loads for better UX
    emailInput.focus();
}); 