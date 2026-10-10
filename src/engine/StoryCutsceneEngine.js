import * as THREE from 'three';
import { AvatarFactory } from './AvatarFactory';

export class StoryCutsceneEngine {
  constructor(containerElement, chapterData) {
    this.container = containerElement;
    this.chapter = chapterData;
    this.width = containerElement.clientWidth;
    this.height = containerElement.clientHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationFrameId = null;

    // Characters & Objects
    this.viratModel = null;
    this.secondaryModel = null; // Coach, Sachin, Bowler, Father silhouette
    this.particles = null;
    this.particleSpeeds = [];

    // Cutscene Camera Animation
    this.time = 0;
    this.camPhase = 0;

    this.init();
    this.setupResize();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040714);
    this.scene.fog = new THREE.FogExp2(0x060C1F, 0.015);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 200);
    this.camera.position.set(0, 2, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Atmosphere Lights
    const ambientLight = new THREE.AmbientLight(0x2C3A5A, 1.2);
    this.scene.add(ambientLight);

    // Spotlight 1 (Dramatic Key Light)
    this.keySpot = new THREE.SpotLight(0xF59E0B, 3.5, 30, Math.PI / 3, 0.3, 1);
    this.keySpot.position.set(-3, 8, 4);
    this.keySpot.castShadow = true;
    this.scene.add(this.keySpot);

    // Spotlight 2 (Cyan Backlight)
    this.rimSpot = new THREE.SpotLight(0x38BDF8, 3.0, 30, Math.PI / 3, 0.3, 1);
    this.rimSpot.position.set(4, 7, -4);
    this.scene.add(this.rimSpot);

    this.buildChapterEnvironment();
    this.buildViratCutsceneModel();
    this.buildSecondaryModel();
    this.buildCinematicParticles();
  }

  buildChapterEnvironment() {
    // Pitch / Ground Platform
    const groundGeo = new THREE.CircleGeometry(25, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.chapter.id === 2 ? 0x0F172A : (this.chapter.id === 3 ? 0x042F2E : 0x14532D),
      roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Pitch Strip
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 10),
      new THREE.MeshStandardMaterial({ color: 0xB8935D, roughness: 0.9 })
    );
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.set(0, 0, 0);
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // Striker Stumps
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0xE2C59A });
    [-0.11, 0, 0.11].forEach(x => {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 8), stumpMat);
      s.position.set(x, 0.36, -1.8);
      s.castShadow = true;
      this.scene.add(s);
    });
  }

  buildViratCutsceneModel() {
    this.viratModel = AvatarFactory.createViratModel(this.chapter.avatar || 'prime');
    this.viratModel.position.set(0, 0, 0);
    this.viratHead = this.viratModel.userData.head;
    this.viratBat = this.viratModel.userData.batGroup;
    this.viratTorso = this.viratModel.userData.torso;
    this.scene.add(this.viratModel);
  }

  buildSecondaryModel() {
    // Secondary character based on chapter narrative
    this.secondaryModel = new THREE.Group();

    if (this.chapter.id === 1) {
      // Coach Rajkumar Sharma standing beside Virat
      const coachMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const coach = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.6, 12), coachMat);
      coach.position.set(1.4, 0.8, -0.4);
      this.secondaryModel.add(coach);
    } else if (this.chapter.id === 2) {
      // Memory / Father Prem Kohli Golden Silhouette
      const fatherMat = new THREE.MeshBasicMaterial({ color: 0xFCD34D, transparent: true, opacity: 0.45 });
      const father = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.7, 12), fatherMat);
      father.position.set(0, 1.8, -3.5);
      this.secondaryModel.add(father);
    } else if (this.chapter.id === 4) {
      // Sachin Tendulkar on shoulders
      const sachinMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B });
      const sachin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.24), sachinMat);
      sachin.position.set(0, 2.2, 0.1);
      this.secondaryModel.add(sachin);
    } else if (this.chapter.id === 9) {
      // Haris Rauf Bowler at top of mark
      const bowlerMat = new THREE.MeshStandardMaterial({ color: 0x16A34A });
      const bowler = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.75, 12), bowlerMat);
      bowler.position.set(-0.2, 0.87, 8);
      this.secondaryModel.add(bowler);
    }

    this.scene.add(this.secondaryModel);
  }

  buildCinematicParticles() {
    const isRain = (this.chapter.id === 3);
    const particleCount = isRain ? 200 : 100;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    this.particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      this.particleSpeeds.push({
        y: isRain ? (0.15 + Math.random() * 0.1) : (0.01 + Math.random() * 0.02),
        x: (Math.random() - 0.5) * 0.01
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: isRain ? 0x7DD3FC : 0xFCD34D,
      size: isRain ? 0.08 : 0.14,
      transparent: true,
      opacity: 0.8,
      blending: isRain ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  setupResize() {
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
    this.time += 0.012;

    // Cinematic Camera Sweeps tailored to chapter mood and scene phases
    const phaseTime = (this.time % 15);
    
    if (phaseTime < 5) {
      // Phase 1: Dramatic Stadium Environment Sweep
      const rad = 7.5;
      this.camera.position.x = Math.sin(this.time * 0.4) * rad;
      this.camera.position.z = Math.cos(this.time * 0.4) * rad;
      this.camera.position.y = 2.8 + Math.sin(this.time * 0.3) * 0.5;
      this.camera.lookAt(0, 1.2, 0);
    } else if (phaseTime < 10) {
      // Phase 2: Close-up Character Facial & Stance Shot
      this.camera.position.x = 0.8 + Math.sin(this.time * 0.2) * 0.3;
      this.camera.position.z = 2.4 + Math.cos(this.time * 0.2) * 0.2;
      this.camera.position.y = 1.62;
      this.camera.lookAt(0, 1.55, 0);

      if (this.viratHead) {
        this.viratHead.rotation.y = Math.sin(this.time * 0.5) * 0.15;
      }
    } else {
      // Phase 3: Action Stroke Preview / Cinematic Pitch Tracking
      const rad = 4.8;
      this.camera.position.x = -Math.sin(this.time * 0.6) * rad;
      this.camera.position.z = Math.cos(this.time * 0.6) * rad;
      this.camera.position.y = 1.5 + Math.sin(this.time * 0.5) * 0.3;
      this.camera.lookAt(0, 1.3, 0);

      if (this.viratBat) {
        this.viratBat.rotation.x = -Math.PI / 4 + Math.sin(this.time * 2.2) * 0.5;
        this.viratBat.rotation.y = Math.sin(this.time * 1.5) * 0.3;
      }
    }

    // Particle motion
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const isRain = (this.chapter.id === 3);

      for (let i = 0; i < this.particleSpeeds.length; i++) {
        if (isRain) {
          positions[i * 3 + 1] -= this.particleSpeeds[i].y;
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 10;
          }
        } else {
          positions[i * 3 + 1] += this.particleSpeeds[i].y;
          if (positions[i * 3 + 1] > 10) {
            positions[i * 3 + 1] = 0;
          }
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

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
