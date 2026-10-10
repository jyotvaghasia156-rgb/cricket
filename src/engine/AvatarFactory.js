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
  // Create Realistic Human Face Group
  static createHumanFaceGroup({
    skinColor = 0xC68B59,
    eyeColor = 0x1E1B18,
    hairColor = 0x1A1412,
    hasBeard = false,
    hasMustache = false,
    hairStyle = 'short', // 'short', 'fade', 'curls', 'bald'
    hasHelmet = true,
    capColor = 0x0F172A
  } = {}) {
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.58, 0);

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55 });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
    const pupilMat = new THREE.MeshBasicMaterial({ color: eyeColor });
    const glareMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.85 });
    const lipMat = new THREE.MeshStandardMaterial({ color: 0x9E5A44, roughness: 0.65 });

    // 1. Realistic Cranium & Jawline
    const headGeo = new THREE.SphereGeometry(0.135, 24, 24);
    headGeo.scale(1, 1.15, 0.98);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // 2. Ears
    [-0.136, 0.136].forEach(x => {
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 8, 12), skinMat);
      ear.position.set(x, 0.01, 0.01);
      ear.rotation.y = Math.PI / 2;
      headGroup.add(ear);
    });

    // 3. Realistic 3D Nose with Bridge & Nostrils
    const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.058, 0.032), skinMat);
    noseBridge.position.set(0, 0.01, 0.132);
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.032, 8), skinMat);
    noseTip.rotation.x = Math.PI / 2;
    noseTip.position.set(0, -0.018, 0.144);
    headGroup.add(noseTip);

    // 4. Detailed Human Eyes (Sclera white, iris, pupil glare, 3D eyebrows)
    [-0.045, 0.045].forEach(x => {
      const eyeWhite = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.013, 0.01), eyeWhiteMat);
      eyeWhite.position.set(x, 0.022, 0.128);
      headGroup.add(eyeWhite);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), pupilMat);
      pupil.position.set(x, 0.022, 0.133);
      headGroup.add(pupil);

      const glare = new THREE.Mesh(new THREE.SphereGeometry(0.002, 6, 6), glareMat);
      glare.position.set(x + 0.002, 0.025, 0.138);
      headGroup.add(glare);

      // Brow Ridge / Eyebrow
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.008, 0.012), hairMat);
      brow.position.set(x, 0.04, 0.131);
      brow.rotation.z = (x < 0 ? -0.1 : 0.1);
      headGroup.add(brow);
    });

    // 5. Mouth & Lips
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.01), lipMat);
    mouth.position.set(0, -0.044, 0.13);
    headGroup.add(mouth);

    // 6. Facial Hair (Beard / Mustache / Goatee)
    if (hasBeard) {
      const beardGeo = new THREE.SphereGeometry(0.136, 16, 16);
      beardGeo.scale(1.015, 0.78, 1.02);
      const beard = new THREE.Mesh(beardGeo, hairMat);
      beard.position.set(0, -0.042, 0.012);
      headGroup.add(beard);
    }
    if (hasMustache || hasBeard) {
      const stache = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.012, 0.015), hairMat);
      stache.position.set(0, -0.03, 0.133);
      headGroup.add(stache);
    }

    // 7. Hair
    if (hairStyle !== 'bald') {
      const hairGeo = new THREE.SphereGeometry(0.138, 18, 18);
      hairGeo.scale(1.02, 0.58, 1.02);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 0.075, -0.01);
      headGroup.add(hair);
    }

    // 8. Open Grille Helmet or Cap (Face remains completely visible)
    if (hasHelmet) {
      const helmetMat = new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.35, metalness: 0.2 });
      const helmetShell = new THREE.Mesh(
        new THREE.SphereGeometry(0.152, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.62),
        helmetMat
      );
      helmetShell.position.set(0, 0.04, -0.02);
      headGroup.add(helmetShell);

      // Open steel grille visor (Eyes and face are clearly visible through the thin grille)
      const grille = new THREE.Mesh(
        new THREE.TorusGeometry(0.125, 0.006, 6, 18, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.95 })
      );
      grille.rotation.x = Math.PI / 2;
      grille.position.set(0, -0.042, 0.105);
      headGroup.add(grille);
    } else {
      // Cricket Cap with peak
      const capMat = new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.6 });
      const capTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.142, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        capMat
      );
      capTop.position.set(0, 0.06, -0.01);
      headGroup.add(capTop);

      const capPeak = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.012, 0.08), capMat);
      capPeak.position.set(0, 0.06, 0.14);
      headGroup.add(capPeak);
    }

    return headGroup;
  }

  // Create Opponent Bowlers with Unique Authentic Human Facial Models
  static createBowlerModel(bowlerName = 'Haris Rauf', kitColor = 0x047857) {
    const group = new THREE.Group();
    group.position.set(-0.4, 0, 18);

    if (bowlerName.includes('Johnson') || bowlerName.includes('Starc') || bowlerName.includes('Cummins')) kitColor = 0xF59E0B;
    if (bowlerName.includes('Anderson') || bowlerName.includes('Broad') || bowlerName.includes('Archer')) kitColor = 0x0284C7;
    if (bowlerName.includes('Malinga')) kitColor = 0x1D4ED8;

    const jerseyMat = new THREE.MeshStandardMaterial({ color: kitColor, roughness: 0.45 });

    // Lower Body / Legs
    [-0.14, 0.14].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.65, 10), jerseyMat);
      leg.position.set(x, 0.35, 0);
      leg.castShadow = true;
      group.add(leg);
    });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.24), jerseyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    group.add(body);

    // Detailed Human Face
    const isBlonde = bowlerName.includes('Starc') || bowlerName.includes('Johnson') || bowlerName.includes('Anderson');
    const headGroup = AvatarFactory.createHumanFaceGroup({
      skinColor: isBlonde ? 0xE8BA99 : 0xC68B59,
      eyeColor: isBlonde ? 0x2563EB : 0x1E1B18,
      hairColor: bowlerName.includes('Malinga') ? 0xD97706 : (isBlonde ? 0x92663A : 0x1A1412),
      hasBeard: !bowlerName.includes('Malinga'),
      hasMustache: bowlerName.includes('Johnson') || bowlerName.includes('Rauf'),
      hasHelmet: false,
      capColor: kitColor
    });
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

  // Create High-Fidelity Human Fielder
  static createFielderModel(jerseyColor = 0x047857, fielderIndex = 0) {
    const group = new THREE.Group();
    const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.5 });

    // Body & Legs
    [-0.12, 0.12].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.62, 8), jerseyMat);
      leg.position.set(x, 0.32, 0);
      leg.castShadow = true;
      group.add(leg);
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.56, 0.22), jerseyMat);
    body.position.y = 1.12;
    body.castShadow = true;
    group.add(body);

    // Human Head with Cap
    const headGroup = AvatarFactory.createHumanFaceGroup({
      skinColor: (fielderIndex % 2 === 0) ? 0xC68B59 : 0xD29A6E,
      eyeColor: 0x1E1B18,
      hairColor: 0x1A1412,
      hasBeard: (fielderIndex % 3 === 0),
      hasMustache: (fielderIndex % 2 === 0),
      hasHelmet: false,
      capColor: jerseyColor
    });
    group.add(headGroup);

    return group;
  }

  // Create Realistic Non-Striker Partner
  static createNonStrikerModel(partnerName = 'Rohit Sharma', jerseyColor = 0x1E3A8A) {
    const group = new THREE.Group();
    group.position.set(-0.4, 0, 9.2);

    const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.45 });
    const padsMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.5 });

    // Legs with Pads
    [-0.16, 0.16].forEach(x => {
      const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 10), jerseyMat);
      upperLeg.position.set(x, 0.64, 0);
      group.add(upperLeg);

      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.5, 0.15), padsMat);
      pad.position.set(x, 0.27, 0.02);
      pad.castShadow = true;
      group.add(pad);
    });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.58, 0.26), jerseyMat);
    torso.position.set(0, 1.15, 0);
    torso.castShadow = true;
    group.add(torso);

    // Realistic Human Face for Partner
    const headGroup = AvatarFactory.createHumanFaceGroup({
      skinColor: 0xC68B59,
      eyeColor: 0x1E1B18,
      hairColor: 0x15100E,
      hasBeard: true,
      hasMustache: true,
      hasHelmet: true,
      capColor: 0x0F172A
    });
    group.add(headGroup);

    // Bat held at non-striker crease
    const batGroup = new THREE.Group();
    batGroup.position.set(0.2, 0.4, 0.1);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.58, 0.038), new THREE.MeshStandardMaterial({ color: 0xDEB887 }));
    batGroup.add(blade);
    group.add(batGroup);

    group.rotation.y = Math.PI / 2.3;
    return group;
  }
}
