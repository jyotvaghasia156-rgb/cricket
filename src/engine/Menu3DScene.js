import * as THREE from 'three';
import { AvatarFactory } from './AvatarFactory';

export class Menu3DScene {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = (containerElement && containerElement.clientWidth > 0) ? containerElement.clientWidth : (window.innerWidth || 1920);
    this.height = (containerElement && containerElement.clientHeight > 0) ? containerElement.clientHeight : (window.innerHeight || 1080);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationFrameId = null;
    this.isFallback = false;

    this.batsman = null;
    this.eraKey = 'prime';
    this.orbitAngle = 0;

    try {
      this.init();
      this.setupResize();
      this.animate();
    } catch (err) {
      console.warn('Menu3DScene initialization fell back to static background:', err);
      this.isFallback = true;
    }
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040814);
    this.scene.fog = new THREE.FogExp2(0x060D20, 0.015);

    const aspect = (this.width > 0 && this.height > 0) ? (this.width / this.height) : (16 / 9);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.camera.position.set(0, 2.2, 5.5);
    this.camera.lookAt(0, 1.2, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x2A3B5C, 1.2);

    this.scene.add(ambientLight);

    // Golden Rim light (hero backlight)
    const rimLight = new THREE.DirectionalLight(0xF59E0B, 2.5);
    rimLight.position.set(-4, 6, -3);
    this.scene.add(rimLight);

    // Cyan Front Fill light
    const frontLight = new THREE.DirectionalLight(0x38BDF8, 2.2);
    frontLight.position.set(4, 5, 4);
    this.scene.add(frontLight);

    // Floodlight Spotlights
    const spotTop = new THREE.SpotLight(0xFFFFFF, 3.5, 30, Math.PI / 4, 0.3, 1);
    spotTop.position.set(0, 12, 2);
    spotTop.target.position.set(0, 1, 0);
    spotTop.castShadow = true;
    this.scene.add(spotTop);
    this.scene.add(spotTop.target);

    this.buildPitchAndStadiumGround();
    this.buildViratModel();
    this.buildFloatingEmbers();
  }

  buildPitchAndStadiumGround() {
    // Pitch Strip
    const pitchGeo = new THREE.PlaneGeometry(3.2, 12);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: 0xB8935D,
      roughness: 0.9,
      metalness: 0.05
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.set(0, 0, 0);
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // Surrounding Circular Grass
    const grassGeo = new THREE.CircleGeometry(35, 48);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x14532D,
      roughness: 0.85
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.01;
    grass.receiveShadow = true;
    this.scene.add(grass);

    // Striker Stumps
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0xE2C59A, roughness: 0.4 });
    const stumpGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.72, 8);
    [-0.11, 0, 0.11].forEach(x => {
      const s = new THREE.Mesh(stumpGeo, stumpMat);
      s.position.set(x, 0.36, -1.8);
      s.castShadow = true;
      this.scene.add(s);
    });

    // Bails on top
    const bailGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 6);
    const bailMat = new THREE.MeshStandardMaterial({ color: 0xFCD34D });
    [-0.055, 0.055].forEach(x => {
      const b = new THREE.Mesh(bailGeo, bailMat);
      b.rotation.z = Math.PI / 2;
      b.position.set(x, 0.73, -1.8);
      this.scene.add(b);
    });
  }

  buildViratModel() {
    this.batsman = AvatarFactory.createViratModel(this.eraKey || 'prime');
    this.batsman.position.set(0.25, 0, 0);
    this.batGroup = this.batsman.userData.batGroup;
    this.jerseyTorso = this.batsman.userData.torso;
    this.batsman.rotation.y = -Math.PI / 3;
    this.scene.add(this.batsman);
  }

  buildFloatingEmbers() {
    const emberCount = 80;
    const emberGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(emberCount * 3);
    this.emberSpeeds = [];

    for (let i = 0; i < emberCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      this.emberSpeeds.push({
        y: 0.01 + Math.random() * 0.02,
        x: (Math.random() - 0.5) * 0.01
      });
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xFCD34D,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.embers = new THREE.Points(emberGeo, emberMat);
    this.scene.add(this.embers);
  }

  setEra(eraKey) {
    this.eraKey = eraKey;
    if (!this.jerseyMat) return;
    const colors = {
      teen: 0xF8FAFC,   // Ranji Whites
      young: 0x0284C7,  // Classic Sahara Blue
      prime: 0x1E3A8A,  // Star Deep Navy
      legend: 0x1D4ED8  // Modern Royal Blue
    };
    this.jerseyMat.color.setHex(colors[eraKey] || 0x1E3A8A);
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
    if (this.isFallback || !this.renderer || !this.scene || !this.camera) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    // Cinematic slow orbit around Virat Kohli
    this.orbitAngle += 0.0035;
    const radius = 5.2;
    this.camera.position.x = Math.sin(this.orbitAngle) * 2.2;

    this.camera.position.z = radius + Math.cos(this.orbitAngle) * 0.6;
    this.camera.position.y = 1.9 + Math.sin(this.orbitAngle * 1.5) * 0.2;
    this.camera.lookAt(0, 1.25, 0);

    // Subtle breathing / bat tap animation
    if (this.batGroup) {
      this.batGroup.rotation.x = Math.sin(Date.now() * 0.004) * 0.08;
    }

    // Floating embers rising upwards
    if (this.embers) {
      const positions = this.embers.geometry.attributes.position.array;
      for (let i = 0; i < this.emberSpeeds.length; i++) {
        positions[i * 3 + 1] += this.emberSpeeds[i].y;
        positions[i * 3] += this.emberSpeeds[i].x;
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 14;
        }
      }
      this.embers.geometry.attributes.position.needsUpdate = true;
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
