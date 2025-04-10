/**
 * WellnessWave Fitness Page JavaScript
 * 
 * This file contains all JavaScript functionality for the fitness.html page:
 * - Hero overlay mouse attraction effect & parallax
 * - Hero background parallax
 * - Hero content behavior
 * - Navbar scroll interactions
 * - Button effects
 * - Smooth scrolling
 * - Program card animations and filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======== Debug GSAP ========
    console.log("Fitness.js loaded - checking GSAP availability");
    const isGsapLoaded = typeof gsap !== 'undefined' && gsap;
    console.log("GSAP loaded:", isGsapLoaded ? "Yes" : "No");
    
    if (isGsapLoaded) {
        console.log("GSAP version:", gsap.version);
        console.log("Available plugins:", 
            gsap.core && typeof gsap.core.globals === 'function' ? 
            Object.keys(gsap.core.globals()).join(", ") : "Cannot detect plugins");
    }
    
    // ======== Hero Elements ========
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    const heroOverlay = document.querySelector('.hero-overlay');
    const overlay = document.querySelector('.overlay-image');
    const heroContent = document.querySelector('.hero-content');
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    
    // Log element detection
    console.log("Hero elements found:", {
        hero: !!hero,
        heroBackground: !!heroBackground,
        heroOverlay: !!heroOverlay,
        overlay: !!overlay,
        heroContent: !!heroContent,
        scrollDownArrow: !!scrollDownArrow
    });
    
    // Re-enable other initializers (or keep them disabled if testing only circles)
    // Ensure all elements are properly loaded before adding animations
    if (!hero || !overlay) {
        console.warn('Hero elements not found, animation not initialized');
    } else {
        // Initialize hero animations
        initHeroAnimations();
    }
    
    // Initialize program card filtering system
    initProgramFilter();
    
    // Initialize frosted glass cards animation <<<< COMMENTING OUT
    // animateCards();

    // Initialize background circle effects <<<< RE-ENABLING CALL
    initBackgroundCircleEffects();
    
    // ======== Program Modal Logic ========
    const modalOverlay = document.getElementById('programModal');
    const modalContent = modalOverlay?.querySelector('.program-modal-content');
    const closeBtn = document.getElementById('modalCloseBtn');
    const programTitleEl = document.getElementById('modalProgramTitle');
    const weekCounterEl = document.getElementById('modalWeekCounter');
    const workoutImageEl = document.getElementById('modalWorkoutImage');
    const dayIndicatorsContainer = document.getElementById('modalDayIndicators');
    const prevDayBtn = document.getElementById('modalPrevDayBtn');
    const nextDayBtn = document.getElementById('modalNextDayBtn');
    const progressBarEl = document.getElementById('modalProgressBar');
    const progressTextEl = document.getElementById('modalProgressText');
    const completeDayBtn = document.getElementById('modalCompleteDayBtn');
    const programLinks = document.querySelectorAll('.program-link'); // Select all program links
    const resetBtn = document.getElementById('modalResetBtn'); // Added reset button reference
    const saveBtn = document.getElementById('modalSaveBtn'); // Added save button reference

    let currentProgramData = null;
    let currentProgramId = null;
    let currentDay = 1;
    let completedDays = [];
    let savedPrograms = []; // Added state for saved programs
    const LS_PROGRESS_KEY = 'wellnessWaveProgramProgress';
    const LS_SAVED_KEY = 'wellnessWaveSavedPrograms'; // Key for saved programs

    // --- Mock Program Data (Replace with actual data later) ---
    const programsData = {
        "strength-foundations": {
            title: "Strength Foundations",
            totalWeeks: 8,
            daysPerWeek: 7, // Assuming 7 days for simplicity
            totalDays: 56,
            getImageForDay: (day) => `fitness/strength_day${((day - 1) % 7) + 1}.jpg`, // Removed Media/
            categories: "strength beginner",
            description: "A comprehensive 8-week program to build fundamental strength. Perfect for beginners or those returning to fitness."
        },
        "cardio-blast": {
            title: "Cardio Blast",
            totalWeeks: 6,
            daysPerWeek: 7,
            totalDays: 42,
            getImageForDay: (day) => `fitness/cardio_day${((day - 1) % 5) + 1}.jpg`, // Removed Media/
            categories: "cardio hiit",
            description: "High-intensity cardio workouts to improve endurance and burn calories. Designed for all fitness levels with scalable options."
        },
        "flexibility-mobility": {
            title: "Flexibility & Mobility",
            totalWeeks: 4,
            daysPerWeek: 7,
            totalDays: 28,
            getImageForDay: (day) => `fitness/flex_day${((day - 1) % 4) + 1}.jpg`, // Removed Media/
            categories: "flexibility recovery",
            description: "Enhance your range of motion, prevent injuries, and improve recovery with this comprehensive mobility program."
        },
        // Add other program data stubs...
         "total-body-hiit": { 
             title: "Total Body HIIT", 
             totalWeeks: 10, 
             daysPerWeek: 7, 
             totalDays: 70, 
             // Assuming 5 HIIT images named hiit_day1.jpg to hiit_day5.jpg
             getImageForDay: (day) => `fitness/hiit_day${((day - 1) % 5) + 1}.jpg`,
             categories: "hiit strength",
             description: "Maximize your results with this high-intensity interval training program that combines strength and cardio elements."
         }, 
         "active-recovery": { 
             title: "Active Recovery", 
             totalWeeks: 3, 
             daysPerWeek: 7, 
             totalDays: 21, 
             // Assuming 3 recovery images named active_day1.jpg to active_day3.jpg
             getImageForDay: (day) => `fitness/active_day${((day - 1) % 3) + 1}.jpg`,
             categories: "recovery beginner",
             description: "Gentle exercises designed to improve circulation, reduce muscle soreness, and speed up the recovery process."
         }, 
         "functional-fitness": { 
             title: "Functional Fitness", 
             totalWeeks: 6, 
             daysPerWeek: 7, 
             totalDays: 42, 
             // Assuming 6 functional images named functional_day1.jpg to functional_day6.jpg
             getImageForDay: (day) => `fitness/functional_day${((day - 1) % 6) + 1}.jpg`,
             categories: "strength cardio",
             description: "Build practical strength for everyday movements with this functional training program focused on full-body integration."
         }
    };

    // --- Utility Functions ---
    function loadProgress() {
        const storedProgress = localStorage.getItem(LS_PROGRESS_KEY);
        return storedProgress ? JSON.parse(storedProgress) : {};
    }

    function saveProgress(allProgress) {
        localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify(allProgress));
    }

    function loadSavedPrograms() {
        const storedSaved = localStorage.getItem(LS_SAVED_KEY);
        return storedSaved ? JSON.parse(storedSaved) : []; // Returns an array of IDs
    }

    function saveSavedPrograms(savedProgramIds) {
        localStorage.setItem(LS_SAVED_KEY, JSON.stringify(savedProgramIds));
    }

    function isProgramSaved(programId) {
        return savedPrograms.includes(programId);
    }

    // --- Modal UI Update Function ---
    function updateModalUI() {
        if (!currentProgramData || !modalOverlay) return;

        // Header
        programTitleEl.textContent = currentProgramData.title;
        const currentWeek = Math.ceil(currentDay / currentProgramData.daysPerWeek);
        weekCounterEl.textContent = `Week ${currentWeek} of ${currentProgramData.totalWeeks}`;

        // Image
        workoutImageEl.src = currentProgramData.getImageForDay(currentDay);
        workoutImageEl.alt = `${currentProgramData.title} - Day ${currentDay}`;

        // Day Indicators
        dayIndicatorsContainer.innerHTML = ''; // Clear old indicators
        for (let i = 1; i <= currentProgramData.totalDays; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('day-indicator');
            indicator.textContent = i;
            indicator.dataset.day = i;
            if (i === currentDay) {
                indicator.classList.add('active');
            }
            if (completedDays.includes(i)) {
                indicator.classList.add('completed');
            }
            indicator.addEventListener('click', () => goToDay(i));
            dayIndicatorsContainer.appendChild(indicator);
        }
         // Scroll active indicator into view if container is scrollable
        const activeIndicator = dayIndicatorsContainer.querySelector('.active');
        if (activeIndicator && dayIndicatorsContainer.scrollHeight > dayIndicatorsContainer.clientHeight) {
            activeIndicator.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }


        // Navigation Arrows
        prevDayBtn.disabled = currentDay <= 1;
        prevDayBtn.classList.toggle('disabled', currentDay <= 1);
        nextDayBtn.disabled = currentDay >= currentProgramData.totalDays;
        nextDayBtn.classList.toggle('disabled', currentDay >= currentProgramData.totalDays);

        // Progress Bar & Text
        const progressPercent = (completedDays.length / currentProgramData.totalDays) * 100;
        progressBarEl.style.width = `${progressPercent}%`;
        progressTextEl.textContent = `${completedDays.length}/${currentProgramData.totalDays} Days Completed`;

        // Complete Button State
        if (completedDays.includes(currentDay)) {
            completeDayBtn.textContent = 'Day Completed';
            completeDayBtn.disabled = true;
            completeDayBtn.classList.add('completed');
        } else {
            completeDayBtn.textContent = 'Complete Day';
            completeDayBtn.disabled = false;
            completeDayBtn.classList.remove('completed');
        }

        // Save Button State
        if (isProgramSaved(currentProgramId)) {
            saveBtn.classList.add('saved');
            saveBtn.title = "Unsave Program";
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>'; // Solid icon
        } else {
            saveBtn.classList.remove('saved');
            saveBtn.title = "Save Program";
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i>'; // Regular icon
        }
    }

    // --- Navigation Functions ---
    function goToDay(dayNum) {
        if (dayNum >= 1 && dayNum <= currentProgramData.totalDays) {
            currentDay = dayNum;
            updateModalUI();
        }
    }

    // --- Event Handlers ---
    function handleOpenModal(event) {
        event.preventDefault(); // Prevent link navigation
        const card = event.target.closest('.program-card');
        
        // Find program ID based on card's data-program-id attribute first
        let programId = card?.dataset?.programId;
        
        // If not found by data-programId, try finding by title
        if (!programId) {
            const programTitle = card?.querySelector('h3')?.textContent;
            programId = Object.keys(programsData).find(key => programsData[key].title === programTitle);
        }

        if (!programId || !programsData[programId]) {
            console.error("Could not find program data for card:", card);
            return;
        }
        
        currentProgramId = programId;
        currentProgramData = programsData[currentProgramId];

        // Load progress
        const allProgress = loadProgress();
        completedDays = allProgress[currentProgramId] || [];
        
        // Load saved programs list
        savedPrograms = loadSavedPrograms();

        // Find the first uncompleted day, or start at day 1
        currentDay = 1;
        for (let i = 1; i <= currentProgramData.totalDays; i++) {
             if (!completedDays.includes(i)) {
                 currentDay = i;
                 break;
             }
             // If all days are complete, stay on the last day
             if (i === currentProgramData.totalDays && completedDays.includes(i)) {
                 currentDay = currentProgramData.totalDays;
             }
        }

        updateModalUI(); // Populate UI before animation

        // Animation
        modalOverlay.classList.remove('hidden');
        document.body.classList.add('modal-open');
        gsap.to(modalContent, {
            scale: 1,
            opacity: 1,
            y: 0, 
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    // --- Attach the global handleOpenModal function ---
    window.handleOpenModal = handleOpenModal;

    function handleCloseModal() {
        gsap.to(modalContent, {
            scale: 0.7,
            opacity: 0,
            y: '0px', 
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modalOverlay.classList.add('hidden');
                document.body.classList.remove('modal-open');
                // Reset state if needed
                currentProgramData = null;
                currentProgramId = null;
            }
        });
    }

    function handleCompleteDay() {
        if (!completedDays.includes(currentDay)) {
            completedDays.push(currentDay);
            completedDays.sort((a, b) => a - b); // Keep sorted

            // Save progress
            const allProgress = loadProgress();
            allProgress[currentProgramId] = completedDays;
            saveProgress(allProgress);

            // Update UI immediately
            updateModalUI();

            // Optional: Auto-advance after a short delay?
            // setTimeout(() => {
            //     if (currentDay < currentProgramData.totalDays) {
            //         goToDay(currentDay + 1);
            //     }
            // }, 800); // 800ms delay
        }
    }

    // --- Reset Progress Function ---
    function handleResetProgress() {
        if (!currentProgramId || !currentProgramData) return;

        const confirmReset = confirm(`Are you sure you want to reset all progress for the program "${currentProgramData.title}"? This cannot be undone.`);

        if (confirmReset) {
            console.log(`Resetting progress for ${currentProgramId}`);
            // Load all progress
            const allProgress = loadProgress();
            // Delete progress for the current program
            if (allProgress[currentProgramId]) {
                delete allProgress[currentProgramId];
            }
            // Save the updated progress object
            saveProgress(allProgress);
            // Reset local state for the modal
            completedDays = [];
            currentDay = 1;
            // Update the UI to reflect the reset
            updateModalUI();
        }
    }

    // --- Toggle Save Program Function (Inside Detail Modal) ---
    function toggleSaveProgram() {
        if (!currentProgramId) return;

        savedPrograms = loadSavedPrograms(); // Ensure we have the latest list
        const programIndex = savedPrograms.indexOf(currentProgramId);

        if (programIndex > -1) {
            // Program is saved, so unsave it
            savedPrograms.splice(programIndex, 1);
            console.log(`Unsaved program: ${currentProgramId}`);
        } else {
            // Program is not saved, so save it
            savedPrograms.push(currentProgramId);
            console.log(`Saved program: ${currentProgramId}`);
        }

        saveSavedPrograms(savedPrograms);
        updateModalUI(); // Update the button state in the detail modal
        updateSavedCounter(); // Update the counter in the filter section
    }

    // --- Populate Saved Programs Modal ---
    function populateSavedProgramsModal() {
        const savedGrid = document.getElementById('savedProgramsGrid');
        const emptyMessage = savedGrid?.querySelector('.empty-saved-message');
        if (!savedGrid || !emptyMessage) {
            console.error("Saved programs grid or empty message element not found.");
            return;
        }

        savedPrograms = loadSavedPrograms(); // Load latest saved IDs
        savedGrid.innerHTML = ''; // Clear existing cards
        savedGrid.appendChild(emptyMessage); // Re-add empty message element

        console.log(`Populating saved programs modal with ${savedPrograms.length} programs:`, savedPrograms);

        if (savedPrograms.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            savedPrograms.forEach(programId => {
                const programData = programsData[programId];
                if (programData) {
                    console.log(`Creating card for saved program: ${programId}`, programData);
                    
                    try {
                        // Create card using the refactored function
                        const cardElement = createProgramCard(programData, programId);

                        // Add unsave button
                        const unsaveBtn = document.createElement('button');
                        unsaveBtn.classList.add('unsave-button');
                        unsaveBtn.innerHTML = '&times;'; // Use times symbol
                        unsaveBtn.title = 'Unsave Program';
                        unsaveBtn.dataset.programId = programId; // Store ID for removal
                        unsaveBtn.addEventListener('click', handleUnsaveFromModal);
                        cardElement.appendChild(unsaveBtn);

                        savedGrid.appendChild(cardElement);
                    } catch (error) {
                        console.error(`Error creating card for program ${programId}:`, error);
                    }
                } else {
                    console.warn(`Data not found for saved program ID: ${programId}`);
                }
            });
        }
    }

    // --- Handle Unsave from Saved Modal ---
    function handleUnsaveFromModal(event) {
        event.stopPropagation(); // Prevent triggering parent elements
        
        const programIdToUnsave = event.target.dataset.programId;
        if (!programIdToUnsave) return;

        savedPrograms = loadSavedPrograms();
        const index = savedPrograms.indexOf(programIdToUnsave);
        if (index > -1) {
            savedPrograms.splice(index, 1);
            saveSavedPrograms(savedPrograms);
            updateSavedCounter(); // Update counter
            // Repopulate the modal to reflect the change
            populateSavedProgramsModal(); 
             // Also update save button state if detail modal is open for this program
             if (currentProgramId === programIdToUnsave && !modalOverlay.classList.contains('hidden')) {
                 updateModalUI();
             }
        }
    }

    // --- Open Saved Programs Modal ---
    function handleOpenSavedModal() {
        const savedModalOverlay = document.getElementById('savedProgramsModal');
        const savedModalContent = savedModalOverlay?.querySelector('.saved-programs-modal-content');
        if (!savedModalOverlay || !savedModalContent) {
            console.error("Could not find saved programs modal elements");
            return;
        }

        populateSavedProgramsModal(); // Populate with latest saved items

        savedModalOverlay.classList.remove('hidden');
        document.body.classList.add('modal-open');
        gsap.to(savedModalContent, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    // --- Close Saved Programs Modal ---
    function handleCloseSavedModal() {
        const savedModalOverlay = document.getElementById('savedProgramsModal');
        const savedModalContent = savedModalOverlay?.querySelector('.saved-programs-modal-content');
         if (!savedModalOverlay || !savedModalContent) return;

        gsap.to(savedModalContent, {
            scale: 0.7,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                savedModalOverlay.classList.add('hidden');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // --- Update Saved Counter in Filter Section ---
    function updateSavedCounter() {
        const counterElement = document.querySelector('.saved-counter');
        if (counterElement) {
            const count = loadSavedPrograms().length;
            counterElement.textContent = count;
        }
    }

    // --- Attach Event Listeners ---
    if (modalOverlay) {
         // Add listeners to all program links to open DETAIL modal
         programLinks.forEach(link => {
            link.addEventListener('click', handleOpenModal);
         });

        // Detail Modal listeners
        closeBtn?.addEventListener('click', handleCloseModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) handleCloseModal();
        });
        prevDayBtn?.addEventListener('click', () => goToDay(currentDay - 1));
        nextDayBtn?.addEventListener('click', () => goToDay(currentDay + 1));
        completeDayBtn?.addEventListener('click', handleCompleteDay);
        resetBtn?.addEventListener('click', handleResetProgress);
        saveBtn?.addEventListener('click', toggleSaveProgram); // Toggles save in detail modal

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
                handleCloseModal();
            }
        });
    } else {
        console.warn("Program detail modal overlay element not found.");
    }

    // Saved Programs Modal listeners
    const savedProgramsButton = document.querySelector('.saved-programs-button');
    const savedModalOverlay = document.getElementById('savedProgramsModal');
    const savedModalCloseBtn = document.getElementById('savedProgramsCloseBtn');

    if (savedProgramsButton) {
        savedProgramsButton.addEventListener('click', handleOpenSavedModal);
        console.log("Added click listener to saved programs button");
    } else {
        console.warn("Saved programs button not found");
    }
    
    if (savedModalOverlay) {
         savedModalOverlay.addEventListener('click', (e) => {
             if (e.target === savedModalOverlay) handleCloseSavedModal();
         });
    } else {
        console.warn("Saved programs modal overlay not found");
    }
    
     if (savedModalCloseBtn) {
         savedModalCloseBtn.addEventListener('click', handleCloseSavedModal);
     } else {
         console.warn("Saved programs close button not found");
     }
     
     // Close saved modal on escape key
     document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && savedModalOverlay && !savedModalOverlay.classList.contains('hidden')) {
             handleCloseSavedModal();
         }
     });
     
     // Initial update for saved counter on page load
     updateSavedCounter();

    // ======== End Program Modal Logic ========

    
    // ======== Hero Animations ========
    function initHeroAnimations() {
    // Initialize GSAP animations only if plugin is loaded
    const isScrollTriggerLoaded = isGsapLoaded && typeof ScrollTrigger !== 'undefined' && ScrollTrigger;
    
    if (!isGsapLoaded) {
        console.warn('GSAP not loaded, animations disabled');
        
        // Fallback non-GSAP interactions (simple CSS transitions)
        if (overlay) {
            // Simple overlay fallback (basic hover effect only)
            hero.addEventListener('mousemove', function(e) {
                const heroRect = hero.getBoundingClientRect();
                const centerX = heroRect.width / 2;
                const centerY = heroRect.height / 2;
                const moveX = (e.clientX - heroRect.left - centerX) / 20;
                const moveY = (e.clientY - heroRect.top - centerY) / 20;
                
                overlay.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            hero.addEventListener('mouseleave', function() {
                overlay.style.transform = 'translate(0, 0)';
            });
        }
        
        // Add simple smooth scrolling for arrow
        if (scrollDownArrow) {
            scrollDownArrow.addEventListener('click', function() {
                const fitnessSection = document.querySelector('.fitness-main');
                if (fitnessSection) {
                    window.scrollTo({
                        top: fitnessSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
            return;
    }
    
    // ======== Hero Overlay Mouse Animation ========
        try {
            // Register ScrollTrigger plugin
            if (isScrollTriggerLoaded) {
                gsap.registerPlugin(ScrollTrigger);
                console.log("ScrollTrigger registered successfully");
            }
        } catch (error) {
            console.error("Error registering ScrollTrigger:", error);
        }

        // Configuration for overlay animation
        const config = {
            baseDuration: 1.5,
            baseEase: "sine.out",
            maxMovement: 50,
            mouseInfluence: 0.1,
            mouseEasing: 0.1,
            scrollSpeed: 0.5,
            breathingAnimation: {
                enabled: true,
                scale: 1.03,
                duration: 4,
                ease: "sine.inOut"
            }
        };

        // State
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let isMouseOver = false;
        let animationFrame = null;
        let scrollY = 0;

        // Overlay position animation (breathing effect)
        if (config.breathingAnimation.enabled) {
            gsap.to(overlay, {
                scale: config.breathingAnimation.scale,
                duration: config.breathingAnimation.duration,
                ease: config.breathingAnimation.ease,
                repeat: -1,
                yoyo: true
            });
        }

        // Calculate distance from viewport center to element center
        function getDistanceFromCenter(element) {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;
            
            return {
                x: elementCenterX - viewportCenterX,
                y: elementCenterY - viewportCenterY
            };
        }

        // Handle mouse movement
        function handleMouseMove(e) {
            const heroRect = hero.getBoundingClientRect();
            const centerX = heroRect.width / 2;
            const centerY = heroRect.height / 2;
            
            // Calculate mouse position relative to hero center
            mouseX = (e.clientX - heroRect.left - centerX) * config.mouseInfluence;
            mouseY = (e.clientY - heroRect.top - centerY) * config.mouseInfluence;
            
            // Limit maximum movement
            mouseX = Math.max(Math.min(mouseX, config.maxMovement), -config.maxMovement);
            mouseY = Math.max(Math.min(mouseY, config.maxMovement), -config.maxMovement);
            
            // Update target position
            targetX = mouseX;
            targetY = mouseY;
            
            if (!isMouseOver) {
                isMouseOver = true;
            }
        }

        // Handle mouse leave
        function handleMouseLeave() {
            isMouseOver = false;
            
            // Return to center with easing
            gsap.to({
                customX: targetX,
                customY: targetY
            }, {
                customX: 0,
                customY: 0,
                duration: config.baseDuration,
                ease: config.baseEase,
                onUpdate: function() {
                    targetX = this.targets()[0].customX;
                    targetY = this.targets()[0].customY;
                }
            });
        }

        // Animation loop for smooth movement
        function animateOverlay() {
            // Smooth tracking of mouse position
            currentX += (targetX - currentX) * config.mouseEasing;
            currentY += (targetY - currentY) * config.mouseEasing;
            
            // Apply transform with both mouse movement and scroll parallax
            gsap.set(overlay, {
                x: currentX,
                y: currentY,
                force3D: true
            });
            
            // Continue animation loop
            animationFrame = requestAnimationFrame(animateOverlay);
        }

        // Start animation loop
        animationFrame = requestAnimationFrame(animateOverlay);

        // Add event listeners
        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);
        
        // Optional: Set up scroll animation if ScrollTrigger is available
        if (isScrollTriggerLoaded) {
            // Overlay parallax effect on scroll
            gsap.to(overlay, {
                y: 100, // Move down when scrolling
                ease: "none",
                scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                    scrub: config.scrollSpeed
                }
            });
            
            // Hero content fade out on scroll
            gsap.to(heroContent, {
                opacity: 0,
                y: -30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                    start: "center center",
                    end: "bottom top",
                    scrub: true
                }
            });
            
            // Scroll down arrow fade out
            gsap.to(scrollDownArrow, {
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                    end: "center center",
                        scrub: true
                }
            });
        }
        
        // Scroll down arrow click handler
        if (scrollDownArrow) {
            scrollDownArrow.addEventListener('click', function() {
                const fitnessSection = document.querySelector('.fitness-main');
                
                if (isScrollTriggerLoaded && ScrollToPlugin) {
                    // Use GSAP's ScrollToPlugin for smooth scrolling
                        gsap.to(window, {
                            duration: 1,
                        scrollTo: { y: fitnessSection, offsetY: 30 }, 
                            ease: "power2.inOut"
                        });
                    } else {
                    // Fallback to standard smooth scrolling
                    window.scrollTo({
                        top: fitnessSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    
    // ======== Program Card Filter & Animation ========
    function initProgramFilter() {
        const filterTags = document.querySelectorAll('.filter-section .filter-tag'); // Be more specific
        const programCards = document.querySelectorAll('.program-grid:not(.saved-grid) .program-card'); // Exclude saved grid
        const activeFiltersText = document.getElementById('activeFiltersText');
        const clearFiltersButton = document.getElementById('clearFilters');
        const allProgramsTag = document.querySelector('.filter-section .filter-tag[data-category="all"]');

        // Check if elements exist
        if (!filterTags.length || !programCards.length || !activeFiltersText || !clearFiltersButton || !allProgramsTag) {
            console.warn('Filter elements not found, filtering disabled.');
            return;
        }

        // Function to apply filter based on category
        function applyFilter(selectedCategory) {
            programCards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                const isMatch = selectedCategory === 'all' || (categories && categories.includes(selectedCategory));
                
                if (isMatch) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        }

        // Handle filter tag clicks
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const category = tag.getAttribute('data-category');
                const isActive = tag.classList.contains('active');

                // If clicking an active tag (and it's not 'all'), deactivate it and show all
                if (isActive && category !== 'all') {
                    tag.classList.remove('active');
                    allProgramsTag.classList.add('active'); // Activate 'All Programs'
                    activeFiltersText.textContent = allProgramsTag.textContent;
                    applyFilter('all'); // Apply 'all' filter
                } else {
                    // Deactivate all tags
                    filterTags.forEach(t => t.classList.remove('active'));
                    // Activate the clicked tag
                    tag.classList.add('active');
                    // Update text
                    activeFiltersText.textContent = tag.textContent;
                    // Apply the filter
                    applyFilter(category);
                }
            });
        });

        // Clear filters button
        clearFiltersButton.addEventListener('click', () => {
            // Deactivate all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Activate 'All Programs' tag
            allProgramsTag.classList.add('active');
            // Update text
            activeFiltersText.textContent = allProgramsTag.textContent;
            // Apply 'all' filter
            applyFilter('all');
        });

        // Initial state (show all)
        applyFilter('all'); // Apply 'all' filter on page load
        if (allProgramsTag) allProgramsTag.classList.add('active'); // Ensure 'All' is active initially
        
    }
    
    // Animate cards on scroll
    function animateCards() {
        const programCards = document.querySelectorAll('.program-card');
        
        if (!programCards.length) {
            console.warn('Program cards not found for animation');
            return;
        }
        
        if (isGsapLoaded && typeof ScrollTrigger !== 'undefined') {
            // GSAP animation for cards
            gsap.from(programCards, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.program-grid',
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                }
            });
        } else {
            // Fallback animation without GSAP
            programCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
        }
    }

    // ======== Background Circle Effects (Parallax & Attraction)
    function initBackgroundCircleEffects() {
        const bgCircles = document.querySelectorAll('.bg-circle');
        const fitnessMain = document.querySelector('.fitness-main'); 
    
        if (!bgCircles.length || !fitnessMain) {
            console.warn("Background circles or fitness-main section not found for effects.");
            return;
        }
    
        const isGsapLoaded = typeof gsap !== 'undefined' && gsap;
        // ScrollTrigger check removed as it's not used for attraction only
    
        if (!isGsapLoaded) {
            console.warn("GSAP not loaded, skipping background circle effects.");
            return;
        }
    
        // --- Setup GSAP Defaults --- 
        gsap.defaults({overwrite: 'auto'}); 
    
        // --- 1. GSAP Morphing Animation --- 
        console.log("Initializing GSAP Morphing for background circles."); // Add log
        bgCircles.forEach((circle, index) => {
            const duration = gsap.utils.random(10, 15);
            const delay = gsap.utils.random(0, 5);
            const morphTargets = [
                { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', scale: 1, rotate: 0 },
                { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', scale: 1.1 + (index * 0.05), rotate: 10 * (index + 1) },
                { borderRadius: '50% 50% 35% 65% / 60% 40% 60% 40%', scale: 1, rotate: -5 * (index + 1) },
                { borderRadius: '70% 30% 50% 50% / 30% 30% 70% 70%', scale: 1.05 + (index * 0.05), rotate: 15 * (index + 1) },
            ];
            const tl = gsap.timeline({ 
                repeat: -1, 
                yoyo: true, 
                delay: delay,
                defaults: { duration: duration / morphTargets.length, ease: "sine.inOut" }
            });
            morphTargets.forEach(target => {
                tl.to(circle, target);
            });
        });
    
        // --- 2. Parallax Effect (Using yPercent) --- 
        // <<< Removed commented-out parallax code >>>
    
        // --- 3. Mouse Attraction Effect (X & Y) --- 
        console.log("Initializing GSAP Mouse Attraction for background circles (X & Y).");
        const proximityThreshold = 250; 
        const maxAttraction = 50; 
        const attractionEase = 'power1.out';
        const returnEase = 'elastic.out(1, 0.7)';
        let frameCount = 0;
    
        function handleMouseMove(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            frameCount++;
    
            bgCircles.forEach((circle, index) => {
                const rect = circle.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
                    if (gsap.getProperty(circle, "x") !== 0 || gsap.getProperty(circle, "y") !== 0) {
                         gsap.to(circle, { x: 0, y: 0, duration: 0.5, ease: returnEase });
                    }
                    return;
                }
                
                const circleCenterX = rect.left + rect.width / 2;
                const circleCenterY = rect.top + rect.height / 2;
                
                const distanceX = mouseX - circleCenterX;
                const distanceY = mouseY - circleCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
                let targetX = 0;
                let targetY = 0; 
    
                if (distance < proximityThreshold) {
                    const attractionStrength = gsap.utils.mapRange(0, proximityThreshold, maxAttraction, 0, distance);
                    const angle = Math.atan2(distanceY, distanceX);
                    // Calculate target offsets based on angle and strength
                    // Apply attraction *away* from cursor by inverting angle
                    targetX = Math.cos(angle + Math.PI) * attractionStrength;
                    targetY = Math.sin(angle + Math.PI) * attractionStrength;
                    
                    if (index === 0 && frameCount % 60 === 0) { 
                        console.log(`Circle ${index+1} - Dist: ${distance.toFixed(0)}, Angle: ${angle.toFixed(2)}, TargetX: ${targetX.toFixed(2)}, TargetY: ${targetY.toFixed(2)}`);
                    }
    
                    gsap.to(circle, {
                        x: targetX, 
                        y: targetY, 
                        duration: 0.5, 
                        ease: attractionEase
                    });
    
                } else {
                    if (gsap.getProperty(circle, "x") !== 0 || gsap.getProperty(circle, "y") !== 0) {
                         gsap.to(circle, {
                            x: 0,
                            y: 0, 
                            duration: 1.2, 
                            ease: returnEase
                        });
                    }
                }
            });
        }
    
        fitnessMain.addEventListener('mousemove', handleMouseMove);
    
        fitnessMain.addEventListener('mouseleave', () => {
            console.log("Mouse left fitnessMain, resetting circles.");
            bgCircles.forEach(circle => {
                gsap.to(circle, {
                    x: 0,
                    y: 0, 
                    duration: 1.2,
                    ease: returnEase
                });
            });
        });
        
    } // End initBackgroundCircleEffects
});

/**
 * Initialize animations for program cards
 */
function initProgramCards() {
    // Check if GSAP and ScrollTrigger are loaded
    const isGsapLoaded = typeof gsap !== 'undefined' && gsap;
    const isScrollTriggerLoaded = isGsapLoaded && typeof ScrollTrigger !== 'undefined' && ScrollTrigger;
    
    // Animate in program cards when they come into view
    if (document.querySelector('.program-card') && isGsapLoaded && isScrollTriggerLoaded) {
        gsap.utils.toArray('.program-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: i * 0.1
            });
        });
    }
}

/**
 * Populate the fitness main section with program cards
 * This can be called when fitness page content needs to be loaded dynamically
 */
function loadFitnessPrograms() {
    // This is a placeholder function for future implementation
    // when program data is available
    
    const programsContainer = document.querySelector('.fitness-main .container');
    
    if (programsContainer) {
        // Add heading and intro text
        let content = `
            <h2>Our Fitness Programs</h2>
            <p class="fitness-intro">Discover our expert-led fitness programs designed to help you reach your goals, whether you're just starting out or looking to push your limits.</p>
            <div class="program-grid">
                <!-- Program cards would be added here dynamically -->
            </div>
        `;
        
        programsContainer.innerHTML = content;
        
        // After adding content, reinitialize program card animations
        initProgramCards();
    }
}

/**
 * Create a program card element (Refactored to return DOM Node)
 * @param {Object} program - Program data (using structure from programsData)
 * @param {string} programId - The unique ID for the program (e.g., 'strength-foundations')
 * @returns {HTMLElement} The program card DOM element
 */
function createProgramCard(program, programId) {
    const card = document.createElement('div');
    card.classList.add('frosted-glass', 'program-card');
    
    // Set the programId attribute for reference
    card.dataset.programId = programId;
    
    // Set data-categories attribute if categories exist in the program data
    if (program.categories) {
        card.setAttribute('data-categories', program.categories);
    }
    
    // Card Content
    const title = document.createElement('h3');
    title.textContent = program.title;

    const description = document.createElement('p');
    description.classList.add('program-description');
    // Use description from data or generate a generic one
    description.textContent = program.description || `Engage in the ${program.title} program, designed over ${program.totalWeeks} weeks.`; 

    const details = document.createElement('div');
    details.classList.add('program-details');

    // Dynamically create stats based on available data
    const stats = [
        { icon: 'fa-calendar', value: `${program.totalWeeks} Weeks` },
        // Assuming 'difficulty' and 'timePerDay' might be added later
        { icon: 'fa-dumbbell', value: program.difficulty || 'Varies' }, 
        { icon: 'fa-clock', value: program.timePerDay || 'Varies' } 
    ];

    stats.forEach(statData => {
        if (statData.value) { // Only add if value exists
            const stat = document.createElement('div');
            stat.classList.add('program-stat');
            stat.innerHTML = `<i class="fas ${statData.icon}"></i> ${statData.value}`;
            details.appendChild(stat);
        }
    });

    const link = document.createElement('a');
    link.href = '#'; // Prevent default link behavior, handled by JS
    link.classList.add('program-link');
    link.innerHTML = `View Program <i class="fas fa-arrow-right"></i>`;
    
    // Use the global handleOpenModal function
    link.addEventListener('click', function(e) {
        if (typeof window.handleOpenModal === 'function') {
            window.handleOpenModal(e);
        } else {
            console.error("handleOpenModal function not available globally");
        }
    });

    // Append elements
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(details);
    card.appendChild(link);

    return card;
}
 