// live-feedback.js
// Real-time exercise feedback system using MediaPipe angles and body part detection

class LiveFeedback {
  constructor() {
    this.feedbackElement = null;
    this.currentFeedback = '';
    this.lastFeedbackTime = 0;
    this.feedbackCooldown = 1500; // Show feedback for 1.5 seconds minimum
    this.angleTolerance = 15; // degrees
  }

  init(feedbackElementId) {
    this.feedbackElement = document.getElementById(feedbackElementId);
    if (!this.feedbackElement) {
      console.warn('Live feedback element not found:', feedbackElementId);
    }
  }

  // Calculate angle between three points
  calculateAngle(a, b, c) {
    if (!a || !b || !c) return null;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  // Calculate distance between two points
  calculateDistance(a, b) {
    if (!a || !b) return null;
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  // Check if landmarks are visible enough
  isVisible(landmark, threshold = 0.5) {
    return landmark && landmark.visibility > threshold;
  }

  // Display feedback message
  showFeedback(message, type = 'correction') {
    if (!this.feedbackElement || !message) return;
    
    const now = Date.now();
    if (now - this.lastFeedbackTime < 500) return; // Prevent spam
    
    this.currentFeedback = message;
    this.lastFeedbackTime = now;
    
    this.feedbackElement.textContent = message;
    this.feedbackElement.className = `live-feedback-container ${type}`;
    
    // Auto-clear after cooldown
    setTimeout(() => {
      if (this.currentFeedback === message) {
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'live-feedback-container';
      }
    }, this.feedbackCooldown);
  }

  // Shoulder Abduction feedback
  provideShoulderbductionFeedback(landmarks) {
    if (!landmarks) return;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (!this.isVisible(leftShoulder) || !this.isVisible(rightShoulder)) {
      this.showFeedback("Keep both shoulders visible", "warning");
      return;
    }

    // Check if shoulders are level
    const shoulderDifference = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderDifference > 0.05) {
      this.showFeedback("Keep your shoulders level", "correction");
      return;
    }

    // Check elbow angles - should be straight (close to 180 degrees)
    if (this.isVisible(leftElbow) && this.isVisible(leftWrist)) {
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      if (leftElbowAngle && leftElbowAngle < 160) {
        this.showFeedback("Straighten your left elbow", "correction");
        return;
      }
    }

    if (this.isVisible(rightElbow) && this.isVisible(rightWrist)) {
      const rightElbowAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
      if (rightElbowAngle && rightElbowAngle < 160) {
        this.showFeedback("Straighten your right elbow", "correction");
        return;
      }
    }

    // Check arm height
    if (this.isVisible(leftWrist) && this.isVisible(rightWrist)) {
      const leftArmHeight = leftShoulder.y - leftWrist.y;
      const rightArmHeight = rightShoulder.y - rightWrist.y;
      
      if (leftArmHeight < -0.02) {
        this.showFeedback("Raise your left arm higher", "correction");
        return;
      }
      if (rightArmHeight < -0.02) {
        this.showFeedback("Raise your right arm higher", "correction");
        return;
      }
      
      // Check if both arms are too low
      if (leftArmHeight < 0.05 && rightArmHeight < 0.05) {
        this.showFeedback("Raise both arms to shoulder level", "correction");
        return;
      }
    }

    // Positive feedback when doing well
    if (this.isVisible(leftWrist) && this.isVisible(rightWrist)) {
      const leftArmAtLevel = Math.abs(leftShoulder.y - leftWrist.y) < 0.05;
      const rightArmAtLevel = Math.abs(rightShoulder.y - rightWrist.y) < 0.05;
      if (leftArmAtLevel && rightArmAtLevel) {
        this.showFeedback("Perfect form! Keep it up!", "success");
      }
    }
  }

  // Overhead Press feedback
  provideOverheadPressFeedback(landmarks) {
    if (!landmarks) return;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (!this.isVisible(leftShoulder) || !this.isVisible(rightShoulder)) {
      this.showFeedback("Keep both shoulders visible", "warning");
      return;
    }

    // Check if wrists are above head
    const nose = landmarks[0];
    if (this.isVisible(nose) && this.isVisible(leftWrist) && this.isVisible(rightWrist)) {
      const leftWristAboveHead = leftWrist.y < nose.y - 0.1;
      const rightWristAboveHead = rightWrist.y < nose.y - 0.1;
      
      if (!leftWristAboveHead && !rightWristAboveHead) {
        this.showFeedback("Press both hands higher - above your head", "correction");
        return;
      } else if (!leftWristAboveHead) {
        this.showFeedback("Press your left hand higher", "correction");
        return;
      } else if (!rightWristAboveHead) {
        this.showFeedback("Press your right hand higher", "correction");
        return;
      }
    }

    // Check elbow alignment
    if (this.isVisible(leftElbow) && this.isVisible(leftWrist)) {
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      if (leftElbowAngle && leftElbowAngle < 160) {
        this.showFeedback("Extend your left arm fully", "correction");
        return;
      }
    }

    if (this.isVisible(rightElbow) && this.isVisible(rightWrist)) {
      const rightElbowAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
      if (rightElbowAngle && rightElbowAngle < 160) {
        this.showFeedback("Extend your right arm fully", "correction");
        return;
      }
    }

    // Positive feedback
    if (this.isVisible(nose) && this.isVisible(leftWrist) && this.isVisible(rightWrist)) {
      const bothHandsUp = leftWrist.y < nose.y - 0.1 && rightWrist.y < nose.y - 0.1;
      if (bothHandsUp) {
        this.showFeedback("Great! Both hands are up!", "success");
      }
    }
  }

  // Forward Reach feedback
  provideForwardReachFeedback(landmarks) {
    if (!landmarks) return;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (!this.isVisible(leftShoulder) || !this.isVisible(rightShoulder)) {
      this.showFeedback("Keep both shoulders visible", "warning");
      return;
    }

    // Check reaching position
    if (this.isVisible(leftWrist) && this.isVisible(rightWrist)) {
      const leftReaching = leftWrist.x < leftShoulder.x - 0.1;
      const rightReaching = rightWrist.x > rightShoulder.x + 0.1;
      
      if (!leftReaching && !rightReaching) {
        this.showFeedback("Reach forward with your arms", "correction");
        return;
      }
    }

    // Shoulder level check
    const shoulderDifference = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderDifference > 0.05) {
      this.showFeedback("Keep shoulders level while reaching", "correction");
      return;
    }

    this.showFeedback("Good reach! Hold the position", "success");
  }

  // Mini Squats feedback
  provideMiniSquatsFeedback(landmarks) {
    if (!landmarks) return;

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Check full body visibility
    if (!this.isVisible(leftHip) || !this.isVisible(rightHip) || 
        !this.isVisible(leftKnee) || !this.isVisible(rightKnee) ||
        !this.isVisible(leftAnkle) || !this.isVisible(rightAnkle)) {
      this.showFeedback("Show your full body - hips, knees, and ankles", "warning");
      return;
    }

    // Calculate knee angles
    const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);

    if (!leftKneeAngle || !rightKneeAngle) return;

    // Check if squatting deep enough
    const minSquatAngle = 140; // degrees
    const maxSquatAngle = 170; // degrees

    if (leftKneeAngle > maxSquatAngle && rightKneeAngle > maxSquatAngle) {
      this.showFeedback("Bend your knees more - mini squat down", "correction");
      return;
    }

    if (leftKneeAngle < minSquatAngle || rightKneeAngle < minSquatAngle) {
      this.showFeedback("Don't squat too deep - keep it mini", "correction");
      return;
    }

    // Check knee alignment
    const kneeAlignment = Math.abs(leftKnee.x - leftAnkle.x) + Math.abs(rightKnee.x - rightAnkle.x);
    if (kneeAlignment > 0.1) {
      this.showFeedback("Keep knees aligned over your ankles", "correction");
      return;
    }

    // Hip distance from knees (squat depth indicator)
    const leftHipKneeDistance = Math.abs(leftHip.y - leftKnee.y);
    const rightHipKneeDistance = Math.abs(rightHip.y - rightKnee.y);
    
    if (leftHipKneeDistance < 0.1 || rightHipKneeDistance < 0.1) {
      this.showFeedback("Perfect squat depth!", "success");
    }
  }

  // Marching in Place feedback
  provideMarchingFeedback(landmarks) {
    if (!landmarks) return;

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    if (!this.isVisible(leftHip) || !this.isVisible(rightHip) || 
        !this.isVisible(leftKnee) || !this.isVisible(rightKnee)) {
      this.showFeedback("Show your full body for marching", "warning");
      return;
    }

    // Calculate hip-knee distances to check lift height
    const leftKneeLifted = leftKnee.y < leftHip.y - 0.05;
    const rightKneeLifted = rightKnee.y < rightHip.y - 0.05;

    // Check if knees are lifted high enough
    const leftKneeHeight = leftHip.y - leftKnee.y;
    const rightKneeHeight = rightHip.y - rightKnee.y;

    if (!leftKneeLifted && !rightKneeLifted) {
      this.showFeedback("Lift your knees higher - march in place", "correction");
      return;
    }

    if (leftKneeLifted && leftKneeHeight < 0.08) {
      this.showFeedback("Lift your left knee higher", "correction");
      return;
    }

    if (rightKneeLifted && rightKneeHeight < 0.08) {
      this.showFeedback("Lift your right knee higher", "correction");
      return;
    }

    // Calculate hip-knee angle for better form feedback
    if (this.isVisible(leftAnkle)) {
      const leftHipKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      if (leftHipKneeAngle && leftHipKneeAngle < 90 && leftKneeLifted) {
        this.showFeedback("Good left knee lift!", "success");
      }
    }

    if (this.isVisible(rightAnkle)) {
      const rightHipKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
      if (rightHipKneeAngle && rightHipKneeAngle < 90 && rightKneeLifted) {
        this.showFeedback("Good right knee lift!", "success");
      }
    }

    // Check posture
    const shoulderMidpoint = {
      x: (landmarks[11].x + landmarks[12].x) / 2,
      y: (landmarks[11].y + landmarks[12].y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const posturalAlignment = Math.abs(shoulderMidpoint.x - hipMidpoint.x);
    if (posturalAlignment > 0.05) {
      this.showFeedback("Stand up straight - align your body", "correction");
      return;
    }
  }

  // Main feedback dispatcher
  provideFeedback(exerciseCriteria, landmarks) {
    if (!landmarks || !exerciseCriteria) return;

    switch (exerciseCriteria) {
      case 'shoulderAbduction':
        this.provideShoulderbductionFeedback(landmarks);
        break;
      case 'overheadPress':
        this.provideOverheadPressFeedback(landmarks);
        break;
      case 'forwardReach':
        this.provideForwardReachFeedback(landmarks);
        break;
      case 'miniSquats':
        this.provideMiniSquatsFeedback(landmarks);
        break;
      case 'marchingInPlace':
        this.provideMarchingFeedback(landmarks);
        break;
      default:
        // Generic feedback for unknown exercises
        if (!this.isVisible(landmarks[11]) || !this.isVisible(landmarks[12])) {
          this.showFeedback("Keep your body visible", "warning");
        }
        break;
    }
  }

  // Clear all feedback
  clearFeedback() {
    if (this.feedbackElement) {
      this.feedbackElement.textContent = '';
      this.feedbackElement.className = 'live-feedback-container';
    }
    this.currentFeedback = '';
  }
}

// Create global instance
window.liveFeedback = new LiveFeedback();

console.log('live-feedback.js loaded');
