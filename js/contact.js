// Contact Form JS - Complete Rewrite for Stability
let phoneInputInstance;

// Main initialization function
const initContactPage = () => {
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

    // Add contact-page class to body for stable styling
    document.body.classList.add('contact-page');

    // Initialize phone input with robust error handling
    if (phoneInput) {
        try {
            // Destroy existing instance if it exists to prevent duplicates
            if (phoneInputInstance) {
                phoneInputInstance.destroy();
            }
            
            // Initialize with enhanced options
            phoneInputInstance = window.intlTelInput(phoneInput, {
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
                initialCountry: "us",
                preferredCountries: ["us", "gb", "ca", "au"],
                separateDialCode: true,
                autoPlaceholder: "aggressive",
                formatOnDisplay: true,
                dropdownContainer: document.body,
                customContainer: "iti-container",
                nationalMode: false
            });

            // Track dropdown state
            let isDropdownOpen = false;
            
            // Special handling for dropdown to keep it visible
            const flagContainer = document.querySelector('.iti__flag-container');
            const selectedFlag = document.querySelector('.iti__selected-flag');
            
            if (flagContainer && selectedFlag) {
                // Remove any existing event listeners
                const newFlagContainer = flagContainer.cloneNode(true);
                const newSelectedFlag = newFlagContainer.querySelector('.iti__selected-flag');
                flagContainer.parentNode.replaceChild(newFlagContainer, flagContainer);
                
                // Add click event listener to flag container
                newSelectedFlag.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Toggle dropdown state
                    isDropdownOpen = !isDropdownOpen;
                    
                    // Force dropdown to be visible
                    setTimeout(() => {
                        const dropdown = document.querySelector('.iti__country-list');
                        if (dropdown) {
                            if (isDropdownOpen) {
                                dropdown.style.display = 'block';
                                dropdown.style.visibility = 'visible';
                                dropdown.style.opacity = '1';
                                dropdown.classList.add('iti__country-list--dropdown');
                            } else {
                                dropdown.style.display = 'none';
                                dropdown.style.visibility = 'hidden';
                                dropdown.style.opacity = '0';
                                dropdown.classList.remove('iti__country-list--dropdown');
                            }
                        }
                    }, 0);
                });
                
                // Handle document clicks to close dropdown
                document.addEventListener('click', function(e) {
                    // Don't close if clicking inside dropdown
                    if (e.target.closest('.iti__country-list')) {
                        e.stopPropagation();
                        return;
                    }
                    
                    // Don't close if clicking flag container
                    if (e.target.closest('.iti__flag-container')) {
                        return;
                    }
                    
                    // Otherwise, close dropdown
                    isDropdownOpen = false;
                    const dropdown = document.querySelector('.iti__country-list');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                        dropdown.style.visibility = 'hidden';
                        dropdown.style.opacity = '0';
                        dropdown.classList.remove('iti__country-list--dropdown');
                    }
                });
                
                // Handle country selection
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.iti__country')) {
                        // Close dropdown after selection
                        setTimeout(() => {
                            isDropdownOpen = false;
                            const dropdown = document.querySelector('.iti__country-list');
                            if (dropdown) {
                                dropdown.style.display = 'none';
                                dropdown.style.visibility = 'hidden';
                                dropdown.style.opacity = '0';
                                dropdown.classList.remove('iti__country-list--dropdown');
                            }
                        }, 100);
                    }
                });
            }
            
            // Add validation event listeners
            phoneInput.addEventListener('blur', validatePhone);
            phoneInput.addEventListener('change', validatePhone);
        } catch (error) {
            console.log('Phone input initialization failed:', error);
        }
    }

    // Form validation
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Enhanced validation
            let isValid = true;
            
            // First name validation
            if (!firstNameInput.value.trim()) {
                markInvalid(firstNameInput, 'First name is required');
                isValid = false;
            } else {
                markValid(firstNameInput);
            }
            
            // Last name validation
            if (!lastNameInput.value.trim()) {
                markInvalid(lastNameInput, 'Last name is required');
                isValid = false;
            } else {
                markValid(lastNameInput);
            }
            
            // Email validation
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                markInvalid(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                markValid(emailInput);
            }
            
            // Phone validation (only if it has a value)
            if (phoneInput.value.trim() && phoneInputInstance) {
                if (!phoneInputInstance.isValidNumber()) {
                    markInvalid(phoneInput, 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    markValid(phoneInput);
                }
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                markInvalid(messageInput, 'Message is required');
                isValid = false;
            } else {
                markValid(messageInput);
            }
            
            if (!isValid) {
                return;
            }
            
            // Show success message and reset form
            showSuccessModal();
            contactForm.reset();
        });
    }
    
    // Helper function to mark a field as invalid
    const markInvalid = (field, message) => {
        field.classList.add('error');
        
        // Add or update error message
        let errorMsgElement = field.parentElement.querySelector('.error-message');
        if (!errorMsgElement) {
            errorMsgElement = document.createElement('div');
            errorMsgElement.className = 'error-message';
            field.parentElement.appendChild(errorMsgElement);
        }
        errorMsgElement.textContent = message;
    };
    
    // Helper function to mark a field as valid
    const markValid = (field) => {
        field.classList.remove('error');
        
        // Remove error message if exists
        const errorMsgElement = field.parentElement.querySelector('.error-message');
        if (errorMsgElement) {
            errorMsgElement.remove();
        }
    };
    
    // Email validation helper
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    // Success modal handling
    const showSuccessModal = () => {
        if (successModal) {
            successModal.classList.remove('hidden');
            setTimeout(() => {
                successModal.classList.add('show');
            }, 10);
        }
    };
    
    const hideSuccessModal = () => {
        if (successModal) {
            successModal.classList.remove('show');
            setTimeout(() => {
                successModal.classList.add('hidden');
            }, 300);
        }
    };
    
    // Add modal close handler
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
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
};

// Multiple initialization points to ensure everything loads properly
document.addEventListener('DOMContentLoaded', initContactPage);
window.addEventListener('load', initContactPage);

// If the document is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initContactPage, 500); // Small delay to ensure elements are ready
}

// Check for a page refresh using sessionStorage
if (!sessionStorage.getItem('contactPageInitialized')) {
    sessionStorage.setItem('contactPageInitialized', 'true');
    // Page was just loaded for the first time
} else {
    // This is a refresh, add additional handling
    window.addEventListener('load', () => {
        // Ensure the body has the right background
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#ffffff';
        
        // Force the contact container to display
        const contactContainer = document.querySelector('.contact-container');
        if (contactContainer) {
            contactContainer.style.display = 'block';
        }
        
        // Re-initialize after a delay to catch any late loading elements
        setTimeout(initContactPage, 1000);
    });
}

// Form validation functions
const validateName = (input) => {
    if (!input.value.trim()) {
        markInvalid(input, 'This field is required');
        return false;
    }
    markValid(input);
    return true;
};

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        markInvalid(emailInput, 'Email is required');
        return false;
    } else if (!emailRegex.test(emailInput.value)) {
        markInvalid(emailInput, 'Please enter a valid email');
        return false;
    }
    markValid(emailInput);
    return true;
};

const validatePhone = () => {
    if (!phoneInput.value.trim()) {
        markInvalid(phoneInput, 'Phone number is required');
        return false;
    }
    
    if (phoneInputInstance && !phoneInputInstance.isValidNumber()) {
        markInvalid(phoneInput, 'Please enter a valid phone number');
        return false;
    }
    
    markValid(phoneInput);
    return true;
};

const validateMessage = () => {
    if (!messageInput.value.trim()) {
        markInvalid(messageInput, 'Message is required');
        return false;
    }
    markValid(messageInput);
    return true;
};

// Form submission handling
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isFirstNameValid = validateName(firstNameInput);
    const isLastNameValid = validateName(lastNameInput);
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    
    // If all valid, show success and reset form
    if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isMessageValid) {
        successModal.style.display = 'flex';
        contactForm.reset();
        
        // Reset phone input properly
        if (phoneInputInstance) {
            phoneInputInstance.setCountry('us');
        }
    }
};

// Close modal handler
const closeModal = () => {
    successModal.style.display = 'none';
};

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize phone input
    setTimeout(initPhoneInput, 100);
    
    // Handle page refresh - use both DOMContentLoaded and load events
    if (sessionStorage.getItem('pageRefreshed')) {
        // Perform additional initialization after refresh
        setTimeout(() => {
            // Ensure proper layout on refresh
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = '#ffffff';
            
            // Ensure phone input is properly initialized
            initPhoneInput();
        }, 200);
        
        // Clear the flag
        sessionStorage.removeItem('pageRefreshed');
    } else {
        // Set flag for next page load
        sessionStorage.setItem('pageRefreshed', 'true');
    }
    
    // Form validation event listeners
    if (firstNameInput) firstNameInput.addEventListener('blur', () => validateName(firstNameInput));
    if (lastNameInput) lastNameInput.addEventListener('blur', () => validateName(lastNameInput));
    if (emailInput) emailInput.addEventListener('blur', validateEmail);
    if (messageInput) messageInput.addEventListener('blur', validateMessage);
    
    // Form submission
    if (contactForm) contactForm.addEventListener('submit', handleSubmit);
    
    // Modal close button
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
});

// Also listen for window.load event to ensure everything is properly initialized
window.addEventListener('load', () => {
    // Force phone input initialization after page is fully loaded
    setTimeout(initPhoneInput, 300);
    
    // Apply additional fixes for layout issues
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
});

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    // Add contact-page class to body for specialized styling
    document.body.classList.add('contact-page');
    
    // Initialize variables
    let phoneInputInstance = null;
    let isPhoneDropdownOpen = false;
    
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Initialize phone input with better configuration
    const initPhoneInput = () => {
        // Check if phone input exists
        if (!phoneInput) return;
        
        // Clean up any existing instance to prevent duplicates
        if (phoneInputInstance) {
            phoneInputInstance.destroy();
        }
        
        // Initialize with proper configuration
        phoneInputInstance = window.intlTelInput(phoneInput, {
            initialCountry: 'us',
            preferredCountries: ['us', 'gb', 'ca', 'au'],
            separateDialCode: true,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.1.5/js/utils.js',
            customContainer: 'iti',
            dropdownContainer: document.body,
            formatOnDisplay: true,
            autoPlaceholder: 'aggressive'
        });
        
        // Fix dropdown visibility issues with special handling
        const flagContainer = document.querySelector('.iti__flag-container');
        const selectedFlag = document.querySelector('.iti__selected-flag');
        
        if (flagContainer && selectedFlag) {
            // Remove any existing event listeners
            const newFlagContainer = flagContainer.cloneNode(true);
            const newSelectedFlag = newFlagContainer.querySelector('.iti__selected-flag');
            flagContainer.parentNode.replaceChild(newFlagContainer, flagContainer);
            
            // Add custom event listeners for dropdown toggling
            newSelectedFlag.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown visibility
                const countryList = document.querySelector('.iti__country-list');
                if (countryList) {
                    if (!isPhoneDropdownOpen) {
                        // Open dropdown
                        countryList.classList.add('iti__country-list--dropdown');
                        isPhoneDropdownOpen = true;
                        
                        // Position dropdown properly
                        const flagRect = newSelectedFlag.getBoundingClientRect();
                        countryList.style.top = `${flagRect.bottom}px`;
                        countryList.style.left = `${flagRect.left}px`;
                        countryList.style.width = '300px';
                    } else {
                        // Close dropdown
                        countryList.classList.remove('iti__country-list--dropdown');
                        isPhoneDropdownOpen = false;
                    }
                }
            });
            
            // Add event listeners for country selection
            const countryItems = document.querySelectorAll('.iti__country');
            if (countryItems) {
                countryItems.forEach(item => {
                    // Create new item to clean up event listeners
                    const newItem = item.cloneNode(true);
                    item.parentNode.replaceChild(newItem, item);
                    
                    // Add click handler for country selection
                    newItem.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const countryCode = newItem.getAttribute('data-country-code');
                        if (countryCode && phoneInputInstance) {
                            phoneInputInstance.setCountry(countryCode);
                        }
                        
                        // Close dropdown after selection
                        const countryList = document.querySelector('.iti__country-list');
                        if (countryList) {
                            countryList.classList.remove('iti__country-list--dropdown');
                            isPhoneDropdownOpen = false;
                        }
                    });
                });
            }
            
            // Handle clicks outside to close dropdown
            document.addEventListener('click', function(e) {
                const countryList = document.querySelector('.iti__country-list');
                const flagContainer = document.querySelector('.iti__flag-container');
                
                // Close dropdown if click is outside
                if (isPhoneDropdownOpen && countryList && 
                    !countryList.contains(e.target) && 
                    (!flagContainer || !flagContainer.contains(e.target))) {
                    countryList.classList.remove('iti__country-list--dropdown');
                    isPhoneDropdownOpen = false;
                }
            });
        }
        
        // Handle phone input blur for validation
        phoneInput.addEventListener('blur', function() {
            validatePhone();
        });
    };
    
    // Initialize phone input
    initPhoneInput();
    
    // Force re-initialization after a short delay to catch any late loading
    setTimeout(() => {
        initPhoneInput();
    }, 500);
    
    // Validation functions
    const validateFirstName = () => {
        const errorElement = document.getElementById('firstNameError');
        if (!firstNameInput.value.trim()) {
            firstNameInput.classList.add('error');
            errorElement.textContent = 'First name is required';
            errorElement.style.display = 'block';
            return false;
        } else {
            firstNameInput.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };
    
    const validateLastName = () => {
        const errorElement = document.getElementById('lastNameError');
        if (!lastNameInput.value.trim()) {
            lastNameInput.classList.add('error');
            errorElement.textContent = 'Last name is required';
            errorElement.style.display = 'block';
            return false;
        } else {
            lastNameInput.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };
    
    const validateEmail = () => {
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailInput.value.trim()) {
            emailInput.classList.add('error');
            errorElement.textContent = 'Email is required';
            errorElement.style.display = 'block';
            return false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
            return false;
        } else {
            emailInput.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };
    
    const validatePhone = () => {
        const errorElement = document.getElementById('phoneError');
        
        if (!phoneInput.value.trim()) {
            phoneInput.classList.add('error');
            errorElement.textContent = 'Phone number is required';
            errorElement.style.display = 'block';
            return false;
        } else if (phoneInputInstance && !phoneInputInstance.isValidNumber()) {
            phoneInput.classList.add('error');
            errorElement.textContent = 'Please enter a valid phone number';
            errorElement.style.display = 'block';
            return false;
        } else {
            phoneInput.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };
    
    const validateMessage = () => {
        const errorElement = document.getElementById('messageError');
        
        if (!messageInput.value.trim()) {
            messageInput.classList.add('error');
            errorElement.textContent = 'Message is required';
            errorElement.style.display = 'block';
            return false;
        } else if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('error');
            errorElement.textContent = 'Message must be at least 10 characters';
            errorElement.style.display = 'block';
            return false;
        } else {
            messageInput.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };
    
    // Add event listeners for input validation
    if (firstNameInput) firstNameInput.addEventListener('blur', validateFirstName);
    if (lastNameInput) lastNameInput.addEventListener('blur', validateLastName);
    if (emailInput) emailInput.addEventListener('blur', validateEmail);
    if (messageInput) messageInput.addEventListener('blur', validateMessage);
    
    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isFirstNameValid = validateFirstName();
            const isLastNameValid = validateLastName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isMessageValid = validateMessage();
            
            // Submit if all fields are valid
            if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isMessageValid) {
                // Show success modal
                if (successModal) {
                    successModal.style.display = 'flex';
                }
                
                // Reset form
                contactForm.reset();
                if (phoneInputInstance) {
                    phoneInputInstance.setCountry('us');
                }
            }
        });
    }
    
    // Modal handling
    if (closeModalBtn && successModal) {
        // Close modal on button click
        closeModalBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    // Force layout stability on window load
    window.addEventListener('load', function() {
        document.body.classList.add('contact-page');
        
        // Reinitialize phone input on load
        initPhoneInput();
    });
    
    // Handle page refreshes with session storage
    if (window.sessionStorage) {
        // Check if this is a page refresh
        if (sessionStorage.getItem('isRefresh') === 'true') {
            // Apply special styling for refreshes
            document.body.classList.add('contact-page');
        }
        
        // Set refresh flag for next load
        sessionStorage.setItem('isRefresh', 'true');
    }
}); 