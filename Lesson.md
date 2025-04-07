# WellnessWave Project Lessons

## Azure Deployment Best Practices

### API Configuration
- **Environment-Aware URLs**: Always make API URLs environment-aware to handle both development and production:
  ```javascript
  const API_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') 
    ? 'http://localhost:3000/api'  // Local development
    : '/api';                      // Production (relative URL)
  ```
- **Relative API Paths**: In production, use relative API paths (`/api`) rather than absolute URLs to avoid cross-domain issues.
- **Configuration Files**: Create a dedicated configuration file (e.g., `azure-config.js`) to centralize all deployment settings.

### CORS Configuration
- **Dynamic Origins**: Configure CORS to dynamically handle different environments:
  ```javascript
  app.use(cors({
      origin: function(origin, callback) {
          // Check against allowed origins including your Azure domain
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
  }));
  ```
- **Regex Pattern Matching**: Use regex patterns to allow multiple subdomains or related domains:
  ```javascript
  if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.startsWith('/') && allowedOrigin.endsWith('/')) {
          return new RegExp(allowedOrigin.slice(1, -1)).test(origin);
      }
      return allowedOrigin === origin;
  }))
  ```
- **No Origin Handling**: Handle requests with no origin (like from mobile apps) with a specific check: `if (!origin) return callback(null, true);`

### Web Server Configuration
- **IIS on Azure**: Create a proper `web.config` file for Azure App Service that uses IIS.
- **URL Rewriting**: Configure URL rewrite rules for both static files and API routes:
  ```xml
  <rule name="StaticContent" stopProcessing="true">
      <match url="^(?!api).*\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$" />
      <action type="Rewrite" url="{R:0}" />
  </rule>
  ```
- **API Routing**: Add a specific rule for API routes to ensure they're properly handled:
  ```xml
  <rule name="DynamicContent-API" stopProcessing="true">
      <match url="^api(/.*)?$" />
      <action type="Rewrite" url="backend/server.js" />
  </rule>
  ```
- **Fallback for SPA**: Include a fallback rule for client-side routing in SPAs:
  ```xml
  <rule name="ClientFallback">
      <match url="^(?!api).*$" />
      <conditions>
          <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
      </conditions>
      <action type="Rewrite" url="index.html" />
  </rule>
  ```

### File System & Data
- **Environment-Specific Paths**: Use environment-specific paths for data files:
  ```javascript
  const dataPath = process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../data')  // Azure App Service path
      : path.join(__dirname, 'data');    // Local development path
  ```
- **Directory Creation**: Always check and create directories if needed:
  ```javascript
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
  }
  ```
- **Absolute Paths**: Use absolute paths with `path.resolve()` to avoid path resolution issues.

### Security Best Practices
- **Environment Variables**: Store secrets in environment variables, not in code:
  ```javascript
  const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret';
  ```
- **Production Detection**: Use `process.env.NODE_ENV === 'production'` to detect production environment.
- **Port Configuration**: Allow Azure to set the port via environment variables:
  ```javascript
  const PORT = process.env.PORT || 3000;
  ```
- **HTTP vs HTTPS**: Consider adding HTTPS redirection for production environments.

### Documentation
- **Deployment Guide**: Create a comprehensive deployment guide with step-by-step instructions.
- **Environment Variables**: Document all required environment variables and their purpose.
- **Troubleshooting**: Include common issues and their solutions in the documentation.

## CSS Best Practices

### Responsive Design
- **Avoid fixed heights**: Fixed heights (like 500px) can cause layout issues across different screen sizes. Use relative units or aspect ratios instead.
- **Use aspect-ratio**: For images and media content, the aspect-ratio property maintains proportions while allowing flexible sizing.
- **Flexible layouts**: Prefer grid and flexbox with relative units over fixed pixel dimensions.

### Parallax Effects
- **CSS vs JavaScript parallax**: CSS `background-attachment: fixed` works well for full-page backgrounds (like hero sections) but can cause issues with containment and positioning within smaller elements or grids. For those cases, JavaScript control over `background-position` is often more reliable.
- **Background image technique**: Use `background-image`, `background-size: cover` on the container. If using JS parallax, ensure `background-attachment: scroll` (the default).
- **Container constraints**: Always maintain proper container dimensions with `overflow: hidden`.
- **Aspect ratio maintenance**: Use `aspect-ratio` property to maintain consistent sizing.
- **Pseudo-element containment**: While useful for some effects, pseudo-elements don't solve the fundamental positioning issue of `background-attachment: fixed` relative to the viewport.
- **Fixed background contextual issues**: Remember that `background-attachment: fixed` positions backgrounds relative to the viewport, not the container element.
- **Border-radius coordination**: Ensure visual consistency if using pseudo-elements.

### Performance
- **Throttle scroll events**: Always throttle scroll event handlers with requestAnimationFrame for better performance.
- **Use getBoundingClientRect()**: More efficient for detecting element position than calculating with offsetTop and scrollY.
- **Function reusability**: Create helper functions for repeated operations like parallax effects.

## JavaScript Techniques

### Animation
- **Smooth parallax effects**: Calculate visibility percentage based on viewport position for smoother animations.
- **Transform performance**: Use transform properties (scale, translateY) for better performance than changing dimensions directly.
- **Center-based calculations**: For parallax effects, calculate based on the element's position relative to the viewport center for more natural movement.
- **Transition properties**: Use longer transition durations (0.5s instead of 0.3s) with ease-out timing function for smoother parallax effects.
- **Extended detection zones**: Check for elements slightly outside the viewport (200px beyond) to ensure smoother transition in and out of view.

### Parallax Techniques
- **Background Position Parallax**: A robust method for parallax within specific elements is to dynamically adjust the `background-position` (e.g., `center YY%`) using JavaScript based on the element's position in the viewport.
- **Viewport Center Calculation**: Calculate the difference between the viewport center and the element's center to determine the direction and magnitude of the parallax shift.
- **Parallax Factor**: Use a multiplier (e.g., 0.1) to control the intensity of the background movement relative to scrolling.
- **Clamping Values**: Limit the calculated `background-position` (e.g., between 0% and 100%) to prevent the image from shifting too far.
- **Revealing parallax**: Create a revealing effect by making images taller than containers and translating them vertically as user scrolls.
- **Percentage-based translation**: Use percentage values for translation to maintain proper scaling across different screen sizes.
- **Progress calculation**: Calculate an element's progress through viewport (0 at entry to 1 at exit) for smooth animations.
- **Direct scroll following**: Remove transition duration for animations that should directly follow scroll position.
- **Container overflow**: Use overflow:hidden on containers with position:absolute on oversized children for parallax effects.

### Performance Optimization
- **will-change property**: Use the will-change: transform CSS property for elements that will be animated to improve performance.
- **Initial state setting**: Call animation functions once on page load to ensure elements are in the correct position initially.
- **Clamping values**: Restrict calculated values within a reasonable range to prevent extreme transformations.

### Error Prevention
- **Null checking**: Always check if elements exist before manipulating them (e.g., `if (!section || !image) return;`).
- **Consistent variable naming**: Use clear, descriptive variable names for better code readability.

## Design Considerations

### Visual Hierarchy
- **Color contrast**: Use contrasting colors for content sections to create visual interest (green for About, blue for Food).
- **Layout variations**: Alternate image and content positions to create rhythm and avoid monotony.

# Lessons Learned from Meal Planner Implementation

## Technical Insights

### CSS Techniques
- **3D Card Flip Effect**: Used `transform-style: preserve-3d` along with `backface-visibility: hidden` to create the 3D flip effect. The rotation is triggered by toggling a class that changes the `transform: rotateY(180deg)` property.
- **CSS Variables**: Used CSS variables for theme colors and transitions to maintain consistency throughout the design and make future updates easier.
- **Responsive Grid**: Utilized CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` to create a responsive grid that adjusts the number of columns based on available space.

### JavaScript Patterns
- **State Management**: Used a central state object to manage application data including recipes, filters, and saved recipes. This makes it easier to track changes and update the UI accordingly.
- **Async/Await**: Used modern async/await pattern for loading data from JSON file, making the code more readable and maintainable.
- **Event Delegation**: Attached event listeners to parent elements and used event delegation for dynamic elements, improving performance by reducing the number of event listeners.

### Animation Techniques
- **GSAP for Complex Animations**: Used GSAP for more complex animations like staggered filtering effects and particle animations, which would be difficult to implement with CSS alone.
- **CSS Transitions**: Used CSS transitions for simpler animations like hover effects and card flipping, improving performance by offloading animation handling to the browser.
- **Particle Effects**: Created dynamic particle effects by generating elements with random properties and animating them using GSAP.

### Accessibility Considerations
- **Keyboard Navigation**: Implemented keyboard navigation for interactive elements using tabindex and keydown event handlers.
- **ARIA Attributes**: Added aria-label attributes to interactive elements to improve screen reader compatibility.
- **Focus Management**: Ensured all interactive elements are properly focusable and have visible focus states.

### jQuery Integration
- **Vanilla JS with jQuery**: Successfully integrated vanilla JavaScript with jQuery, using each where it makes the most sense - vanilla JS for core functionality and jQuery for specific enhancements.
- **Event Handling**: Used jQuery's event handling for hover-based filtering preview, taking advantage of its simplified syntax.

### Error Handling and Resilience
- **Try/Catch for Data Loading**: Implemented try/catch blocks for data loading to gracefully handle fetch errors and provide user feedback.
- **Null Checks**: Added checks for existence of elements before manipulating them to prevent runtime errors.
- **Default Values**: Provided sensible defaults where appropriate to ensure the application works even with partial data.

### CORS and Local Development
- **CORS Understanding**: Learned that browsers restrict access to local files (file://) for security reasons when using Fetch API or XMLHttpRequest.
- **Development Server Solution**: Created a simple Node.js HTTP server to serve files locally and avoid CORS issues.
- **Data Embedding Alternative**: Implemented alternative approach by embedding JSON data directly in the JavaScript file for situations where a server is not available.
- **Error Handling**: Added proper error messages and fallbacks to handle potential CORS or network issues.
- **README Documentation**: Created documentation explaining the CORS issue and providing multiple solutions for users.

## Best Practices Applied

1. **DRY Principle**: Used functions like `createRecipeCard()` to avoid repeating code for similar operations.
2. **Progressive Enhancement**: Implemented core functionality with vanilla JS and enhanced with jQuery/GSAP.
3. **Performance Optimization**: Used efficient animation techniques like CSS transitions for simple animations and GSAP for complex ones.
4. **Mobile-First Approach**: Designed for mobile first and then added breakpoints for larger screens.
5. **Semantic HTML**: Used appropriate HTML elements for different parts of the UI (sections, headings, etc.).
6. **CSS Organization**: Organized CSS by component with clear comments for different sections.
7. **JavaScript Modularity**: Structured JavaScript into logical functions with clear responsibilities.

## Future Improvements

1. **Code Splitting**: Could improve performance by splitting JavaScript into modules for different functionality.
2. **Local Storage**: Add local storage to persist saved recipes between sessions.
3. **Service Workers**: Implement service workers for offline functionality.
4. **Unit Tests**: Add unit tests for core functionality to ensure reliability.
5. **Backend Integration**: Replace JSON file with a proper backend API for more dynamic data.

# Development Lessons - Frontend Sport

## Video Background Implementation
- Always provide fallback sources for video elements to ensure compatibility across browsers
- Use both local and CDN-hosted fallback options when possible
- The `playsinline` attribute is important for mobile devices, especially iOS
- GSAP ScrollTrigger provides powerful and smooth parallax effects with minimal code
- Adding null checks for DOM elements prevents JS errors when elements don't exist

## CORS Handling
- Local JSON files can cause CORS errors when accessed via file:// protocol
- Two effective solutions:
  1. Use a local server (requires additional setup)
  2. Embed JSON data directly in JavaScript (simpler for users)
- Always provide meaningful error messages when CORS or other issues occur
- Document both approaches to give users flexibility

## Animation Best Practices
- Use CSS transitions for simple animations
- Use GSAP for complex animations and scroll-based effects
- Throttle or debounce scroll events for performance
- Test animations on both high and low-end devices
- Provide reduced motion options for accessibility

## General Front-End Development
- Use CSS variables for consistent theming and easier updates
- Implement responsive design from the beginning, not as an afterthought
- Include fallbacks for new CSS features to ensure broader compatibility
- Test across multiple browsers and devices early in development
- Use relative units (rem, em, %) rather than fixed units (px) for better responsiveness

## File Path Best Practices

### Understanding File Paths in Web Projects
- **Always check paths relative to the HTML file**: The browser resolves file paths relative to the location of the HTML file, not relative to the project root.
- **Root-relative paths start with "/"**: A path starting with "/" is resolved from the domain root (not from the filesystem root).
- **Project structure matters**: Maintain a consistent and logical directory structure for assets (images/videos in one folder, CSS in another, etc.).
- **Use the Network tab for debugging**: When files fail to load, check the browser's Network tab to see the exact path being requested.
- **Consider path encoding issues**: Spaces and special characters in filenames may need to be URL-encoded.

### Common Path-Related Issues
- **Path doesn't exist**: Verify that the file actually exists at the specified location and is accessible.
- **Case sensitivity**: File paths are case-sensitive on many servers (especially Linux-based). "Video.mp4" is not the same as "video.mp4".
- **Forward vs. backward slashes**: Use forward slashes (/) for web paths, even on Windows systems. Backward slashes (\) will not work in URLs.
- **Incorrect relative paths**: Be careful with "../" notation - verify you're traversing the directory structure correctly.
- **Cross-origin restrictions**: Loading files from different domains might require proper CORS headers.

# Lessons Learned

- **JavaScript Execution Timing:** Ensure JavaScript code that manipulates DOM elements, especially event listeners, runs *after* the DOM is fully loaded. Wrapping such code in a `DOMContentLoaded` event listener is a reliable way to achieve this. This prevents errors where scripts try to access elements that don't exist yet. (Seen in fixing navbar animation in `js/main.js`).
- **CSS Transitions and JS Interference:** Be mindful when using JavaScript methods that directly manipulate CSS properties (like jQuery's `.show()`, `.hide()`, or `.css()`). These can override or bypass CSS transitions defined in stylesheets. Prefer using class addition/removal (`addClass()`, `removeClass()`, `toggleClass()`) to trigger state changes, allowing CSS to handle the visual transition smoothly. (Seen in fixing navbar fade effect due to `js/auth-ui.js` interference). 