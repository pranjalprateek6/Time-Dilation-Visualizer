// Detect mobile devices and reduce animation complexity
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// DOM Elements
const speedSlider = document.getElementById('speed-slider');
const speedInput = document.getElementById('speed-input');
const lorentzFactorElement = document.getElementById('lorentz-factor');
const dilatedTimeElement = document.getElementById('dilated-time');
const starsContainer = document.getElementById('stars-container');
const speedLinesContainer = document.getElementById('speed-lines-container');

// UFO Effect Elements
const ufoNormalEffect = document.getElementById('ufo-normal');
const ufoLightspeedEffect = document.getElementById('ufo-lightspeed');
const ufoSuperluminalEffect = document.getElementById('ufo-superluminal');

// UFO Visual Elements
const ufoVisualNormal = document.getElementById('ufo-visual-normal');
const ufoVisualLightspeed = document.getElementById('ufo-visual-lightspeed');
const ufoVisualSuperluminal = document.getElementById('ufo-visual-superluminal');

// Clock Elements
const earthHourHand = document.getElementById('earth-hour-hand');
const earthMinuteHand = document.getElementById('earth-minute-hand');
const earthSecondHand = document.getElementById('earth-second-hand');
const travelerHourHand = document.getElementById('traveler-hour-hand');
const travelerMinuteHand = document.getElementById('traveler-minute-hand');
const travelerSecondHand = document.getElementById('traveler-second-hand');
const travelerClockFace = document.getElementById('traveler-clock-face');
const travelerClockTitle = document.querySelector('.traveler-clock h3');

// Constants
const SPEED_OF_LIGHT = 299792458; // m/s
// Reduce number of elements on mobile
const NUMBER_OF_STARS = isMobile ? 50 : 100;
const NUMBER_OF_SPEED_LINES = isMobile ? 8 : 15;
const NUMBER_OF_WARP_LINES = isMobile ? 10 : 20;

// Variables
let speed = 0; // Default speed as fraction of c
let lorentzFactor = 1; // Default Lorentz factor for speed 0
let isAnimating = false;
let earthTime = 0;
let travelerTime = 0;
let animationFrameId;
let isSuperluminal = false; // Flag for speeds > c
let isUltraSuperluminal = false; // Flag for speeds > 1.5c

// Initialize the application
function init() {
    console.log("Initializing application...");
    
    // Check if DOM elements exist
    if (!speedSlider || !speedInput || !lorentzFactorElement || !dilatedTimeElement) {
        console.error("Critical DOM elements not found. Aborting initialization.");
        return;
    }
    
    // Set initial values
    speedSlider.value = speed;
    speedInput.value = speed;
    
    // Calculate initial Lorentz factor
    calculateLorentzFactor();
    
    // Add event listeners
    speedSlider.addEventListener('input', handleSpeedChange);
    speedInput.addEventListener('input', handleSpeedChange);
    
    // Create visual elements
    createStars();
    createSpeedLines();
    createWarpEffect();
    createBlackHoleEffect();
    
    // Update UFO effect card
    updateUFOEffectCard();
    
    // Start the animation
    startAnimation();
    
    console.log("Initialization complete!");
}

// Create stars for the background
function createStars() {
    console.log("Creating stars...");
    if (!starsContainer) return;
    
    starsContainer.innerHTML = ''; // Clear any existing stars
    
    for (let i = 0; i < NUMBER_OF_STARS; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation delay
        const delay = Math.random() * 4;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}

// Create speed lines for the spaceship
function createSpeedLines() {
    console.log("Creating speed lines...");
    if (!speedLinesContainer) return;
    
    speedLinesContainer.innerHTML = ''; // Clear any existing speed lines
    
    for (let i = 0; i < NUMBER_OF_SPEED_LINES; i++) {
        const speedLine = document.createElement('div');
        speedLine.classList.add('speed-line');
        
        // Random position
        const y = Math.random() * 100;
        
        // Random width
        const width = Math.random() * 50 + 50;
        
        // Random animation delay
        const delay = Math.random() * 1.5;
        
        speedLine.style.top = `${y}%`;
        speedLine.style.width = `${width}%`;
        speedLine.style.animationDelay = `${delay}s`;
        
        speedLinesContainer.appendChild(speedLine);
    }
}

// Create warp effect for superluminal speeds
function createWarpEffect() {
    console.log("Creating warp effect...");
    // Remove any existing warp container
    const existingWarp = document.querySelector('.warp-effect-container');
    if (existingWarp) {
        existingWarp.remove();
    }
    
    // Create container for warp effect
    const warpContainer = document.createElement('div');
    warpContainer.classList.add('warp-effect-container');
    document.body.appendChild(warpContainer);
    
    // Create warp lines
    for (let i = 0; i < NUMBER_OF_WARP_LINES; i++) {
        const warpLine = document.createElement('div');
        warpLine.classList.add('warp-line');
        
        // Random position and rotation
        const y = Math.random() * 100;
        const rotation = Math.random() * 180 - 90; // -90 to 90 degrees
        
        // Random animation delay
        const delay = Math.random() * 3;
        
        warpLine.style.top = `${y}%`;
        warpLine.style.transform = `rotate(${rotation}deg)`;
        warpLine.style.animationDelay = `${delay}s`;
        
        warpContainer.appendChild(warpLine);
    }
}

// Create black hole effect for ultra-superluminal speeds
function createBlackHoleEffect() {
    console.log("Creating black hole effect...");
    // Remove any existing black hole
    const existingBlackHole = document.querySelector('.black-hole');
    if (existingBlackHole) {
        existingBlackHole.remove();
    }
    
    const blackHole = document.createElement('div');
    blackHole.classList.add('black-hole');
    document.body.appendChild(blackHole);
}

// Update speed lines based on current speed
function updateSpeedLines() {
    const speedLines = document.querySelectorAll('.speed-line');
    if (!speedLines.length) return;
    
    speedLines.forEach(line => {
        if (isUltraSuperluminal) {
            line.style.opacity = '0.9';
            line.style.background = `linear-gradient(to right, transparent, rgba(131, 56, 236, 0.7), transparent)`;
            line.style.boxShadow = `0 0 12px rgba(131, 56, 236, 0.5)`;
        } else if (isSuperluminal) {
            line.style.opacity = '0.7';
            line.style.background = `linear-gradient(to right, transparent, rgba(255, 0, 110, 0.6), transparent)`;
            line.style.boxShadow = `0 0 8px rgba(255, 0, 110, 0.4)`;
        } else {
            // Scale opacity with speed
            line.style.opacity = (0.3 + speed * 0.4).toString();
            line.style.background = `linear-gradient(to right, transparent, rgba(0, 180, 216, 0.5), transparent)`;
            line.style.boxShadow = `0 0 5px rgba(0, 180, 216, 0.3)`;
        }
    });
}

// Handle speed change from slider or input
function handleSpeedChange(e) {
    console.log("Speed changed:", e.target.value);
    
    // Update speed value
    speed = parseFloat(e.target.value);
    
    // Sync the other input
    if (e.target === speedSlider && speedInput) {
        speedInput.value = speed;
    } else if (speedSlider) {
        speedSlider.value = speed;
    }
    
    // Validate speed is within range
    if (speed < 0) {
        speed = 0;
        if (speedSlider) speedSlider.value = speed;
        if (speedInput) speedInput.value = speed;
    } else if (speed > 2) {
        speed = 2;
        if (speedSlider) speedSlider.value = speed;
        if (speedInput) speedInput.value = speed;
    }
    
    // Calculate new Lorentz factor
    calculateLorentzFactor();
    
    // Update visual elements
    updateSpeedLines();
    updateUFOEffectCard();
}

// Update UFO effect card based on current speed
function updateUFOEffectCard() {
    if (!ufoNormalEffect || !ufoLightspeedEffect || !ufoSuperluminalEffect) return;
    
    // Remove active class from all
    ufoNormalEffect.classList.remove('active');
    ufoLightspeedEffect.classList.remove('active');
    ufoSuperluminalEffect.classList.remove('active');
    
    // Add active class based on speed
    if (isUltraSuperluminal) {
        ufoSuperluminalEffect.classList.add('active');
    } else if (isSuperluminal) {
        ufoLightspeedEffect.classList.add('active');
    } else {
        ufoNormalEffect.classList.add('active');
    }
    
    // Update visual UFO animations
    updateUFOVisualAnimations();
}

// Update UFO visual animations based on current speed
function updateUFOVisualAnimations() {
    if (!ufoVisualNormal || !ufoVisualLightspeed || !ufoVisualSuperluminal) return;
    
    // Remove active class from all
    ufoVisualNormal.classList.remove('active');
    ufoVisualLightspeed.classList.remove('active');
    ufoVisualSuperluminal.classList.remove('active');
    
    // Clean up all special effects first
    
    // Remove time reversal indicator
    const timeReversal = document.getElementById('time-reversal-indicator');
    if (timeReversal) {
        timeReversal.remove();
    }
    
    // Remove time reversal clock
    const timeReversalClock = ufoVisualSuperluminal.querySelector('.time-reversal-clock');
    if (timeReversalClock) {
        timeReversalClock.remove();
    }
    
    // Remove light speed clock
    const lightSpeedClock = ufoVisualLightspeed.querySelector('.light-speed-clock');
    if (lightSpeedClock) {
        lightSpeedClock.remove();
    }
    
    // Remove normal speed clock
    const normalSpeedClock = ufoVisualNormal.querySelector('.normal-speed-clock');
    if (normalSpeedClock) {
        normalSpeedClock.remove();
    }
    
    // Remove time stopped indicator
    const timeStoppedIndicator = ufoVisualLightspeed.querySelector('.time-reversal-indicator');
    if (timeStoppedIndicator) {
        timeStoppedIndicator.remove();
    }
    
    // Remove normal time indicator
    const normalTimeIndicator = ufoVisualNormal.querySelector('.time-reversal-indicator');
    if (normalTimeIndicator) {
        normalTimeIndicator.remove();
    }
    
    // Reset any ultra-superluminal specific effects
    if (ufoVisualSuperluminal.querySelector('.ufo-visual-saucer')) {
        ufoVisualSuperluminal.querySelector('.ufo-visual-saucer').style.filter = '';
    }
    
    // Now add the appropriate effects based on speed
    if (isUltraSuperluminal) {
        ufoVisualSuperluminal.classList.add('active');
        
        // Add ultra-superluminal specific effects
        if (ufoVisualSuperluminal.querySelector('.ufo-visual-saucer')) {
            ufoVisualSuperluminal.querySelector('.ufo-visual-saucer').style.filter = 'hue-rotate(60deg) brightness(1.3)';
        }
        
        // Add time reversal effect indicator
        const indicator = document.createElement('div');
        indicator.id = 'time-reversal-indicator';
        indicator.className = 'time-reversal-indicator';
        indicator.innerHTML = '<span>⟲ Time Reversal</span>';
        ufoVisualSuperluminal.appendChild(indicator);
        
        // Add time reversal clock
        const newTimeReversalClock = document.createElement('div');
        newTimeReversalClock.className = 'time-reversal-clock';
        
        const clockHand = document.createElement('div');
        clockHand.className = 'time-reversal-hand';
        
        newTimeReversalClock.appendChild(clockHand);
        ufoVisualSuperluminal.appendChild(newTimeReversalClock);
        
        // Add enhanced black hole effect for ultra-superluminal
        const ultraBlackHole = document.createElement('div');
        ultraBlackHole.className = 'ufo-visual-blackhole';
        ultraBlackHole.style.width = '100px';
        ultraBlackHole.style.height = '100px';
        ultraBlackHole.style.background = 'radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(162, 89, 255, 0.8) 75%, rgba(162, 89, 255, 0) 100%)';
        ultraBlackHole.style.boxShadow = '0 0 30px rgba(162, 89, 255, 0.7)';
        ufoVisualSuperluminal.appendChild(ultraBlackHole);
        
        // Add gravitational lensing effect (light bending around black hole)
        const ultraLensEffect = document.createElement('div');
        ultraLensEffect.style.position = 'absolute';
        ultraLensEffect.style.top = '50%';
        ultraLensEffect.style.left = '50%';
        ultraLensEffect.style.transform = 'translate(-50%, -50%)';
        ultraLensEffect.style.width = '130px';
        ultraLensEffect.style.height = '130px';
        ultraLensEffect.style.borderRadius = '50%';
        ultraLensEffect.style.background = 'radial-gradient(circle, transparent 40%, rgba(162, 89, 255, 0.15) 70%, transparent 100%)';
        ultraLensEffect.style.boxShadow = '0 0 40px rgba(162, 89, 255, 0.4)';
        ultraLensEffect.style.animation = 'blackholeEffect 3s ease-in-out infinite alternate';
        ultraLensEffect.style.zIndex = '-2';
        ufoVisualSuperluminal.appendChild(ultraLensEffect);
        
    } else if (isSuperluminal) {
        ufoVisualLightspeed.classList.add('active');
        
        // Add light speed stopped clock
        const newLightSpeedClock = document.createElement('div');
        newLightSpeedClock.className = 'light-speed-clock';
        
        const clockHand = document.createElement('div');
        clockHand.className = 'light-speed-hand';
        
        newLightSpeedClock.appendChild(clockHand);
        ufoVisualLightspeed.appendChild(newLightSpeedClock);
        
        // Add time stopped indicator
        const newTimeStoppedIndicator = document.createElement('div');
        newTimeStoppedIndicator.className = 'time-reversal-indicator';
        newTimeStoppedIndicator.innerHTML = '<span>⏱️ Time Stopped</span>';
        newTimeStoppedIndicator.style.backgroundColor = 'rgba(255, 101, 132, 0.3)';
        newTimeStoppedIndicator.style.border = '1px solid rgba(255, 101, 132, 0.7)';
        ufoVisualLightspeed.appendChild(newTimeStoppedIndicator);
        
        // Add enhanced black hole effect
        const blackHole = document.createElement('div');
        blackHole.className = 'ufo-visual-blackhole';
        ufoVisualLightspeed.appendChild(blackHole);
        
        // Add gravitational lensing effect (light bending around black hole)
        const lensEffect = document.createElement('div');
        lensEffect.style.position = 'absolute';
        lensEffect.style.top = '50%';
        lensEffect.style.left = '50%';
        lensEffect.style.transform = 'translate(-50%, -50%)';
        lensEffect.style.width = '100px';
        lensEffect.style.height = '100px';
        lensEffect.style.borderRadius = '50%';
        lensEffect.style.background = 'radial-gradient(circle, transparent 30%, rgba(255, 101, 132, 0.1) 60%, transparent 100%)';
        lensEffect.style.boxShadow = '0 0 30px rgba(255, 101, 132, 0.3)';
        lensEffect.style.animation = 'blackholeEffect 4s ease-in-out infinite';
        lensEffect.style.zIndex = '-2';
        ufoVisualLightspeed.appendChild(lensEffect);
        
    } else {
        ufoVisualNormal.classList.add('active');
        
        // Add normal speed clock (only if speed is close to c, e.g., > 0.5c)
        if (speed > 0.5) {
            const newNormalSpeedClock = document.createElement('div');
            newNormalSpeedClock.className = 'normal-speed-clock';
            
            const clockHand = document.createElement('div');
            clockHand.className = 'normal-speed-hand';
            
            // Adjust animation speed based on how close to light speed
            // As we get closer to c, the clock hand moves slower
            const animationDuration = 3 + (speed * 5); // Ranges from 3s at 0c to 8s at 1c
            clockHand.style.animationDuration = `${animationDuration}s`;
            
            newNormalSpeedClock.appendChild(clockHand);
            ufoVisualNormal.appendChild(newNormalSpeedClock);
            
            // Add time dilation indicator
            const newNormalTimeIndicator = document.createElement('div');
            newNormalTimeIndicator.className = 'time-reversal-indicator';
            newNormalTimeIndicator.innerHTML = '<span>⏳ Time Dilated</span>';
            newNormalTimeIndicator.style.backgroundColor = 'rgba(0, 229, 255, 0.3)';
            newNormalTimeIndicator.style.border = '1px solid rgba(0, 229, 255, 0.7)';
            ufoVisualNormal.appendChild(newNormalTimeIndicator);
        }
    }
}

// Calculate the Lorentz factor based on the current speed
function calculateLorentzFactor() {
    console.log("Calculating Lorentz factor for speed:", speed);
    
    isSuperluminal = speed >= 1;
    isUltraSuperluminal = speed >= 1.5;
    
    if (isSuperluminal) {
        // For speeds > c, we'll use imaginary numbers (just for visualization)
        // This is not physically accurate but allows for a continuous visualization
        
        // For animation purposes, we'll use a negative time dilation effect
        // This is purely for visualization and has no physical meaning
        const v2 = Math.pow(speed, 2);
        const dilationFactor = 1 / Math.sqrt(Math.abs(1 - v2));
        
        // Update the UI
        if (isUltraSuperluminal) {
            if (lorentzFactorElement) {
                lorentzFactorElement.textContent = "Complex";
                lorentzFactorElement.style.color = "var(--tertiary-color)";
            }
            if (dilatedTimeElement) {
                dilatedTimeElement.textContent = dilationFactor.toFixed(2);
                dilatedTimeElement.style.color = "var(--tertiary-color)";
            }
            
            // Add ultra-superluminal class
            document.body.classList.add('ultra-superluminal');
            document.body.classList.remove('superluminal');
            
            // Update mode description if function exists
            if (typeof updateModeDescription === 'function') {
                updateModeDescription(speed);
            }
        } else {
            if (lorentzFactorElement) {
                lorentzFactorElement.textContent = "Imaginary";
                lorentzFactorElement.style.color = "var(--secondary-color)";
            }
            if (dilatedTimeElement) {
                dilatedTimeElement.textContent = dilationFactor.toFixed(2);
                dilatedTimeElement.style.color = "var(--secondary-color)";
            }
            
            // Add superluminal class
            document.body.classList.add('superluminal');
            document.body.classList.remove('ultra-superluminal');
            
            // Update mode description if function exists
            if (typeof updateModeDescription === 'function') {
                updateModeDescription(speed);
            }
        }
        
        // Set lorentz factor for animation
        lorentzFactor = dilationFactor;
    } else {
        // Normal relativistic calculation
        const v2 = Math.pow(speed, 2);
        lorentzFactor = 1 / Math.sqrt(1 - v2);
        
        // Update the UI
        if (lorentzFactorElement) {
            lorentzFactorElement.textContent = lorentzFactor.toFixed(2);
            lorentzFactorElement.style.color = "";
        }
        if (dilatedTimeElement) {
            dilatedTimeElement.textContent = lorentzFactor.toFixed(2);
            dilatedTimeElement.style.color = "";
        }
        
        // Remove superluminal classes
        document.body.classList.remove('superluminal', 'ultra-superluminal');
        
        // Update mode description if function exists
        if (typeof updateModeDescription === 'function') {
            updateModeDescription(speed);
        }
    }
    
    // Update UFO effect card
    updateUFOEffectCard();
    
    // Update UFO visual animations
    updateUFOVisualAnimations();
    
    return lorentzFactor;
}

// Start the clock animation
function startAnimation() {
    console.log("Starting animation...");
    
    if (isAnimating) {
        stopAnimation();
    }
    
    isAnimating = true;
    earthTime = 0;
    travelerTime = 0;
    
    // Start the animation loop
    animateClocks();
}

// Stop the clock animation
function stopAnimation() {
    console.log("Stopping animation...");
    
    isAnimating = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// Update the animation speed based on the Lorentz factor
function updateAnimationSpeed() {
    // If animation is running, restart it to apply the new speed
    if (isAnimating) {
        stopAnimation();
        startAnimation();
    }
}

// Animate the clocks
function animateClocks() {
    // Increment the time
    earthTime += 0.01;
    
    if (isUltraSuperluminal) {
        // For ultra-superluminal speeds, we'll make the traveler clock run backwards faster
        // This is purely for visualization and has no physical meaning
        const v2 = Math.pow(speed, 2);
        const dilationFactor = 1 / Math.sqrt(Math.abs(1 - v2));
        travelerTime -= 0.015 / dilationFactor; // Faster negative time progression
    } else if (isSuperluminal) {
        // For superluminal speeds, we'll make the traveler clock run backwards
        // This is purely for visualization and has no physical meaning
        const v2 = Math.pow(speed, 2);
        const dilationFactor = 1 / Math.sqrt(Math.abs(1 - v2));
        travelerTime -= 0.01 / dilationFactor; // Negative time progression
    } else {
        // Normal time dilation
        travelerTime += 0.01 / lorentzFactor;
    }
    
    // Update the Earth clock
    updateClock(earthHourHand, earthMinuteHand, earthSecondHand, earthTime);
    
    // Update the Traveler clock
    updateClock(travelerHourHand, travelerMinuteHand, travelerSecondHand, travelerTime);
    
    // Continue the animation loop
    animationFrameId = requestAnimationFrame(animateClocks);
}

// Update a clock's hands based on the given time
function updateClock(hourHand, minuteHand, secondHand, time) {
    // Handle negative time for superluminal visualization
    const absTime = Math.abs(time);
    
    // Convert time to hours, minutes, seconds
    const seconds = absTime % 60;
    const minutes = (absTime / 60) % 60;
    const hours = (absTime / 3600) % 12;
    
    // Calculate rotation angles
    const secondAngle = (seconds / 60) * 360;
    const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
    const hourAngle = ((hours + minutes / 60) / 12) * 360;
    
    // For negative time (superluminal), rotate in opposite direction
    const direction = time < 0 ? -1 : 1;
    
    // Apply rotations to clock hands
    if (secondHand) secondHand.style.transform = `rotate(${direction * secondAngle}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${direction * minuteAngle}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${direction * hourAngle}deg)`;
    
    // Add pulsing effect for superluminal speeds
    if (secondHand) {
        if (isUltraSuperluminal && secondHand === travelerSecondHand) {
            secondHand.style.boxShadow = "0 0 10px var(--tertiary-color)";
        } else if (isSuperluminal && secondHand === travelerSecondHand) {
            secondHand.style.boxShadow = "0 0 8px var(--secondary-color)";
        } else {
            secondHand.style.boxShadow = "";
        }
    }
}

// Single initialization point
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
}

// Start the application
initializeApp(); 