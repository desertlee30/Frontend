document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    
    // Image zoom effect elements
    const imageContainer = document.querySelector('.login-image-container');
    const personImage = document.querySelector('.person-image');
    const customCursor = document.querySelector('.custom-cursor');
    
    // Page zoom effect elements
    const body = document.body;
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
        
        // Update both cursors based on mouse position
        // Only show the page cursor, not the custom cursor in the image container
        if (mouseX >= imageRect.left && mouseX <= imageRect.right && 
            mouseY >= imageRect.top && mouseY <= imageRect.bottom) {
            
            // Hide custom cursor in image container
            customCursor.style.opacity = 0;
            
            // Hide page cursor when over image as well (use default cursor)
            pageCursor.style.opacity = 0;
        } else {
            // Hide custom cursor
            customCursor.style.opacity = 0;
            
            // Show page cursor
            pageCursor.style.opacity = 1;
            pageCursor.style.left = `${mouseX}px`;
            pageCursor.style.top = `${mouseY}px`;
            
            // Size cursor relative to background zoom
            const pageCursorSize = 40 + ((bgZoomFactor - 1) * 300);
            pageCursor.style.width = `${pageCursorSize}px`;
            pageCursor.style.height = `${pageCursorSize}px`;
        }
    };
    
    const handleMouseLeave = () => {
        // Reset transforms
        personImage.style.transform = 'scale(1)';
        personImage.style.objectPosition = '50% 50%';
        document.documentElement.style.setProperty('--bg-scale', 1);
        document.documentElement.style.setProperty('--bg-move-x', '0px');
        document.documentElement.style.setProperty('--bg-move-y', '0px');
        
        // Hide cursors
        customCursor.style.opacity = 0;
        pageCursor.style.opacity = 0;
    };
    
    // Add global event listeners
    document.addEventListener('mousemove', handleGlobalZoom);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Remove any old image-specific listeners
    if (imageContainer && personImage) {
        imageContainer.removeEventListener('mousemove', handleImageZoom);
        imageContainer.removeEventListener('mouseenter', handleImageEnter);
        imageContainer.removeEventListener('mouseleave', handleImageLeave);
    }
    
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
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // This is where you would typically make an API call to authenticate
        console.log('Form submitted', { email, password });
        
        // Simulate successful login
        alert('Login successful! (Demo purposes only)');
        
        // Clear form after submission
        loginForm.reset();
    };
    
    // Add form submission event listener
    loginForm.addEventListener('submit', handleSubmit);
    
    // Handle social login buttons
    const handleSocialLogin = (platform) => {
        console.log(`Login with ${platform} clicked`);
        alert(`${platform} login not implemented in this demo`);
    };
    
    // Add event listeners to social buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
    
    // Focus the email input when the page loads for better UX
    emailInput.focus();
}); 