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
    const heroContent = document.getElementById('hero-content');
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
    
    // ======== Tip Card Modal Animation ========
    const tipCards = document.querySelectorAll('.tip-card');
    const tipModal = document.getElementById('tipModal');
    const tipModalOverlay = document.getElementById('tipModalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon').querySelector('i');
    const modalText = document.getElementById('modalText');
    
    // Content for different tip types with expanded information
    const tipContent = {
        'Cardiovascular Health': {
            icon: 'fa-heartbeat',
            colorClass: 'modal-color-red',
            content: document.getElementById('modalText').innerHTML // Use existing content
        },
        'Mental Wellness': {
            icon: 'fa-brain',
            colorClass: 'modal-color-blue',
            content: `
                <h3>Why Mental Wellness Matters</h3>
                <p>Mental wellness is fundamental to our overall health and quality of life. It affects how we think, feel, and act. It helps determine how we handle stress, relate to others, and make choices. A growing body of research shows that mental well-being is not simply the absence of mental health conditions, but rather a state of thriving where individuals realize their own potential, can cope with normal life stresses, work productively, and contribute to their communities.</p>
                
                <h3>Key Benefits</h3>
                <ul>
                    <li>Reduced anxiety and depression symptoms</li>
                    <li>Improved focus and cognitive function</li>
                    <li>Enhanced emotional regulation and resilience</li>
                    <li>Better relationships and social connections</li>
                    <li>Increased productivity and life satisfaction</li>
                    <li>Stronger immune system functioning</li>
                    <li>Lower risk of cardiovascular disease</li>
                    <li>Improved sleep quality</li>
                    <li>Greater ability to handle life's challenges</li>
                </ul>
                
                <h3>Practical Tips</h3>
                <ol>
                    <li><strong>Daily Mindfulness:</strong> Practice mindfulness meditation for 10 minutes daily to reduce stress and improve mental clarity. Mindfulness helps bring your attention to the present moment without judgment, reducing rumination and worry. Apps like Headspace, Calm, or Insight Timer can guide beginners through the process.</li>
                    <li><strong>Digital Detox:</strong> Schedule regular breaks from screens and social media to reduce information overload. Consider setting specific tech-free times, such as during meals or for an hour before bedtime. Use this time for face-to-face connections or activities that nourish your mental health.</li>
                    <li><strong>Physical Activity:</strong> Exercise releases endorphins, which naturally improve mood and reduce stress. Even short bursts of activity can have significant mental health benefits. Find activities you enjoy so you're more likely to stick with them long-term.</li>
                    <li><strong>Quality Sleep:</strong> Prioritize 7-9 hours of quality sleep per night for optimal brain function. Create a consistent sleep schedule and a relaxing bedtime routine. Keep your bedroom cool, dark, and free from electronic devices.</li>
                    <li><strong>Gratitude Practice:</strong> Keep a gratitude journal to shift focus toward positive aspects of life. Each day, write down three things you're thankful for. This simple practice has been shown to increase happiness and life satisfaction over time.</li>
                    <li><strong>Social Connection:</strong> Nurture meaningful relationships with friends, family, and community. Quality social connections are one of the strongest predictors of well-being. Make time for the people who matter to you and be open to forming new connections.</li>
                    <li><strong>Nature Exposure:</strong> Spend time outdoors in natural environments. Research shows that just 20 minutes in nature can significantly reduce stress hormone levels. Forest bathing, gardening, or simply sitting in a park can all provide mental health benefits.</li>
                </ol>
                
                <h3>Start Small</h3>
                <p>Begin with just 5 minutes of mindfulness meditation daily. Find a quiet space, sit comfortably, and focus on your breath. When your mind wanders, gently bring your attention back to your breathing. Gradually increase the duration as it becomes easier. Remember that consistency matters more than duration when you're starting a mindfulness practice.</p>
                
                <h3>Track Your Progress</h3>
                <p>Consider keeping a mood journal to notice patterns in your mental well-being. Note your energy levels, mood, and stress levels at different times of day and after different activities. This self-awareness can help you identify what practices are most beneficial for your unique mental health needs.</p>
                
                <h3>When to Seek Professional Support</h3>
                <p>While self-care practices are essential for mental wellness, sometimes professional support is needed. If you experience persistent feelings of sadness or anxiety, difficulty functioning in daily life, or thoughts of harming yourself, reach out to a mental health professional. Many resources exist, including therapists, counselors, support groups, and crisis hotlines. Remember that seeking help is a sign of strength, not weakness.</p>
            `
        },
        'Nutrition Tips': {
            icon: 'fa-apple-alt',
            colorClass: 'modal-color-green',
            content: `
                <h3>Why Nutrition Matters</h3>
                <p>Proper nutrition is the foundation of good health. What you eat directly impacts your energy levels, immune function, mental clarity, and long-term health outcomes. The food choices we make daily influence cellular regeneration, inflammation levels, gut microbiome health, and even gene expression. A balanced, nutrient-dense diet provides the raw materials your body needs to function optimally and protect against chronic diseases.</p>
                
                <h3>Key Benefits</h3>
                <ul>
                    <li>Sustained energy throughout the day</li>
                    <li>Stronger immune system</li>
                    <li>Reduced risk of chronic diseases</li>
                    <li>Improved mood and mental function</li>
                    <li>Healthier weight management</li>
                    <li>Better digestive health</li>
                    <li>Enhanced skin, hair, and nail quality</li>
                    <li>Balanced hormone production</li>
                    <li>More efficient recovery and repair</li>
                    <li>Reduced inflammation throughout the body</li>
                </ul>
                
                <h3>Practical Tips</h3>
                <ol>
                    <li><strong>Eat the Rainbow:</strong> Incorporate a variety of colorful fruits and vegetables into your diet for essential vitamins and minerals. Different colors signify different phytonutrients, so aim for diverse selections. Dark leafy greens, vibrant berries, orange root vegetables, and red peppers all offer unique nutritional profiles.</li>
                    <li><strong>Prioritize Whole Foods:</strong> Choose minimally processed foods over highly processed alternatives. Whole foods retain more of their natural nutrients and typically contain fewer additives, preservatives, and added sugars. Shop the perimeter of the grocery store where fresh foods are typically located.</li>
                    <li><strong>Balanced Plate:</strong> Fill half your plate with vegetables, a quarter with lean protein, and a quarter with whole grains. This simple visual guide helps ensure proper macronutrient balance without requiring strict measuring or calorie counting. Add a small amount of healthy fats like olive oil, avocado, or nuts.</li>
                    <li><strong>Mindful Eating:</strong> Slow down, eliminate distractions, and pay attention to hunger and fullness cues. It takes approximately 20 minutes for your brain to register fullness, so eating slowly helps prevent overeating. Notice the flavors, textures, and sensations of your food.</li>
                    <li><strong>Hydration:</strong> Drink water consistently throughout the day and limit sugary beverages. Proper hydration supports every system in your body, from digestion to circulation to temperature regulation. Consider starting each day with a glass of water and keeping a water bottle nearby.</li>
                    <li><strong>Healthy Fats:</strong> Include sources of omega-3 fatty acids and other healthy fats in your diet. Fatty fish (salmon, sardines, mackerel), walnuts, flaxseeds, olive oil, and avocados provide essential fatty acids that support brain health, reduce inflammation, and improve nutrient absorption.</li>
                    <li><strong>Gut Health:</strong> Incorporate fermented foods and fiber-rich options to support a healthy microbiome. Yogurt, kefir, sauerkraut, kimchi, and kombucha contain beneficial probiotics, while whole grains, legumes, fruits, and vegetables provide prebiotic fiber that feeds healthy gut bacteria.</li>
                </ol>
                
                <h3>Start Small</h3>
                <p>Begin by adding one additional serving of vegetables to your day. Try incorporating vegetables into meals you already enjoy, like adding spinach to smoothies or extra vegetables to pasta sauce. Small, sustainable changes are more effective than radical diet overhauls that are difficult to maintain.</p>
                
                <h3>Meal Planning Strategies</h3>
                <p>Taking time to plan meals can significantly improve your nutrition. Consider batch cooking on weekends, preparing versatile ingredients that can be used in multiple dishes, and keeping healthy snacks readily available. Having nutritious options on hand makes it easier to make good choices, especially when you're busy or tired.</p>
                
                <h3>Understanding Food Labels</h3>
                <p>Learn to read nutrition facts panels and ingredient lists critically. Look for short ingredient lists with recognizable items. Be aware that ingredients are listed in order of quantity, so the first few ingredients make up the majority of the product. Watch out for different names for added sugars, such as high-fructose corn syrup, dextrose, or maltose.</p>
                
                <h3>Individualized Nutrition</h3>
                <p>Remember that nutritional needs vary based on age, activity level, health status, and personal factors. What works for someone else might not be optimal for you. Consider consulting with a registered dietitian for personalized nutrition advice, especially if you have specific health concerns or dietary restrictions.</p>
            `
        },
        'Strength Training': {
            icon: 'fa-dumbbell',
            colorClass: 'modal-color-orange',
            content: `
                <h3>Why Strength Training Matters</h3>
                <p>Strength training is essential for maintaining muscle mass, boosting metabolism, improving joint health, and enhancing overall functional capacity throughout life. Unlike cardiovascular exercise alone, resistance training directly builds muscle tissue, strengthens bones, and improves body composition. Research shows that regular strength training can reverse age-related muscle loss (sarcopenia), improve insulin sensitivity, and enhance quality of life as we age.</p>
                
                <h3>Key Benefits</h3>
                <ul>
                    <li>Increased muscle mass and strength</li>
                    <li>Improved bone density and reduced risk of osteoporosis</li>
                    <li>Enhanced metabolic rate and fat burning</li>
                    <li>Better posture and reduced back pain</li>
                    <li>Increased energy and improved mood</li>
                    <li>Enhanced functional capacity for daily activities</li>
                    <li>Improved glucose management and insulin sensitivity</li>
                    <li>Reduced risk of injury through improved stability</li>
                    <li>Better body composition (more muscle, less fat)</li>
                    <li>Improved connective tissue strength and joint stability</li>
                </ul>
                
                <h3>Practical Tips</h3>
                <ol>
                    <li><strong>Frequency:</strong> Include resistance training at least twice weekly to maintain muscle mass and bone density. For optimal results, aim for 2-3 strength sessions per week with at least 48 hours between sessions targeting the same muscle groups. This allows for adequate recovery and adaptation.</li>
                    <li><strong>Compound Exercises:</strong> Focus on multi-joint movements like squats, deadlifts, push-ups, rows, and lunges for maximum efficiency. These exercises recruit multiple muscle groups simultaneously, providing more bang for your buck and mimicking real-world movement patterns.</li>
                    <li><strong>Progressive Overload:</strong> Gradually increase weight, repetitions, or difficulty to continue making gains. The principle of progressive overload is essential for continued improvement—your muscles adapt to the demands placed on them, requiring new challenges for continued growth.</li>
                    <li><strong>Proper Form:</strong> Prioritize technique over weight to prevent injury and maximize results. Consider working with a qualified trainer initially to learn proper form, especially for more complex movements. Focus on controlled, intentional movements rather than using momentum.</li>
                    <li><strong>Recovery:</strong> Allow 48 hours between training the same muscle groups for optimal recovery. Muscle growth happens during recovery, not during the workout itself. Ensure adequate protein intake, hydration, and sleep to support the repair and building process.</li>
                    <li><strong>Full Body Approach:</strong> Include exercises for all major muscle groups—legs, chest, back, shoulders, arms, and core. A balanced approach prevents muscular imbalances that can lead to posture problems and injuries. Aim to push, pull, squat, hinge, and carry in your routine.</li>
                    <li><strong>Variety and Periodization:</strong> Change your routine every 4-6 weeks to prevent plateaus and keep training interesting. Modify variables such as exercises, sets, repetitions, tempo, and rest periods. Consider cycling between phases focusing on different goals (hypertrophy, strength, endurance).</li>
                </ol>
                
                <h3>Start Small</h3>
                <p>Begin with bodyweight exercises like modified push-ups, squats, and lunges twice weekly. Focus on form first, then gradually increase repetitions before adding external resistance. Even just 15-20 minutes of structured bodyweight training can provide significant benefits when performed consistently.</p>
                
                <h3>Equipment Options</h3>
                <p>You don't need an elaborate gym setup to strength train effectively. Resistance bands, adjustable dumbbells, a kettlebell, or even household items like water bottles or canned goods can provide adequate resistance for beginners. As you advance, you might consider more specialized equipment or a gym membership for greater variety and loading options.</p>
                
                <h3>Tracking Progress</h3>
                <p>Keep a training journal to monitor your exercises, weights, sets, and repetitions. This helps ensure progressive overload and provides motivation as you see your strength increase over time. Consider taking measurements, photos, or performance tests periodically to track changes beyond what the scale shows.</p>
                
                <h3>Special Considerations</h3>
                <p>If you have joint issues, medical conditions, or are new to exercise, consult a healthcare provider before beginning a strength training program. A physical therapist or certified trainer can help modify exercises to accommodate limitations while still providing effective training stimulus. Remember that strength training can be adapted for virtually all fitness levels and health conditions.</p>
            `
        },
        'Sleep Optimization': {
            icon: 'fa-bed',
            colorClass: 'modal-color-purple',
            content: `
                <h3>Why Sleep Matters</h3>
                <p>Quality sleep is essential for physical recovery, cognitive function, emotional regulation, and long-term health. It affects virtually every aspect of your wellbeing. During sleep, your body repairs tissues, consolidates memories, removes metabolic waste from the brain, and regulates hormones that control everything from appetite to stress response. Chronic sleep deprivation has been linked to serious health conditions including heart disease, diabetes, obesity, and depression.</p>
                
                <h3>Key Benefits</h3>
                <ul>
                    <li>Enhanced memory and learning</li>
                    <li>Stronger immune function</li>
                    <li>Improved mood and stress resilience</li>
                    <li>Better weight management</li>
                    <li>Reduced risk of chronic diseases</li>
                    <li>Improved attention and concentration</li>
                    <li>Enhanced physical performance and recovery</li>
                    <li>More balanced hormone production</li>
                    <li>Better skin health and appearance</li>
                    <li>Reduced inflammation throughout the body</li>
                    <li>Lower risk of accidents and errors</li>
                </ul>
                
                <h3>Practical Tips</h3>
                <ol>
                    <li><strong>Consistent Schedule:</strong> Maintain a consistent sleep schedule to improve sleep quality and overall health. Go to bed and wake up at approximately the same times every day, even on weekends. This helps regulate your body's internal clock (circadian rhythm) and can help you fall asleep and stay asleep for the night.</li>
                    <li><strong>Optimal Environment:</strong> Keep your bedroom dark, quiet, and cool (around 65°F/18°C). Consider blackout curtains to block external light, white noise machines to mask disruptive sounds, and comfortable, breathable bedding appropriate for the season. Your sleep environment should feel like a sanctuary devoted to rest.</li>
                    <li><strong>Digital Curfew:</strong> Avoid screens 1-2 hours before bedtime to limit blue light exposure. Blue light from phones, tablets, computers, and TVs can suppress melatonin production and delay sleep onset. If you must use devices in the evening, consider blue-light blocking glasses or screen filters, and set devices to night mode.</li>
                    <li><strong>Relaxation Routine:</strong> Develop a calming pre-sleep ritual to signal your body it's time to wind down. This might include reading a physical book, taking a warm bath, gentle stretching, meditation, or deep breathing exercises. Consistency helps train your brain to recognize these activities as precursors to sleep.</li>
                    <li><strong>Limit Stimulants:</strong> Avoid caffeine after midday and alcohol close to bedtime. While caffeine's stimulating effects are well-known, many people don't realize that alcohol, despite its initial sedative effect, disrupts sleep architecture and reduces sleep quality, especially in the second half of the night.</li>
                    <li><strong>Physical Activity:</strong> Regular exercise promotes better sleep, but try to complete vigorous workouts at least 3-4 hours before bedtime. Morning and afternoon exercise appear to be most beneficial for sleep quality, while evening exercise may delay sleep onset for some individuals.</li>
                    <li><strong>Mindful Eating:</strong> Avoid heavy, rich foods within two hours of bedtime. Light snacks before bed are generally acceptable, particularly those containing tryptophan, magnesium, or complex carbohydrates that can promote drowsiness. Examples include a small banana with almond butter or a small bowl of whole-grain cereal with milk.</li>
                </ol>
                
                <h3>Start Small</h3>
                <p>Begin by setting a consistent bedtime and wake-up time, even on weekends. This simple habit helps regulate your body's internal clock and improves sleep quality over time. Adjust gradually by shifting your schedule by 15-30 minutes every few days until you reach your target sleep window.</p>
                
                <h3>Sleep Tracking</h3>
                <p>Consider monitoring your sleep patterns with a journal or app to identify factors that help or hinder your rest. Note your bedtime, wake time, sleep quality, and factors like exercise, caffeine, screen time, and stress levels. Over time, you may notice patterns that can help you optimize your sleep routine.</p>
                
                <h3>Common Sleep Disruptors</h3>
                <p>Be aware of hidden sleep disruptors like certain medications, untreated sleep apnea, restless leg syndrome, chronic pain, or anxiety disorders. If you consistently struggle with sleep despite good sleep hygiene practices, consult a healthcare provider. Effective treatments exist for most sleep disorders, but proper diagnosis is essential.</p>
                
                <h3>Sleep Supplements</h3>
                <p>Some supplements may help improve sleep quality when used appropriately. Melatonin, magnesium, and herbs like valerian root and lavender have some research supporting their use for sleep. However, always consult with a healthcare provider before starting supplements, especially if you take other medications or have health conditions.</p>
            `
        },
        'Hydration': {
            icon: 'fa-tint',
            colorClass: 'modal-color-blue',
            content: `
                <h3>Why Hydration Matters</h3>
                <p>Water is essential for virtually every bodily function, from regulating temperature and delivering nutrients to removing waste and lubricating joints. Proper hydration affects cognitive performance, physical ability, energy levels, and even mood. Your body is approximately 60% water, with even higher percentages in critical organs like the brain (73%) and lungs (83%). Even mild dehydration—as little as 1-2% of body weight—can impair cognitive function, reduce endurance, and trigger headaches.</p>
                
                <h3>Key Benefits</h3>
                <ul>
                    <li>Improved physical performance</li>
                    <li>Enhanced cognitive function</li>
                    <li>Better digestion and nutrient absorption</li>
                    <li>Healthier skin appearance</li>
                    <li>Regulated body temperature</li>
                    <li>Efficient toxin elimination</li>
                    <li>Reduced risk of kidney stones</li>
                    <li>Proper joint lubrication</li>
                    <li>Supported immune function</li>
                    <li>Better cardiac function</li>
                    <li>Reduced fatigue and increased energy</li>
                </ul>
                
                <h3>Practical Tips</h3>
                <ol>
                    <li><strong>Daily Intake:</strong> Drink at least 8 glasses (about 2 liters) of water daily to stay properly hydrated. Individual needs vary based on activity level, climate, body size, and health status. A common recommendation is to divide your weight in pounds by 2 to determine how many ounces to drink daily, though active individuals may need more.</li>
                    <li><strong>Morning Ritual:</strong> Start your day with a glass of water to rehydrate after sleep. During the night, you lose water through breathing and perspiration. A morning glass helps replenish this loss and jumpstarts your metabolism and digestion after the overnight fast.</li>
                    <li><strong>Carry Water:</strong> Keep a reusable water bottle with you as a constant reminder to drink. Choose a bottle you enjoy using and consider one with measurement markings to track your intake. Set goals for refilling it a certain number of times throughout the day.</li>
                    <li><strong>Enhanced Hydration:</strong> Add natural flavors like lemon, cucumber, or berries if plain water is unappealing. Herbs like mint or basil can also add interest without calories or artificial additives. Experiment with different combinations to keep hydration interesting.</li>
                    <li><strong>Monitor Signs:</strong> Pay attention to urine color—pale yellow indicates good hydration. Dark yellow or amber urine suggests you need to increase fluid intake. Be aware that certain vitamins and foods can affect urine color temporarily.</li>
                    <li><strong>Hydrating Foods:</strong> Increase consumption of water-rich foods like cucumbers, watermelon, strawberries, lettuce, and celery. These foods are over 90% water and contribute significantly to your overall hydration status while providing valuable nutrients.</li>
                    <li><strong>Electrolyte Balance:</strong> Replenish electrolytes (sodium, potassium, magnesium) after intense exercise or excessive sweating. Natural sources include coconut water, bananas, and a small pinch of salt in water. Commercial sports drinks can be useful for extended activity but watch for added sugars.</li>
                </ol>
                
                <h3>Start Small</h3>
                <p>Begin by drinking a full glass of water before each meal. This simple habit adds three glasses to your daily intake and can help with portion control during meals. Studies show that drinking water before eating may help reduce calorie intake and support weight management.</p>
                
                <h3>Hydration Tracking</h3>
                <p>Consider using a hydration tracking app or journal to monitor your intake until proper hydration becomes habitual. Some water bottles now come with built-in tracking systems, or you can use a simple tally method. Setting regular reminders on your phone can also help develop consistent hydration habits.</p>
                
                <h3>Special Conditions</h3>
                <p>Adjust your hydration strategy during illness, pregnancy, breastfeeding, high-altitude exposure, air travel, or hot weather—all conditions that increase fluid needs. Certain medications and medical conditions may also affect hydration requirements or fluid balance. Consult your healthcare provider about your specific needs.</p>
                
                <h3>Overhydration Awareness</h3>
                <p>While rare, it is possible to drink too much water too quickly, which can dilute electrolytes and cause hyponatremia (low blood sodium). This is mainly a concern during endurance events when athletes drink excessive amounts without replacing electrolytes. For most people, the kidneys effectively regulate fluid balance when water is consumed gradually throughout the day.</p>
            `
        }
    };

    // Handle tip card click events with enhanced modal experience
    tipCards.forEach(card => {
        const readMoreLink = card.querySelector('.tip-link');
        const tipTitle = card.querySelector('h3').textContent;
        const tipIconClass = card.querySelector('.tip-icon i').className.split(' ')[1]; // Get icon class
        
        readMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add no-hover class to prevent hover effect during animation
            card.classList.add('no-hover-effect');
            
            // Update modal content
            modalTitle.textContent = tipTitle;
            modalIcon.className = `fas ${tipContent[tipTitle].icon}`;
            modalText.innerHTML = tipContent[tipTitle].content;
            
            // Reset scroll position of modal and modal-body
            if (document.querySelector('.modal-body')) {
                document.querySelector('.modal-body').scrollTop = 0;
            }
            
            // Create custom background style based on tip type - using RGB values for smoother transitions
            let colorStart, colorEnd, colorMid, blendMode;
            switch(tipTitle) {
                case 'Cardiovascular Health':
                    colorStart = 'var(--modal-red-start)';
                    colorEnd = 'var(--modal-red-end)';
                    colorMid = '255, 120, 50';
                    blendMode = 'screen';
                    break;
                case 'Mental Wellness':
                    colorStart = 'var(--modal-blue-start)';
                    colorEnd = 'var(--modal-blue-end)';
                    colorMid = '70, 169, 230';
                    blendMode = 'normal';
                    break;
                case 'Nutrition Tips':
                    colorStart = 'var(--modal-green-start)';
                    colorEnd = 'var(--modal-green-end)';
                    colorMid = '40, 162, 110';
                    blendMode = 'screen';
                    break;
                case 'Strength Training':
                    colorStart = 'var(--modal-orange-start)';
                    colorEnd = 'var(--modal-orange-end)';
                    colorMid = '255, 132, 45';
                    blendMode = 'normal';
                    break;
                case 'Sleep Optimization':
                    colorStart = 'var(--modal-purple-start)';
                    colorEnd = 'var(--modal-purple-end)';
                    colorMid = '130, 48, 180';
                    blendMode = 'screen';
                    break;
                case 'Hydration':
                    colorStart = 'var(--modal-blue-start)';
                    colorEnd = 'var(--modal-blue-end)';
                    colorMid = '70, 169, 230';
                    blendMode = 'normal';
                    break;
                default:
                    colorStart = 'var(--modal-red-start)';
                    colorEnd = 'var(--modal-red-end)';
                    colorMid = '255, 120, 50';
                    blendMode = 'screen';
            }
            
            // Apply custom gradient using the RGB variables with enhanced intermediate color
            tipModal.style.setProperty('--color-start', colorStart);
            tipModal.style.setProperty('--color-mid', colorMid);
            tipModal.style.setProperty('--color-end', colorEnd);
            tipModal.style.setProperty('--blend-mode', blendMode);

            // Make overlay visible but transparent for animation
            tipModalOverlay.classList.add('active');
            tipModalOverlay.style.opacity = 0;
            tipModalOverlay.style.visibility = 'visible';

            // Hide the modal initially 
            gsap.set(tipModal, {
                opacity: 0,
                visibility: 'visible', 
                scale: 0.8,
                rotation: -2,
                y: 50,
                transformOrigin: 'center center',
                // Ensure it's properly centered
                top: '50%',
                left: '50%',
                xPercent: -50,
                yPercent: -50,
                width: '90%',
                maxWidth: '1000px',
                height: 'auto',
                maxHeight: '85vh',
                borderRadius: '20px'
            });

            // Show overlay with fade-in first
            gsap.to(tipModalOverlay, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                onComplete: function() {
                    // After overlay is visible, animate the modal with fluid reveal
                    gsap.to(tipModal, {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        y: 0,
                        duration: 0.7,
                        ease: "back.out(1.2)",
                        onComplete: function() {
                            // Add active class after animation to enable scrolling in the modal-body
                            tipModal.classList.add('active');
                            
                            // Animate text content with a subtle fade-in and stagger
                            gsap.fromTo('.modal-text > *', 
                                { opacity: 0, y: 20 },
                                { 
                                    opacity: 1, 
                                    y: 0, 
                                    stagger: 0.05,
                                    duration: 0.4,
                                    ease: "power2.out"
                                }
                            );
                            
                            // Add enhanced gradient animation 
                            tipModal.classList.add('animated-gradient');
                        }
                    });
                }
            });
        });
    });
    
    // Close modal when clicking close button or overlay
    modalCloseBtn.addEventListener('click', closeModal);
    tipModalOverlay.addEventListener('click', closeModal);
    
    // Close modal function
    function closeModal() {
        // Kill any running GSAP animations to prevent conflicts
        gsap.killTweensOf(tipModal);
        gsap.killTweensOf('.modal-text > *');
        gsap.killTweensOf(tipModalOverlay);
        
        // Remove active class
        tipModal.classList.remove('active');
        tipModal.classList.remove('animated-gradient');
        
        // Animate modal out with reverse of the reveal animation
        gsap.to(tipModal, {
            opacity: 0,
            scale: 0.8,
            rotation: 2,
            y: 30,
            duration: 0.5,
            ease: "power2.in",
            onComplete: function() {
                // Reset modal visibility
                tipModal.style.visibility = 'hidden';
                
                // Remove no-hover class from all cards
                tipCards.forEach(card => {
                    card.classList.remove('no-hover-effect');
                });
            }
        });
        
        // Fade out overlay
        gsap.to(tipModalOverlay, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: function() {
                tipModalOverlay.classList.remove('active');
                tipModalOverlay.style.visibility = 'hidden';
            }
        });
        
        // Reset scroll position
        if (document.querySelector('.modal-body')) {
            document.querySelector('.modal-body').scrollTop = 0;
        }
    }
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tipModalOverlay.classList.contains('active')) {
            closeModal();
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
                clearProps: "opacity,y" // Clear properties after animation
            });
        };
        
        // Add small delay before starting animations to ensure DOM is ready
        setTimeout(animateCards, 100);
        
        // Add hover animations to cards
        tipCards.forEach(card => {
            // Check if GSAP should handle hover or not (modal related)
            if (!card.classList.contains('no-hover-effect')) {
                card.addEventListener('mouseenter', function() {
                    gsap.to(this, {
                        y: -10,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', function() {
                    gsap.to(this, {
                        y: 0,
                        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
                        duration: 0.6, // Slightly faster return
                        ease: "power2.out"
                    });
                });
            } else {
                 // Reset GSAP transforms if no-hover-effect is present initially
                gsap.set(card, { y: 0, boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)" });
            }
        });
    }

    // ======== Doctor Image Proximity Effect ======== 
    const doctorImage = document.querySelector('.doctor-image');
    const doctorContainer = document.querySelector('.doctor-image-container');
    if (doctorImage && doctorContainer && isGsapLoaded) {
        console.log("Setting up doctor image proximity effect.");
        
        const proximityThreshold = 300; // Increase threshold for better interaction
        const maxScale = 1.18; // Slightly larger scale for better visibility
        const baseScale = 1.0;

        document.addEventListener('mousemove', (e) => {
            const imageRect = doctorContainer.getBoundingClientRect();
            
            // Optimization: Only calculate if the image is potentially in view or nearby
            if (imageRect.bottom < -proximityThreshold || imageRect.top > window.innerHeight + proximityThreshold ||
                imageRect.right < -proximityThreshold || imageRect.left > window.innerWidth + proximityThreshold) {
                // Image is far off-screen, reset scale if needed and skip calculations
                if (gsap.getProperty(doctorImage, "scale") !== baseScale) {
                    gsap.to(doctorImage, {
                        scale: baseScale,
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: 'auto'
                    });
                }
                return; 
            }

            const imageCenterX = imageRect.left + imageRect.width / 2;
            const imageCenterY = imageRect.top + imageRect.height / 2;
            
            const distanceX = e.clientX - imageCenterX;
            const distanceY = e.clientY - imageCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            let targetScale = baseScale;
            if (distance < proximityThreshold) {
                const progress = Math.max(0, 1 - (distance / proximityThreshold)); 
                targetScale = baseScale + (maxScale - baseScale) * progress;
            }

            gsap.to(doctorImage, {
                scale: targetScale,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "top left", // Match CSS setting
                overwrite: 'auto' 
            });
        });

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            gsap.to(doctorImage, {
                scale: baseScale,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "top left",
                overwrite: 'auto'
            });
        });
    } else if (!doctorImage) {
        console.warn("Doctor image element not found.");
    } else if (!doctorContainer) {
        console.warn("Doctor image container not found.");
    } else {
        console.warn("GSAP not loaded, Doctor proximity effect disabled.");
    }
}); 