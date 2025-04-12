// Simple contact form handling
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Initialize phone input if the plugin is available
    if (window.intlTelInput && phoneInput) {
        try {
            window.intlTelInput(phoneInput, {
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js",
                initialCountry: "us",
                separateDialCode: true,
                preferredCountries: ["us", "gb", "ca"]
            });
        } catch (error) {
            console.log('Phone input initialization failed:', error);
        }
    }

    // Simple form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            
            if (!firstNameInput.value.trim()) {
                firstNameInput.classList.add('error');
                isValid = false;
            } else {
                firstNameInput.classList.remove('error');
            }
            
            if (!lastNameInput.value.trim()) {
                lastNameInput.classList.add('error');
                isValid = false;
            } else {
                lastNameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                emailInput.classList.add('error');
                isValid = false;
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!messageInput.value.trim()) {
                messageInput.classList.add('error');
                isValid = false;
            } else {
                messageInput.classList.remove('error');
            }
            
            if (!isValid) {
                return;
            }
            
            // Show success message
            showSuccessModal();
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Simple email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Success modal handling
    function showSuccessModal() {
        if (successModal) {
            successModal.classList.remove('hidden');
            setTimeout(() => {
                successModal.classList.add('show');
            }, 10);
        }
    }
    
    function hideSuccessModal() {
        if (successModal) {
            successModal.classList.remove('show');
            setTimeout(() => {
                successModal.classList.add('hidden');
            }, 300);
        }
    }
    
    // Add modal close handler
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
            hideSuccessModal();
        }
    });
    
    // Add input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            const label = this.closest('.form-group').querySelector('label');
            if (label) label.style.color = '#FF6B35';
        });
        
        input.addEventListener('blur', function() {
            const label = this.closest('.form-group').querySelector('label');
            if (label) label.style.color = '';
        });

    });
}); 