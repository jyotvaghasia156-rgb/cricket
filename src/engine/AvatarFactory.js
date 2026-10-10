import * as THREE from 'three';

export class AvatarFactory {
  // Create detailed Virat Kohli 3D Model with realistic facial features, hair, beard, and kit
  static createViratModel(eraKey = 'prime') {
    const group = new THREE.Group();
    group.position.set(0.2, 0, -9.2);

    // Skin tones and materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xC68B59, roughness: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0F0E0D });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const eyeGlareMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const lipMat = new THREE.MeshStandardMaterial({ color: 0x9E5A44, roughness: 0.6 });

    const hairColor = (eraKey === 'legend') ? 0x2A2421 : (eraKey === 'teen' ? 0x1F1A17 : 0x120C0A);
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.75 });
    const beardColor = (eraKey === 'legend') ? 0x241F1C : 0x120D0B;
    const beardMat = new THREE.MeshStandardMaterial({ color: beardColor, roughness: 0.9 });

    // Kit colors based on era
    const jerseyColors = {
      teen: 0xF8FAFC,   // Ranji / Academy Whites
      young: 0x0284C7,  // Classic Sahara Blue
      prime: 0x1E3A8A,  // Star Deep Navy
      legend: 0x1D4ED8  // Modern Royal Blue
    };
    const jerseyMat = new THREE.MeshStandardMaterial({
      color: jerseyColors[eraKey] || 0x1E3A8A,
      roughness: 0.45
    });
    const padsMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.5 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.25, metalness: 0.4 });
    const batWillowMat = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.4 });
    const batStickerMat = new THREE.MeshStandardMaterial({ color: 0xDC2626 }); // MRF Red

    // 1. Legs with Pads
    const legs = new THREE.Group();
    [-0.18, 0.18].forEach(x => {
      const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45, 12), jerseyMat);
      upperLeg.position.set(x, 0.65, 0);
      upperLeg.castShadow = true;
      legs.add(upperLeg);

      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.52, 0.16), padsMat);
      pad.position.set(x, 0.28, 0.02);
      pad.castShadow = true;
      legs.add(pad);
    });
    group.add(legs);

    // 2. Torso with #18 Jersey
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.56, 0.26), jerseyMat);
    torso.position.set(0, 1.15, 0);
    torso.castShadow = true;
    group.add(torso);
    group.userData.torso = torso;

    const no18 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.18),
      new THREE.MeshBasicMaterial({ color: 0xF59E0B })
    );
    no18.position.set(0, 1.18, -0.14);
    no18.rotation.y = Math.PI;
    group.add(no18);

    // 3. Detailed Head & Facial Features
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.58, 0);

    // Head Base Mesh (With jaw & chin definition)
    const headGeo = new THREE.SphereGeometry(0.135, 24, 24);
    headGeo.scale(1, 1.15, 0.96);
    const face = new THREE.Mesh(headGeo, skinMat);
    face.castShadow = true;
    headGroup.add(face);

    // Ears
    [-0.135, 0.135].forEach(x => {
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.009, 8, 12), skinMat);
      ear.position.set(x, 0.01, 0.01);
      ear.rotation.y = Math.PI / 2;
      headGroup.add(ear);
    });

    // Nose Bridge & Tip
    const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.03), skinMat);
    noseBridge.position.set(0, 0.01, 0.13);
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.035, 8), skinMat);
    noseTip.rotation.x = Math.PI / 2;
    noseTip.position.set(0, -0.018, 0.142);
    headGroup.add(noseTip);

    // Eyes (White, Iris pupil, and Glare Highlight for realistic expression)
    [-0.046, 0.046].forEach(x => {
      const eyeWhite = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.014, 0.01), eyeWhiteMat);
      eyeWhite.position.set(x, 0.02, 0.126);
      headGroup.add(eyeWhite);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 10, 10), eyeMat);
      pupil.position.set(x, 0.02, 0.131);
      headGroup.add(pupil);

      const glare = new THREE.Mesh(new THREE.SphereGeometry(0.002, 6, 6), eyeGlareMat);
      glare.position.set(x + 0.002, 0.023, 0.136);
      headGroup.add(glare);

      // Intense Kohli Eyebrow
      const eyebrow = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.009, 0.012), hairMat);
      eyebrow.position.set(x, 0.039, 0.129);
      eyebrow.rotation.z = (x < 0 ? -0.12 : 0.12);
      headGroup.add(eyebrow);
    });

    // Lips & Mouth Line
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.012, 0.01), lipMat);
    mouth.position.set(0, -0.042, 0.13);
    headGroup.add(mouth);

    // Signature Kohli Beard / Stubble
    if (eraKey !== 'teen') {
      const beardGeo = new THREE.SphereGeometry(0.137, 20, 20);
      beardGeo.scale(1.015, 0.78, 1.02);
      const beard = new THREE.Mesh(beardGeo, beardMat);
      beard.position.set(0, -0.042, 0.012);
      headGroup.add(beard);

      // Mustache Bar
      const stache = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.015), beardMat);
      stache.position.set(0, -0.03, 0.133);
      headGroup.add(stache);
    }

    // Sculpted Kohli Hairstyle (Side Fade + Textured Top)
    const hairTopGeo = new THREE.SphereGeometry(0.139, 18, 18);
    hairTopGeo.scale(1.02, 0.55, 1.02);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.082, -0.01);
    headGroup.add(hairTop);

    // Modern Helmet with Thin Wire Open Grille Visor (Face Remains 100% Visible!)
    const helmetShell = new THREE.Mesh(new THREE.SphereGeometry(0.152, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65), helmetMat);
    helmetShell.position.set(0, 0.04, -0.02);
    headGroup.add(helmetShell);

    // Thin Steel Wire Open Grille (Does NOT hide eyes/face)
    const grilleArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.125, 0.007, 8, 20, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95, roughness: 0.1 })
    );
    grilleArch.rotation.x = Math.PI / 2;
    grilleArch.position.set(0, -0.045, 0.105);
    headGroup.add(grilleArch);

    const grilleBarLow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.22, 6),
      new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95 })
    );
    grilleBarLow.rotation.z = Math.PI / 2;
    grilleBarLow.position.set(0, -0.055, 0.12);
    headGroup.add(grilleBarLow);

    group.add(headGroup);
    group.userData.head = headGroup;

    // 4. Arms & Bat Rigging
    [-0.25, 0.25].forEach(x => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.38, 10), jerseyMat);
      arm.position.set(x, 1.16, 0.05);
      arm.castShadow = true;
      group.add(arm);
    });

    const batGroup = new THREE.Group();
    batGroup.position.set(-0.15, 0.7, 0.2);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.62, 0.04), batWillowMat);
    blade.position.y = -0.15;
    blade.castShadow = true;
    batGroup.add(blade);

    const sticker = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.2), batStickerMat);
    sticker.position.set(0, -0.08, 0.022);
    batGroup.add(sticker);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.28, 10), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    handle.position.y = 0.24;
    batGroup.add(handle);

    group.add(batGroup);
    group.userData.batGroup = batGroup;

    group.rotation.y = -Math.PI / 2.3;
    return group;
  }

  // Create Opponent Bowlers with Unique Authentic Facial Models
  static createBowlerModel(bowlerName = 'Haris Rauf') {
    const group = new THREE.Group();
    group.position.set(-0.4, 0, 18);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xC68B59, roughness: 0.55 });
    
    // Kit color based on bowler/team
    let kitColor = 0x047857; // Default Green (Pak)
    if (bowlerName.includes('Johnson') || bowlerName.includes('Starc')) kitColor = 0xF59E0B; // Aus Gold
    if (bowlerName.includes('Anderson') || bowlerName.includes('Broad')) kitColor = 0x0284C7; // Eng Blue
    if (bowlerName.includes('Malinga')) kitColor = 0x1D4ED8; // SL Blue

    const jerseyMat = new THREE.MeshStandardMaterial({ color: kitColor, roughness: 0.45 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.24), jerseyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    group.add(body);

    // Head & Face
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.6, 0);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.132, 20, 20), skinMat);
    face.castShadow = true;
    headGroup.add(face);

    // Nose & Eyes
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.04, 8), skinMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0, 0.135);
    headGroup.add(nose);

    [-0.042, 0.042].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1E1B18 }));
      eye.position.set(x, 0.02, 0.125);
      headGroup.add(eye);
    });

    // Custom Facial Details per Bowler
    if (bowlerName.includes('Malinga')) {
      // Blonde curly hair ringlets
      const hairMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.85 });
      const curls = new THREE.Mesh(new THREE.TorusGeometry(0.138, 0.038, 8, 16), hairMat);
      curls.position.set(0, 0.05, 0);
      headGroup.add(curls);

      // Gold chain necklace
      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 6, 16), new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.9 }));
      chain.rotation.x = Math.PI / 2.5;
      chain.position.set(0, -0.12, 0.02);
      headGroup.add(chain);
    } else if (bowlerName.includes('Johnson')) {
      // Iconic Mitchell Johnson Handlebar Mustache & Aggressive Brow
      const stacheMat = new THREE.MeshStandardMaterial({ color: 0x1F1915, roughness: 0.9 });
      const stache = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), stacheMat);
      stache.rotation.z = Math.PI;
      stache.position.set(0, -0.032, 0.132);
      headGroup.add(stache);

      const hairMat = new THREE.MeshStandardMaterial({ color: 0x1F1915, roughness: 0.8 });
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.136, 16, 16), hairMat);
      hair.position.set(0, 0.06, -0.01);
      headGroup.add(hair);
    } else {
      // Standard Bowler Hairstyle & Beard
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.8 });
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.136, 16, 16), hairMat);
      hair.position.set(0, 0.06, -0.01);
      headGroup.add(hair);
    }

    group.add(headGroup);

    // Bowling Arm
    const bowlingArm = new THREE.Group();
    bowlingArm.position.set(0.24, 1.35, 0);
    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.42, 8), jerseyMat);
    armMesh.position.y = -0.18;
    bowlingArm.add(armMesh);
    group.add(bowlingArm);
    group.userData.bowlingArm = bowlingArm;

    return group;
  }
}
