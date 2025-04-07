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
 * - Program card animations
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
        return;
    }
    
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
    }
    
    // ======== Hero Overlay Mouse Animation ========
    if (hero && overlay && isGsapLoaded) {
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
            
            // Apply transform with smooth easing
            gsap.set(overlay, {
                x: currentX,
                y: currentY + scrollY
            });
            
            // Continue animation loop
            animationFrame = requestAnimationFrame(animateOverlay);
        }

        // Start animation loop
        animationFrame = requestAnimationFrame(animateOverlay);

        // Add event listeners
        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);
        
        // Set up scroll-based animation
        if (isScrollTriggerLoaded) {
            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: config.scrollSpeed,
                invalidateOnRefresh: true,
                onUpdate: function(self) {
                    // Update scroll position for overlay movement
                    scrollY = self.progress * 280; // 280px total movement
                }
            });
        }
    }
    
    // ======== Hero Parallax Effects ========
    if (isGsapLoaded && isScrollTriggerLoaded) {
        // Hero background parallax
        if (heroBackground) {
            // Set initial properties
            gsap.set(heroBackground, {
                backgroundAttachment: "fixed",
                backgroundPosition: "center center",
                backgroundSize: "cover"
            });
            
            // Create parallax effect
            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
                onUpdate: function(self) {
                    // Move background position based on scroll
                    const yPercent = self.progress * 30;
                    gsap.set(heroBackground, {
                        backgroundPositionY: `${yPercent}%`
                    });
                }
            });
        }
        
        // Hero content fade effect
        if (heroContent) {
            gsap.fromTo(heroContent, 
                { y: 0, opacity: 1 },
                { 
                    y: 0, // No vertical movement (stays fixed)
                    opacity: 0.3, // Just fade out effect
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "center top",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                }
            );
        }
        
        // Scroll arrow fadeout
        if (scrollDownArrow) {
            // Add pulse animation to make it more visible
            gsap.to(scrollDownArrow, {
                y: 10,
                opacity: 0.7,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Fade out on scroll
            gsap.fromTo(scrollDownArrow,
                { opacity: 1 },
                {
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "10% top",
                        scrub: true
                    }
                }
            );
        }
    }
    
    // ======== Smooth Scrolling ========
    if (isGsapLoaded) {
        // Check if ScrollToPlugin is registered
        const hasScrollToPlugin = gsap.core && typeof gsap.core.globals === 'function' && gsap.core.globals('ScrollToPlugin');
        
        if (scrollDownArrow) {
            scrollDownArrow.addEventListener('click', function() {
                const fitnessSection = document.querySelector('.fitness-main');
                if (fitnessSection) {
                    if (hasScrollToPlugin) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: fitnessSection, offsetY: 0 },
                            ease: "power2.inOut"
                        });
                    } else {
                        // Fallback to native smooth scrolling
                        fitnessSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    }
    
    // ======== Initialize Program Cards ========
    initProgramCards();
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
 