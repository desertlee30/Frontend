// Blog post data - in a real application, this would come from a database or API
const blogPosts = [
    {
        id: 1,
        title: "8 Fitness Trends That Will Dominate This Year",
        subtitle: "Stay ahead of the curve with these emerging workout styles and health technologies that are changing how we approach fitness.",
        date: "May 31, 2023",
        readTime: "3 min read",
        views: 0,
        comments: 0,
        likes: 15,
        content: `
            <p>The fitness world is constantly evolving with new workout styles, equipment, and approaches to health. Let's explore the top fitness trends that are gaining momentum this year.</p>
            
            <h2>Emerging Fitness Technologies</h2>
            
            <p>From AI-powered workout apps to advanced wearables that track everything from sleep quality to recovery metrics, technology is revolutionizing how we approach fitness. These tools are making personalized training more accessible than ever before.</p>
            
            <blockquote>
                "The most effective fitness technology doesn't replace human connection—it enhances it by providing data that helps us make better decisions about our health." - Dr. Sarah Johnson, Sports Medicine Specialist
            </blockquote>
            
            <p>Virtual reality workouts, smart home gym equipment, and recovery-focused technologies are changing how we approach fitness at home and in traditional gym settings.</p>
            
            <h2>Holistic Wellness Approaches</h2>
            
            <p>This year, we're seeing a strong shift toward integrated fitness routines that balance high-intensity training with recovery practices like yoga, mobility work, and meditation. The focus has moved from purely aesthetic goals to performance and overall wellbeing.</p>

            <p>Mind-body connection exercises, breathwork, and stress management are becoming essential components of comprehensive fitness programs, recognizing that mental health directly impacts physical performance.</p>
        `
    },
    {
        id: 2,
        title: "The Science of Nutrition: Beyond Calories",
        subtitle: "Discover how the quality of your food matters more than simple calorie counts, and how nutrient timing can optimize your results.",
        date: "April 15, 2023",
        readTime: "4 min read",
        views: 0,
        comments: 0,
        likes: 26,
        content: `
            <p>The nutrition world is moving beyond simple calorie counting to a more nuanced understanding of how different foods affect our hormones, energy levels, and overall health.</p>
            
            <h2>Nutrient Quality Over Quantity</h2>
            
            <p>While calorie balance remains important for weight management, research increasingly shows that the source of those calories dramatically affects how our bodies process and utilize the energy from our food.</p>
            
            <blockquote>
                "Food is information, not just energy. Every bite you take sends specific instructions to your cells and genes." - Dr. Mark Hyman, Functional Medicine Specialist
            </blockquote>
            
            <p>Ultra-processed foods, even when calorie-matched with whole foods, don't provide the same nutritional benefits and can actually drive inflammation and hunger signals in ways that whole foods don't.</p>
            
            <h2>Strategic Nutrient Timing</h2>
            
            <p>When you eat can be almost as important as what you eat. Proper nutrient timing around workouts, strategic fasting periods, and aligning your eating patterns with your circadian rhythm can optimize performance, recovery, and long-term health outcomes.</p>

            <p>Understanding your body's unique needs and response to different foods is the future of nutrition—moving away from one-size-fits-all approaches to personalized nutrition strategies based on your goals, activity level, and even genetics.</p>
        `
    },
    {
        id: 3,
        title: "Recovery Strategies: The Missing Link in Your Fitness Journey",
        subtitle: "Learn why proper recovery might be the most underrated component of fitness success and how to implement effective recovery protocols.",
        date: "March 20, 2023",
        readTime: "3 min read",
        views: 0,
        comments: 0,
        likes: 14,
        content: `
            <p>In the pursuit of fitness goals, many enthusiasts focus primarily on training intensity and nutrition while overlooking the critical role of recovery in performance and results.</p>
            
            <h2>Why Recovery Matters</h2>
            
            <blockquote>
                "You don't get stronger during your workout—you get stronger during recovery when your body adapts to the training stress." - Alex Hutchinson, Exercise Science Author
            </blockquote>
            
            <p>Proper recovery isn't just about rest days. It encompasses sleep quality, stress management, nutrition, hydration, and active recovery techniques that help your body repair damaged tissues and adapt to training stimuli.</p>
            
            <blockquote>
                "Sleep is the most powerful recovery tool available to athletes, yet it's often the first thing sacrificed in busy schedules."
            </blockquote>
            
            <p>Research shows that insufficient recovery not only hampers performance but can lead to increased injury risk, hormonal imbalances, and psychological burnout that can derail your fitness journey entirely.</p>
            
            <h2>Effective Recovery Protocols</h2>
            
            <p>Implementing strategic recovery techniques like contrast therapy (alternating hot and cold exposure), compression, proper sleep hygiene, and mobility work can dramatically improve your body's ability to recover between training sessions and continue making progress toward your goals.</p>
        `
    },
    {
        id: 4,
        title: "Strength Training for Longevity: Why Everyone Should Lift Weights",
        subtitle: "Discover how resistance training benefits go far beyond aesthetics, potentially adding years to your life and significantly improving health outcomes.",
        date: "February 10, 2023",
        readTime: "3 min read",
        views: 0,
        comments: 0,
        likes: 19,
        content: `
            <p>While cardio exercise has long been associated with heart health and longevity, emerging research shows that strength training may be equally—if not more—important for extending lifespan and healthspan.</p>
            
            <h2>The Muscle-Longevity Connection</h2>
            
            <p>Maintaining muscle mass becomes increasingly important as we age. After age 30, we naturally lose 3-5% of muscle mass per decade, a process called sarcopenia that accelerates after 60. This muscle loss is directly associated with increased mortality risk.</p>
            
            <blockquote>
                "Muscle is the organ of longevity. It produces myokines that communicate with virtually every organ in the body, regulating metabolism, inflammation, and even cognitive function." - Dr. Peter Attia, Longevity Specialist
            </blockquote>
            
            <p>Regular strength training doesn't just preserve muscle—it can reverse age-related decline, improve bone density, enhance metabolic health, and significantly reduce the risk of falls and fractures that often precipitate decline in older adults.</p>
            
            <h2>Getting Started Safely</h2>
            
            <p>Strength training doesn't require heavy barbells or intense bodybuilding routines. Body weight exercises, resistance bands, and light dumbbells can provide significant benefits, especially for beginners. The key is progressive overload—gradually increasing resistance as your body adapts.</p>
            
            <p>Even two 30-minute strength sessions per week targeting major muscle groups can provide most of the longevity benefits. The best routine is the one you'll stick with consistently.</p>
        `
    },
    {
        id: 5,
        title: "Mindfulness and Exercise: The Perfect Performance Partnership",
        subtitle: "Learn how mindfulness practices can enhance athletic performance, improve mind-muscle connection, and accelerate recovery.",
        date: "January 18, 2023",
        readTime: "4 min read",
        views: 0,
        comments: 0,
        likes: 12,
        content: `
            <p>The integration of mindfulness practices with physical training is revolutionizing how athletes and fitness enthusiasts approach their workouts and recovery.</p>
            
            <h2>Enhanced Mind-Muscle Connection</h2>
            
            <p>Mindfulness—the practice of present-moment awareness without judgment—can dramatically improve the mind-muscle connection during exercise, leading to better form, more efficient movement patterns, and potentially greater results from the same training stimulus.</p>
            
            <blockquote>
                "The quality of your workout is determined by the quality of your attention. Most people are physically present but mentally absent during exercise." - Michael Gervais, Sports Psychologist
            </blockquote>
            
            <p>Research shows that athletes who practice mindfulness techniques report greater enjoyment of exercise, better adherence to training programs, and often achieve better results than those who exercise while distracted or mentally disengaged.</p>
            
            <h2>The Stress-Performance Connection</h2>
            
            <p>Chronic stress impairs recovery, disrupts sleep, and can negate many of the positive adaptations from exercise. Regular mindfulness practice has been shown to lower cortisol levels, improve heart rate variability, and enhance parasympathetic nervous system activity—all crucial factors in recovery and performance.</p>
            
            <p>Integrating breathwork, meditation, or mindful movement practices like yoga into your fitness routine isn't just beneficial for mental health—it creates the physiological conditions for optimal physical performance and adaptation.</p>
        `
    },
    {
        id: 6,
        title: "Nutrition Myths Debunked: What Science Really Says",
        subtitle: "Cut through the confusion with evidence-based answers to common nutrition questions that might be sabotaging your health goals.",
        date: "December 5, 2022",
        readTime: "5 min read",
        views: 0,
        comments: 0,
        likes: 22,
        content: `
            <p>The nutrition space is filled with conflicting information, making it challenging to separate fact from fiction. Let's examine what the scientific evidence actually says about common nutrition beliefs.</p>
            
            <h2>Meal Timing and Frequency</h2>
            
            <blockquote>
                "It's not when you eat that matters most for weight management—it's what and how much you eat. The idea that eating small, frequent meals 'stokes your metabolism' isn't supported by research." - Dr. Layne Norton, Nutrition Scientist
            </blockquote>
            
            <p>Research consistently shows that for weight management, overall calorie balance matters more than meal timing or frequency. While intermittent fasting may work well for some individuals, eating 6 small meals per day isn't inherently better for metabolism or weight loss.</p>
            
            <h2>Carbohydrates and Fat Loss</h2>
            
            <p>Low-carb and ketogenic diets have gained popularity, but research comparing diet types consistently shows that when protein and calories are matched, there's little difference in fat loss outcomes between low-carb and moderate-carb approaches.</p>
            
            <blockquote>
                "The best diet is the one you can stick to consistently that also meets your nutritional needs."
            </blockquote>
            
            <p>Individual factors like food preferences, lifestyle, activity level, and even genetics play a significant role in determining which dietary approach will be most sustainable and effective for each person.</p>
            
            <h2>Protein Requirements</h2>
            
            <p>The RDA for protein (0.8g per kg of body weight) is the minimum to prevent deficiency—not the optimal amount for health, performance, or body composition. Current research suggests higher protein intakes (1.6-2.2g per kg) better support muscle maintenance, recovery, and satiety, especially for active individuals.</p>
        `
    },
    {
        id: 7,
        title: "Sleep Optimization: The Ultimate Performance Enhancer",
        subtitle: "Discover why sleep might be the most important factor in your fitness journey and how to improve your sleep quality for better results.",
        date: "November 14, 2022",
        readTime: "4 min read",
        views: 0,
        comments: 0,
        likes: 17,
        content: `
            <p>While nutrition and exercise receive most of the attention in fitness discussions, sleep quality and quantity may be the most underrated factors affecting your results and overall health.</p>
            
            <h2>Sleep and Recovery</h2>
            
            <p>During sleep, particularly deep and REM sleep stages, your body releases growth hormone, repairs damaged tissues, consolidates motor learning from your workouts, and regulates key hormones involved in hunger, metabolism, and stress.</p>
            
            <blockquote>
                "If you're struggling with plateaus in performance or body composition despite consistent training and nutrition, inadequate sleep is often the hidden culprit." - Matthew Walker, PhD, Sleep Researcher
            </blockquote>
            
            <p>Just one night of poor sleep can reduce physical performance, impair glucose metabolism, increase hunger hormones, and compromise decision-making around food choices—effectively sabotaging both your workout quality and nutritional choices.</p>
            
            <h2>Optimizing Sleep Quality</h2>
            
            <p>Research-backed strategies for improving sleep quality include maintaining consistent sleep-wake times (even on weekends), creating a cool (65-68°F), dark sleeping environment, avoiding screens 1-2 hours before bedtime, limiting caffeine after noon, and establishing a calming pre-sleep routine.</p>
            
            <p>For athletes and fitness enthusiasts, timing exercise appropriately can also improve sleep quality. While morning exercise has been shown to improve deep sleep the following night, intense exercise too close to bedtime may delay sleep onset for some individuals.</p>
        `
    },
    {
        id: 8,
        title: "Functional Movement: Train for Life, Not Just the Gym",
        subtitle: "Learn how functional training can improve daily life activities, prevent injuries, and create balanced, sustainable fitness for the long term.",
        date: "October 22, 2022",
        readTime: "3 min read",
        views: 0,
        comments: 0,
        likes: 14,
        content: `
            <p>While aesthetic goals often drive fitness pursuits, training for improved function in daily life offers more sustainable motivation and practical benefits beyond the gym.</p>
            
            <h2>Beyond Isolated Muscles</h2>
            
            <p>Traditional bodybuilding-style training often isolates muscle groups, which can build impressive muscles but doesn't necessarily translate to improved performance in real-world movements that require coordination between multiple muscle groups.</p>
            
            <blockquote>
                "The body knows movements, not muscles. Training in integrated patterns rather than isolated parts creates more usable strength and resilience." - Dr. Stuart McGill, Spine Biomechanist
            </blockquote>
            
            <p>Functional training focuses on multi-joint, multi-planar movements that mimic real-life activities, training the body as an integrated system rather than as separate components.</p>
            
            <h2>Movement Patterns for Life</h2>
            
            <p>Fundamental movement patterns like squatting, hinging, pushing, pulling, rotating, and carrying form the foundation of functional training. Mastering these patterns with proper form first, then progressively adding load or complexity, builds a body that performs well in both athletic endeavors and daily tasks.</p>
            
            <p>This approach is particularly valuable as we age—maintaining the ability to get up from the floor, carry groceries, reach overhead, and move with confidence directly translates to independence and quality of life in later years.</p>
        `
    }
    // Add more blog posts as needed
];

// DOM Elements
const blogCards = document.querySelectorAll('.blog-card');
const modal = document.getElementById('blog-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalDate = document.querySelector('.modal-date');
const modalReadTime = document.getElementById('modal-read-time');
const modalBody = document.getElementById('modal-body');
const modalViews = document.getElementById('modal-views');
const modalComments = document.getElementById('modal-comments');
const modalLikes = document.getElementById('modal-likes');
const modalLikesContainer = document.getElementById('modal-likes-container');
const socialButtons = document.querySelectorAll('.social-btn');

// Current post being viewed
let currentPostId = null;

// Handle card click
const handleCardClick = (event) => {
    const card = event.currentTarget;
    const postId = parseInt(card.getAttribute('data-id'));
    currentPostId = postId;
    const post = blogPosts.find(p => p.id === postId) || blogPosts[0]; // Fallback to first post if not found
    
    // Populate modal with post data
    modalTitle.textContent = post.title;
    modalSubtitle.textContent = post.subtitle;
    modalDate.textContent = post.date + ' · ';
    modalReadTime.textContent = post.readTime;
    modalBody.innerHTML = post.content;
    modalViews.textContent = post.views;
    modalComments.textContent = post.comments;
    modalLikes.textContent = post.likes;
    
    // Update like button state
    updateLikeButtonState(post);
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
    
    // Update view count (in a real app, this would be an API call)
    post.views++;
    modalViews.textContent = post.views;
    
    // Update the sharing buttons with the current post URL
    updateSocialSharingUrls(post);
};

// Handle post like in modal
const handleLikeClick = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    
    if (!currentPostId) return;
    
    const post = blogPosts.find(p => p.id === currentPostId);
    if (!post) return;
    
    // Toggle like state (in a real app, this would be an API call)
    const isLiked = modalLikesContainer.classList.contains('liked');
    
    if (isLiked) {
        // Unlike
        post.likes--;
        modalLikesContainer.classList.remove('liked');
        modalLikesContainer.querySelector('i').classList.remove('fas');
        modalLikesContainer.querySelector('i').classList.add('far');
    } else {
        // Like
        post.likes++;
        modalLikesContainer.classList.add('liked');
        modalLikesContainer.querySelector('i').classList.remove('far');
        modalLikesContainer.querySelector('i').classList.add('fas');
    }
    
    // Update UI
    modalLikes.textContent = post.likes;
    
    // Update the card on the page
    const card = document.querySelector(`.blog-card[data-id="${currentPostId}"]`);
    if (card) {
        const likesElement = card.querySelector('.blog-card-likes');
        
        if (!isLiked) {
            // Update to filled heart
            likesElement.innerHTML = `<i class="fas fa-heart"></i> ${post.likes}`;
            // Add liked animation to the card
            likesElement.classList.add('liked');
            likesElement.classList.add('liked-permanent');
            setTimeout(() => likesElement.classList.remove('liked'), 1000);
        } else {
            // Update to empty heart
            likesElement.innerHTML = `<i class="far fa-heart"></i> ${post.likes}`;
            likesElement.classList.remove('liked-permanent');
        }
    }
};

// Update like button state based on post
const updateLikeButtonState = (post) => {
    // In a real app, you would check if the user has already liked this post from a database
    // For now, we'll check if the corresponding card has the liked-permanent class
    const card = document.querySelector(`.blog-card[data-id="${post.id}"]`);
    const isLiked = card && card.querySelector('.blog-card-likes').classList.contains('liked-permanent');
    
    if (isLiked) {
        modalLikesContainer.classList.add('liked');
        modalLikesContainer.querySelector('i').classList.remove('far');
        modalLikesContainer.querySelector('i').classList.add('fas');
    } else {
        modalLikesContainer.classList.remove('liked');
        modalLikesContainer.querySelector('i').classList.remove('fas');
        modalLikesContainer.querySelector('i').classList.add('far');
    }
    
    // Add the click event listener if not already added
    if (!modalLikesContainer.getAttribute('listener-added')) {
        modalLikesContainer.addEventListener('click', handleLikeClick);
        modalLikesContainer.setAttribute('listener-added', 'true');
    }
};

// Handle card like
const handleCardLikeClick = (event) => {
    event.stopPropagation(); // Prevent card click
    
    const card = event.currentTarget.closest('.blog-card');
    if (!card) return;
    
    const postId = parseInt(card.getAttribute('data-id'));
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Toggle like state (in a real app, this would be an API call)
    const likesElement = card.querySelector('.blog-card-likes');
    const isLiked = likesElement.classList.contains('liked-permanent');
    
    if (isLiked) {
        // Unlike
        post.likes--;
        likesElement.classList.remove('liked-permanent');
        likesElement.innerHTML = `<i class="far fa-heart"></i> ${post.likes}`;
    } else {
        // Like
        post.likes++;
        likesElement.classList.add('liked');
        likesElement.classList.add('liked-permanent');
        likesElement.innerHTML = `<i class="fas fa-heart"></i> ${post.likes}`;
        setTimeout(() => likesElement.classList.remove('liked'), 1000);
    }
};

// Close modal
const handleCloseModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Re-enable scrolling
    currentPostId = null;
};

// Update social sharing URLs
const updateSocialSharingUrls = (post) => {
    const pageUrl = encodeURIComponent(window.location.href + '?post=' + post.id);
    const pageTitle = encodeURIComponent(post.title);
    
    // Set up sharing URLs for different platforms
    const sharingUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
        link: window.location.href + '?post=' + post.id
    };
    
    // Update data attributes for sharing buttons
    socialButtons.forEach(btn => {
        const platform = btn.getAttribute('data-platform');
        if (platform) {
            btn.setAttribute('data-url', sharingUrls[platform] || '');
        }
    });
};

// Handle social sharing
const handleShareClick = (event) => {
    const btn = event.currentTarget;
    const platform = btn.getAttribute('data-platform');
    const shareUrl = btn.getAttribute('data-url');
    
    if (platform === 'link') {
        // Copy URL to clipboard
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                // Visual feedback for copy success
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    } else if (shareUrl) {
        // Open sharing dialog in a new window
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // Prevent the click from bubbling up to the modal
    event.stopPropagation();
};

// Handle clicking outside the modal to close it
const handleOverlayClick = (event) => {
    if (event.target === modal) {
        handleCloseModal();
    }
};

// Handle keyboard events (Escape to close modal)
const handleKeyDown = (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        handleCloseModal();
    }
};

// Initialize the blog functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners
    blogCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
        
        // Add click listener to the like button on each card
        const likesElement = card.querySelector('.blog-card-likes');
        if (likesElement) {
            likesElement.addEventListener('click', handleCardLikeClick);
        }
        
        // Make cards keyboard accessible
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleCardClick(event);
            }
        });
    });
    
    modalClose.addEventListener('click', handleCloseModal);
    modal.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeyDown);
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', handleShareClick);
    });
    
    // Check if we should open a specific post based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
        const cardToOpen = document.querySelector(`.blog-card[data-id="${postId}"]`);
        if (cardToOpen) {
            cardToOpen.click();
        }
    }
});
