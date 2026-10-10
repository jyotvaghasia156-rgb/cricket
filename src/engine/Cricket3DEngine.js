import * as THREE from 'three';
import { audio } from '../utils/audio';
import { AvatarFactory } from './AvatarFactory';

export class Cricket3DEngine {
  constructor(containerElement, onEventCallback) {
    this.container = containerElement;
    this.onEvent = onEventCallback || (() => {});
    this.width = containerElement.clientWidth;
    this.height = containerElement.clientHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationFrameId = null;

    // Game Objects
    this.batsman = null;
    this.nonStriker = null;
    this.bowler = null;
    this.ball = null;
    this.stumpsStriker = null;
    this.bailsStriker = [];
    this.stumpsNonStriker = null;
    this.floodlights = [];
    this.fielders = [];

    // Camera views: 'helmet_cam', 'pro_batting', 'broadcast', 'chase_cam', 'bowler_pov', 'side'
    this.currentCameraView = 'helmet_cam'; // Default to First Person Helmet POV!
    this.cameraTargets = {
      helmet_cam: { pos: new THREE.Vector3(0.2, 1.62, -9.05), look: new THREE.Vector3(0, 1.5, 10) }, // First Person Helmet POV!
      pro_batting: { pos: new THREE.Vector3(0.48, 2.05, -10.3), look: new THREE.Vector3(0, 1.35, 6) }, // Pro Batting Shoulder Cam!
      broadcast: { pos: new THREE.Vector3(-12, 7.5, -6), look: new THREE.Vector3(0, 1.2, 5) }, // TV Studio Broadcast Cam
      chase_cam: { pos: new THREE.Vector3(0, 3.5, -12), look: new THREE.Vector3(0, 1.0, 10) }, // Ball Tracking Chase Cam
      bowler_pov: { pos: new THREE.Vector3(-0.4, 2.4, 18.5), look: new THREE.Vector3(0, 1.0, -9.5) }, // Bowler Runup POV
      side: { pos: new THREE.Vector3(12, 2.8, -4), look: new THREE.Vector3(0, 1.2, -9) } // Side Crease View
    };

    // Physics State
    this.ballState = 'idle';
    this.ballPos = new THREE.Vector3();
    this.ballVel = new THREE.Vector3();
    this.trailPoints = [];
    this.trailLine = null;

    // Continuous dynamic auto-play
    this.isAutoPlay = true;
    this.nextDeliveryCountdown = 0.8;

    // Batsman animation & Hit window
    this.batSwingProgress = 0;
    this.currentShot = null;
    this.shotTimingScore = 1.0;
    this.shotActiveTimer = 0;
    this.hasHitBall = false;
    this.batsmanTappingTime = 0;
    this.footworkMode = 'front_foot';

    // Bowler animation state
    this.bowlerProgress = 0;

    this.initScene();
    this.initStadium();
    this.initPitchAndCreases();
    this.initStumps();
    this.initBatsman();
    this.initNonStriker();
    this.initBowler();
    this.initFielders();
    this.initBall();
    this.initBallTrail();
    this.setupResizeListener();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060B18);
    this.scene.fog = new THREE.FogExp2(0x070E22, 0.007);

    this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.1, 400);
    this.setCameraView('helmet_cam', false);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x3B4868, 0.85);
    this.scene.add(ambientLight);

    const skyLight = new THREE.DirectionalLight(0x7DD3FC, 0.65);
    skyLight.position.set(20, 40, -30);
    this.scene.add(skyLight);
  }

  initStadium() {
    const fieldRadius = 75;
    const fieldGeo = new THREE.CircleGeometry(fieldRadius, 64);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0, '#15803D');
    grad.addColorStop(0.2, '#166534');
    grad.addColorStop(0.4, '#15803D');
    grad.addColorStop(0.6, '#14532D');
    grad.addColorStop(0.8, '#166534');
    grad.addColorStop(1, '#0F381E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const turfTexture = new THREE.CanvasTexture(canvas);
    const fieldMat = new THREE.MeshStandardMaterial({
      map: turfTexture,
      roughness: 0.85,
      metalness: 0.05
    });

    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    this.scene.add(field);

    const ropeGeo = new THREE.TorusGeometry(fieldRadius - 1.5, 0.22, 8, 80);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.7 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.15;
    this.scene.add(rope);

    const adRadius = fieldRadius - 0.6;
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const adGeo = new THREE.BoxGeometry(10, 1.1, 0.2);
      const isRed = i % 2 === 0;
      const adMat = new THREE.MeshStandardMaterial({
        color: isRed ? 0xDC2626 : 0x0284C7,
        emissive: isRed ? 0x7F1D1D : 0x075985,
        emissiveIntensity: 0.45,
        roughness: 0.3
      });
      const adBoard = new THREE.Mesh(adGeo, adMat);
      adBoard.position.set(Math.sin(angle) * adRadius, 0.55, Math.cos(angle) * adRadius);
      adBoard.rotation.y = angle + Math.PI / 2;
      this.scene.add(adBoard);
    }

    const standGeo = new THREE.CylinderGeometry(fieldRadius + 24, fieldRadius + 6, 14, 48, 1, true);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.9,
      side: THREE.BackSide
    });
    const stands = new THREE.Mesh(standGeo, standMat);
    stands.position.y = 6.8;
    this.scene.add(stands);

    const screenGeo = new THREE.BoxGeometry(16, 9, 0.8);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      emissive: 0x0369A1,
      emissiveIntensity: 0.8
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 18, fieldRadius + 14);
    screen.rotation.y = Math.PI;
    this.scene.add(screen);

    const towerPositions = [
      [-55, 38, -55],
      [55, 38, -55],
      [-55, 38, 55],
      [55, 38, 55]
    ];

    towerPositions.forEach((pos, idx) => {
      const mastGeo = new THREE.CylinderGeometry(0.5, 1.4, 38, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.7, roughness: 0.3 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(pos[0], 19, pos[2]);
      this.scene.add(mast);

      const bankGeo = new THREE.BoxGeometry(6, 4, 1);
      const bankMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
      const bank = new THREE.Mesh(bankGeo, bankMat);
      bank.position.set(pos[0], 38, pos[2]);
      bank.lookAt(0, 0, 0);
      this.scene.add(bank);

      const spot = new THREE.SpotLight(0xF8FAFC, 2.4, 140, Math.PI / 4, 0.4, 1.2);
      spot.position.set(pos[0], 38, pos[2]);
      spot.target.position.set(0, 0, 0);
      spot.castShadow = (idx === 0 || idx === 1);
      spot.shadow.mapSize.width = 1024;
      spot.shadow.mapSize.height = 1024;
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.floodlights.push(spot);
    });
  }

  initPitchAndCreases() {
    const pitchLength = 20.12;
    const pitchWidth = 3.2;
    const pitchGeo = new THREE.PlaneGeometry(pitchWidth, pitchLength);

    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.width = 256;
    pitchCanvas.height = 512;
    const pCtx = pitchCanvas.getContext('2d');
    pCtx.fillStyle = '#C2A374';
    pCtx.fillRect(0, 0, 256, 512);
    pCtx.fillStyle = '#B0905D';
    pCtx.fillRect(60, 20, 136, 472);
    pCtx.fillStyle = '#9C7A4A';
    for (let i = 0; i < 40; i++) {
      const rx = 70 + Math.random() * 110;
      const ry = 80 + Math.random() * 350;
      pCtx.fillRect(rx, ry, 6, 2);
    }

    const pitchTex = new THREE.CanvasTexture(pitchCanvas);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: pitchTex,
      roughness: 0.95,
      metalness: 0.05
    });

    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.02;
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    const creaseMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const strikerCrease = new THREE.Mesh(new THREE.PlaneGeometry(pitchWidth, 0.1), creaseMat);
    strikerCrease.rotation.x = -Math.PI / 2;
    strikerCrease.position.set(0, 0.03, -8.84);
    this.scene.add(strikerCrease);

    const nonStrikerCrease = new THREE.Mesh(new THREE.PlaneGeometry(pitchWidth, 0.1), creaseMat);
    nonStrikerCrease.rotation.x = -Math.PI / 2;
    nonStrikerCrease.position.set(0, 0.03, 8.84);
    this.scene.add(nonStrikerCrease);
  }

  initStumps() {
    this.stumpsStriker = new THREE.Group();
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0xE2C59A, roughness: 0.5 });
    const stumpGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.71, 10);

    [-0.11, 0, 0.11].forEach(xOff => {
      const stump = new THREE.Mesh(stumpGeo, stumpMat);
      stump.position.set(xOff, 0.355, -10.06);
      stump.castShadow = true;
      this.stumpsStriker.add(stump);
    });

    const bailGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.11, 8);
    const bailMat = new THREE.MeshStandardMaterial({ color: 0xFCD34D, roughness: 0.3 });
    this.bailsStriker = [];

    [-0.055, 0.055].forEach(bOff => {
      const bail = new THREE.Mesh(bailGeo, bailMat);
      bail.rotation.z = Math.PI / 2;
      bail.position.set(bOff, 0.72, -10.06);
      bail.castShadow = true;
      this.stumpsStriker.add(bail);
      this.bailsStriker.push(bail);
    });

    this.scene.add(this.stumpsStriker);

    this.stumpsNonStriker = new THREE.Group();
    [-0.11, 0, 0.11].forEach(xOff => {
      const stump = new THREE.Mesh(stumpGeo, stumpMat);
      stump.position.set(xOff, 0.355, 10.06);
      stump.castShadow = true;
      this.stumpsNonStriker.add(stump);
    });
    this.scene.add(this.stumpsNonStriker);
  }

  // Create High-Detail 3D Virat Kohli via AvatarFactory
  initBatsman() {
    this.batsman = AvatarFactory.createViratModel('prime');
    this.torso = this.batsman.userData.torso;
    this.head = this.batsman.userData.head;
    this.batGroup = this.batsman.userData.batGroup;
    this.scene.add(this.batsman);
  }

  // Render 3D Non-Striker
  initNonStriker() {
    this.nonStriker = new THREE.Group();
    this.nonStriker.position.set(-0.4, 0, 9.2);

    const jerseyMat = new THREE.MeshStandardMaterial({ color: 0x1E3A8A });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xBA8B65 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.24), jerseyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    this.nonStriker.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinMat);
    head.position.y = 1.6;
    head.castShadow = true;
    this.nonStriker.add(head);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0x0F172A }));
    helmet.position.set(0, 1.63, -0.02);
    this.nonStriker.add(helmet);

    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.04), new THREE.MeshStandardMaterial({ color: 0xDEB887 }));
    bat.position.set(0.15, 0.3, 0);
    this.nonStriker.add(bat);

    this.nonStriker.rotation.y = Math.PI / 2.3;
    this.scene.add(this.nonStriker);
  }

  // Create Detailed Bowler via AvatarFactory
  initBowler() {
    this.bowler = AvatarFactory.createBowlerModel('Haris Rauf');
    this.bowlingArm = this.bowler.userData.bowlingArm;
    this.scene.add(this.bowler);
  }

  initFielders() {
    const fielderPositions = [
      { x: -16, z: -4 },  // Cover
      { x: -12, z: 12 },  // Mid-off
      { x: 12, z: 12 },   // Mid-on
      { x: 18, z: -4 },   // Mid-wicket
      { x: -35, z: -18 }, // Deep Point
      { x: 35, z: -18 },  // Deep Square Leg
      { x: -6, z: -12 },  // 1st Slip
      { x: -12, z: -11 }, // 2nd Slip
      { x: 0, z: -11.5 }  // Wicket Keeper
    ];

    const fielderMat = new THREE.MeshStandardMaterial({ color: 0x047857 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xC89E78 });

    fielderPositions.forEach(p => {
      const fGroup = new THREE.Group();
      fGroup.position.set(p.x, 0, p.z);

      const fBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), fielderMat);
      fBody.position.y = 1.1;
      fGroup.add(fBody);

      const fHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMat);
      fHead.position.y = 1.55;
      fGroup.add(fHead);

      fGroup.lookAt(0, 1.2, -9);
      this.scene.add(fGroup);
      this.fielders.push({
        group: fGroup,
        basePos: new THREE.Vector3(p.x, 0, p.z)
      });
    });
  }

  initBall() {
    const ballGeo = new THREE.SphereGeometry(0.085, 20, 20);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626,
      roughness: 0.35,
      metalness: 0.1
    });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.visible = false;
    this.scene.add(this.ball);
  }

  initBallTrail() {
    const maxTrailPoints = 35;
    const positions = new Float32Array(maxTrailPoints * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const trailMat = new THREE.LineBasicMaterial({
      color: 0xF59E0B,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });

    this.trailLine = new THREE.Line(trailGeo, trailMat);
    this.scene.add(this.trailLine);
  }

  setCameraView(viewKey, smooth = true) {
    if (!this.cameraTargets[viewKey]) return;
    this.currentCameraView = viewKey;
    const target = this.cameraTargets[viewKey];

    if (!smooth) {
      this.camera.position.copy(target.pos);
      this.camera.lookAt(target.look);
    }
  }

  setBatsmanEra(eraKey) {
    if (!this.batsman || !this.torso) return;
    const colors = {
      teen: 0xF8FAFC,
      young: 0x0284C7,
      prime: 0x1E3A8A,
      legend: 0x1D4ED8
    };
    this.torso.material.color.setHex(colors[eraKey] || 0x1E3A8A);
  }

  startDelivery(ballConfig = {}) {
    const speed = ballConfig.speed || (136 + Math.floor(Math.random() * 12));
    const swing = ballConfig.swing || (Math.random() - 0.5) * 0.3;
    const line = ballConfig.line || (Math.random() - 0.5) * 0.3;
    const lengths = ['full', 'good', 'short', 'yorker'];
    const length = ballConfig.length || lengths[Math.floor(Math.random() * lengths.length)];

    this.ballState = 'runup';
    this.bowlerProgress = 0;
    this.ball.visible = false;
    this.trailPoints = [];
    this.hasHitBall = false;
    this.currentShot = null;

    let bounceZ = -3.5;
    if (length === 'full') bounceZ = -6.2;
    if (length === 'short') bounceZ = 0.5;
    if (length === 'yorker') bounceZ = -8.2;

    this.currentDeliveryConfig = {
      speedMps: (speed * 1000) / 3600,
      swing,
      line,
      bounceZ,
      length
    };

    if (this.bailsStriker.length > 0) {
      [-0.055, 0.055].forEach((bOff, idx) => {
        const bail = this.bailsStriker[idx];
        if (bail) {
          bail.position.set(bOff, 0.72, -10.06);
          bail.rotation.set(0, 0, Math.PI / 2);
        }
      });
    }

    this.fielders.forEach(f => {
      f.group.position.copy(f.basePos);
    });
  }

  playShot(shotType, timingScore = 1.0, options = {}) {
    this.currentShot = shotType;
    this.shotTimingScore = timingScore;
    this.currentShotOptions = options;
    this.batSwingProgress = 0;
    this.shotActiveTimer = 0.65;
    this.footworkMode = options.footwork || 'front_foot';

    if (this.batsman) {
      if (this.footworkMode === 'advance') {
        this.batsman.position.z = -8.5;
      } else if (this.footworkMode === 'back_foot') {
        this.batsman.position.z = -9.6;
      } else {
        this.batsman.position.z = -9.2;
      }
    }

    if (this.ballState === 'bowled' && this.ballPos.z < -4.5 && this.ballPos.z > -10.0 && !this.hasHitBall) {
      this.executeBatContact(shotType, timingScore, options);
    }
  }

  executeBatContact(shotType, timingScore, options = (this.currentShotOptions || {})) {
    if (this.hasHitBall) return;
    this.hasHitBall = true;
    this.ballState = 'hit';

    const distFromSweetSpot = Math.abs(this.ballPos.z - (-8.2));
    const accuracy = Math.max(0.3, 1.0 - (distFromSweetSpot / 3.0));
    const finalScore = (timingScore * 0.5) + (accuracy * 0.5);

    // Determine if shot is lofted (aerial boundary clearing) or along the ground
    const isLoftRequested = (options && options.isLofted !== undefined) ? options.isLofted : (shotType === 'lofted_six');
    const isSix = (isLoftRequested && finalScore > 0.52 && shotType !== 'defend');
    audio.playBatHit(isSix ? 'six' : 'normal', finalScore);

    let exitSpeed = 34 * finalScore;
    let launchAngleY = isLoftRequested ? (0.45 + (finalScore * 0.25)) : (0.04 + (Math.random() * 0.05)); // Ground shots stay hugging the turf!
    let targetDirX = 0;
    let targetDirZ = 1;

    switch (shotType) {
      case 'cover_drive':
        targetDirX = -1.35;
        targetDirZ = 1.15;
        if (!isLoftRequested) launchAngleY = 0.04;
        break;
      case 'straight_drive':
        targetDirX = 0.05;
        targetDirZ = 2.1;
        if (!isLoftRequested) launchAngleY = 0.05;
        break;
      case 'pull':
        targetDirX = 1.45;
        targetDirZ = 0.75;
        if (!isLoftRequested) launchAngleY = 0.06;
        break;
      case 'flick':
        targetDirX = 1.05;
        targetDirZ = 1.25;
        if (!isLoftRequested) launchAngleY = 0.05;
        break;
      case 'lofted_six':
        targetDirX = -0.15;
        targetDirZ = 2.2;
        launchAngleY = 0.68;
        exitSpeed = 48 * Math.max(0.65, finalScore);
        break;
      case 'defend':
      default:
        targetDirX = 0.25;
        targetDirZ = 0.35;
        launchAngleY = 0.02;
        exitSpeed = 8;
        break;
    }

    if (isLoftRequested && shotType !== 'defend') {
      exitSpeed *= 1.22; // Lofted shots travel faster and further
    }

    const dir = new THREE.Vector3(targetDirX, launchAngleY, targetDirZ).normalize();
    this.ballVel.copy(dir.multiplyScalar(exitSpeed));

    if (isSix || shotType === 'cover_drive') {
      audio.playCrowdCheer(0.9);
      this.setCameraView('broadcast', true);
    } else {
      audio.playCrowdCheer(0.5);
    }

    this.onEvent({
      type: 'bat_impact',
      isSix,
      isFour: finalScore > 0.8 && !isSix,
      timingScore: finalScore,
      shotType
    });

    setTimeout(() => {
      let runs = 0;
      if (isSix) runs = 6;
      else if (finalScore > 0.8) runs = 4;
      else if (finalScore > 0.55) runs = 2;
      else if (finalScore > 0.3) runs = 1;

      this.onEvent({
        type: 'shot_complete',
        runs,
        shotType,
        timingScore: finalScore
      });

      this.scheduleNextDelivery(2.2);
    }, 1800);
  }

  triggerBowledDismissal() {
    this.ballState = 'missed';
    audio.playWicketShatter();
    audio.playCrowdGasp();

    if (this.bailsStriker.length > 0) {
      this.bailsStriker.forEach((bail, idx) => {
        bail.position.y += 0.8;
        bail.position.x += (idx === 0 ? -0.4 : 0.4);
        bail.rotation.z += 1.5;
      });
    }

    this.onEvent({ type: 'wicket_impact' });

    this.onEvent({
      type: 'wicket',
      kind: 'bowled',
      message: 'BOWLED! Off-stump rattled!'
    });

    this.scheduleNextDelivery(2.5);
  }

  scheduleNextDelivery(delaySeconds = 2.0) {
    if (this.isAutoPlay) {
      this.nextDeliveryCountdown = delaySeconds;
    }
  }

  updatePhysics(delta) {
    if (this.nextDeliveryCountdown > 0) {
      this.nextDeliveryCountdown -= delta;
      if (this.nextDeliveryCountdown <= 0) {
        this.startDelivery();
      }
    }

    if (this.ballState === 'runup') {
      this.bowlerProgress += delta * 1.8;
      this.bowler.position.z = 18 - this.bowlerProgress * 6.5;

      if (this.bowlingArm) {
        this.bowlingArm.rotation.x = -this.bowlerProgress * Math.PI * 2;
      }

      if (this.bowler.position.z <= 10.2) {
        this.ballState = 'bowled';
        this.ball.visible = true;
        this.ballPos.set(this.bowler.position.x + 0.2, 1.9, 10.0);
        this.ball.position.copy(this.ballPos);

        const cfg = this.currentDeliveryConfig;
        const flightTime = 20 / cfg.speedMps;
        const velZ = -cfg.speedMps;
        const velX = (cfg.line - this.ballPos.x) / flightTime;
        const velY = -1.2;

        this.ballVel.set(velX, velY, velZ);
        this.trailPoints = [];

        this.onEvent({
          type: 'ball_delivered',
          speed: Math.round((cfg.speedMps * 3600) / 1000)
        });
      }
    }

    if (this.ballState === 'bowled') {
      this.ballPos.addScaledVector(this.ballVel, delta);

      if (this.ballPos.y <= 0.1 && this.ballPos.z > -8.5) {
        this.ballPos.y = 0.1;
        this.ballVel.y = Math.abs(this.ballVel.y) * 0.82;
        this.ballVel.x += (Math.random() - 0.5) * 0.4;
        audio.playBallBounce();
      } else {
        this.ballVel.y -= 9.8 * delta;
      }

      this.ball.position.copy(this.ballPos);
      this.updateTrail(this.ballPos);

      if (this.shotActiveTimer > 0 && !this.hasHitBall && this.ballPos.z < -5.5 && this.ballPos.z > -9.8) {
        this.executeBatContact(this.currentShot || 'cover_drive', this.shotTimingScore, this.currentShotOptions);
      }

      if (this.ballPos.z <= -10.0 && !this.hasHitBall) {
        const distToStumpsX = Math.abs(this.ballPos.x);
        const heightAtStumps = this.ballPos.y;

        if (distToStumpsX < 0.24 && heightAtStumps < 0.75 && heightAtStumps > 0.05) {
          this.triggerBowledDismissal();
        } else {
          this.ballState = 'missed';
          this.onEvent({
            type: 'dot_ball',
            message: 'Beaten by pace outside off!'
          });
          this.scheduleNextDelivery(2.0);
        }
      }
    }

    if (this.ballState === 'hit') {
      this.ballPos.addScaledVector(this.ballVel, delta);
      this.ballVel.y -= 9.8 * delta;

      if (this.ballPos.y <= 0.1) {
        this.ballPos.y = 0.1;
        this.ballVel.y = Math.abs(this.ballVel.y) * 0.45;
        this.ballVel.x *= 0.94;
        this.ballVel.z *= 0.94;
      }

      this.ball.position.copy(this.ballPos);
      this.updateTrail(this.ballPos);

      if (this.fielders.length > 0) {
        let nearestFielder = null;
        let minDist = 999;
        this.fielders.forEach(f => {
          const d = f.group.position.distanceTo(this.ballPos);
          if (d < minDist) {
            minDist = d;
            nearestFielder = f;
          }
        });

        if (nearestFielder && minDist > 1.2) {
          nearestFielder.group.lookAt(this.ballPos.x, 0, this.ballPos.z);
          nearestFielder.group.translateZ(delta * 8.5);
        }
      }

      const distFromCenter = Math.sqrt(this.ballPos.x * this.ballPos.x + this.ballPos.z * this.ballPos.z);
      if (distFromCenter >= 73) {
        this.ballVel.set(0, 0, 0);
      }
    }

    if (this.currentShot) {
      this.batSwingProgress += delta * 6;
      if (this.shotActiveTimer > 0) {
        this.shotActiveTimer -= delta;
      }

      if (this.batSwingProgress <= 1.0) {
        if (this.currentShot === 'cover_drive') {
          this.batGroup.rotation.x = -Math.PI / 4 + this.batSwingProgress * 1.6;
          this.batGroup.rotation.z = -this.batSwingProgress * 1.1;
          this.torso.rotation.y = -this.batSwingProgress * 0.4;
        } else if (this.currentShot === 'pull') {
          this.batGroup.rotation.y = this.batSwingProgress * 2.2;
          this.batGroup.rotation.z = 0.5;
        } else if (this.currentShot === 'lofted_six') {
          this.batGroup.rotation.x = -Math.PI / 3 + this.batSwingProgress * 2.4;
          this.batGroup.rotation.y = this.batSwingProgress * 0.5;
        } else if (this.currentShot === 'straight_drive') {
          this.batGroup.rotation.x = -Math.PI / 4 + this.batSwingProgress * 1.8;
        } else if (this.currentShot === 'flick') {
          this.batGroup.rotation.y = this.batSwingProgress * 1.8;
          this.batGroup.rotation.z = 0.3;
        }
      } else if (this.batSwingProgress > 2.5) {
        this.currentShot = null;
        this.batGroup.rotation.set(0, 0, 0);
        this.torso.rotation.set(0, 0, 0);
      }
    } else {
      this.batsmanTappingTime += delta * 4;
      this.batGroup.rotation.x = Math.sin(this.batsmanTappingTime) * 0.08;
    }

    const currentTarget = this.cameraTargets[this.currentCameraView];
    if (currentTarget) {
      const targetPos = currentTarget.pos.clone();
      const targetLook = currentTarget.look.clone();

      // First Person Helmet POV Dynamic Head Sway & Ball Eye Tracking
      if (this.currentCameraView === 'helmet_cam') {
        const swayX = Math.sin(Date.now() * 0.003) * 0.015;
        const swayY = Math.cos(Date.now() * 0.004) * 0.01;
        targetPos.x += swayX;
        targetPos.y += swayY;

        if (this.ballState === 'bowled' && this.ball.visible) {
          // Track ball with eye gaze as it comes down pitch!
          targetLook.copy(this.ballPos);
        } else if (this.ballState === 'runup' && this.bowler) {
          // Focus gaze on bowler's release arm
          targetLook.set(this.bowler.position.x, 1.9, this.bowler.position.z);
        }
      } else if (this.currentCameraView === 'bowler_pov' && this.bowler) {
        // Track behind running bowler
        targetPos.set(this.bowler.position.x, 2.4, this.bowler.position.z + 2.5);
        targetLook.set(0, 1.1, -9.5);
      } else if (this.currentCameraView === 'chase_cam' && this.ballState === 'hit') {
        // Track flying ball from behind crease
        targetLook.copy(this.ballPos);
      }

      this.camera.position.lerp(targetPos, delta * 4.2);
      this.camera.lookAt(targetLook);
    }
  }

  updateTrail(pos) {
    if (!this.trailLine) return;
    this.trailPoints.push(pos.clone());
    if (this.trailPoints.length > 30) {
      this.trailPoints.shift();
    }

    const posAttr = this.trailLine.geometry.attributes.position;
    for (let i = 0; i < 30; i++) {
      if (i < this.trailPoints.length) {
        const p = this.trailPoints[i];
        posAttr.setXYZ(i, p.x, p.y, p.z);
      } else {
        posAttr.setXYZ(i, pos.x, pos.y, pos.z);
      }
    }
    posAttr.needsUpdate = true;
  }

  setupResizeListener() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.width = width;
          this.height = height;
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = 0.016;
    this.updatePhysics(delta);
    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
