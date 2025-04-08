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
    
    // Ensure all elements are properly loaded before adding animations
    if (!hero || !overlay) {
        console.warn('Hero elements not found, animation not initialized');
    } else {
        // Initialize hero animations
        initHeroAnimations();
    }
    
    // Initialize program card filtering system
    initProgramFilter();
    
    // Initialize frosted glass cards
    animateCards();
    
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
        const filterTags = document.querySelectorAll('.filter-tag');
        const programCards = document.querySelectorAll('.program-card');
        const activeFiltersText = document.getElementById('activeFiltersText');
        const clearFiltersButton = document.getElementById('clearFilters');
        
        // Check if elements exist
        if (!filterTags.length || !programCards.length) {
            console.warn('Filter tags or program cards not found');
            return;
        }
        
        // Handle filter tag clicks
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all tags
                filterTags.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tag
                tag.classList.add('active');
                
                // Get selected category
                const category = tag.getAttribute('data-category');
                
                // Update active filters text
                if (activeFiltersText) {
                    activeFiltersText.textContent = tag.textContent;
                }
                
                // Filter program cards
                programCards.forEach(card => {
                    const categories = card.getAttribute('data-categories');
                    
                    if (category === 'all' || (categories && categories.includes(category))) {
                        // Show card with animation
                        gsap ? gsap.to(card, {opacity: 1, scale: 1, duration: 0.3}) 
                             : card.style.display = 'flex';
                    } else {
                        // Hide card with animation
                        gsap ? gsap.to(card, {opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => card.style.display = 'none'}) 
                             : card.style.display = 'none';
                    }
                });
            });
        });
        
        // Clear filters button
        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', () => {
                // Find and activate the "All" filter tag
                filterTags.forEach(tag => {
                    const category = tag.getAttribute('data-category');
                    if (category === 'all') {
                        tag.click();
                    }
                });
            });
        }
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
 * Create a program card element
 * @param {Object} program - Program data including title, description, image, etc.
 * @returns {string} HTML string for the program card
 */
function createProgramCard(program) {
    return `
        <div class="program-card">
            <img src="${program.image}" alt="${program.title}" class="program-image">
            <div class="program-content">
                <h3>${program.title}</h3>
                <p>${program.description}</p>
                <div class="program-details">
                    <div class="program-stat">
                        <i class="fas fa-clock"></i>
                        <span>${program.duration}</span>
                    </div>
                    <div class="program-stat">
                        <i class="fas fa-fire-alt"></i>
                        <span>${program.intensity}</span>
                    </div>
                    <div class="program-stat">
                        <i class="fas fa-user-friends"></i>
                        <span>${program.type}</span>
                    </div>
                </div>
                <a href="${program.link}" class="program-link">Learn More</a>
            </div>
        </div>
    `;
}
 