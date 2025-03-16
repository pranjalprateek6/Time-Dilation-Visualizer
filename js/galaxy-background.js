/**
 * Galaxy Background Animation
 * 
 * This script creates an animated galaxy background with:
 * - Twinkling stars with dynamic brightness
 * - Moving asteroids with irregular shapes
 * - Occasional UFOs with tractor beams
 * 
 * Uses HTML5 Canvas for rendering all elements
 */

// Canvas and context
let galaxyCanvas, galaxyCtx;
let canvasWidth, canvasHeight;

// Animation elements
let stars = [];
let asteroids = [];
let ufos = [];
let lastUfoTime = 0;

// Speed settings
let currentSpeed = 0.5; // Default speed (as fraction of c)
let speedMode = 'normal'; // 'normal', 'lightspeed', or 'superluminal'

// Animation frame ID for cancellation
let galaxyAnimationId;

/**
 * Initialize the galaxy background
 */
function initGalaxyBackground() {
    // Create canvas element if it doesn't exist
    if (!document.getElementById('galaxy-canvas')) {
        galaxyCanvas = document.createElement('canvas');
        galaxyCanvas.id = 'galaxy-canvas';
        
        // Set canvas styles
        galaxyCanvas.style.position = 'fixed';
        galaxyCanvas.style.top = '0';
        galaxyCanvas.style.left = '0';
        galaxyCanvas.style.width = '100%';
        galaxyCanvas.style.height = '100%';
        galaxyCanvas.style.zIndex = '-3'; // Below the existing stars container (which is -1)
        galaxyCanvas.style.pointerEvents = 'none';
        
        // Add canvas to the document
        document.body.insertBefore(galaxyCanvas, document.body.firstChild);
    } else {
        galaxyCanvas = document.getElementById('galaxy-canvas');
    }
    
    // Get context and set canvas dimensions
    galaxyCtx = galaxyCanvas.getContext('2d');
    resizeCanvas();
    
    // Initialize elements
    createStars();
    createAsteroids();
    
    // Start animation
    animateGalaxy();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Listen for speed changes
    listenForSpeedChanges();
}

/**
 * Listen for speed changes from the main application
 */
function listenForSpeedChanges() {
    // Listen for speed slider changes
    const speedSlider = document.getElementById('speed-slider');
    const speedInput = document.getElementById('speed-input');
    
    if (speedSlider) {
        speedSlider.addEventListener('input', function() {
            updateSpeed(parseFloat(this.value));
        });
    }
    
    if (speedInput) {
        speedInput.addEventListener('input', function() {
            updateSpeed(parseFloat(this.value));
        });
    }
    
    // Initial update
    updateSpeed(0.5);
}

/**
 * Update the current speed and mode
 */
function updateSpeed(speed) {
    currentSpeed = speed;
    
    // Update speed mode
    if (speed >= 1.5) {
        speedMode = 'superluminal';
        updateUFOEffectCard('superluminal');
    } else if (speed >= 0.95) {
        speedMode = 'lightspeed';
        updateUFOEffectCard('lightspeed');
    } else {
        speedMode = 'normal';
        updateUFOEffectCard('normal');
    }
}

/**
 * Update the UFO effect card to highlight the current mode
 */
function updateUFOEffectCard(mode) {
    const normalEffect = document.getElementById('ufo-normal');
    const lightspeedEffect = document.getElementById('ufo-lightspeed');
    const superluminalEffect = document.getElementById('ufo-superluminal');
    
    if (normalEffect && lightspeedEffect && superluminalEffect) {
        // Remove active class from all
        normalEffect.classList.remove('active');
        lightspeedEffect.classList.remove('active');
        superluminalEffect.classList.remove('active');
        
        // Add active class to current mode
        if (mode === 'superluminal') {
            superluminalEffect.classList.add('active');
        } else if (mode === 'lightspeed') {
            lightspeedEffect.classList.add('active');
        } else {
            normalEffect.classList.add('active');
        }
    }
}

/**
 * Resize canvas to match window dimensions
 */
function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    
    // Set actual canvas dimensions (important for rendering quality)
    galaxyCanvas.width = canvasWidth;
    galaxyCanvas.height = canvasHeight;
}

/**
 * Handle window resize
 */
function handleResize() {
    resizeCanvas();
    
    // Recreate stars and asteroids to fit new dimensions
    createStars();
    createAsteroids();
}

// ==================== STARS ====================
// Colors for stars (from white to blue/purple tints)
const starColors = [
    '#ffffff', // White
    '#f8f8ff', // Ghost White
    '#e6e6fa', // Lavender
    '#b0c4de', // Light Steel Blue
    '#add8e6', // Light Blue
    '#87ceeb',  // Sky Blue
    '#ffffd4', // Very Pale Yellow
    '#fff8e7',  // Very Pale Orange
    '#ffcce6', // Pale Pink
    '#ffe6cc', // Pale Orange
    '#ffff99', // Pale Yellow
    '#ccffcc', // Pale Green
    '#ccffff'  // Pale Cyan
];

/**
 * Create stars with random positions, sizes, and twinkle speeds
 */
function createStars() {
    // Clear existing stars
    stars = [];
    
    // Number of stars based on screen size (more stars for larger screens)
    // Dramatically increased density by reducing the divisor from 600 to 300
    const starCount = Math.floor((canvasWidth * canvasHeight) / 300);
    
    // Create background stars (small and numerous)
    for (let i = 0; i < starCount; i++) {
        // Create different types of stars with varying sizes
        const starType = Math.random();
        let radius, brightness;
        
        if (starType > 0.98) {
            // Rare very large bright stars (2%)
            radius = Math.random() * 2.5 + 2.5; // Size between 2.5 and 5
            brightness = 0.85 + Math.random() * 0.15; // Very bright
        } else if (starType > 0.95) {
            // Rare large bright stars (3%)
            radius = Math.random() * 2 + 2; // Size between 2 and 4
            brightness = 0.8 + Math.random() * 0.2; // Brighter
        } else if (starType > 0.85) {
            // Medium stars (10%)
            radius = Math.random() * 1 + 1.2; // Size between 1.2 and 2.2
            brightness = 0.6 + Math.random() * 0.3;
        } else if (starType > 0.65) {
            // Small-medium stars (20%)
            radius = Math.random() * 0.7 + 0.8; // Size between 0.8 and 1.5
            brightness = 0.5 + Math.random() * 0.3;
        } else {
            // Common small stars (65%)
            radius = Math.random() * 0.5 + 0.3; // Size between 0.3 and 0.8
            brightness = 0.3 + Math.random() * 0.4;
        }
        
        // Add some color variation based on star size
        let colorIndex;
        if (radius > 2) {
            // Larger stars have more color variety
            colorIndex = Math.floor(Math.random() * starColors.length);
        } else if (radius > 1) {
            // Medium stars have some color variety but tend toward white/blue
            colorIndex = Math.floor(Math.random() * 8); // First 8 colors
        } else {
            // Smaller stars are mostly white/blue
            colorIndex = Math.floor(Math.random() * 5); // First 5 colors
        }
        
        stars.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: radius,
            color: starColors[colorIndex],
            twinkleSpeed: Math.random() * 0.03 + 0.01, // Speed of brightness change
            brightness: brightness, // Current brightness (0-1)
            twinkleDirection: Math.random() > 0.5 ? 1 : -1, // Direction of brightness change
            // Add pulsing effect to some stars
            pulseEffect: Math.random() > 0.7, // 30% of stars will pulse
            pulseSpeed: Math.random() * 0.01 + 0.005
        });
    }
    
    // Add star clusters in random areas
    const clusterCount = Math.floor(canvasWidth * canvasHeight / 500000) + 2; // 2-5 clusters typically
    
    for (let c = 0; c < clusterCount; c++) {
        const clusterX = Math.random() * canvasWidth;
        const clusterY = Math.random() * canvasHeight;
        const clusterRadius = Math.random() * 150 + 100; // Cluster size between 100-250px
        const clusterStarCount = Math.floor(Math.random() * 30) + 20; // 20-50 stars per cluster
        
        for (let i = 0; i < clusterStarCount; i++) {
            // Random position within cluster (with higher density toward center)
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.pow(Math.random(), 2) * clusterRadius; // Squared for center density
            const x = clusterX + Math.cos(angle) * distance;
            const y = clusterY + Math.sin(angle) * distance;
            
            // Skip if outside canvas
            if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) continue;
            
            // Cluster stars are smaller on average
            const radius = Math.random() * 0.8 + 0.2;
            const brightness = 0.4 + Math.random() * 0.4;
            
            stars.push({
                x: x,
                y: y,
                radius: radius,
                color: starColors[Math.floor(Math.random() * 5)], // First 5 colors
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                brightness: brightness,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                pulseEffect: Math.random() > 0.8,
                pulseSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }
    
    // Add a few shooting stars that will animate across the screen
    const shootingStarCount = Math.floor(Math.random() * 3) + 1; // 1-3 shooting stars
    
    for (let i = 0; i < shootingStarCount; i++) {
        // Shooting stars start off-screen and move across
        const angle = Math.random() * Math.PI / 4 + Math.PI / 8; // Angle between PI/8 and 3PI/8 (downward diagonal)
        const speed = Math.random() * 2 + 3; // Speed between 3-5 pixels per frame
        
        stars.push({
            x: Math.random() * canvasWidth * 1.5 - canvasWidth * 0.25, // Start anywhere horizontally (including off-screen)
            y: -20, // Start above the screen
            radius: Math.random() * 1 + 1,
            color: '#ffffff',
            brightness: 0.9,
            isShootingStar: true,
            trailLength: Math.random() * 50 + 50, // Trail length between 50-100px
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            // Shooting stars have a limited lifespan
            lifespan: Math.random() * 200 + 100, // Frames of life
            age: 0
        });
    }
}

/**
 * Update star brightness for twinkling effect
 */
function updateStars() {
    const time = Date.now() / 1000;
    
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        
        if (star.isShootingStar) {
            // Update shooting star position
            star.x += star.speedX;
            star.y += star.speedY;
            star.age++;
            
            // Remove if off-screen or too old
            if (star.x > canvasWidth + 50 || 
                star.y > canvasHeight + 50 || 
                star.age > star.lifespan) {
                
                // Replace with a new shooting star if it's gone
                if (Math.random() > 0.7) { // 30% chance to replace
                    const angle = Math.random() * Math.PI / 4 + Math.PI / 8;
                    const speed = Math.random() * 2 + 3;
                    
                    stars[i] = {
                        x: Math.random() * canvasWidth * 1.5 - canvasWidth * 0.25,
                        y: -20,
                        radius: Math.random() * 1 + 1,
                        color: '#ffffff',
                        brightness: 0.9,
                        isShootingStar: true,
                        trailLength: Math.random() * 50 + 50,
                        speedX: Math.cos(angle) * speed,
                        speedY: Math.sin(angle) * speed,
                        lifespan: Math.random() * 200 + 100,
                        age: 0
                    };
                } else {
                    // Remove the star
                    stars.splice(i, 1);
                }
            }
        } else {
            // Update regular star brightness
            star.brightness += star.twinkleSpeed * star.twinkleDirection;
            
            // Reverse direction when reaching brightness limits
            if (star.brightness >= 1 || star.brightness <= 0.3) {
                star.twinkleDirection *= -1;
            }
            
            // Apply pulsing effect to radius for some stars
            if (star.pulseEffect) {
                star.currentRadius = star.radius * (1 + 0.2 * Math.sin(time * star.pulseSpeed));
            } else {
                star.currentRadius = star.radius;
            }
        }
    }
}

/**
 * Draw stars on the canvas
 */
function drawStars() {
    // Draw regular stars
    stars.forEach(star => {
        if (star.isShootingStar) {
            // Draw shooting star with trail
            const gradient = galaxyCtx.createLinearGradient(
                star.x, star.y,
                star.x - star.speedX * star.trailLength,
                star.y - star.speedY * star.trailLength
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
            
            galaxyCtx.beginPath();
            galaxyCtx.moveTo(star.x, star.y);
            galaxyCtx.lineTo(
                star.x - star.speedX * star.trailLength,
                star.y - star.speedY * star.trailLength
            );
            galaxyCtx.lineWidth = star.radius * 2;
            galaxyCtx.strokeStyle = gradient;
            galaxyCtx.stroke();
            
            // Draw the star head
            galaxyCtx.beginPath();
            galaxyCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            galaxyCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            galaxyCtx.fill();
        } else {
            // Draw regular star
            galaxyCtx.beginPath();
            
            // Use current radius which may include pulse effect
            const radius = star.currentRadius || star.radius;
            galaxyCtx.arc(star.x, star.y, radius, 0, Math.PI * 2);
            
            // Create a gradient for the star glow
            const gradient = galaxyCtx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, radius * 2.5
            );
            
            // Set gradient colors with current brightness
            gradient.addColorStop(0, star.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // Draw the star core
            galaxyCtx.fillStyle = star.color;
            galaxyCtx.globalAlpha = star.brightness;
            galaxyCtx.fill();
            
            // Draw the glow effect for larger stars
            if (radius > 1) {
                galaxyCtx.beginPath();
                galaxyCtx.arc(star.x, star.y, radius * 2.5, 0, Math.PI * 2);
                galaxyCtx.fillStyle = gradient;
                galaxyCtx.globalAlpha = star.brightness * 0.5;
                galaxyCtx.fill();
                
                // Add cross-shaped light rays for the brightest stars
                if (radius > 2) {
                    const rayLength = radius * 5;
                    const rayWidth = radius * 0.5;
                    
                    // Horizontal ray
                    galaxyCtx.beginPath();
                    galaxyCtx.moveTo(star.x - rayLength, star.y);
                    galaxyCtx.lineTo(star.x + rayLength, star.y);
                    galaxyCtx.lineWidth = rayWidth;
                    
                    const rayGradient = galaxyCtx.createLinearGradient(
                        star.x - rayLength, star.y,
                        star.x + rayLength, star.y
                    );
                    rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    rayGradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.brightness * 0.3})`);
                    rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    galaxyCtx.strokeStyle = rayGradient;
                    galaxyCtx.stroke();
                    
                    // Vertical ray
                    galaxyCtx.beginPath();
                    galaxyCtx.moveTo(star.x, star.y - rayLength);
                    galaxyCtx.lineTo(star.x, star.y + rayLength);
                    galaxyCtx.lineWidth = rayWidth;
                    
                    const rayGradient2 = galaxyCtx.createLinearGradient(
                        star.x, star.y - rayLength,
                        star.x, star.y + rayLength
                    );
                    rayGradient2.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    rayGradient2.addColorStop(0.5, `rgba(255, 255, 255, ${star.brightness * 0.3})`);
                    rayGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    galaxyCtx.strokeStyle = rayGradient2;
                    galaxyCtx.stroke();
                }
            }
        }
    });
    
    // Reset global alpha
    galaxyCtx.globalAlpha = 1;
}

// ==================== ASTEROIDS ====================
/**
 * Create initial asteroids
 */
function createAsteroids() {
    // Clear existing asteroids
    asteroids = [];
    
    // Number of asteroids (fewer than stars)
    // Slightly increased the number of asteroids by reducing divisor
    const asteroidCount = Math.floor((canvasWidth * canvasHeight) / 40000);
    
    for (let i = 0; i < asteroidCount; i++) {
        createAsteroid();
    }
}

/**
 * Create a single asteroid with random properties
 */
function createAsteroid() {
    // Determine starting edge (0: top, 1: right, 2: bottom, 3: left)
    const edge = Math.floor(Math.random() * 4);
    
    // Set starting position based on edge
    let x, y;
    switch (edge) {
        case 0: // Top
            x = Math.random() * canvasWidth;
            y = -20;
            break;
        case 1: // Right
            x = canvasWidth + 20;
            y = Math.random() * canvasHeight;
            break;
        case 2: // Bottom
            x = Math.random() * canvasWidth;
            y = canvasHeight + 20;
            break;
        case 3: // Left
            x = -20;
            y = Math.random() * canvasHeight;
            break;
    }
    
    // Random speed and direction
    const speed = Math.random() * 0.8 + 0.3; // Slightly slower for better visibility
    const angle = Math.random() * Math.PI * 2;
    
    // Increased size range for better visibility
    const size = Math.random() * 5 + 4; // Size between 4 and 9 (increased from 2-5)
    
    // Determine asteroid type
    const asteroidType = Math.random();
    let color1, color2, detailColor;
    
    if (asteroidType > 0.7) {
        // Rocky/iron asteroid (30%)
        color1 = '#8B8B8B'; // Light gray
        color2 = '#3A3A3A'; // Dark gray
        detailColor = '#555555'; // Medium gray
    } else if (asteroidType > 0.4) {
        // Icy asteroid (30%)
        color1 = '#A8C8E0'; // Light blue-gray
        color2 = '#506878'; // Dark blue-gray
        detailColor = '#FFFFFF'; // White
    } else {
        // Carbonaceous asteroid (40%)
        color1 = '#5D4037'; // Brown
        color2 = '#3E2723'; // Dark brown
        detailColor = '#8D6E63'; // Light brown
    }
    
    asteroids.push({
        x: x,
        y: y,
        size: size,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2, // Initial rotation
        rotationSpeed: (Math.random() - 0.5) * 0.05, // Rotation speed
        // Random shape vertices (for irregular asteroid shape)
        // Increased number of vertices for more detail
        vertices: Array.from({ length: Math.floor(Math.random() * 4) + 7 }, () => {
            return {
                radius: Math.random() * 0.4 + 0.8, // Radius multiplier for each vertex
                angle: Math.random() * Math.PI * 2 // Angle of vertex
            };
        }),
        // Add craters for detail
        craters: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
            return {
                x: (Math.random() - 0.5) * size * 0.8,
                y: (Math.random() - 0.5) * size * 0.8,
                radius: Math.random() * (size * 0.3) + (size * 0.1)
            };
        }),
        // Store colors
        color1: color1,
        color2: color2,
        detailColor: detailColor
    });
}

/**
 * Update asteroid positions and rotations
 */
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        
        // Update position
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;
        
        // Update rotation
        asteroid.rotation += asteroid.rotationSpeed;
        
        // Remove asteroids that are off-screen
        if (
            asteroid.x < -50 || 
            asteroid.x > canvasWidth + 50 || 
            asteroid.y < -50 || 
            asteroid.y > canvasHeight + 50
        ) {
            asteroids.splice(i, 1);
            // Create a new asteroid to replace the removed one
            createAsteroid();
        }
    }
}

/**
 * Draw asteroids on the canvas
 */
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        galaxyCtx.save();
        galaxyCtx.translate(asteroid.x, asteroid.y);
        galaxyCtx.rotate(asteroid.rotation);
        
        // Draw irregular asteroid shape
        galaxyCtx.beginPath();
        
        // Draw the asteroid shape using its vertices
        asteroid.vertices.forEach((vertex, index) => {
            const x = Math.cos(vertex.angle) * asteroid.size * vertex.radius;
            const y = Math.sin(vertex.angle) * asteroid.size * vertex.radius;
            
            if (index === 0) {
                galaxyCtx.moveTo(x, y);
            } else {
                galaxyCtx.lineTo(x, y);
            }
        });
        
        galaxyCtx.closePath();
        
        // Fill with a gradient for a 3D effect
        const gradient = galaxyCtx.createRadialGradient(0, 0, 0, 0, 0, asteroid.size);
        gradient.addColorStop(0, asteroid.color1);
        gradient.addColorStop(1, asteroid.color2);
        
        galaxyCtx.fillStyle = gradient;
        galaxyCtx.fill();
        
        // Add a subtle stroke for better definition
        galaxyCtx.strokeStyle = asteroid.detailColor;
        galaxyCtx.lineWidth = 0.5;
        galaxyCtx.stroke();
        
        // Draw craters for detail
        asteroid.craters.forEach(crater => {
            galaxyCtx.beginPath();
            galaxyCtx.arc(crater.x, crater.y, crater.radius, 0, Math.PI * 2);
            
            // Create crater gradient
            const craterGradient = galaxyCtx.createRadialGradient(
                crater.x, crater.y, 0,
                crater.x, crater.y, crater.radius
            );
            craterGradient.addColorStop(0, asteroid.color2);
            craterGradient.addColorStop(1, asteroid.color1);
            
            galaxyCtx.fillStyle = craterGradient;
            galaxyCtx.fill();
            
            // Add a subtle rim highlight
            galaxyCtx.beginPath();
            galaxyCtx.arc(
                crater.x - crater.radius * 0.2, 
                crater.y - crater.radius * 0.2, 
                crater.radius * 0.8, 
                0, Math.PI * 2
            );
            galaxyCtx.strokeStyle = asteroid.detailColor;
            galaxyCtx.lineWidth = 0.5;
            galaxyCtx.stroke();
        });
        
        galaxyCtx.restore();
    });
}

// ==================== UFOs ====================
/**
 * Create a UFO at random intervals
 */
function createUfo() {
    // Determine if it's time to create a new UFO
    const currentTime = Date.now();
    if (currentTime - lastUfoTime < 10000) return; // Minimum 10 seconds between UFOs
    
    // Random chance to create a UFO
    if (Math.random() > 0.1) return; // 10% chance each check
    
    lastUfoTime = currentTime;
    
    // Determine starting edge (0: left, 1: right)
    const fromLeft = Math.random() > 0.5;
    
    // Set starting position
    const x = fromLeft ? -50 : canvasWidth + 50;
    const y = Math.random() * (canvasHeight * 0.7) + canvasHeight * 0.15; // Middle 70% of screen
    
    // Speed adjustments based on current speed mode
    let ufoSpeedMultiplier, glowColor, beamColor;
    
    if (speedMode === 'superluminal') {
        // Superluminal: Very fast, purple glow, creates black hole effect
        ufoSpeedMultiplier = 3.5 + (currentSpeed - 1.5) * 2;
        glowColor = 'rgba(162, 89, 255, 0.3)'; // Purple glow
        beamColor = 'rgba(162, 89, 255, 0.8)';
        
    } else if (speedMode === 'lightspeed') {
        // Lightspeed: Fast, red glow
        ufoSpeedMultiplier = 2 + (currentSpeed - 0.95) * 3;
        glowColor = 'rgba(255, 101, 132, 0.3)'; // Red glow
        beamColor = 'rgba(255, 101, 132, 0.8)';
        
    } else {
        // Normal: Regular speed, green glow
        ufoSpeedMultiplier = 1 + currentSpeed;
        glowColor = 'rgba(120, 255, 120, 0.3)'; // Green glow
        beamColor = 'rgba(120, 255, 120, 0.8)';
    }
    
    // Create the UFO with speed-dependent properties
    ufos.push({
        x: x,
        y: y,
        size: Math.random() * 10 + 15, // Size between 15 and 25
        speedX: (fromLeft ? 1 : -1) * (Math.random() * 2 + 1) * ufoSpeedMultiplier,
        wobbleAmplitude: Math.random() * 1 + 0.5, // Vertical wobble amount
        wobbleFrequency: Math.random() * 0.05 + 0.02, // Wobble speed
        wobbleOffset: Math.random() * Math.PI * 2, // Starting phase of wobble
        glowIntensity: 0, // Current glow intensity
        glowDirection: 0.02, // Rate of glow change
        beamActive: false, // Whether the tractor beam is active
        beamTime: 0, // Time the beam has been active
        beamDuration: Math.random() * 2000 + 1000, // Duration of beam in milliseconds
        speedMode: speedMode, // Store current speed mode
        glowColor: glowColor,
        beamColor: beamColor,
        // Black hole effect for superluminal mode
        blackHoleActive: speedMode === 'superluminal' && Math.random() > 0.5,
        blackHoleSize: 0, // Will grow over time
        blackHoleMaxSize: Math.random() * 50 + 30,
        // Time distortion effect
        timeDistortion: speedMode !== 'normal',
        timeDirection: speedMode === 'superluminal' ? -1 : 1 // Reverse time in superluminal mode
    });
}

/**
 * Update UFO positions and effects
 */
function updateUfos() {
    for (let i = ufos.length - 1; i >= 0; i--) {
        const ufo = ufos[i];
        
        // Update position with wobble effect
        ufo.x += ufo.speedX;
        ufo.wobbleOffset += ufo.wobbleFrequency;
        
        // Update glow effect
        ufo.glowIntensity += ufo.glowDirection;
        if (ufo.glowIntensity >= 1 || ufo.glowIntensity <= 0) {
            ufo.glowDirection *= -1;
        }
        
        // Randomly activate tractor beam
        if (!ufo.beamActive && Math.random() > 0.995) { // Small chance each frame
            ufo.beamActive = true;
            ufo.beamTime = 0;
        }
        
        // Update beam time if active
        if (ufo.beamActive) {
            ufo.beamTime += 16; // Approximate milliseconds per frame
            if (ufo.beamTime >= ufo.beamDuration) {
                ufo.beamActive = false;
            }
        }
        
        // Update black hole effect for superluminal mode
        if (ufo.blackHoleActive && ufo.speedMode === 'superluminal') {
            if (ufo.blackHoleSize < ufo.blackHoleMaxSize) {
                ufo.blackHoleSize += 0.5; // Grow the black hole
            }
        }
        
        // Remove UFOs that are off-screen
        if (
            (ufo.speedX > 0 && ufo.x > canvasWidth + 100) || 
            (ufo.speedX < 0 && ufo.x < -100)
        ) {
            ufos.splice(i, 1);
        }
    }
}

/**
 * Draw UFOs on the canvas
 */
function drawUfos() {
    ufos.forEach(ufo => {
        // Calculate current y position with wobble
        const wobbleY = ufo.y + Math.sin(ufo.wobbleOffset) * ufo.wobbleAmplitude;
        
        galaxyCtx.save();
        galaxyCtx.translate(ufo.x, wobbleY);
        
        // Draw black hole effect for superluminal mode
        if (ufo.blackHoleActive && ufo.speedMode === 'superluminal' && ufo.blackHoleSize > 0) {
            const blackHoleGradient = galaxyCtx.createRadialGradient(
                0, 0, 0,
                0, 0, ufo.blackHoleSize
            );
            blackHoleGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            blackHoleGradient.addColorStop(0.7, 'rgba(50, 0, 80, 0.5)');
            blackHoleGradient.addColorStop(1, 'rgba(50, 0, 80, 0)');
            
            galaxyCtx.beginPath();
            galaxyCtx.arc(0, 0, ufo.blackHoleSize, 0, Math.PI * 2);
            galaxyCtx.fillStyle = blackHoleGradient;
            galaxyCtx.fill();
            
            // Add swirl effect around black hole
            const swirlCount = 5;
            for (let i = 0; i < swirlCount; i++) {
                const angle = (i / swirlCount) * Math.PI * 2 + Date.now() * 0.001;
                const distance = ufo.blackHoleSize * 0.8;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                galaxyCtx.beginPath();
                galaxyCtx.arc(x, y, ufo.blackHoleSize * 0.2, 0, Math.PI * 2);
                galaxyCtx.fillStyle = 'rgba(162, 89, 255, 0.3)';
                galaxyCtx.fill();
            }
        }
        
        // Draw tractor beam if active
        if (ufo.beamActive) {
            const beamProgress = ufo.beamTime / ufo.beamDuration;
            const beamWidth = ufo.size * (1 - Math.abs(beamProgress - 0.5) * 1.5);
            
            // Create beam gradient with color based on speed mode
            const beamGradient = galaxyCtx.createLinearGradient(0, 0, 0, canvasHeight);
            beamGradient.addColorStop(0, ufo.beamColor);
            beamGradient.addColorStop(1, 'rgba(120, 255, 120, 0)');
            
            // Draw beam
            galaxyCtx.beginPath();
            galaxyCtx.moveTo(-beamWidth, 0);
            galaxyCtx.lineTo(beamWidth, 0);
            galaxyCtx.lineTo(beamWidth * 2, canvasHeight);
            galaxyCtx.lineTo(-beamWidth * 2, canvasHeight);
            galaxyCtx.closePath();
            
            galaxyCtx.fillStyle = beamGradient;
            galaxyCtx.fill();
            
            // Add time distortion effect in the beam for lightspeed and superluminal modes
            if (ufo.timeDistortion) {
                const distortionCount = 5;
                for (let i = 0; i < distortionCount; i++) {
                    const y = (i / distortionCount) * canvasHeight * 0.8;
                    const width = beamWidth * (1 - i / distortionCount) * 1.5;
                    
                    galaxyCtx.beginPath();
                    galaxyCtx.arc(0, y, width, 0, Math.PI * 2);
                    
                    // Color based on speed mode
                    let distortionColor;
                    if (ufo.speedMode === 'superluminal') {
                        distortionColor = `rgba(162, 89, 255, ${0.3 * (1 - i / distortionCount)})`;
                    } else {
                        distortionColor = `rgba(255, 101, 132, ${0.3 * (1 - i / distortionCount)})`;
                    }
                    
                    galaxyCtx.fillStyle = distortionColor;
                    galaxyCtx.fill();
                }
            }
        }
        
        // Draw UFO body (saucer shape)
        // Top dome
        galaxyCtx.beginPath();
        galaxyCtx.ellipse(0, -ufo.size * 0.2, ufo.size * 0.5, ufo.size * 0.3, 0, Math.PI, 0);
        galaxyCtx.fillStyle = '#444';
        galaxyCtx.fill();
        
        // Main saucer body
        galaxyCtx.beginPath();
        galaxyCtx.ellipse(0, 0, ufo.size, ufo.size * 0.3, 0, 0, Math.PI * 2);
        
        // Create gradient for UFO body
        const bodyGradient = galaxyCtx.createLinearGradient(0, -ufo.size * 0.3, 0, ufo.size * 0.3);
        
        // Body color based on speed mode
        if (ufo.speedMode === 'superluminal') {
            bodyGradient.addColorStop(0, '#9966cc');
            bodyGradient.addColorStop(0.5, '#663399');
            bodyGradient.addColorStop(1, '#330066');
        } else if (ufo.speedMode === 'lightspeed') {
            bodyGradient.addColorStop(0, '#ff6666');
            bodyGradient.addColorStop(0.5, '#cc3333');
            bodyGradient.addColorStop(1, '#990000');
        } else {
            bodyGradient.addColorStop(0, '#888');
            bodyGradient.addColorStop(0.5, '#555');
            bodyGradient.addColorStop(1, '#333');
        }
        
        galaxyCtx.fillStyle = bodyGradient;
        galaxyCtx.fill();
        
        // Draw lights around the UFO
        const lightCount = 8;
        for (let i = 0; i < lightCount; i++) {
            const angle = (i / lightCount) * Math.PI * 2;
            const lightX = Math.cos(angle) * ufo.size * 0.8;
            const lightY = Math.sin(angle) * ufo.size * 0.25;
            
            galaxyCtx.beginPath();
            galaxyCtx.arc(lightX, lightY, ufo.size * 0.1, 0, Math.PI * 2);
            
            // Light colors based on speed mode
            let lightColor1, lightColor2;
            
            if (ufo.speedMode === 'superluminal') {
                // Alternate purple and blue for superluminal
                lightColor1 = `rgba(162, 89, 255, ${0.5 + ufo.glowIntensity * 0.5})`;
                lightColor2 = `rgba(80, 200, 255, ${0.5 + ufo.glowIntensity * 0.5})`;
            } else if (ufo.speedMode === 'lightspeed') {
                // Alternate red and yellow for lightspeed
                lightColor1 = `rgba(255, 0, 0, ${0.5 + ufo.glowIntensity * 0.5})`;
                lightColor2 = `rgba(255, 255, 0, ${0.5 + ufo.glowIntensity * 0.5})`;
            } else {
                // Original colors for normal mode
                lightColor1 = `rgba(255, 0, 0, ${0.5 + ufo.glowIntensity * 0.5})`;
                lightColor2 = `rgba(0, 255, 255, ${0.5 + ufo.glowIntensity * 0.5})`;
            }
            
            // Alternate light colors
            const lightColor = i % 2 === 0 ? lightColor1 : lightColor2;
            
            galaxyCtx.fillStyle = lightColor;
            galaxyCtx.fill();
        }
        
        // Draw glow effect
        galaxyCtx.beginPath();
        const glowGradient = galaxyCtx.createRadialGradient(
            0, 0, ufo.size * 0.5,
            0, 0, ufo.size * 2
        );
        glowGradient.addColorStop(0, ufo.glowColor.replace('0.3', (ufo.glowIntensity * 0.3).toString()));
        glowGradient.addColorStop(1, 'rgba(120, 255, 120, 0)');
        
        galaxyCtx.fillStyle = glowGradient;
        galaxyCtx.fillRect(-ufo.size * 2, -ufo.size * 2, ufo.size * 4, ufo.size * 4);
        
        // Add speed trails based on speed mode
        if (ufo.speedMode !== 'normal') {
            const trailLength = ufo.speedMode === 'superluminal' ? 20 : 10;
            const trailCount = ufo.speedMode === 'superluminal' ? 8 : 5;
            
            for (let i = 0; i < trailCount; i++) {
                const trailX = -Math.sign(ufo.speedX) * (i * trailLength / trailCount);
                
                galaxyCtx.beginPath();
                galaxyCtx.ellipse(
                    trailX, 
                    0, 
                    ufo.size * (1 - i / trailCount * 0.8), 
                    ufo.size * 0.3 * (1 - i / trailCount * 0.8), 
                    0, 0, Math.PI * 2
                );
                
                let trailColor;
                if (ufo.speedMode === 'superluminal') {
                    trailColor = `rgba(162, 89, 255, ${0.4 * (1 - i / trailCount)})`;
                } else {
                    trailColor = `rgba(255, 101, 132, ${0.4 * (1 - i / trailCount)})`;
                }
                
                galaxyCtx.fillStyle = trailColor;
                galaxyCtx.fill();
            }
        }
        
        galaxyCtx.restore();
    });
}

/**
 * Main animation function
 */
function animateGalaxy() {
    galaxyAnimationId = requestAnimationFrame(animateGalaxy);
    
    // Clear the canvas
    galaxyCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw stars
    updateStars();
    drawStars();
    
    // Update and draw asteroids
    updateAsteroids();
    drawAsteroids();
    
    // Create, update and draw UFOs
    createUfo();
    updateUfos();
    drawUfos();
}

/**
 * Clean up resources when the animation is stopped
 */
function cleanupGalaxyBackground() {
    if (galaxyAnimationId) {
        cancelAnimationFrame(galaxyAnimationId);
    }
    
    window.removeEventListener('resize', handleResize);
    
    if (galaxyCanvas && galaxyCanvas.parentNode) {
        galaxyCanvas.parentNode.removeChild(galaxyCanvas);
    }
}

// Initialize the galaxy background when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGalaxyBackground); 