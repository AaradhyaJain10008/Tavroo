// app.js - TAVROO Interactive 3D WebGL Runway Atelier Engine
// Restored Classic Runway Mannequin Figure, Precision Garment Fitting & Responsive Mobile Architecture

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. STATE & DOM REFERENCES
    // -------------------------------------------------------------
    const container = document.getElementById('webgl-canvas-container');
    const regionLabel = document.getElementById('region-label');
    const genderSelect = document.getElementById('gender-select');
    const genderBadge = document.getElementById('gender-badge');
    const ethnicitySelect = document.getElementById('ethnicity-preset');
    const ethnicityBadge = document.getElementById('ethnicity-badge');
    const hairStyleSelect = document.getElementById('hair-style');
    const hairBadge = document.getElementById('hair-badge');
    const hairColorInput = document.getElementById('hair-color');
    const hairColorName = document.getElementById('hair-color-name');
    const sleeveSelect = document.getElementById('sleeve-select');
    const sleeveBadge = document.getElementById('sleeve-badge');
    const skinPicker = document.querySelectorAll('#skin-picker .swatch');
    const bodyTypeSelect = document.getElementById('body-type');
    const heightSlider = document.getElementById('height-slider');

    // Studio Toolbar Controls
    const lightBtns = document.querySelectorAll('.mode-btn');
    const autoRotateBtn = document.getElementById('btn-autorotate');
    const autoRotateText = document.getElementById('autorotate-text');
    const resetCamBtn = document.getElementById('btn-reset-cam');

    // Right Column View Controls
    const initialMessage = document.getElementById('initial-message');
    const apparelListView = document.getElementById('apparel-list-view');
    const customizationView = document.getElementById('customization-view');
    const apparelListTitle = document.getElementById('apparel-list-title');
    const apparelGrid = document.getElementById('apparel-grid');
    const selectedItemName = document.getElementById('selected-item-name');
    const backToListBtn = document.getElementById('back-to-list');
    const removeGarmentBtn = document.getElementById('remove-garment-btn');

    // Customization Toolkit Controls
    const customTextInput = document.getElementById('custom-text');
    const toggleStudsInput = document.getElementById('toggle-studs');
    const tieDyeColorInput = document.getElementById('tie-dye-color');
    const colorHexLabel = document.getElementById('color-hex-label');
    const openCreativityBtn = document.getElementById('open-creativity-btn');

    let activeRegion = null;
    let selectedGarments = { head: null, torso: null, legs: null };
    let currentGender = 'female';
    let currentSkinTone = '#f3c299';
    let currentHairColor = '#3a2212';
    let currentSleeveMode = 'short';
    let currentBodyType = 'athletic';
    let currentHeightScale = 1.0;

    // -------------------------------------------------------------
    // 2. APPAREL DATA DEFINITIONS (FOOTWEAR EXCLUDED)
    // -------------------------------------------------------------
    const apparelData = {
        head: [
            { id: 'h1', name: 'Cyber Snapback Cap', icon: '🧢', defaultColor: '#00f0ff', type: 'snapback' },
            { id: 'h2', name: 'Acid Beanie', icon: '🎩', defaultColor: '#ff007f', type: 'beanie' },
            { id: 'h3', name: 'Tactical Bucket Hat', icon: '🪖', defaultColor: '#2d3a2d', type: 'bucket' },
            { id: 'h4', name: 'Vintage Beret', icon: '🎓', defaultColor: '#7928ca', type: 'beret' },
            { id: 'h5', name: 'Streetwear Balaclava', icon: '🥷', defaultColor: '#1b1b24', type: 'balaclava' }
        ],
        torso: [
            { id: 't1', name: 'Deconstructed Graphic Tee', icon: '👕', defaultColor: '#141318', type: 'tee' },
            { id: 't2', name: 'Hyper-Object Hoodie', icon: '🧥', defaultColor: '#6b21a8', type: 'hoodie' },
            { id: 't3', name: 'Acid-Wash Biker Vest', icon: '🎽', defaultColor: '#22222d', type: 'vest' },
            { id: 't4', name: 'Oversized Denim Jacket', icon: '👔', defaultColor: '#2c4d75', type: 'jacket' },
            { id: 't5', name: 'Techwear Zip Sweater', icon: '🥼', defaultColor: '#111827', type: 'sweater' }
        ],
        legs: [
            { id: 'l1', name: 'Modular Cargo Trousers', icon: '👖', defaultColor: '#323542', type: 'cargo' },
            { id: 'l2', name: 'Distressed Selvedge Jeans', icon: '👖', defaultColor: '#1e3860', type: 'jeans' },
            { id: 'l3', name: 'Cyberpunk Shorts', icon: '🩳', defaultColor: '#14131c', type: 'shorts' },
            { id: 'l4', name: 'Flare Track Pants', icon: '👖', defaultColor: '#121118', type: 'track' },
            { id: 'l5', name: 'Utility Joggers', icon: '👖', defaultColor: '#3e4233', type: 'joggers' }
        ]
    };

    // Ethnicity Presets
    const ethnicityPresets = {
        'default': { name: 'Global Standard', tone: '#f3c299', eyeColor: '#3a2212', hairColor: '#3a2212' },
        'south-asian': { name: 'South Asian', tone: '#e0ac69', eyeColor: '#1c0e07', hairColor: '#140a05' },
        'east-asian': { name: 'East Asian', tone: '#ffe3cf', eyeColor: '#1b1008', hairColor: '#0d0603' },
        'african': { name: 'Afro-Descendant', tone: '#5c351b', eyeColor: '#120703', hairColor: '#050201' },
        'caucasian': { name: 'European', tone: '#ffebd4', eyeColor: '#2b5c8f', hairColor: '#7a5230' }
    };

    // -------------------------------------------------------------
    // 3. THREE.JS 3D SCENE & ENGINE SETUP
    // -------------------------------------------------------------
    if (!container || typeof THREE === 'undefined') {
        console.error('Three.js or Canvas Container missing.');
        return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.055);

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.25, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Orbit Controls with full touch and mobile gesture support
    let controls = null;
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1.12, 0);
        controls.minDistance = 1.4;
        controls.maxDistance = 5.5;
        controls.maxPolarAngle = Math.PI / 2 + 0.05;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.2;
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
    }

    // -------------------------------------------------------------
    // 4. STUDIO LIGHTING & PBR ENVIRONMENT
    // -------------------------------------------------------------
    const studioLightsGroup = new THREE.Group();
    scene.add(studioLightsGroup);

    const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x181028, 0.95);
    studioLightsGroup.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.45);
    keyLight.position.set(2.4, 4.2, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    studioLightsGroup.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb8c5e0, 0.85);
    fillLight.position.set(-2.8, 2.2, 2.0);
    studioLightsGroup.add(fillLight);

    const rimLight1 = new THREE.SpotLight(0xd4af37, 2.0, 12, Math.PI / 4, 0.45);
    rimLight1.position.set(-2.2, 3.4, -2.6);
    rimLight1.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight1);
    studioLightsGroup.add(rimLight1.target);

    const rimLight2 = new THREE.SpotLight(0xffeedd, 1.8, 12, Math.PI / 4, 0.45);
    rimLight2.position.set(2.2, 3.4, -2.6);
    rimLight2.target.position.set(0, 1.2, 0);
    studioLightsGroup.add(rimLight2);
    studioLightsGroup.add(rimLight2.target);

    // Studio Stage Floor
    const floorGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 64);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0e0e14,
        roughness: 0.32,
        metalness: 0.75
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing Stage Rim
    const ringGeo = new THREE.RingGeometry(1.72, 1.76, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    function setLightingMode(mode) {
        if (mode === 'atelier') {
            hemiLight.color.setHex(0xfff6ea);
            hemiLight.groundColor.setHex(0x181028);
            hemiLight.intensity = 0.95;
            keyLight.color.setHex(0xfffaed);
            keyLight.intensity = 1.45;
            fillLight.color.setHex(0xb8c5e0);
            fillLight.intensity = 0.85;
            rimLight1.color.setHex(0xd4af37);
            rimLight2.color.setHex(0xffeedd);
            ringMat.color.setHex(0xd4af37);
        } else if (mode === 'cyber') {
            hemiLight.color.setHex(0x140d24);
            hemiLight.groundColor.setHex(0x05040a);
            hemiLight.intensity = 0.6;
            keyLight.color.setHex(0x00f0ff);
            keyLight.intensity = 1.4;
            fillLight.color.setHex(0x7928ca);
            fillLight.intensity = 1.2;
            rimLight1.color.setHex(0x00f0ff);
            rimLight2.color.setHex(0xff007f);
            ringMat.color.setHex(0x00f0ff);
        } else if (mode === 'editorial') {
            hemiLight.color.setHex(0xffffff);
            hemiLight.groundColor.setHex(0x222222);
            hemiLight.intensity = 1.0;
            keyLight.color.setHex(0xffffff);
            keyLight.intensity = 1.6;
            fillLight.color.setHex(0xd8d8df);
            fillLight.intensity = 0.7;
            rimLight1.color.setHex(0xffffff);
            rimLight2.color.setHex(0xaaaaaa);
            ringMat.color.setHex(0xffffff);
        }
    }

    lightBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lightBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLightingMode(btn.getAttribute('data-light'));
        });
    });

    // -------------------------------------------------------------
    // 5. PBR MATERIALS & HUMAN ANATOMY SCULPTING (RESTORED FIGURE)
    // -------------------------------------------------------------
    const mannequinRoot = new THREE.Group();
    scene.add(mannequinRoot);

    // Realistic PBR Skin Material with clearcoat sheen
    const skinMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(currentSkinTone),
        roughness: 0.44,
        metalness: 0.05,
        clearcoat: 0.25,
        clearcoatRoughness: 0.35,
        reflectivity: 0.45
    });

    // Anatomical facial feature materials
    const lipsMaterial = new THREE.MeshStandardMaterial({
        color: 0xba6468,
        roughness: 0.38,
        metalness: 0.05
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f6fa,
        roughness: 0.2,
        metalness: 0.02
    });

    const eyeIrisMaterial = new THREE.MeshStandardMaterial({
        color: 0x24160d,
        roughness: 0.15,
        metalness: 0.1
    });

    const eyePupilMaterial = new THREE.MeshBasicMaterial({
        color: 0x050404
    });

    // High-specular cornea reflection
    const eyeCorneaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });

    // Base Bodysuit Material
    const baseUnderwearMat = new THREE.MeshStandardMaterial({
        color: 0x120e1a,
        roughness: 0.55,
        metalness: 0.2
    });

    // Hair Material
    const hairMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(currentHairColor),
        roughness: 0.45,
        metalness: 0.22
    });

    // Body groups
    const headGroup = new THREE.Group();
    headGroup.userData = { region: 'head' };
    const torsoGroup = new THREE.Group();
    torsoGroup.userData = { region: 'torso' };
    const legsGroup = new THREE.Group();
    legsGroup.userData = { region: 'legs' };

    mannequinRoot.add(headGroup);
    mannequinRoot.add(torsoGroup);
    mannequinRoot.add(legsGroup);

    const interactiveMeshes = [];

    function addPartMesh(geo, mat, parent, regionTag) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { region: regionTag };
        parent.add(mesh);
        interactiveMeshes.push(mesh);
        return mesh;
    }

    // --- A. HEAD & HUMAN FACE SCULPTING ---
    // Oval Cranium
    const headCranium = addPartMesh(new THREE.SphereGeometry(0.125, 32, 28), skinMaterial, headGroup, 'head');
    headCranium.position.set(0, 1.83, 0);
    headCranium.scale.set(0.96, 1.16, 1.02);

    // Anatomical Jaw & Chin
    const jawMesh = addPartMesh(new THREE.CylinderGeometry(0.108, 0.062, 0.13, 24), skinMaterial, headGroup, 'head');
    jawMesh.position.set(0, 1.73, 0.02);
    jawMesh.scale.set(0.92, 1.0, 0.90);

    // Chin Apex
    const chinTip = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 14), skinMaterial);
    chinTip.position.set(0, 1.68, 0.06);
    chinTip.scale.set(1.0, 0.8, 1.1);
    headGroup.add(chinTip);

    // Refined Neck with Collarbone Transition
    const neckMesh = addPartMesh(new THREE.CylinderGeometry(0.054, 0.070, 0.16, 24), skinMaterial, headGroup, 'head');
    neckMesh.position.set(0, 1.64, -0.01);

    // 1. Nose Bridge, Cartilaginous Tip & Nostrils
    const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.065, 16), skinMaterial);
    noseBridge.position.set(0, 1.795, 0.135);
    noseBridge.rotation.x = -0.22;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 14), skinMaterial);
    noseTip.position.set(0, 1.765, 0.154);
    noseTip.scale.set(1.0, 0.85, 1.15);
    headGroup.add(noseTip);

    const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 10), skinMaterial);
    nostrilL.position.set(-0.014, 1.762, 0.144);
    headGroup.add(nostrilL);

    const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 10), skinMaterial);
    nostrilR.position.set(0.014, 1.762, 0.144);
    headGroup.add(nostrilR);

    // 2. Sculpted Almond Eyes (Properly positioned on facial plane)
    function buildAlmondEye(isLeft) {
        const eyeGroup = new THREE.Group();
        const sideMult = isLeft ? -1 : 1;

        // White Sclera
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.015, 18, 14), eyeWhiteMaterial);
        sclera.scale.set(1.35, 0.85, 0.7);
        eyeGroup.add(sclera);

        // Iris
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 16, 14), eyeIrisMaterial);
        iris.position.set(0, 0, 0.007);
        eyeGroup.add(iris);

        // Pupil
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0042, 12, 12), eyePupilMaterial);
        pupil.position.set(0, 0, 0.011);
        eyeGroup.add(pupil);

        // Cornea Specular Gloss
        const cornea = new THREE.Mesh(new THREE.SphereGeometry(0.0155, 16, 14), eyeCorneaMaterial);
        cornea.scale.set(1.35, 0.85, 0.7);
        eyeGroup.add(cornea);

        // Upper Eyelid / Eyeliner Arc
        const lidGeo = new THREE.TorusGeometry(0.018, 0.0028, 8, 16, Math.PI);
        const lid = new THREE.Mesh(lidGeo, new THREE.MeshBasicMaterial({ color: 0x1a0f0a }));
        lid.position.set(0, 0.004, 0.008);
        lid.rotation.x = Math.PI / 4;
        eyeGroup.add(lid);

        eyeGroup.position.set(0.046 * sideMult, 1.825, 0.126);
        headGroup.add(eyeGroup);
        return eyeGroup;
    }

    const eyeLeftGroup = buildAlmondEye(true);
    const eyeRightGroup = buildAlmondEye(false);

    // 3. Eyebrow Arcs
    const browGeo = new THREE.TorusGeometry(0.034, 0.0038, 10, 18, Math.PI / 2.1);
    const browL = new THREE.Mesh(browGeo, hairMaterial);
    browL.position.set(-0.046, 1.855, 0.126);
    browL.rotation.z = Math.PI * 0.94;
    browL.rotation.x = 0.15;
    headGroup.add(browL);

    const browR = new THREE.Mesh(browGeo, hairMaterial);
    browR.position.set(0.046, 1.855, 0.126);
    browR.rotation.z = Math.PI * 0.06;
    browR.rotation.x = 0.15;
    headGroup.add(browR);

    // 4. Sculpted Lips with Cupid's Bow
    const upperLipL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.019, 12), lipsMaterial);
    upperLipL.position.set(-0.010, 1.740, 0.138);
    upperLipL.rotation.z = Math.PI / 2 + 0.12;
    headGroup.add(upperLipL);

    const upperLipR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.019, 12), lipsMaterial);
    upperLipR.position.set(0.010, 1.740, 0.138);
    upperLipR.rotation.z = Math.PI / 2 - 0.12;
    headGroup.add(upperLipR);

    const lowerLip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.034, 14), lipsMaterial);
    lowerLip.position.set(0, 1.726, 0.135);
    lowerLip.rotation.z = Math.PI / 2;
    headGroup.add(lowerLip);

    // 5. Anatomical Ears
    const earGeo = new THREE.SphereGeometry(0.024, 14, 12);
    const earL = new THREE.Mesh(earGeo, skinMaterial);
    earL.position.set(-0.122, 1.80, -0.01);
    earL.scale.set(0.45, 1.4, 0.85);
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, skinMaterial);
    earR.position.set(0.122, 1.80, -0.01);
    earR.scale.set(0.45, 1.4, 0.85);
    headGroup.add(earR);

    // --- B. TORSO & ANATOMICAL LIMBS ---
    const chestMesh = addPartMesh(new THREE.CylinderGeometry(0.19, 0.165, 0.28, 32), skinMaterial, torsoGroup, 'torso');
    chestMesh.position.set(0, 1.44, 0);
    chestMesh.scale.set(1.12, 1.0, 0.74);

    // Clavicle Collarbones
    const clavicleGeo = new THREE.TorusGeometry(0.14, 0.007, 10, 24, Math.PI / 2);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, skinMaterial);
    clavicleMesh.position.set(0, 1.55, 0.04);
    clavicleMesh.rotation.x = Math.PI / 2;
    clavicleMesh.rotation.z = Math.PI / 4;
    torsoGroup.add(clavicleMesh);

    // Waist Taper
    const waistMesh = addPartMesh(new THREE.CylinderGeometry(0.142, 0.158, 0.22, 32), skinMaterial, torsoGroup, 'torso');
    waistMesh.position.set(0, 1.22, 0);
    waistMesh.scale.set(0.96, 1.0, 0.68);

    // Pelvis / Hips
    const hipsMesh = addPartMesh(new THREE.CylinderGeometry(0.165, 0.185, 0.20, 32), baseUnderwearMat, torsoGroup, 'torso');
    hipsMesh.position.set(0, 1.04, 0);
    hipsMesh.scale.set(1.18, 1.0, 0.76);

    // Sculpted Shoulders
    const shoulderL = addPartMesh(new THREE.SphereGeometry(0.062, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderL.position.set(-0.24, 1.52, 0);
    const shoulderR = addPartMesh(new THREE.SphereGeometry(0.062, 20, 16), skinMaterial, torsoGroup, 'torso');
    shoulderR.position.set(0.24, 1.52, 0);

    // Upper Arms (Naturally resting by side in runway poise)
    const upperArmGeo = new THREE.CylinderGeometry(0.042, 0.038, 0.26, 20);
    const armLeftUpper = addPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armLeftUpper.position.set(-0.27, 1.36, 0);
    armLeftUpper.rotation.z = -0.14;
    armLeftUpper.rotation.x = 0.06;

    const armRightUpper = addPartMesh(upperArmGeo, skinMaterial, torsoGroup, 'torso');
    armRightUpper.position.set(0.27, 1.36, 0);
    armRightUpper.rotation.z = 0.14;
    armRightUpper.rotation.x = 0.06;

    // Elbow Joints
    const elbowL = addPartMesh(new THREE.SphereGeometry(0.035, 16, 14), skinMaterial, torsoGroup, 'torso');
    elbowL.position.set(-0.305, 1.22, 0.015);
    const elbowR = addPartMesh(new THREE.SphereGeometry(0.035, 16, 14), skinMaterial, torsoGroup, 'torso');
    elbowR.position.set(0.305, 1.22, 0.015);

    // Forearms (Tapering naturally toward wrist)
    const forearmGeo = new THREE.CylinderGeometry(0.035, 0.026, 0.25, 20);
    const forearmLeft = addPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmLeft.position.set(-0.312, 1.07, 0.045);
    forearmLeft.rotation.z = -0.06;
    forearmLeft.rotation.x = 0.18;

    const forearmRight = addPartMesh(forearmGeo, skinMaterial, torsoGroup, 'torso');
    forearmRight.position.set(0.312, 1.07, 0.045);
    forearmRight.rotation.z = 0.06;
    forearmRight.rotation.x = 0.18;

    // --- ANATOMICAL POSED RUNWAY HANDS (Sorted, Natural & Refined) ---
    function buildSculptedHand(isLeft) {
        const handRoot = new THREE.Group();
        const sideMult = isLeft ? -1 : 1;

        // Slender Wrist Transition
        const wristMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.020, 0.04, 14), skinMaterial);
        wristMesh.position.set(0, 0.02, 0);
        handRoot.add(wristMesh);

        // Palm Base (Anatomically tapered volume with thenar pad)
        const palmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.052, 0.018), skinMaterial);
        palmMesh.position.set(0, -0.016, 0);
        palmMesh.castShadow = true;
        handRoot.add(palmMesh);

        // Thenar Muscle Mound (Base of thumb)
        const thenarMound = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), skinMaterial);
        thenarMound.position.set(0.018 * sideMult, -0.008, 0.006);
        thenarMound.scale.set(1.2, 1.0, 0.8);
        handRoot.add(thenarMound);

        // Natural Posed Thumb (Angling inward toward index finger)
        const thumbProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0055, 0.024, 10), skinMaterial);
        thumbProx.position.set(0.024 * sideMult, -0.014, 0.012);
        thumbProx.rotation.z = -0.45 * sideMult;
        thumbProx.rotation.x = 0.35;
        handRoot.add(thumbProx);

        const thumbDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0040, 0.018, 10), skinMaterial);
        thumbDist.position.set(0.032 * sideMult, -0.028, 0.018);
        thumbDist.rotation.z = -0.25 * sideMult;
        thumbDist.rotation.x = 0.50;
        handRoot.add(thumbDist);

        // 4 Cascaded Runway Fingers (Index, Middle, Ring, Pinky - gently curved)
        const fingerData = [
            { len: 0.042, xOff: -0.012, curl: 0.18 }, // Index
            { len: 0.046, xOff: -0.004, curl: 0.16 }, // Middle (longest)
            { len: 0.040, xOff: 0.004, curl: 0.22 },  // Ring
            { len: 0.033, xOff: 0.011, curl: 0.28 }   // Pinky (most curled)
        ];

        fingerData.forEach(f => {
            const posX = f.xOff * sideMult;
            const prox = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0040, f.len * 0.6, 10), skinMaterial);
            prox.position.set(posX, -0.048, 0.004);
            prox.rotation.x = f.curl;
            handRoot.add(prox);

            const dist = new THREE.Mesh(new THREE.CylinderGeometry(0.0038, 0.0028, f.len * 0.45, 10), skinMaterial);
            dist.position.set(posX, -0.064, 0.012);
            dist.rotation.x = f.curl + 0.25;
            handRoot.add(dist);
        });

        // Position hand gracefully on forearm
        handRoot.position.set(0.316 * sideMult, 0.91, 0.08);
        handRoot.rotation.y = 0.25 * sideMult;
        handRoot.rotation.z = -0.06 * sideMult;
        torsoGroup.add(handRoot);
        return handRoot;
    }

    const handLeftMesh = buildSculptedHand(true);
    const handRightMesh = buildSculptedHand(false);

    // --- C. SCULPTED ATHLETIC LEGS ---
    const thighGeo = new THREE.CylinderGeometry(0.084, 0.062, 0.44, 24);
    const thighLeft = addPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighLeft.position.set(-0.11, 0.74, 0);

    const thighRight = addPartMesh(thighGeo, skinMaterial, legsGroup, 'legs');
    thighRight.position.set(0.11, 0.74, 0);

    // Sculpted Kneecaps
    const kneeL = addPartMesh(new THREE.SphereGeometry(0.052, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeL.position.set(-0.11, 0.50, 0.012);
    const kneeR = addPartMesh(new THREE.SphereGeometry(0.052, 18, 14), skinMaterial, legsGroup, 'legs');
    kneeR.position.set(0.11, 0.50, 0.012);

    // Calves & Shins
    const calfGeo = new THREE.CylinderGeometry(0.058, 0.038, 0.44, 24);
    const calfLeft = addPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfLeft.position.set(-0.11, 0.27, 0);
    const calfRight = addPartMesh(calfGeo, skinMaterial, legsGroup, 'legs');
    calfRight.position.set(0.11, 0.27, 0);

    // --- D. ANATOMICAL FEET ---
    const footGeo = new THREE.BoxGeometry(0.068, 0.048, 0.17);
    const footLeft = addPartMesh(footGeo, skinMaterial, legsGroup, 'legs');
    footLeft.position.set(-0.11, 0.03, 0.03);
    const footRight = addPartMesh(footGeo, skinMaterial, legsGroup, 'legs');
    footRight.position.set(0.11, 0.03, 0.03);

    // -------------------------------------------------------------
    // 6. PROCEDURAL 3D HAIR GEOMETRIES (REALISTIC & GENDER-ALIGNED)
    // -------------------------------------------------------------
    const hairContainer = new THREE.Group();
    headGroup.add(hairContainer);
    let activeHairMesh = null;

    function build3DHair(styleKey) {
        if (activeHairMesh) {
            hairContainer.remove(activeHairMesh);
            activeHairMesh = null;
        }

        if (styleKey === 'bald') return;

        const hairGroup = new THREE.Group();

        // 1. FEMALE DEFAULT: Editorial Side-Part & Glamour Waves
        if (styleKey === 'side-part' || styleKey === 'long-waves') {
            const cap = new THREE.Mesh(new THREE.SphereGeometry(0.134, 28, 24), hairMaterial);
            cap.position.set(0, 1.86, -0.01);
            cap.scale.set(1.02, 1.10, 1.05);
            hairGroup.add(cap);

            const sideSweep = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.026, 16, 24, Math.PI * 0.75), hairMaterial);
            sideSweep.position.set(0.03, 1.88, 0.06);
            sideSweep.rotation.z = -0.55;
            sideSweep.rotation.x = 0.25;
            hairGroup.add(sideSweep);

            const waveL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.48, 16), hairMaterial);
            waveL.position.set(-0.13, 1.62, 0.03);
            waveL.rotation.z = -0.16;
            waveL.rotation.x = 0.08;
            hairGroup.add(waveL);

            const waveR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.48, 16), hairMaterial);
            waveR.position.set(0.13, 1.62, 0.03);
            waveR.rotation.z = 0.16;
            waveR.rotation.x = 0.08;
            hairGroup.add(waveR);

            const backDrape = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.085, 0.52, 20), hairMaterial);
            backDrape.position.set(0, 1.60, -0.09);
            backDrape.scale.set(1.1, 1.0, 0.85);
            hairGroup.add(backDrape);
        }
        // 2. MALE DEFAULT: Modern Textured Quiff / High-Fashion Crop
        else if (styleKey === 'short-crop') {
            const fadeSides = new THREE.Mesh(new THREE.SphereGeometry(0.130, 28, 24), hairMaterial);
            fadeSides.position.set(0, 1.85, -0.01);
            fadeSides.scale.set(1.02, 1.12, 1.03);
            hairGroup.add(fadeSides);

            const quiffBase = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.045, 0.13), hairMaterial);
            quiffBase.position.set(0, 1.95, 0.01);
            quiffBase.rotation.x = 0.15;
            hairGroup.add(quiffBase);

            for (let i = 0; i < 5; i++) {
                const strand = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.065, 8), hairMaterial);
                const xOff = (-0.04 + (i * 0.02));
                strand.position.set(xOff, 1.97, 0.03 + (Math.sin(i) * 0.01));
                strand.rotation.x = 0.45;
                strand.rotation.z = (i - 2) * 0.12;
                hairGroup.add(strand);
            }
        }
        // 3. NON-BINARY DEFAULT: Textured Afro High Puff with Metallic Band
        else if (styleKey === 'curly-puff') {
            const baseHair = new THREE.Mesh(new THREE.SphereGeometry(0.132, 24, 20), hairMaterial);
            baseHair.position.set(0, 1.86, 0);
            hairGroup.add(baseHair);

            const cuffMat = new THREE.MeshStandardMaterial({ color: 0xffc700, metalness: 0.9, roughness: 0.2 });
            const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 14, 24), cuffMat);
            cuff.position.set(0, 1.94, -0.02);
            cuff.rotation.x = Math.PI / 2;
            hairGroup.add(cuff);

            const puffCrown = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 20), hairMaterial);
            puffCrown.position.set(0, 2.04, -0.02);
            puffCrown.scale.set(1.15, 0.95, 1.15);
            hairGroup.add(puffCrown);

            for (let i = 0; i < 8; i++) {
                const miniCurl = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), hairMaterial);
                const angle = (i / 8) * Math.PI * 2;
                miniCurl.position.set(Math.cos(angle) * 0.13, 2.05 + Math.sin(angle) * 0.03, Math.sin(angle) * 0.13);
                hairGroup.add(miniCurl);
            }
        }
        // 4. BUZZ CUT
        else if (styleKey === 'buzz-cut') {
            const buzz = new THREE.Mesh(new THREE.SphereGeometry(0.128, 28, 24), hairMaterial);
            buzz.position.set(0, 1.84, 0);
            buzz.scale.set(1.02, 1.15, 1.04);
            hairGroup.add(buzz);
        }

        hairContainer.add(hairGroup);
        activeHairMesh = hairGroup;
    }

    build3DHair('side-part');

    // -------------------------------------------------------------
    // 7. PRECISION GARMENT TAILORING (FLUSH AROUND SHOULDERS & NECK)
    // -------------------------------------------------------------
    const garmentsRoot = new THREE.Group();
    mannequinRoot.add(garmentsRoot);

    const active3DGarments = { head: null, torso: null, legs: null };
    const garmentMaterials = { head: null, torso: null, legs: null };
    const studsGroups = { head: null, torso: null, legs: null };

    // Canvas Texture Generator for Authentic Streetwear Graphics & Decals
    function createGraphicTeeTexture(customText = '') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Streetwear Cyber Framing Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 6;
        ctx.strokeRect(160, 140, 704, 740);

        // Top Header Pill
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(160, 140, 704, 85);
        ctx.fillStyle = '#08080a';
        ctx.font = '900 36px "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ TAVROO ATELIER // ARCHIVE 2026', 512, 196);

        // Main Dynamic Streetwear Typography
        const displayMain = (customText && customText.trim().length > 0) ? customText.toUpperCase() : 'TAVROO';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 76px "Montserrat", sans-serif';
        ctx.fillText(displayMain, 512, 400);

        ctx.fillStyle = '#e5c98d';
        ctx.font = '800 42px "Montserrat", sans-serif';
        ctx.fillText('WEAR YOUR POINT OF VIEW', 512, 470);

        // Editorial Accent Lines & Crosshairs
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(220, 520);
        ctx.lineTo(804, 520);
        ctx.stroke();

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '700 24px monospace';
        ctx.fillText('BANGALORE // TOKYO // NYC  [SPEC-TAVROO-26]', 512, 560);

        // Circular Seal Badge
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(512, 660, 68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 24px "Montserrat", sans-serif';
        ctx.fillText('LIMITED RUN', 512, 655);
        ctx.fillText('01 OF 50', 512, 685);

        // Barcode
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 34; i++) {
            const w = (i % 4 === 0) ? 8 : (i % 2 === 0 ? 4 : 2);
            ctx.fillRect(240 + (i * 16), 770, w, 60);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createChromeStuds(coordsArray, parent) {
        const studsGroup = new THREE.Group();
        const studGeo = new THREE.SphereGeometry(0.012, 12, 10);
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xe8eef5,
            metalness: 0.98,
            roughness: 0.10
        });

        coordsArray.forEach(pos => {
            const stud = new THREE.Mesh(studGeo, chromeMat);
            stud.position.set(pos[0], pos[1], pos[2]);
            studsGroup.add(stud);
        });

        studsGroup.visible = false;
        parent.add(studsGroup);
        return studsGroup;
    }

    // Build Authentic 3D Garments with Precision Ergonomic Fitting around Shoulders and Neck
    function build3DGarmentMesh(region, item) {
        if (active3DGarments[region]) {
            garmentsRoot.remove(active3DGarments[region]);
            active3DGarments[region] = null;
            garmentMaterials[region] = null;
            studsGroups[region] = null;
        }

        const garmentGroup = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(item.defaultColor),
            roughness: 0.45,
            metalness: 0.15
        });
        garmentMaterials[region] = mat;

        const isMale = (currentGender === 'male');
        const chestWidthMult = isMale ? 1.25 : 1.0;
        const shoulderSpread = isMale ? 0.30 : 0.24;

        // =========================================================
        // A. HEADWEAR REPLICATION
        // =========================================================
        if (region === 'head') {
            if (item.type === 'snapback') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.134, 0.09, 28), mat);
                crown.position.set(0, 1.93, 0.01);
                garmentGroup.add(crown);

                const topButton = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), mat);
                topButton.position.set(0, 1.98, 0.01);
                garmentGroup.add(topButton);

                const brim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.14), mat);
                brim.position.set(0, 1.90, 0.14);
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[-0.06, 1.93, 0.13], [0.06, 1.93, 0.13]], garmentGroup);
            } else if (item.type === 'beanie') {
                const dome = new THREE.Mesh(new THREE.SphereGeometry(0.138, 28, 24), mat);
                dome.position.set(0, 1.93, 0);
                dome.scale.set(1.02, 1.25, 1.05);
                garmentGroup.add(dome);

                const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.026, 16, 36), mat);
                cuff.position.set(0, 1.88, 0);
                cuff.rotation.x = Math.PI / 2;
                garmentGroup.add(cuff);

                studsGroups.head = createChromeStuds([[-0.05, 1.88, 0.14], [0.05, 1.88, 0.14]], garmentGroup);
            } else if (item.type === 'bucket') {
                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.134, 0.10, 28), mat);
                crown.position.set(0, 1.94, 0);
                garmentGroup.add(crown);

                const brim = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.06, 36, 1, true), mat);
                brim.position.set(0, 1.88, 0);
                brim.rotation.x = Math.PI;
                garmentGroup.add(brim);

                studsGroups.head = createChromeStuds([[0, 1.94, 0.13], [-0.08, 1.94, 0.11], [0.08, 1.94, 0.11]], garmentGroup);
            } else if (item.type === 'beret') {
                const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.136, 0.05, 36), mat);
                puff.position.set(0.04, 1.94, 0.01);
                puff.rotation.z = -0.25;
                garmentGroup.add(puff);

                studsGroups.head = createChromeStuds([[0.05, 1.95, 0.12]], garmentGroup);
            } else if (item.type === 'balaclava') {
                const hood = new THREE.Mesh(new THREE.SphereGeometry(0.134, 28, 28), mat);
                hood.position.set(0, 1.85, 0);
                hood.scale.set(1.02, 1.35, 1.05);
                garmentGroup.add(hood);

                const neckCover = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 28), mat);
                neckCover.position.set(0, 1.62, 0);
                garmentGroup.add(neckCover);

                studsGroups.head = createChromeStuds([[-0.06, 1.65, 0.09], [0.06, 1.65, 0.09]], garmentGroup);
            }
        }

        // =========================================================
        // B. TORSO REPLICATION (EXACT CONTOURED FIT AROUND SHOULDERS & NECK)
        // =========================================================
        else if (region === 'torso') {
            // 1. DECONSTRUCTED GRAPHIC TEE
            if (item.type === 'tee') {
                const teeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.205 * chestWidthMult, 0.180 * chestWidthMult, 0.48, 36), mat);
                teeBody.position.set(0, 1.31, 0);
                teeBody.scale.set(1.15, 1.0, 0.80);
                garmentGroup.add(teeBody);

                // Shoulder Yokes: slope along trapezius downward angle over deltoids
                const yokeL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.16, 24), mat);
                yokeL.position.set(-shoulderSpread * 0.72, 1.505, 0.005);
                yokeL.rotation.z = 0.42;
                garmentGroup.add(yokeL);

                const yokeR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.16, 24), mat);
                yokeR.position.set(shoulderSpread * 0.72, 1.505, 0.005);
                yokeR.rotation.z = -0.42;
                garmentGroup.add(yokeR);

                // Precision Ribbed Crewneck Collar: hugs base of neck snugly
                const ribMat = new THREE.MeshStandardMaterial({ color: 0x1f1d24, roughness: 0.65 });
                const collar = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.011, 16, 36), ribMat);
                collar.position.set(0, 1.568, 0.005);
                collar.rotation.x = Math.PI / 2.08;
                collar.scale.x = isMale ? 1.15 : 1.0;
                garmentGroup.add(collar);

                // Streetwear Graphic Decal
                const decalGeo = new THREE.PlaneGeometry(0.25 * chestWidthMult, 0.28);
                const decalMat = new THREE.MeshBasicMaterial({
                    map: createGraphicTeeTexture(),
                    transparent: true,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1
                });
                const decalMesh = new THREE.Mesh(decalGeo, decalMat);
                decalMesh.name = 'tee-graphic-decal';
                decalMesh.position.set(0, 1.34, 0.174);
                garmentGroup.add(decalMesh);

                // Mid-Bicep Drop-Shoulder Sleeves
                const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.054, 0.16, 24), mat);
                sleeveL.position.set(-shoulderSpread - 0.03, 1.44, 0);
                sleeveL.rotation.z = -0.28;
                garmentGroup.add(sleeveL);

                const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.054, 0.16, 24), mat);
                sleeveR.position.set(shoulderSpread + 0.03, 1.44, 0);
                sleeveR.rotation.z = 0.28;
                garmentGroup.add(sleeveR);

                // Full Forearm Long Sleeve Extensions (Toggled by sleeve slider)
                const longExtL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.26, 24), mat);
                longExtL.name = 'sleeve-long-mesh-l';
                longExtL.position.set(-shoulderSpread - 0.07, 1.23, 0.03);
                longExtL.rotation.z = -0.10;
                longExtL.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtL);

                const longExtR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.26, 24), mat);
                longExtR.name = 'sleeve-long-mesh-r';
                longExtR.position.set(shoulderSpread + 0.07, 1.23, 0.03);
                longExtR.rotation.z = 0.10;
                longExtR.visible = (currentSleeveMode === 'long');
                garmentGroup.add(longExtR);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.54, 0.15], [0.08, 1.54, 0.15],
                    [-0.14, 1.52, 0.12], [0.14, 1.52, 0.12]
                ], garmentGroup);
            }
            // 2. HYPER-OBJECT HOODIE
            else if (item.type === 'hoodie') {
                const hoodieBody = new THREE.Mesh(new THREE.CylinderGeometry(0.222 * chestWidthMult, 0.192 * chestWidthMult, 0.52, 36), mat);
                hoodieBody.position.set(0, 1.32, 0);
                hoodieBody.scale.set(1.18, 1.0, 0.84);
                garmentGroup.add(hoodieBody);

                // Ergonomic Cowl Collar sitting flush around neck
                const cowl = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.038, 18, 36), mat);
                cowl.position.set(0, 1.585, -0.035);
                cowl.rotation.x = Math.PI / 2.5;
                garmentGroup.add(cowl);

                // Kangaroo Front Pocket
                const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.25 * chestWidthMult, 0.14, 0.06), mat);
                pouch.position.set(0, 1.20, 0.165);
                garmentGroup.add(pouch);

                // Sleeves
                const sleeveLen = (currentSleeveMode === 'short') ? 0.22 : 0.46;
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, sleeveLen, 24), mat);
                armL.position.set(-shoulderSpread - 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armL.rotation.z = -0.16;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.052, sleeveLen, 24), mat);
                armR.position.set(shoulderSpread + 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armR.rotation.z = 0.16;
                garmentGroup.add(armR);

                // Drawstrings
                const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8), stringMat);
                stringL.position.set(-0.04, 1.50, 0.16);
                garmentGroup.add(stringL);

                const stringR = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8), stringMat);
                stringR.position.set(0.04, 1.50, 0.16);
                garmentGroup.add(stringR);

                studsGroups.torso = createChromeStuds([
                    [-0.10, 1.22, 0.20], [0.10, 1.22, 0.20],
                    [0, 1.48, 0.17]
                ], garmentGroup);
            }
            // 3. ACID-WASH BIKER VEST
            else if (item.type === 'vest') {
                const vestBody = new THREE.Mesh(new THREE.CylinderGeometry(0.208 * chestWidthMult, 0.180 * chestWidthMult, 0.48, 36), mat);
                vestBody.position.set(0, 1.34, 0);
                vestBody.scale.set(1.16, 1.0, 0.80);
                garmentGroup.add(vestBody);

                // Form-fitting shoulder straps resting smoothly on the clavicle
                const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.16, 0.018), mat);
                strapL.position.set(-shoulderSpread * 0.70, 1.50, 0.018);
                strapL.rotation.z = 0.32;
                garmentGroup.add(strapL);

                const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.16, 0.018), mat);
                strapR.position.set(shoulderSpread * 0.70, 1.50, 0.018);
                strapR.rotation.z = -0.32;
                garmentGroup.add(strapR);

                // Moto Lapels
                const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.02), mat);
                lapelL.position.set(-0.08 * chestWidthMult, 1.46, 0.16);
                lapelL.rotation.z = -0.3;
                garmentGroup.add(lapelL);

                const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.02), mat);
                lapelR.position.set(0.08 * chestWidthMult, 1.46, 0.16);
                lapelR.rotation.z = 0.3;
                garmentGroup.add(lapelR);

                // Chrome Diagonal Moto Zipper
                const zipMat = new THREE.MeshStandardMaterial({ color: 0xd8e0e8, metalness: 0.95, roughness: 0.15 });
                const zipTrack = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.36, 0.01), zipMat);
                zipTrack.position.set(0.03, 1.32, 0.165);
                zipTrack.rotation.z = -0.16;
                garmentGroup.add(zipTrack);

                // Waist Belt
                const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.212 * chestWidthMult, 0.212 * chestWidthMult, 0.04, 36), zipMat);
                belt.position.set(0, 1.13, 0);
                belt.scale.set(1.16, 1.0, 0.80);
                garmentGroup.add(belt);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.54, 0.17], [0.08, 1.54, 0.17],
                    [-0.10, 1.40, 0.17], [0.10, 1.40, 0.17]
                ], garmentGroup);
            }
            // 4. OVERSIZED DENIM JACKET
            else if (item.type === 'jacket') {
                const jacketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.215 * chestWidthMult, 0.190 * chestWidthMult, 0.50, 36), mat);
                jacketBody.position.set(0, 1.33, 0);
                jacketBody.scale.set(1.18, 1.0, 0.83);
                garmentGroup.add(jacketBody);

                // Tailored Turn-Down Collar (Conforms to the back of the neck)
                const collarMat = new THREE.MeshStandardMaterial({ color: 0x1f3b60, roughness: 0.6 });
                const collar = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.022, 16, 36), collarMat);
                collar.position.set(0, 1.570, 0.005);
                collar.rotation.x = Math.PI / 2.15;
                garmentGroup.add(collar);

                // Epaulets along shoulder slope
                const epauletL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.08), collarMat);
                epauletL.position.set(-shoulderSpread * 0.82, 1.515, 0);
                epauletL.rotation.z = 0.28;
                garmentGroup.add(epauletL);

                const epauletR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.08), collarMat);
                epauletR.position.set(shoulderSpread * 0.82, 1.515, 0);
                epauletR.rotation.z = -0.28;
                garmentGroup.add(epauletR);

                // Sleeves
                const sleeveLen = (currentSleeveMode === 'short') ? 0.22 : 0.44;
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.050, sleeveLen, 24), mat);
                armL.position.set(-shoulderSpread - 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armL.rotation.z = -0.15;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.050, sleeveLen, 24), mat);
                armR.position.set(shoulderSpread + 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armR.rotation.z = 0.15;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [-0.08, 1.52, 0.17], [0.08, 1.52, 0.17],
                    [-0.08, 1.35, 0.17], [0.08, 1.35, 0.17]
                ], garmentGroup);
            }
            // 5. TECHWEAR ZIP SWEATER
            else if (item.type === 'sweater') {
                const sweaterBody = new THREE.Mesh(new THREE.CylinderGeometry(0.208 * chestWidthMult, 0.178 * chestWidthMult, 0.50, 36), mat);
                sweaterBody.position.set(0, 1.34, 0);
                sweaterBody.scale.set(1.15, 1.0, 0.80);
                garmentGroup.add(sweaterBody);

                // Snug Funnel Neckband: hugs the lower neck cylinder
                const funnelNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.084, 0.085, 28), mat);
                funnelNeck.position.set(0, 1.595, -0.005);
                garmentGroup.add(funnelNeck);

                // Half-Zip Hardware
                const zipHardwareMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.2 });
                const zipPull = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.18, 0.008), zipHardwareMat);
                zipPull.position.set(0, 1.53, 0.155);
                garmentGroup.add(zipPull);

                // Sleeves
                const sleeveLen = (currentSleeveMode === 'short') ? 0.22 : 0.44;
                const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.046, sleeveLen, 24), mat);
                armL.position.set(-shoulderSpread - 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armL.rotation.z = -0.14;
                garmentGroup.add(armL);

                const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.046, sleeveLen, 24), mat);
                armR.position.set(shoulderSpread + 0.05, 1.42 - (sleeveLen * 0.25), 0.02);
                armR.rotation.z = 0.14;
                garmentGroup.add(armR);

                studsGroups.torso = createChromeStuds([
                    [-0.12, 1.48, 0.14], [0.12, 1.48, 0.14]
                ], garmentGroup);
            }
        }

        // =========================================================
        // C. LEGS REPLICATION
        // =========================================================
        else if (region === 'legs') {
            if (item.type === 'cargo') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.078, 0.82, 28), mat);
                legL.position.set(-0.115, 0.55, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.078, 0.82, 28), mat);
                legR.position.set(0.115, 0.55, 0);
                garmentGroup.add(legR);

                const pocketGeo = new THREE.BoxGeometry(0.06, 0.12, 0.05);
                const pocketL = new THREE.Mesh(pocketGeo, mat);
                pocketL.position.set(-0.19, 0.60, 0.02);
                garmentGroup.add(pocketL);

                const pocketR = new THREE.Mesh(pocketGeo, mat);
                pocketR.position.set(0.19, 0.60, 0.02);
                garmentGroup.add(pocketR);

                studsGroups.legs = createChromeStuds([
                    [-0.19, 0.65, 0.05], [0.19, 0.65, 0.05]
                ], garmentGroup);
            } else if (item.type === 'jeans') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.070, 0.82, 28), mat);
                legL.position.set(-0.115, 0.55, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.070, 0.82, 28), mat);
                legR.position.set(0.115, 0.55, 0);
                garmentGroup.add(legR);

                studsGroups.legs = createChromeStuds([
                    [-0.12, 0.90, 0.11], [0.12, 0.90, 0.11]
                ], garmentGroup);
            } else if (item.type === 'shorts') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.102, 0.092, 0.36, 28), mat);
                legL.position.set(-0.115, 0.78, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.102, 0.092, 0.36, 28), mat);
                legR.position.set(0.115, 0.78, 0);
                garmentGroup.add(legR);

                studsGroups.legs = createChromeStuds([
                    [-0.18, 0.78, 0.08], [0.18, 0.78, 0.08]
                ], garmentGroup);
            } else if (item.type === 'track') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.090, 0.096, 0.82, 28), mat);
                legL.position.set(-0.115, 0.55, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.090, 0.096, 0.82, 28), mat);
                legR.position.set(0.115, 0.55, 0);
                garmentGroup.add(legR);

                const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.82, 0.01), stripeMat);
                stripeL.position.set(-0.20, 0.55, 0);
                garmentGroup.add(stripeL);

                const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.82, 0.01), stripeMat);
                stripeR.position.set(0.20, 0.55, 0);
                garmentGroup.add(stripeR);

                studsGroups.legs = createChromeStuds([
                    [-0.12, 0.90, 0.10], [0.12, 0.90, 0.10]
                ], garmentGroup);
            } else if (item.type === 'joggers') {
                const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.060, 0.82, 28), mat);
                legL.position.set(-0.115, 0.55, 0);
                garmentGroup.add(legL);

                const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.060, 0.82, 28), mat);
                legR.position.set(0.115, 0.55, 0);
                garmentGroup.add(legR);

                studsGroups.legs = createChromeStuds([
                    [-0.14, 0.82, 0.09], [0.14, 0.82, 0.09]
                ], garmentGroup);
            }
        }

        garmentsRoot.add(garmentGroup);
        active3DGarments[region] = garmentGroup;
    }

    function remove3DGarment(region) {
        if (active3DGarments[region]) {
            garmentsRoot.remove(active3DGarments[region]);
            active3DGarments[region] = null;
            garmentMaterials[region] = null;
            studsGroups[region] = null;
            selectedGarments[region] = null;
        }
    }

    // -------------------------------------------------------------
    // 8. SMART GENDER, MORPHING & PARAMETRIC ANATOMY
    // -------------------------------------------------------------
    function updateGenderMorphing(gender) {
        currentGender = gender;
        if (genderBadge) {
            genderBadge.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
        }

        if (gender === 'male') {
            chestMesh.scale.set(1.36, 1.0, 0.90);
            waistMesh.scale.set(1.12, 1.0, 0.78);
            hipsMesh.scale.set(1.04, 1.0, 0.72);
            shoulderL.position.x = -0.30;
            shoulderR.position.x = 0.30;
            armLeftUpper.position.x = -0.33;
            armRightUpper.position.x = 0.33;
            elbowL.position.x = -0.365;
            elbowR.position.x = 0.365;
            forearmLeft.position.x = -0.372;
            forearmRight.position.x = 0.372;
            handLeftMesh.position.x = -0.376;
            handRightMesh.position.x = 0.376;
            jawMesh.scale.set(1.14, 1.05, 1.10);

            if (hairStyleSelect && hairStyleSelect.value === 'side-part') {
                hairStyleSelect.value = 'short-crop';
                if (hairBadge) hairBadge.textContent = '3D Modern Textured Crop';
                build3DHair('short-crop');
            }
        } else if (gender === 'female') {
            chestMesh.scale.set(1.12, 1.0, 0.74);
            waistMesh.scale.set(0.96, 1.0, 0.68);
            hipsMesh.scale.set(1.18, 1.0, 0.76);
            shoulderL.position.x = -0.24;
            shoulderR.position.x = 0.24;
            armLeftUpper.position.x = -0.27;
            armRightUpper.position.x = 0.27;
            elbowL.position.x = -0.305;
            elbowR.position.x = 0.305;
            forearmLeft.position.x = -0.312;
            forearmRight.position.x = 0.312;
            handLeftMesh.position.x = -0.316;
            handRightMesh.position.x = 0.316;
            jawMesh.scale.set(0.92, 1.0, 0.90);

            if (hairStyleSelect && hairStyleSelect.value === 'short-crop') {
                hairStyleSelect.value = 'side-part';
                if (hairBadge) hairBadge.textContent = '3D Editorial Side-Part';
                build3DHair('side-part');
            }
        } else {
            chestMesh.scale.set(1.20, 1.0, 0.80);
            waistMesh.scale.set(1.02, 1.0, 0.72);
            hipsMesh.scale.set(1.12, 1.0, 0.74);
            shoulderL.position.x = -0.26;
            shoulderR.position.x = 0.26;
            armLeftUpper.position.x = -0.29;
            armRightUpper.position.x = 0.29;
            elbowL.position.x = -0.325;
            elbowR.position.x = 0.325;
            forearmLeft.position.x = -0.332;
            forearmRight.position.x = 0.332;
            handLeftMesh.position.x = -0.336;
            handRightMesh.position.x = 0.336;
            jawMesh.scale.set(1.0, 1.0, 0.95);
        }

        if (selectedGarments.torso) {
            build3DGarmentMesh('torso', selectedGarments.torso);
        }
    }

    function updateBodyType(type) {
        currentBodyType = type;
        if (type === 'athletic') {
            waistMesh.scale.y = 1.0;
            chestMesh.scale.x = (currentGender === 'male') ? 1.36 : 1.12;
        } else if (type === 'slim') {
            chestMesh.scale.x *= 0.92;
            waistMesh.scale.x *= 0.90;
            hipsMesh.scale.x *= 0.92;
        } else if (type === 'plus') {
            chestMesh.scale.x *= 1.14;
            waistMesh.scale.x *= 1.16;
            hipsMesh.scale.x *= 1.15;
        }
        if (selectedGarments.torso) {
            build3DGarmentMesh('torso', selectedGarments.torso);
        }
    }

    function updateHeightScale(val) {
        currentHeightScale = parseFloat(val);
        legsGroup.scale.y = currentHeightScale;
        legsGroup.position.y = (1.0 - currentHeightScale) * 0.15;

        torsoGroup.scale.y = 1.0 + (currentHeightScale - 1.0) * 0.4;
        headGroup.position.y = (currentHeightScale - 1.0) * 0.25;

        if (active3DGarments.head) {
            active3DGarments.head.position.y = (currentHeightScale - 1.0) * 0.25;
            active3DGarments.head.scale.y = 1.0;
        }
        if (active3DGarments.torso) {
            active3DGarments.torso.scale.y = 1.0 + (currentHeightScale - 1.0) * 0.4;
        }
        if (active3DGarments.legs) {
            active3DGarments.legs.scale.y = currentHeightScale;
            active3DGarments.legs.position.y = (1.0 - currentHeightScale) * 0.15;
        }
    }

    // -------------------------------------------------------------
    // 9. RAYCASTING, HOVER & SELECTION LOGIC
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerMove(e) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);

        if (intersects.length > 0) {
            const hitRegion = intersects[0].object.userData.region;
            if (hitRegion) {
                regionLabel.textContent = `TRY ON ${hitRegion.toUpperCase()} APPAREL ⚡`;
                regionLabel.style.opacity = '1';
                renderer.domElement.style.cursor = 'pointer';
                return;
            }
        }
        regionLabel.style.opacity = '0';
        renderer.domElement.style.cursor = 'grab';
    }

    function onPointerClick(e) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);

        if (intersects.length > 0) {
            const hitRegion = intersects[0].object.userData.region;
            if (hitRegion && apparelData[hitRegion]) {
                selectBodyRegion(hitRegion);
            }
        }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerClick);

    // -------------------------------------------------------------
    // 10. UI STATE TRANSITIONS & SELECTION HANDLERS
    // -------------------------------------------------------------
    function selectBodyRegion(region) {
        activeRegion = region;
        initialMessage.classList.remove('active');
        customizationView.classList.remove('active');
        apparelListView.classList.add('active');

        apparelListTitle.textContent = `${region.toUpperCase()} APPAREL OPTIONS`;
        apparelGrid.innerHTML = '';

        const items = apparelData[region] || [];
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'apparel-item';
            if (selectedGarments[region] && selectedGarments[region].id === item.id) {
                card.classList.add('selected');
            }

            card.innerHTML = `
                <div class="apparel-icon-box">${item.icon}</div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #fff; margin-bottom: 0.2rem;">${item.name}</div>
                <div style="font-size: 0.76rem; color: var(--accent-champagne); font-weight: 600;">TRY ON 3D ⚡</div>
            `;

            card.addEventListener('click', () => {
                selectedGarments[region] = item;
                build3DGarmentMesh(region, item);
                openCustomizationView(item);
            });

            apparelGrid.appendChild(card);
        });

        // Focus camera gently on selected zone
        if (controls) {
            if (region === 'head') {
                controls.target.set(0, 1.75, 0);
            } else if (region === 'torso') {
                controls.target.set(0, 1.35, 0);
            } else if (region === 'legs') {
                controls.target.set(0, 0.55, 0);
            }
        }

        // On mobile & tablet viewports, switch to Garments tab so options are immediately visible
        if (window.innerWidth <= 1024 && typeof window.switchMobileTab === 'function') {
            window.switchMobileTab('apparel-panel');
        }
    }

    function openCustomizationView(item) {
        apparelListView.classList.remove('active');
        customizationView.classList.add('active');
        selectedItemName.textContent = item.name;

        // Reset inputs
        if (customTextInput) customTextInput.value = '';
        if (toggleStudsInput) toggleStudsInput.checked = false;
        if (tieDyeColorInput) {
            tieDyeColorInput.value = item.defaultColor;
            if (colorHexLabel) colorHexLabel.textContent = item.defaultColor.toUpperCase();
        }
    }

    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            if (activeRegion) selectBodyRegion(activeRegion);
        });
    }

    if (removeGarmentBtn) {
        removeGarmentBtn.addEventListener('click', () => {
            if (activeRegion) {
                remove3DGarment(activeRegion);
                selectBodyRegion(activeRegion);
            }
        });
    }

    // Custom text decal updates
    if (customTextInput) {
        customTextInput.addEventListener('input', (e) => {
            const decal = garmentsRoot.getObjectByName('tee-graphic-decal');
            if (decal && decal.material) {
                decal.material.map = createGraphicTeeTexture(e.target.value);
                decal.material.needsUpdate = true;
            }
        });
    }

    // Toggle Studs
    if (toggleStudsInput) {
        toggleStudsInput.addEventListener('change', (e) => {
            if (activeRegion && studsGroups[activeRegion]) {
                studsGroups[activeRegion].visible = e.target.checked;
            }
        });
    }

    // Fabric dye color
    if (tieDyeColorInput) {
        tieDyeColorInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (colorHexLabel) colorHexLabel.textContent = val.toUpperCase();
            if (activeRegion && garmentMaterials[activeRegion]) {
                garmentMaterials[activeRegion].color.set(val);
            }
        });
    }

    // Creative tint button
    if (openCreativityBtn) {
        openCreativityBtn.addEventListener('click', () => {
            const palette = ['#ff007f', '#00f0ff', '#d4af37', '#7928ca', '#ff5e00', '#10b981'];
            const randomColor = palette[Math.floor(Math.random() * palette.length)];
            if (tieDyeColorInput) tieDyeColorInput.value = randomColor;
            if (colorHexLabel) colorHexLabel.textContent = randomColor.toUpperCase();
            if (activeRegion && garmentMaterials[activeRegion]) {
                garmentMaterials[activeRegion].color.set(randomColor);
            }
        });
    }

    // -------------------------------------------------------------
    // 11. UI SELECT & SLIDER EVENT LISTENERS
    // -------------------------------------------------------------
    if (genderSelect) {
        genderSelect.addEventListener('change', (e) => updateGenderMorphing(e.target.value));
    }

    if (ethnicitySelect) {
        ethnicitySelect.addEventListener('change', (e) => {
            const preset = ethnicityPresets[e.target.value] || ethnicityPresets['default'];
            if (ethnicityBadge) ethnicityBadge.textContent = preset.name;
            currentSkinTone = preset.tone;
            skinMaterial.color.set(currentSkinTone);
            eyeIrisMaterial.color.set(preset.eyeColor);
            currentHairColor = preset.hairColor;
            hairMaterial.color.set(currentHairColor);
            if (hairColorInput) hairColorInput.value = currentHairColor;
        });
    }

    if (hairStyleSelect) {
        hairStyleSelect.addEventListener('change', (e) => {
            if (hairBadge) hairBadge.textContent = hairStyleSelect.options[hairStyleSelect.selectedIndex].text;
            build3DHair(e.target.value);
        });
    }

    if (hairColorInput) {
        hairColorInput.addEventListener('input', (e) => {
            currentHairColor = e.target.value;
            hairMaterial.color.set(currentHairColor);
            if (hairColorName) hairColorName.textContent = currentHairColor.toUpperCase();
        });
    }

    if (sleeveSelect) {
        sleeveSelect.addEventListener('change', (e) => {
            currentSleeveMode = e.target.value;
            if (sleeveBadge) sleeveBadge.textContent = (currentSleeveMode === 'long' ? 'Long Sleeves' : 'Short Sleeves');
            if (selectedGarments.torso) {
                build3DGarmentMesh('torso', selectedGarments.torso);
            }
        });
    }

    skinPicker.forEach(swatch => {
        swatch.addEventListener('click', () => {
            skinPicker.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentSkinTone = swatch.getAttribute('data-tone');
            skinMaterial.color.set(currentSkinTone);
        });
    });

    if (bodyTypeSelect) {
        bodyTypeSelect.addEventListener('change', (e) => updateBodyType(e.target.value));
    }

    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => updateHeightScale(e.target.value));
    }

    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
            if (controls) {
                controls.autoRotate = !controls.autoRotate;
                autoRotateBtn.classList.toggle('active', controls.autoRotate);
                if (autoRotateText) autoRotateText.textContent = controls.autoRotate ? 'Spinning...' : 'Auto-Spin';
            }
        });
    }

    if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
            camera.position.set(0, 1.25, 3.6);
            if (controls) {
                controls.target.set(0, 1.12, 0);
                controls.update();
            }
        });
    }

    // -------------------------------------------------------------
    // 12. ANIMATION LOOP & RESIZE HANDLING
    // -------------------------------------------------------------
    function onWindowResize() {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
