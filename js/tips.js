/**
 * WellnessWave Tips Page JavaScript
 * 
 * This file contains all JavaScript functionality for the tips.html page:
 * - Hero overlay mouse attraction effect & parallax
 * - Hero background parallax
 * - Hero content behavior
 * - Navbar scroll interactions
 * - Button effects
 * - Smooth scrolling
 * - Tip card animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======== Debug GSAP ========
    console.log("Tips.js loaded - checking GSAP availability");
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
                const tipsSection = document.querySelector('.tips-main');
                if (tipsSection) {
                    window.scrollTo({
                        top: tipsSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    
    // ======== Hero Overlay Mouse Animation ========
    if (hero && overlay && isGsapLoaded) {
        // Configuration
        const maxMovement = 60;
        const attractionStrength = 0.03;
        const returnDuration = 2.0;
        
        // Create a dedicated animation system for the overlay
        const overlayAnimation = {
            // Mouse position tracking
            mouseX: 0,
            mouseY: 0,
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0,
            
            // Scroll position tracking
            scrollY: 0,
            
            // Animation frame
            animationFrame: null,
            
            // Is the mouse over the hero?
            isMouseOver: false,
            
            // Initialize the system
            init: function() {
                console.log("Initializing overlay animation system");
                
                // Set up event listeners
                hero.addEventListener('mousemove', this.handleMouseMove.bind(this));
                hero.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                hero.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
                
                // Start the animation loop
                this.animate();
                
                return this;
            },
            
            // Handle mouse movement
            handleMouseMove: function(e) {
                // Get mouse position relative to hero center
                const heroRect = hero.getBoundingClientRect();
                const centerX = heroRect.width / 2;
                const centerY = heroRect.height / 2;
                
                // Raw mouse position
                this.mouseX = e.clientX - heroRect.left - centerX;
                this.mouseY = e.clientY - heroRect.top - centerY;
                
                // Apply attraction and clamping
                this.targetX = this.mouseX * attractionStrength;
                this.targetY = this.mouseY * attractionStrength;
                
                // Limit maximum movement
                this.targetX = Math.max(Math.min(this.targetX, maxMovement), -maxMovement);
                this.targetY = Math.max(Math.min(this.targetY, maxMovement), -maxMovement);
            },
            
            // Handle mouse enter
            handleMouseEnter: function() {
                this.isMouseOver = true;
            },
            
            // Handle mouse leave
            handleMouseLeave: function() {
                this.isMouseOver = false;
                
                // Return to center position
                gsap.to(this, {
                    targetX: 0,
                    targetY: 0,
                    duration: returnDuration / 2,
                    ease: "power2.out"
                });
            },
            
            // Set scroll progress (called by ScrollTrigger)
            setScrollProgress: function(progress) {
                // Scale progress to desired pixel movement (0-280px)
                this.scrollY = progress * 280;
            },
            
            // Animation loop
            animate: function() {
                // Smooth interpolation for mouse movement
                this.currentX += (this.targetX - this.currentX) * 0.1;
                this.currentY += (this.targetY - this.currentY) * 0.1;
                
                // Apply the transform directly to avoid GSAP transform conflicts
                if (overlay) {
                    // Combine mouse and scroll movements
                    const transformX = this.currentX;
                    const transformY = this.currentY + this.scrollY;
                    
                    // Only update if there's significant movement (reduces jitter)
                    if (Math.abs(transformX) > 0.01 || Math.abs(transformY) > 0.01) {
                        overlay.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
                    }
                }
                
                // Continue animation loop
                this.animationFrame = requestAnimationFrame(this.animate.bind(this));
            },
            
            // Clean up resources
            destroy: function() {
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                }
                
                // Remove event listeners
                hero.removeEventListener('mousemove', this.handleMouseMove);
                hero.removeEventListener('mouseenter', this.handleMouseEnter);
                hero.removeEventListener('mouseleave', this.handleMouseLeave);
            }
        };
        
        // Initialize animation system
        const animation = overlayAnimation.init();
        
        // Set up ScrollTrigger for scroll-based animation
        if (isScrollTriggerLoaded) {
            // Create scroll animation without directly manipulating transform
            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1.8,
                invalidateOnRefresh: true,
                fastScrollEnd: true,
                onUpdate: function(self) {
                    // Update scroll progress in animation system
                    animation.setScrollProgress(self.progress);
                }
            });
        }
    }
    
    // ======== Navbar Scroll Effects ========
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        if (navbar) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
    });
    
    // ======== Hero Parallax Effects ========
    if (isGsapLoaded && isScrollTriggerLoaded) {
        // Register ScrollTrigger with error handling
        try {
            gsap.registerPlugin(ScrollTrigger);
            console.log("ScrollTrigger registered successfully");
        } catch (error) {
            console.error("Error registering ScrollTrigger:", error);
            isScrollTriggerLoaded = false;
        }
        
        // Classic fixed background approach - more reliable across browsers
        if (heroBackground && isScrollTriggerLoaded) {
            // Apply fixed background attachment via JavaScript 
            // (this avoids CSS conflicts but still gives the classic parallax effect)
            gsap.set(heroBackground, {
                backgroundAttachment: "fixed",
                backgroundPosition: "center center",
                backgroundSize: "cover"
            });
            
            // Add subtle movement to enhance the fixed effect
            gsap.fromTo(
                hero, 
                { backgroundPositionY: "0%" },
                {
                    backgroundPositionY: "30%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1 
                    }
                }
            );
        }

        // Overlay movement is subtle and independent of background
        if (overlay) {
            // All overlay animation is now handled by the overlayAnimation object
            // This section is only responsible for scroll-based animations for other elements
        }
        
        // Hero content - STAYS FIXED with fade effect only
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
        
        // Scroll arrow fadeout (cleaner transition)
        if (scrollDownArrow) {
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
                const tipsSection = document.querySelector('.tips-main');
                if (tipsSection) {
                    if (hasScrollToPlugin) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: tipsSection, offsetY: 0 },
                            ease: "power2.inOut"
                        });
                    } else {
                        // Fallback to native smooth scrolling
                        tipsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        if (hasScrollToPlugin) {
                            gsap.to(window, {
                                duration: 1,
                                scrollTo: { y: targetElement, offsetY: 0 },
                                ease: "power2.inOut"
                            });
                        } else {
                            // Fallback to native smooth scrolling
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    } else {
        // Generic smooth scrolling with native API (already defined in the fallback section)
    }
    
    // ======== Button Hover Effects ========
    if (isGsapLoaded) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                gsap.to(this, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
            });
            button.addEventListener('mouseleave', function() {
                gsap.to(this, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        });
        
        // ======== Tip Cards Hover & Scroll Animation ========
        const tipCards = document.querySelectorAll('.tip-card');
        
        // Helper function to stagger animations with delay
        const animateCards = () => {
            // Hide cards initially
            gsap.set(tipCards, { opacity: 0, y: 50 });
            
            // Create staggered timeline for smoother sequence
            const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
            
            // Add each card to the timeline with staggered delay
            tl.to(tipCards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1, // Stagger each card's animation
                ease: "power2.out",
                clearProps: "opacity" // Clear opacity prop after animation for better performance
            });
        };
        
        // Add small delay before starting animations to ensure DOM is ready
        setTimeout(animateCards, 100);
        
        // Add hover animations to cards
        tipCards.forEach(card => {
            card.classList.add('no-hover-effect');
            
            // Hover animation
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    y: -10,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            // Smoother leave animation with improved easing
            card.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    y: 0,
                    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
                    duration: 2.2,
                    ease: "power4.out"
                });
            });
        });
    }
}); 