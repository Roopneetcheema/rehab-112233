// ==========================
// Rehabify — Level 2 (Mini Squats -> Marching -> Final Star)
// ==========================

// -------- DOM
const video   = document.getElementById('video');
const canvas  = document.getElementById('overlay');
const ctx     = canvas.getContext('2d');
const startBtn= document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const starsEl = document.getElementById('stars');
const streakEl= document.getElementById('streak');
const statusEl= document.getElementById('status');
const exerciseInfoEl = document.getElementById('exerciseInfo');
const repBigEl   = document.getElementById('repBig');
const coachBoxEl = document.getElementById('coachBox');
const levelTagEl = document.getElementById('levelTag');

const status = msg => { if (statusEl) statusEl.textContent = msg || ''; };
const coach  = msg => { if (coachBoxEl) { coachBoxEl.style.display='block'; coachBoxEl.textContent = msg || ''; } };

// Level tag
if (levelTagEl) levelTagEl.textContent = '• Level 2';

// --- Final celebration star state
let celebrationActive = false;

// --- Perf
const PERF = { LOW:true };
const VIS_THRESH = 0.25;
const SHOW_LANDMARKS = false;

// --- State
let running=false;
let score=0, streak=0, starCount=0, repCount=0;
let latestLm=null;
let currentExerciseIndex=0;
let currentExercise=null;

// --- Utils
const visOK = p => !!p && (p.visibility===undefined || p.visibility>=VIS_THRESH);
function toPix(p){ return { x:(1-p.x)*canvas.width, y:p.y*canvas.height, c:(p.visibility ?? 1) }; }
function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function lineAngle(a,b){ return Math.atan2(b.y-a.y, b.x-a.x)*180/Math.PI; }
function waistVisible(lm){ return visOK(lm?.[23]) && visOK(lm?.[24]); }
function fullBodyVisible(lm){
  return visOK(lm?.[23]) && visOK(lm?.[24]) && visOK(lm?.[25]) && visOK(lm?.[26]) && visOK(lm?.[27]) && visOK(lm?.[28]);
}

// Canvas + video
function setCanvasSize(){
  const targetW = PERF.LOW ? 640 : (video.videoWidth  || 640);
  const targetH = PERF.LOW ? 360 : (video.videoHeight || 480);
  canvas.width  = targetW;
  canvas.height = targetH;
}
function drawCameraFrame(){
  if (video.readyState >= 2) {
    ctx.save(); ctx.scale(-1,1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

// -------- Audio ping
let audioCtx=null;
const initAudio = ()=>{ if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); };
function playDing(){
  if (!audioCtx) return;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type='sine'; o.frequency.value=880; o.connect(g); g.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.6,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.25);
  o.start(t); o.stop(t+0.26);
}

// =========================================================================================
// PLAN (Level 2)
// =========================================================================================
const PLAN = [
  { id:'miniSquats', name:'Mini Squats', description:'Small squats for leg strength', criteria:'miniSquats', repetitions_target:2, level:2, requiresFullBody:true, introSticky:true,
    introText:'Level 2: Mini Squats — Show FULL body. Bend both knees a little, then stand tall.' },

  { id:'marchingInPlace', name:'Marching in Place', description:'Lift knees alternately', criteria:'marchingInPlace', repetitions_target:2, level:2, requiresFullBody:true, introSticky:true,
    introText:'Level 2: Marching in Place — Show FULL body. Lift each knee above waist level. 2 reps.' },
];

const LOWER_BODY = new Set(['miniSquats','marchingInPlace']);

// =========================================================================================
// Intro (very simple: sticky until requirements met)
// =========================================================================================
let _intro = { text:'', sticky:false, visible:false, until:0, sub:'' };
function showIntro(text, { sticky=true }={}){
  _intro.text = text || '';
  _intro.sub  = '';
  _intro.sticky = !!sticky;
  _intro.visible = true;
  _intro.until = 0;
}
function shouldHoldIntro(){
  if (!_intro.sticky) return false;
  if (!latestLm){ _intro.sub = 'Make sure you are visible'; return true; }
  if (currentExercise?.requiresFullBody && !fullBodyVisible(latestLm)){ _intro.sub='Show FULL body (hips, knees, ankles)'; return true; }
  _intro.sub = '';
  return false;
}
function introIsActive(){
  if (!_intro.visible) return false;
  const hold = shouldHoldIntro();
  if (!hold){ _intro.visible=false; return false; }
  return true;
}
function drawIntroOverlay(){
  if (!_intro.visible) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.62)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const base = Math.max(22, canvas.width*0.032);
  ctx.font = `600 ${base}px ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial`;
  ctx.fillText(_intro.text, canvas.width/2, canvas.height*0.38);
  if (_intro.sub){
    ctx.font = `500 ${Math.max(18, base*0.9)}px ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial`;
    ctx.fillStyle = '#ffe07a';
    ctx.fillText(_intro.sub, canvas.width/2, canvas.height*0.48);
  }
  ctx.restore();
}

// =========================================================================================
// Reps + flow
// =========================================================================================
function updateExerciseInfo(){
  const name = currentExercise?.name ?? '—';
  const need = currentExercise?.repetitions_target ?? 2;
  const remain = Math.max(0, need - repCount);
  if (exerciseInfoEl) exerciseInfoEl.textContent = `${name} | ${remain} reps left`;
  if (repBigEl) repBigEl.textContent = String(remain);
}
let _lastRepAt = 0;
function incrementRep(){
  const now = performance.now();
  if (now - _lastRepAt < 250) return;
  _lastRepAt = now;
  repCount++;
  playDing();
  streak++; if (streakEl) streakEl.textContent = streak;
  score += 10; if (scoreEl) scoreEl.textContent = score;
  updateExerciseInfo();

  const need = currentExercise?.repetitions_target ?? 2;
  if (repCount >= need){
    coach('Great! Exercise complete.');
    // If this was the last exercise, start the final star
    if (currentExerciseIndex >= PLAN.length - 1){
      startCelebrationStar();
    } else {
      setTimeout(()=>goToExercise(currentExerciseIndex+1), 300);
    }
  } else {
    coach(need - repCount === 1 ? 'One more to go!' : 'Keep going!');
  }
}

function goToExercise(index){
  currentExerciseIndex = Math.max(0, Math.min(PLAN.length-1, index));
  currentExercise = PLAN[currentExerciseIndex];
  repCount = 0;
  updateExerciseInfo();
  coach(`Next: ${currentExercise.name} — ${currentExercise.description}`);
  if (levelTagEl) levelTagEl.textContent = '• Level 2';
  // show intro
  showIntro(currentExercise.introText || currentExercise.description || currentExercise.name, { sticky:true });
  // stop celebration mode if we were in it
  celebrationActive = false;
}

// =========================================================================================
// Lower-body detectors (fallback if your modules don’t provide processFrame)
// =========================================================================================
const KneePhases = { NONE:0, UP:1 };
let _march = { side:'left', phase:KneePhases.NONE };
let _squat = { down:false };

// helpers
function kneeAboveWaist(lm, side){
  const knee = lm[ side==='left' ? 25 : 26 ];
  const hip  = lm[ side==='left' ? 23 : 24 ];
  if (!visOK(knee) || !visOK(hip)) return false;
  return knee.y < hip.y - 0.10; // knee clearly above hip level
}
function kneeAtRest(lm, side){
  const knee = lm[ side==='left' ? 25 : 26 ];
  const hip  = lm[ side==='left' ? 23 : 24 ];
  if (!visOK(knee) || !visOK(hip)) return false;
  return knee.y > hip.y - 0.03; // back down near hip line
}
function bothKneesBent(lm){
  const lK = lm[25], rK = lm[26], lH=lm[23], rH=lm[24];
  if (![lK,rK,lH,rH].every(visOK)) return false;
  // heuristic: hips drop and knees move forward -> use hip height drop
  const shoulderMidY = (lm[11]?.y + lm[12]?.y)/2 || 0.5;
  const hipMidY = (lH.y + rH.y)/2;
  return (hipMidY - shoulderMidY) < 0.42; // hips sufficiently low relative to shoulders
}
function standingTall(lm){
  const lH=lm[23], rH=lm[24], sL=lm[11], sR=lm[12];
  if (![lH,rH,sL,sR].every(visOK)) return false;
  const hipMidY = (lH.y + rH.y)/2;
  const shoulderMidY = (sL.y + sR.y)/2;
  return (hipMidY - shoulderMidY) > 0.48; // taller posture
}

// detectors
function detectMiniSquat(lm){
  if (!fullBodyVisible(lm)) { coach('Show FULL body'); return; }
  if (!_squat.down){
    if (bothKneesBent(lm)){ _squat.down = true; coach('Good depth — stand up'); }
  } else {
    if (standingTall(lm)){ _squat.down = false; incrementRep(); }
  }
}
function detectMarching(lm){
  if (!fullBodyVisible(lm)) { coach('Show FULL body'); return; }
  const side = _march.side;
  if (_march.phase === KneePhases.NONE){
    if (kneeAboveWaist(lm, side)){ _march.phase = KneePhases.UP; coach(`Nice ${side} knee — bring it down`); }
  } else {
    if (kneeAtRest(lm, side)){
      _march.phase = KneePhases.NONE;
      _march.side = side === 'left' ? 'right' : 'left';
      incrementRep();
    }
  }
}

// =========================================================================================
// Final star (celebration)
// =========================================================================================
const NOTE_SPEED_PX_S = 110;
const HOLD_MS_DEFAULT = 520;
const POST_HIT_DESPAWN_MS = 650;
let stars = [];
let nextAllowedSpawnAt = 0;

function starPath(cx, cy, spikes, outerR, innerR, rotation=-Math.PI/2){
  const step = Math.PI / spikes; ctx.beginPath();
  for (let i=0;i<spikes*2;i++){
    const r = (i%2===0) ? outerR : innerR, a = i*step + rotation;
    const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  } ctx.closePath();
}
function drawStarShape(s){
  const {x,y} = s; const r = s._rDraw ?? s.r;
  ctx.save();
  starPath(x, y, 5, r, r*0.48);
  ctx.fillStyle = s.inside ? '#ffd54a' : '#ffef7a';
  ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffffffcc'; ctx.stroke();
  ctx.restore();
}
function spawnFinishStar(now){
  if (!celebrationActive) return;
  if (stars.length > 0 || now < nextAllowedSpawnAt) return;
  const w = canvas.width, h = canvas.height;
  const baseR = Math.max(34, Math.min(64, canvas.width * 0.05));
  stars = [{
    x: w*0.5, y: -60, targetY: h*0.35, r: baseR,
    vy: NOTE_SPEED_PX_S, spawnedAt: now, hit:false, hitAt:0, holdStart:0, inside:false,
    holdMs: HOLD_MS_DEFAULT, required:'palm', label:'FINISH', shape:'star'
  }];
}
function drawStarsAndUI(now, lm){
  // only used for final star
  for (let i = stars.length - 1; i >= 0; i--){
    const s = stars[i];
    // descend
    if (s.y < s.targetY){ s.y += s.vy * (1/60); if (s.y >= s.targetY) s.y = s.targetY; }
    // check palms/wrists
    const LW = visOK(lm?.[15]) ? toPix(lm[15]) : null;
    const RW = visOK(lm?.[16]) ? toPix(lm[16]) : null;
    const rad = (s.r || 40) + 30;
    const leftIn  = LW && dist(LW, s) <= rad;
    const rightIn = RW && dist(RW, s) <= rad;
    const wasInside = s.inside;
    s.inside = !!(leftIn || rightIn);
    if (s.inside && !wasInside) s.holdStart = performance.now();
    // complete
    if (s.inside && !s.hit && (performance.now() - s.holdStart) >= s.holdMs){
      s.hit = true; s.hitAt = performance.now(); playDing();
      setTimeout(endSession, 600);
    }
    // draw
    ctx.save();
    if (!s.hit){ s._rDraw = s.r * (1 + 0.10*Math.sin((now - s.spawnedAt)/220)); }
    else { const k = Math.min(1, (now - s.hitAt)/350); s._rDraw = s.r*(1+0.9*k); ctx.globalAlpha = 1 - Math.min(1,(now-s.hitAt)/650); }
    // halo
    ctx.beginPath(); ctx.arc(s.x, s.y, (s._rDraw||s.r)+12, 0, Math.PI*2);
    ctx.fillStyle = s.inside ? 'rgba(255,255,160,0.24)' : 'rgba(255,240,120,0.12)';
    ctx.fill();
    drawStarShape(s);
    // label
    ctx.globalAlpha = 1;
    const fpx = Math.max(20, (s._rDraw||s.r) * 0.65);
    ctx.font = `700 ${fpx}px ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.lineWidth = Math.max(3, fpx*0.12);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeText('FINISH', s.x, s.y);
    ctx.fillStyle='#fff';
    ctx.fillText('FINISH', s.x, s.y);
    ctx.restore();

    if (s.hit && (now - s.hitAt) > POST_HIT_DESPAWN_MS) stars.splice(i,1);
  }
}
function startCelebrationStar(){
  celebrationActive = true;
  stars = [];
  nextAllowedSpawnAt = 0;
  coach('Final pop to finish!');
}
function endSession(){
  localStorage.setItem('sessionStats', JSON.stringify({
    score, streak, starCount, exercisesCompleted: currentExerciseIndex+1,
    completedAt: new Date().toISOString(), level: 2
  }));
  window.location.href = '/public/feedback.html?level=2';
}

// =========================================================================================
// Main loop
// =========================================================================================
let _lastDrawAt = 0;
const FRAME_MS = 100;

function renderLoop(){
  const now = performance.now();
  if (now - _lastDrawAt < FRAME_MS) { requestAnimationFrame(renderLoop); return; }
  _lastDrawAt = now;

  drawCameraFrame();

  const introActive = introIsActive();
  if (introActive) drawIntroOverlay();

  if (latestLm){
    // run detectors only when intro is cleared
    if (!introActive && currentExercise){
      if (currentExercise.criteria === 'miniSquats'){
        if (window.Exercises?.miniSquats?.processFrame){
          const r = window.Exercises.miniSquats.processFrame(ctx, latestLm, canvas);
          if (r?.repComplete) incrementRep();
        } else {
          detectMiniSquat(latestLm);
        }
      } else if (currentExercise.criteria === 'marchingInPlace'){
        if (window.Exercises?.marchingInPlace?.processFrame){
          const r = window.Exercises.marchingInPlace.processFrame(ctx, latestLm, canvas);
          if (r?.repComplete) incrementRep();
        } else {
          detectMarching(latestLm);
        }
      }
    }

    // final star overlay
    if (celebrationActive){
      spawnFinishStar(now);
      drawStarsAndUI(now, latestLm);
    }
  } else {
    if (celebrationActive){ spawnFinishStar(now); drawStarsAndUI(now, null); }
  }

  requestAnimationFrame(renderLoop);
}

// =========================================================================================
// Camera + Pose
// =========================================================================================
async function openCamera(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('getUserMedia not supported');
  const tries = [
    { video: { facingMode:{ideal:'user'}, width:{ideal:1280}, height:{ideal:720} }, audio:false },
    { video: { facingMode:'user' }, audio:false },
    { video: true, audio:false },
  ];
  let lastErr;
  for (const c of tries){ try { return await navigator.mediaDevices.getUserMedia(c); } catch(e){ lastErr=e; } }
  throw lastErr || new Error('Unable to open camera');
}

let pose = null;
async function start(){
  if (running) return; running=true;
  try{
    initAudio();
    status('requesting camera…');

    const stream = await openCamera();
    video.srcObject = stream;

    await new Promise(res=>{
      if (video.readyState >= 1) return res();
      video.addEventListener('loadedmetadata', res, {once:true});
    });
    await video.play().catch(()=>{});
    setCanvasSize(); window.addEventListener('resize', setCanvasSize);

    // Start at first Level 2 exercise
    goToExercise(0);

    renderLoop();
    status('camera ready');

    const PoseCtor =
      (window.Pose && window.Pose.Pose) ? window.Pose.Pose :
      (window.Pose) ? window.Pose :
      (window.pose && window.pose.Pose) ? window.pose.Pose : null;

    if (!PoseCtor){ status('ERROR: Pose constructor not found'); return; }

    pose = new PoseCtor({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}` });
    pose.setOptions({ modelComplexity: PERF.LOW ? 0 : 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    pose.onResults(({ poseLandmarks })=> { latestLm = poseLandmarks || null; });

    if (typeof Camera === 'function'){
      const cam = new Camera(video, { onFrame: async () => { await pose.send({ image: video }); }, width: canvas.width, height: canvas.height });
      cam.start(); status('running…');
    } else {
      (async function loop(){ await pose.send({ image: video }); requestAnimationFrame(loop); })();
      status('running…');
    }
  }catch(e){
    status('Camera Error: ' + (e?.message || e));
    running=false;
  }
}

if (startBtn) startBtn.addEventListener('click', start);

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentExerciseIndex >= PLAN.length - 1) {
      // on last exercise -> show finish star
      if (!celebrationActive) startCelebrationStar();
    } else {
      goToExercise(currentExerciseIndex + 1);
    }
  });
}

// Init UI
updateExerciseInfo();
status('Ready. Click Start when you are set.');
