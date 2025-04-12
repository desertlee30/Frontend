// Global variables
let phoneValidationActive = false;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Setup simplified country code selector
function setupSimplePhoneInput() {
    console.log("Setting up simple phone code selector...");
    
    if (!phoneInput) {
        console.warn("Phone input element (#phone) not found.");
        return;
    }
    
    // If already set up, don't do it again
    if (phoneValidationActive) {
        console.log("Phone input already initialized.");
        return;
    }
    
    // Create container to wrap the phone input
    const phoneContainer = document.createElement('div');
    phoneContainer.className = 'simple-phone-container';
    phoneContainer.style.cssText = 'display: flex; position: relative; width: 100%;';
    
    // Create country code dropdown
    const codeSelector = document.createElement('select');
    codeSelector.id = 'countryCode';
    codeSelector.className = 'country-code-selector';
    codeSelector.style.cssText = 'width: 80px; border-radius: 4px 0 0 4px; background-color: #2a2a2a; color: white; border: 1px solid #444; padding: 0 5px;';
    
    // Common country codes
    const countryCodes = [
        {code: '+1', country: 'US/CA'},
        {code: '+44', country: 'UK'},
        {code: '+61', country: 'AU'},
        {code: '+33', country: 'FR'},
        {code: '+49', country: 'DE'},
        {code: '+34', country: 'ES'},
        {code: '+39', country: 'IT'},
        {code: '+81', country: 'JP'},
        {code: '+86', country: 'CN'},
        {code: '+91', country: 'IN'},
        {code: '+52', country: 'MX'},
        {code: '+55', country: 'BR'},
        {code: '+7', country: 'RU'},
        {code: '+27', country: 'ZA'},
        {code: '+82', country: 'KR'},
    ];
    
    // Populate dropdown options
    countryCodes.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.code} ${country.country}`;
        codeSelector.appendChild(option);
    });
    
    // Style the phone input
    phoneInput.style.cssText = 'flex: 1; border-radius: 0 4px 4px 0; border-left: none;';
    
    // Insert elements into the container
    phoneContainer.appendChild(codeSelector);
    
    // Replace the phone input with our container
    phoneInput.parentNode.insertBefore(phoneContainer, phoneInput);
    phoneContainer.appendChild(phoneInput);
    
    // Set validation active flag
    phoneValidationActive = true;
    console.log("Simple phone code selector set up successfully");
}

// Form validation functions
function showError(inputElement, message) {
    const formGroup = inputElement?.closest('.form-group');
    if (!formGroup) return;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    inputElement?.classList.add('error');
}

function clearError(inputElement) {
    const formGroup = inputElement?.closest('.form-group');
     if (!formGroup) return;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    inputElement?.classList.remove('error');
}

function validateFirstName() {
    clearError(firstNameInput);
    if (!firstNameInput?.value.trim()) {
        showError(firstNameInput, 'First name is required');
        return false;
    }
    return true;
}

function validateLastName() {
     clearError(lastNameInput);
    if (!lastNameInput?.value.trim()) {
         showError(lastNameInput, 'Last name is required');
        return false;
    }
    return true;
}

function validateEmail() {
    clearError(emailInput);
    const value = emailInput?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        showError(emailInput, 'Email is required');
        return false;
    }
    if (!emailRegex.test(value)) {
         showError(emailInput, 'Please enter a valid email address');
        return false;
    }
    return true;
}

function validatePhone() {
    clearError(phoneInput);
    const value = phoneInput?.value.trim();
    // Phone is optional, but if provided should be valid
    if (value) {
        // Basic phone validation (digits, spaces, dashes, parentheses)
        const phoneRegex = /^[\d\s\-\(\)]{7,15}$/;
        if (!phoneRegex.test(value)) {
            showError(phoneInput, 'Please enter a valid phone number');
            return false;
        }
    }
    return true;
}

function validateMessage() {
    clearError(messageInput);
    if (!messageInput?.value.trim()) {
         showError(messageInput, 'Message is required');
        return false;
    }
    return true;
}

// Get full phone number (with country code)
function getFullPhoneNumber() {
    const codeSelector = document.getElementById('countryCode');
    const countryCode = codeSelector ? codeSelector.value : '+1';
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) return '';
    return `${countryCode} ${phoneNumber}`;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission

    // Run all validations
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    // If all valid, show success and reset
    if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isMessageValid) {
        console.log("Form is valid. Showing success modal.");
        
        // Optional: Log the form submission with full phone number
        const fullPhone = getFullPhoneNumber();
        console.log(`Submission details: ${firstNameInput.value} ${lastNameInput.value}, ${emailInput.value}, ${fullPhone}`);
        
        if (successModal) {
            successModal.classList.remove('hidden'); // Use class manipulation
        }
        if (contactForm) {
            contactForm.reset(); // Reset the form fields
            // Clear any lingering error classes
            clearError(firstNameInput);
            clearError(lastNameInput);
            clearError(emailInput);
            clearError(phoneInput);
            clearError(messageInput);
        }
    } else {
        console.log("Form validation failed.");
        // Optionally focus the first invalid field
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
}

// Close success modal
function closeSuccessModal() {
    if (successModal) {
        successModal.classList.add('hidden'); // Use class manipulation
    }
}

// Handle modal outside click
function handleModalOutsideClick(e) {
    // Close if click is directly on the overlay, not its children
    if (e.target === successModal) {
        closeSuccessModal();
    }
}

// Set up event listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    // Form validation on blur
    if (firstNameInput) firstNameInput.addEventListener('blur', validateFirstName);
    if (lastNameInput) lastNameInput.addEventListener('blur', validateLastName);
    if (emailInput) emailInput.addEventListener('blur', validateEmail);
    if (phoneInput) phoneInput.addEventListener('blur', validatePhone);
    if (messageInput) messageInput.addEventListener('blur', validateMessage);

    // Form submission
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

    // Modal handling
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeSuccessModal);
    if (successModal) successModal.addEventListener('click', handleModalOutsideClick);
    console.log("Event listeners setup complete.");
}

// Main initialization function
function initContactPage() {
    console.log("Initializing contact page scripts...");
    setupSimplePhoneInput(); // Set up the simplified phone input
    setupEventListeners();
    console.log("Contact page initialization complete.");
}

// --- Initialization Timing ---
document.addEventListener('DOMContentLoaded', initContactPage);
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  console.log(`Document ready state is '${document.readyState}', running initContactPage.`);
  setTimeout(initContactPage, 0); // Run ASAP
} 