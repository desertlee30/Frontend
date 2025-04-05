// Main JS file with parallax effects and animations
// Wait for both DOM and all scripts to load
window.addEventListener('load', function() {
    console.log('Main.js initializing GSAP animations');
    
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded. Parallax effects will not work.');
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.error('ScrollTrigger plugin not loaded. Parallax effects will not work.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    initNavbarScroll();
    initHeroParallax();
    initScrollArrow();
    initSectionParallax();
});

// Navbar scroll visibility
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('.about-section');

    if (!navbar || !aboutSection) {
        console.warn("Navbar or About Section element not found for scroll behavior.");
        return;
    }

    const aboutSectionTop = aboutSection.offsetTop;

    ScrollTrigger.create({
        start: () => aboutSectionTop - 100,
        end: "max",
        onUpdate: (self) => {
            if (self.direction === 1) {
                navbar.classList.add('hidden');
            } else if (self.direction === -1) {
                navbar.classList.remove('hidden');
            }
        },
        onLeaveBack: () => {
            navbar.classList.remove('hidden');
        },
        onEnter: (self) => {
            if (self.direction === 1) {
                navbar.classList.add('hidden');
            }
        },
        onEnterBack: () => {
            navbar.classList.remove('hidden');
        }
    });

    if (window.scrollY < aboutSectionTop - 100) {
        navbar.classList.remove('hidden');
    }
}

// Hero section parallax
function initHeroParallax() {
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
        const nextSection = document.querySelector('.about-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Section images parallax effect
function initSectionParallax() {
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