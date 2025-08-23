// mini_squats.js
// Enhanced with star guides and better angle detection for rep counting
window.Exercises = window.Exercises || {};

window.Exercises.miniSquats = {
  id: 'miniSquats',
  name: 'Mini Squats',
  description: 'Small squatting movements for leg strength',
  criteria: 'miniSquats',
  repetitions_target: 3,
  level: 2,
  requiresFullBody: true,
  introSticky: true,
  introText: 'Level 2: Mini Squats — Show your FULL body. Bend your knees slightly and return to standing. Keep your back straight.',
  
  // Stars configuration for visual guidance
  stars: [],
  starRadius: 40,
  starColors: {
    inactive: '#ffef7a',
    active: '#ffd54a',
    hit: '#45e0f0'
  },
  
  // State tracking for rep detection
  state: {
    phase: 'standing',       // 'standing' or 'squatting'
    squatDepthReached: false, // tracks if proper squat depth was reached
    repInProgress: false,     // tracks if a rep is currently being performed
    lastRepTime: 0,           // timestamp of last completed rep
    currentStarIndex: 0       // current active star
  },

  // Initialize star targets for visual guidance
  setupStars: function(canvas) {
    const centerX = canvas.width / 2;
    // Target position for hip/center guidance during squats
    this.stars = [
      {
        x: centerX,
        y: canvas.height * 0.65, // Middle position for standing
        hit: false,
        active: true,
        phase: 'standing',
        radius: this.starRadius,
        color: this.starColors.active
      },
      {
        x: centerX,
        y: canvas.height * 0.75, // Lower position for squatting
        hit: false,
        active: false,
        phase: 'squatting',
        radius: this.starRadius,
        color: this.starColors.inactive
      }
    ];
    
    // Reset state
    this.state = {
      phase: 'standing',
      squatDepthReached: false,
      repInProgress: false,
      lastRepTime: 0,
      currentStarIndex: 0
    };
  },
  
  // Draw the star guides
  drawStars: function(ctx) {
    if (!this.stars || !this.stars.length) return;
    
    for (const star of this.stars) {
      ctx.save();
      ctx.globalAlpha = star.hit ? 0.3 : 1;
      ctx.fillStyle = star.active ? this.starColors.active : this.starColors.inactive;
      if (star.hit) ctx.fillStyle = this.starColors.hit;
      
      // Draw star shape
      this.drawStarShape(ctx, star.x, star.y, star.radius);
      
      ctx.restore();
    }
  },
  
  // Draw a star shape
  drawStarShape: function(ctx, x, y, radius) {
    const spikes = 5;
    const innerRadius = radius * 0.4;
    const rotation = -Math.PI / 2;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? radius : innerRadius;
      const angle = i * Math.PI / spikes + rotation;
      const pointX = x + Math.cos(angle) * r;
      const pointY = y + Math.sin(angle) * r;
      
      if (i === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  },
  
  // Custom criteria for mini squats with improved detection
  customCriteria: function(lm) {
    const leftHip = lm?.[23], rightHip = lm?.[24];
    const leftKnee = lm?.[25], rightKnee = lm?.[26];
    const leftAnkle = lm?.[27], rightAnkle = lm?.[28];
    
    // Ensure all required landmarks are visible
    if (![leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle].every(p => p && p.visibility > 0.5)) {
      return null;
    }
    
    // Calculate knee angles
    const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
    
    // Hip midpoint for star targeting
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };
    
    // Determine squat depth - detect squatting when knee angles < 160 degrees
    const minSquatAngle = 140; // minimum angle for a mini squat (not too deep)
    const maxSquatAngle = 170; // maximum angle that still counts as a squat
    
    // Is currently squatting if knee angles are in the right range
    const isSquatting = leftKneeAngle < maxSquatAngle && rightKneeAngle < maxSquatAngle && 
                       leftKneeAngle > minSquatAngle && rightKneeAngle > minSquatAngle;
    
    // Too deep if either knee angle is smaller than minimum
    const isTooDeep = leftKneeAngle < minSquatAngle || rightKneeAngle < minSquatAngle;
    
    return { 
      isSquatting, 
      isTooDeep,
      leftKneeAngle, 
      rightKneeAngle,
      hipMidpoint
    };
  },
  
  // Process pose data and update exercise state
  processFrame: function(ctx, lm, canvas) {
    // Initialize stars if needed
    if (!this.stars || !this.stars.length) {
      this.setupStars(canvas);
    }
    
    // Draw guidance stars
    this.drawStars(ctx);
    
    // Get pose data
    const poseData = this.customCriteria(lm);
    if (!poseData) return null;
    
    const { isSquatting, isTooDeep, hipMidpoint } = poseData;
    const now = performance.now();
    
    // Star interaction logic
    if (hipMidpoint) {
      const hipPixel = { x: hipMidpoint.x * canvas.width, y: hipMidpoint.y * canvas.height };
      
      // Handle state transitions based on squat phase
      if (!isSquatting && !isTooDeep) {
        // Standing position
        if (this.state.phase === 'squatting' && this.state.squatDepthReached) {
          // Completed a rep by returning to standing
          if (now - this.state.lastRepTime > 1000) { // Prevent too rapid reps
            this.state.lastRepTime = now;
            this.stars[0].hit = true; // Mark standing star as hit
            this.stars[1].hit = false; // Reset squat star
            
            // Update star states
            this.stars[0].active = true;
            this.stars[1].active = false;
            
            this.state.phase = 'standing';
            this.state.squatDepthReached = false;
            this.state.repInProgress = false;
            
            // Signal a completed rep
            return { repComplete: true };
          }
        } else {
          // In standing position
          this.state.phase = 'standing';
          this.stars[0].active = true;
          this.stars[1].active = false;
        }
      } else if (isSquatting && !isTooDeep) {
        // In squatting position with correct depth
        if (this.state.phase === 'standing') {
          // Transitioning to squat phase
          this.state.phase = 'squatting';
          this.state.squatDepthReached = true;
          this.state.repInProgress = true;
          
          // Update star states
          this.stars[0].active = false;
          this.stars[1].active = true;
          this.stars[1].hit = true;
        }
      } else if (isTooDeep) {
        // Squatting too deep - still count as squatting but give feedback
        this.state.phase = 'squatting';
        this.state.squatDepthReached = true;
      }
    }
    
    return { 
      repInProgress: this.state.repInProgress,
      squatDepthReached: this.state.squatDepthReached,
      isTooDeep: isTooDeep,
      isSquatting: isSquatting
    };
  },
  
  // Utility function to calculate angle between three points
  calculateAngle: function(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }
};

console.log('mini_squats.js loaded');
