// marching_in_place.js - Fixed stars + correct alternating counting
window.Exercises = window.Exercises || {};

window.Exercises.marchingInPlace = {
  id: 'marchingInPlace',
  name: 'Marching in Place',
  description: 'Lift knees alternately for balance and coordination',
  criteria: 'marchingInPlace',
  repetitions_target: 4,
  level: 2,
  requiresFullBody: true,
  introSticky: true,
  introText: 'Level 2: Marching in Place — Lift each knee to waist level. One rep = left + right leg!',

  // Star visuals
  stars: [],
  starRadius: 35,
  starColors: {
    inactive: '#ffef7a',
    leftActive: '#4da3ff',
    rightActive: '#ff6fb0',
    hit: '#45e0f0'
  },

  // State
  state: {
    leftKneeState: 'down',
    rightKneeState: 'down',
    lastLeftLift: 0,
    lastRightLift: 0,
    repCount: 0,
    leftDone: false,
    rightDone: false,
    starPositionsSet: false // Prevent stars from jittering
  },

  // Draw stars
  drawStars: function(ctx) {
    for (const star of this.stars) {
      ctx.save();
      ctx.globalAlpha = star.hit ? 0.4 : 1;

      if (star.active && !star.hit) {
        ctx.fillStyle = star.side === 'left' ? this.starColors.leftActive : this.starColors.rightActive;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
      } else if (star.hit) {
        ctx.fillStyle = this.starColors.hit;
      } else {
        ctx.fillStyle = this.starColors.inactive;
      }

      this.drawStarShape(ctx, star.x, star.y, star.radius);
      ctx.restore();
    }
  },

  // Draw star shape
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

  // Knee lift detection
  customCriteria: function(lm, waistY) {
    const leftHip = lm?.[23], rightHip = lm?.[24];
    const leftKnee = lm?.[25], rightKnee = lm?.[26];
    const leftAnkle = lm?.[27], rightAnkle = lm?.[28];

    if (![leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle].every(p => p && p.visibility > 0.5)) {
      return null;
    }

    const leftHipKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightHipKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
    const maxLiftAngle = 120;

    const leftKneeLifted = (leftKnee.y < waistY) && leftHipKneeAngle < maxLiftAngle;
    const rightKneeLifted = (rightKnee.y < waistY) && rightHipKneeAngle < maxLiftAngle;

    return { leftKneeLifted, rightKneeLifted };
  },

  // Frame processing
  processFrame: function(ctx, lm, canvas) {
    if (!lm?.length) return null;

    // Waist Y position
    const waistY = (lm[23].y + lm[24].y) / 2;

    // Set stars only once (to prevent jitter)
    if (!this.state.starPositionsSet) {
      const leftHipX = lm[23].x * canvas.width;
      const rightHipX = lm[24].x * canvas.width;
      const waistPixelY = waistY * canvas.height;

      this.stars = [
        { id: 'leftKnee', x: leftHipX, y: waistPixelY, hit: false, active: false, side: 'left', radius: this.starRadius },
        { id: 'rightKnee', x: rightHipX, y: waistPixelY, hit: false, active: false, side: 'right', radius: this.starRadius }
      ];
      this.state.starPositionsSet = true;
    }

    // Draw stars
    this.drawStars(ctx);

    // Detect knees
    const poseData = this.customCriteria(lm, waistY);
    if (!poseData) return null;

    const { leftKneeLifted, rightKneeLifted } = poseData;
    const now = performance.now();
    const minTimeBetweenLifts = 500;
    let repComplete = false;

    // LEFT knee logic
    if (leftKneeLifted && this.state.leftKneeState === 'down') {
      if (now - this.state.lastLeftLift > minTimeBetweenLifts) {
        this.state.leftKneeState = 'up';
        this.state.lastLeftLift = now;
        this.state.leftDone = true;
        this.flashStar('left');
      }
    } else if (!leftKneeLifted) {
      this.state.leftKneeState = 'down';
    }

    // RIGHT knee logic
    if (rightKneeLifted && this.state.rightKneeState === 'down') {
      if (now - this.state.lastRightLift > minTimeBetweenLifts) {
        this.state.rightKneeState = 'up';
        this.state.lastRightLift = now;
        this.state.rightDone = true;
        this.flashStar('right');
      }
    } else if (!rightKneeLifted) {
      this.state.rightKneeState = 'down';
    }

    // One full rep = both knees done in any order
    if (this.state.leftDone && this.state.rightDone) {
      this.state.repCount++;
      repComplete = true;
      this.state.leftDone = false;
      this.state.rightDone = false;
    }

    return { repComplete, leftKneeLifted, rightKneeLifted, repCount: this.state.repCount };
  },

  // Flash star feedback
  flashStar: function(side) {
    const star = this.stars.find(s => s.side === side);
    if (star) {
      star.hit = true;
      setTimeout(() => { star.hit = false; }, 800);
    }
  },

  // Angle calc
  calculateAngle: function(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }
};

console.log('marching_in_place.js fixed: stable stars + both legs count');
