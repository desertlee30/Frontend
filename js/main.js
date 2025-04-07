// Main JS file with parallax effects and animations

// Check if GSAP and ScrollTrigger are loaded early
const isGsapLoaded = typeof gsap !== 'undefined' && gsap;
const isScrollTriggerLoaded = isGsapLoaded && typeof ScrollTrigger !== 'undefined' && ScrollTrigger;

if (isGsapLoaded) {
    console.log('GSAP loaded. Version:', gsap.version);
    if (isScrollTriggerLoaded) {
        console.log('ScrollTrigger loaded.');
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error('ScrollTrigger plugin not loaded. Some effects will not work.');
    }
} else {
    console.error('GSAP library not loaded. Effects will not work.');
}


// Initialize other GSAP animations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Initializing GSAP-dependent animations');

    // ======== Navbar Scroll Effects (GSAP Approach) ========
    const navbar = document.querySelector('.navbar');
    if (navbar && isGsapLoaded) { // Ensure GSAP is loaded
        console.log("Setting up navbar scroll animation (GSAP approach)");
        
        let lastScrollTop = 0;
        let isHidden = false; // Track state to prevent redundant animations
        const navbarHeight = navbar.offsetHeight;

        // Set initial state (visible)
        gsap.set(navbar, { y: 0, opacity: 1 });

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Scrolling Down
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (!isHidden) {
                    isHidden = true;
                    gsap.to(navbar, { 
                        y: -navbarHeight, // Move up by its height
                        opacity: 0,
                        duration: 0.3, 
                        ease: "power1.inOut" 
                    });
                }
            } 
            // Scrolling Up or Near Top
            else {
                if (isHidden) {
                    isHidden = false;
                    gsap.to(navbar, { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.3, 
                        ease: "power1.inOut" 
                    });
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    } else if (!navbar) {
        console.warn("Navbar not found - navbar animation disabled");
    } else if (!isGsapLoaded) {
        console.warn("GSAP not loaded - falling back to CSS class toggle for navbar");
        // Fallback to original CSS class logic if GSAP isn't available
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    if (!isGsapLoaded) return; // Don't run GSAP stuff if not loaded

    // Reenable other initializations
    initHeroParallax();
    initScrollArrow();
    initSectionParallax();
});


// Hero section parallax
function initHeroParallax() {
    if (!isGsapLoaded || !isScrollTriggerLoaded) return; // Check GSAP/ScrollTrigger
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) {
        console.warn("Hero content element not found for parallax effect.");
        return;
    }

    gsap.to(heroContent, {
        yPercent: -30,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });
}

// Scroll down arrow animation
function initScrollArrow() {
    if (!isGsapLoaded || !isScrollTriggerLoaded) return; // Check GSAP/ScrollTrigger
    const scrollArrow = document.querySelector('#scroll-down-arrow');
    if (!scrollArrow) {
        console.warn("Scroll arrow element not found.");
        return;
    }

    gsap.to(scrollArrow, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "15% top",
            scrub: true
        }
    });

    scrollArrow.addEventListener('click', () => {
        const nextSection = document.querySelector('.about-section') || 
                           document.querySelector('#main-container');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Section images parallax effect
function initSectionParallax() {
    if (!isGsapLoaded || !isScrollTriggerLoaded) return; // Check GSAP/ScrollTrigger
    console.log('Initializing section parallax');
    const parallaxContainers = gsap.utils.toArray('.image-parallax-container');
    
    if (parallaxContainers.length === 0) {
        console.warn("No image-parallax-container elements found. Parallax won't work.");
        return;
    }
    
    console.log(`Found ${parallaxContainers.length} parallax containers`);
    
    parallaxContainers.forEach((container, index) => {
        const image = container.querySelector('img');
        if (!image) {
            console.warn(`No image found in parallax container ${index+1}`);
            return;
        }
        
        console.log(`Setting up parallax for container ${index+1}`);
        
        gsap.fromTo(image, 
            { yPercent: -50 },
            {   
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.60,
                    // markers: true,  // Uncomment for debugging
                    onEnter: () => console.log(`Parallax ${index+1} entered`),
                    onLeave: () => console.log(`Parallax ${index+1} left`)
                }
            }
        );
    });
} 