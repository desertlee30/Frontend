# WellnessWave Project Lessons

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