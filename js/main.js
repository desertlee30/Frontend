gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('.about-section');

    // --- Navbar Visibility Control ---
    if (navbar && aboutSection) {
        const aboutSectionTop = aboutSection.offsetTop; // Get the initial top position

        ScrollTrigger.create({
            start: () => aboutSectionTop - 100, // Start checking when scrolled 100px above the about section
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

        // Initial check in case the page loads already scrolled down
        if (window.scrollY >= aboutSectionTop - 100) {
             // We don't necessarily hide it here, the onEnter/onUpdate will handle direction
             // But we might need an initial state if loading deep and scrolling up initially
        } else {
             navbar.classList.remove('hidden'); // Ensure visible if loaded above trigger
        }


    } else {
        console.error("Navbar or About Section element not found for scroll behavior.");
    }

    // --- Hero Content Parallax ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.to(heroContent, {
            yPercent: -30, // Move up 30% of its own height
            opacity: 0.7, // Fade out slightly (adjust opacity as desired)
            ease: "none", // Linear transition
            scrollTrigger: {
                trigger: ".hero",        // Element that triggers the animation
                start: "top top",        // When the top of the trigger hits the top of the viewport
                end: "bottom top",     // When the bottom of the trigger hits the top of the viewport
                scrub: true,             // Smoothly link animation progress to scroll position
                // markers: true,        // Uncomment for debugging visual markers
            }
        });
    } else {
         console.error("Hero content element not found for parallax effect.");
    }

    // --- Section Image Parallax (Reveal Effect) ---
    const parallaxContainers = gsap.utils.toArray('.image-parallax-container');
    if (parallaxContainers.length > 0) {
        parallaxContainers.forEach(container => {
            const image = container.querySelector('img'); // Target the img directly
            if (image) {
                // Animate yPercent from -45% to 0% (relative to image height, assuming 180% CSS height)
                // This slides the image downwards within the container
                gsap.fromTo(image, 
                    { yPercent: -45 }, // Start with image shifted up (bottom visible)
                    {
                        yPercent: 0,   // End with image top aligned with container top (top visible)
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,         
                            start: "top bottom",        
                            end: "bottom top",        
                            scrub: 0.20, 
                            // markers: true,         // Uncomment for debugging
                        }
                    }
                );
            }
        });
    } else {
        console.warn("No image-parallax-container elements found.");
    }

}); // End DOMContentLoaded 