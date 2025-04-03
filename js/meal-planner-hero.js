document.addEventListener('DOMContentLoaded', function() {

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.meal-hero');

    // --- Navbar Visibility Control ---
    if (navbar && heroSection) {
        const heroSectionTop = heroSection.offsetTop;
        const heroSectionHeight = heroSection.offsetHeight;

        ScrollTrigger.create({
            start: () => heroSectionHeight - 100, // Start checking when scrolled 100px before the end of hero
            end: "max", // Continue checking to the end of the page
            onUpdate: (self) => {
                // Hide navbar when scrolling down past the trigger point
                if (self.direction === 1) {
                    navbar.classList.add('hidden');
                }
                // Show navbar when scrolling up past the trigger point
                else if (self.direction === -1) {
                    navbar.classList.remove('hidden');
                }
            },
            // Ensure navbar is visible when scrolling back up above the trigger point
            onLeaveBack: () => {
                navbar.classList.remove('hidden');
            },
            // If the page loads scrolled past the trigger, handle initial state correctly
            onEnter: (self) => {
                if (self.direction === 1) { // If entered scrolling down
                    navbar.classList.add('hidden');
                }
            },
            onEnterBack: () => { // When scrolling up into the trigger zone
                navbar.classList.remove('hidden');
            }
        });
        
    }

    // --- Hero Content Parallax ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.to(heroContent, {
            yPercent: -30, // Move up 30% of its own height
            opacity: 0.7, // Fade out slightly
            ease: "none", // Linear transition
            scrollTrigger: {
                trigger: ".meal-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });
    }

    // --- Hero Scroll Down Arrow Fade ---
    const scrollArrow = document.querySelector('#scroll-down-arrow');
    if (scrollArrow) {
        gsap.to(scrollArrow, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".meal-hero",
                start: "top top", // Start fading when top of hero hits top of viewport
                end: "15% top", // Fully faded by the time 15% of hero is scrolled past top
                scrub: true
            }
        });

        // Scroll down when arrow is clicked
        scrollArrow.addEventListener('click', function() {
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) {
                mainContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                const mainContainerByClass = document.querySelector('.main-container');
                if (mainContainerByClass) {
                    mainContainerByClass.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // --- Video Parallax Effect ---
    // Re-implementing GSAP parallax to mimic fixed background
    const videoElement = document.getElementById('meal-video');
    if (videoElement) {
        
        gsap.to(videoElement, {
            yPercent: 25, // Move video *down* relative to container as page scrolls up
            ease: "none",
            scrollTrigger: {
                trigger: ".meal-hero",
                start: "top top",
                end: "bottom top",
                scrub: true, // Smoothly tie animation to scroll
                invalidateOnRefresh: true
            }
        });
    }
}); 