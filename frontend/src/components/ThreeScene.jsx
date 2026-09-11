import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Download, Sparkles, Waves } from 'lucide-react';

/**
 * Creates a photorealistic 57-facet Round Brilliant Cut Diamond geometry
 */
function createBrilliantDiamondGeometry(radius = 0.32, height = 0.40) {
  const crownHeight = height * 0.38;
  const pavilionDepth = height * 0.62;
  const tableRadius = radius * 0.56;
  const girdleRadius = radius;
  const girdleThickness = height * 0.04;

  const geom = new THREE.BufferGeometry();
  const vertices = [];

  const tableY = crownHeight;
  const girdleTopY = girdleThickness * 0.5;
  const girdleBottomY = -girdleThickness * 0.5;
  const culetY = -pavilionDepth;

  const tableVerts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    tableVerts.push(new THREE.Vector3(Math.cos(a) * tableRadius, tableY, Math.sin(a) * tableRadius));
  }

  const girdleTopVerts = [];
  const girdleBottomVerts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    girdleTopVerts.push(new THREE.Vector3(Math.cos(a) * girdleRadius, girdleTopY, Math.sin(a) * girdleRadius));
    girdleBottomVerts.push(new THREE.Vector3(Math.cos(a) * girdleRadius, girdleBottomY, Math.sin(a) * girdleRadius));
  }

  // 1. Table Facet
  const centerTable = new THREE.Vector3(0, tableY, 0);
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    vertices.push(
      centerTable.x, centerTable.y, centerTable.z,
      tableVerts[i].x, tableVerts[i].y, tableVerts[i].z,
      tableVerts[next].x, tableVerts[next].y, tableVerts[next].z
    );
  }

  // 2. Crown Facets
  for (let i = 0; i < 8; i++) {
    const tCurrent = tableVerts[i];
    const tNext = tableVerts[(i + 1) % 8];
    const gMid = girdleTopVerts[i * 2 + 1];
    const gLeft = girdleTopVerts[i * 2];
    const gRight = girdleTopVerts[(i * 2 + 2) % 16];

    vertices.push(tCurrent.x, tCurrent.y, tCurrent.z, gLeft.x, gLeft.y, gLeft.z, gMid.x, gMid.y, gMid.z);
    vertices.push(tNext.x, tNext.y, tNext.z, gMid.x, gMid.y, gMid.z, gRight.x, gRight.y, gRight.z);
    vertices.push(tCurrent.x, tCurrent.y, tCurrent.z, gMid.x, gMid.y, gMid.z, tNext.x, tNext.y, tNext.z);
  }

  // 3. Girdle Facets
  for (let i = 0; i < 16; i++) {
    const next = (i + 1) % 16;
    const gt1 = girdleTopVerts[i], gt2 = girdleTopVerts[next];
    const gb1 = girdleBottomVerts[i], gb2 = girdleBottomVerts[next];
    vertices.push(gt1.x, gt1.y, gt1.z, gb1.x, gb1.y, gb1.z, gt2.x, gt2.y, gt2.z);
    vertices.push(gt2.x, gt2.y, gt2.z, gb1.x, gb1.y, gb1.z, gb2.x, gb2.y, gb2.z);
  }

  // 4. Pavilion Facets
  const culet = new THREE.Vector3(0, culetY, 0);
  for (let i = 0; i < 16; i++) {
    const next = (i + 1) % 16;
    const gb1 = girdleBottomVerts[i], gb2 = girdleBottomVerts[next];
    vertices.push(gb1.x, gb1.y, gb1.z, culet.x, culet.y, culet.z, gb2.x, gb2.y, gb2.z);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates a parametric, organically cupped lotus petal geometry
 */
function createLotusPetalGeometry(length = 2.0, maxWidth = 0.95, cupAmount = 0.28, archAmount = 0.32) {
  const uSegs = 14;
  const vSegs = 10;
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= uSegs; i++) {
    const u = i / uSegs;
    let widthFactor = u < 0.45 
      ? 0.22 + 0.78 * Math.sin((u / 0.45) * Math.PI * 0.5) 
      : Math.cos(((u - 0.45) / 0.55) * Math.PI * 0.5);

    const longitudinalY = u * length;
    const longitudinalZ = Math.sin(u * Math.PI * 0.85) * archAmount * length;

    for (let j = 0; j <= vSegs; j++) {
      const v = (j / vSegs) * 2 - 1;
      const cupZ = (1 - v * v) * cupAmount * widthFactor;
      const x = v * (maxWidth * 0.5) * widthFactor;
      const y = longitudinalY;
      const z = longitudinalZ + cupZ;

      vertices.push(x, y, z);
      uvs.push((v + 1) * 0.5, u);
    }
  }

  for (let i = 0; i < uSegs; i++) {
    for (let j = 0; j < vSegs; j++) {
      const a = i * (vSegs + 1) + j;
      const b = (i + 1) * (vSegs + 1) + j;
      const c = (i + 1) * (vSegs + 1) + (j + 1);
      const d = i * (vSegs + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geom.setIndex(indices);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates curved botanical water lily pad with sinus cleft and upturned edge
 */
function createCurvedLilyPadGeometry(radius = 1.3, segments = 36) {
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  const rings = 4;
  const notchAngle = 0.52; // ~30 degree V-notch (sinus)
  const startAngle = notchAngle / 2;
  const endAngle = Math.PI * 2 - notchAngle / 2;

  vertices.push(0, -0.03, 0);
  uvs.push(0.5, 0.5);

  for (let rIdx = 1; rIdx <= rings; rIdx++) {
    const rFrac = rIdx / rings;
    const curR = radius * rFrac;
    const curY = (rFrac > 0.75) ? Math.pow((rFrac - 0.75) / 0.25, 2) * 0.03 : -0.03 * (1 - rFrac);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = startAngle + t * (endAngle - startAngle);
      const edgeVar = 1.0 + (rFrac > 0.8 ? Math.sin(a * 6.0) * 0.025 : 0);
      const x = Math.cos(a) * curR * edgeVar;
      const z = Math.sin(a) * curR * edgeVar;

      vertices.push(x, curY, z);
      uvs.push(0.5 + Math.cos(a) * 0.5 * rFrac, 0.5 + Math.sin(a) * 0.5 * rFrac);
    }
  }

  for (let i = 0; i < segments; i++) {
    indices.push(0, i + 1, i + 2);
  }

  const ringVertCount = segments + 1;
  for (let rIdx = 1; rIdx < rings; rIdx++) {
    const innerStart = 1 + (rIdx - 1) * ringVertCount;
    const outerStart = 1 + rIdx * ringVertCount;

    for (let i = 0; i < segments; i++) {
      const i1 = innerStart + i;
      const i2 = innerStart + i + 1;
      const o1 = outerStart + i;
      const o2 = outerStart + i + 1;

      indices.push(i1, o1, i2);
      indices.push(o1, o2, i2);
    }
  }

  geom.setIndex(indices);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates procedural studio environment for realistic PBR jewelry, water, and petals
 */
function createStudioEnvironment(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#1c1916');
  bgGrad.addColorStop(0.5, '#0b0c10');
  bgGrad.addColorStop(1, '#14151a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Key overhead softbox
  const g1 = ctx.createRadialGradient(512, 90, 10, 512, 90, 220);
  g1.addColorStop(0, '#ffffff');
  g1.addColorStop(0.3, '#fffbf2');
  g1.addColorStop(0.7, 'rgba(255, 240, 215, 0.45)');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(280, 0, 464, 250);

  // Cool rim kicker
  const g2 = ctx.createRadialGradient(160, 256, 10, 160, 256, 170);
  g2.addColorStop(0, '#ffffff');
  g2.addColorStop(0.4, '#eef6ff');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(40, 100, 240, 312);

  // Warm gold kicker
  const g3 = ctx.createRadialGradient(860, 256, 10, 860, 256, 180);
  g3.addColorStop(0, '#fff6db');
  g3.addColorStop(0.5, '#ffcf70');
  g3.addColorStop(1, 'transparent');
  ctx.fillStyle = g3;
  ctx.fillRect(700, 90, 320, 330);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;

  texture.dispose();
  pmremGenerator.dispose();
  return envMap;
}

/**
 * Creates animated diamond starburst flare texture
 */
function createSparkleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64, cy = 64;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(235, 248, 255, 0.85)');
  grad.addColorStop(0.5, 'rgba(180, 220, 255, 0.3)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, 8); ctx.lineTo(cx, 120);
  ctx.moveTo(8, cy); ctx.lineTo(120, cy);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 235, 190, 0.75)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(24, 24); ctx.lineTo(104, 104);
  ctx.moveTo(24, 104); ctx.lineTo(104, 24);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export default function ThreeScene({ onReady, isBuffering = false }) {
  const mountRef = useRef(null);
  const replayTriggerRef = useRef(null);
  const [isBloomed, setIsBloomed] = useState(false);
  const isBufferingRef = useRef(isBuffering);
  const bloomTriggerTimeoutRef = useRef(null);
  const bloomStartTimeRef = useRef(null);

  useEffect(() => {
    isBufferingRef.current = isBuffering;
    if (!isBuffering) {
      // Buffer loader has started lifting! Wait 350ms for buffer screen to completely clear
      if (bloomTriggerTimeoutRef.current) clearTimeout(bloomTriggerTimeoutRef.current);
      bloomTriggerTimeoutRef.current = setTimeout(() => {
        if (bloomStartTimeRef.current === null) {
          bloomStartTimeRef.current = performance.now();
        }
      }, 350);
    } else {
      // While buffering, petals stay strictly closed as a bud
      bloomStartTimeRef.current = null;
      setIsBloomed(false);
      if (bloomTriggerTimeoutRef.current) clearTimeout(bloomTriggerTimeoutRef.current);
    }
  }, [isBuffering]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera Setup (Front 3/4 Perspective)
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    // Front 3/4 elevated perspective viewing the floating lotus, lily pads, and ring
    camera.position.set(0, 2.4, 5.2);
    camera.lookAt(0, 0.38, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    currentMount.appendChild(renderer.domElement);

    // 2. Studio Environment Map
    const studioEnvMap = createStudioEnvironment(renderer);
    scene.environment = studioEnvMap;

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.6);
    scene.add(ambientLight);

    const sunKey = new THREE.DirectionalLight(0xfffaee, 3.2);
    sunKey.position.set(3.5, 9.0, 4.5);
    scene.add(sunKey);

    const waterRim = new THREE.DirectionalLight(0xdcf0ff, 2.2);
    waterRim.position.set(-5, 4, -4);
    scene.add(waterRim);

    // Dedicated spotlight illuminating the wedding ring inside the lotus
    const ringSpotlight = new THREE.PointLight(0xffeed0, 6.0, 7);
    ringSpotlight.position.set(0, 2.0, 1.2);
    scene.add(ringSpotlight);

    // 4. Materials
    const petalMaterialOuter = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFB0BE'), // Dawn blush lotus pink
      roughness: 0.34,
      metalness: 0.04,
      transmission: 0.18,
      thickness: 0.4,
      sheen: 0.85,
      sheenColor: new THREE.Color('#FFD6E2'),
      side: THREE.DoubleSide
    });

    const petalMaterialInner = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFF5F8'), // Delicate ivory blush
      roughness: 0.30,
      metalness: 0.04,
      transmission: 0.22,
      thickness: 0.35,
      sheen: 0.90,
      sheenColor: new THREE.Color('#FFEBF2'),
      side: THREE.DoubleSide
    });

    const receptacleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8C358'), // Golden lime pericarp seed pod
      roughness: 0.42,
      metalness: 0.18
    });

    const stamenMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFD700'),
      roughness: 0.28,
      metalness: 0.35
    });

    const lilyPadMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2D6A4F'), // Fresh rich lotus garden green
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.4,
      sheen: 0.65,
      sheenColor: new THREE.Color('#52B788'),
      side: THREE.DoubleSide
    });

    const goldRingMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F2BA49'), // 18K Royal Yellow Gold
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.8
    });

    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.96,
      ior: 2.417,
      thickness: 1.6,
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#FFFFFF'),
      dispersion: 0.045,
      envMapIntensity: 5.0,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.98,
      flatShading: true
    });

    const waterDropletMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#EBF8FF'),
      roughness: 0.0,
      metalness: 0.0,
      transmission: 0.98,
      ior: 1.333,
      transparent: true,
      opacity: 0.90,
      clearcoat: 1.0
    });

    // ========================================================
    // 5. SEPARATE ANIMATED WATER SURFACE (Not in GLB)
    // ========================================================
    // A calm, romantic lake water surface with animated Gerstner wave ripples & caustics
    const waterWidth = 18;
    const waterSegs = 64;
    const waterGeo = new THREE.PlaneGeometry(waterWidth, waterWidth, waterSegs, waterSegs);
    waterGeo.rotateX(-Math.PI / 2);

    const basePositions = waterGeo.attributes.position.array.slice(); // store resting vertex positions

    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0D3545'), // Deep calm lake emerald-teal
      roughness: 0.04,
      metalness: 0.08,
      transmission: 0.65,
      ior: 1.333,
      reflectivity: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.92
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
    waterMesh.position.set(0, 0.0, 0);
    scene.add(waterMesh);

    // Deep aquatic bottom floor under water for realistic depth perception
    const floorGeo = new THREE.PlaneGeometry(waterWidth, waterWidth);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#05131A') });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.6, 0);
    scene.add(floorMesh);

    // ========================================================
    // 6. SCENE NODES: LOTUS, RING, LILY PADS (Matching GLB)
    // ========================================================
    const worldGroup = new THREE.Group();

    // --- NODE A: LOTUS FLOWER ---
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(0, 0.02, 0);

    // Receptacle (Golden central seed pod cushion)
    const recGeo = new THREE.CylinderGeometry(0.70, 0.45, 0.40, 32);
    const receptacle = new THREE.Mesh(recGeo, receptacleMaterial);
    receptacle.position.set(0, 0.15, 0);
    lotusGroup.add(receptacle);

    // Stamens Ring (48 Golden filaments encircling the pod)
    const stamenGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8);
    const antherGeo = new THREE.SphereGeometry(0.024, 8, 8);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const sg = new THREE.Group();
      sg.position.set(Math.cos(a) * 0.72, 0.22, Math.sin(a) * 0.72);
      sg.rotation.y = a;
      sg.rotation.z = -0.20;

      const filament = new THREE.Mesh(stamenGeo, stamenMaterial);
      filament.position.set(0, 0.17, 0);
      sg.add(filament);

      const anther = new THREE.Mesh(antherGeo, stamenMaterial);
      anther.position.set(0, 0.35, 0);
      sg.add(anther);

      lotusGroup.add(sg);
    }

    // Petals Outer Whorl (6 Petals)
    const outerPetals = [];
    const outerPetalGeo = createLotusPetalGeometry(2.3, 1.15, 0.32, 0.38);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const yawGroup = new THREE.Group();
      yawGroup.rotation.y = angle;

      const pitchGroup = new THREE.Group();
      pitchGroup.position.set(0, 0.02, 0.65);
      
      const petal = new THREE.Mesh(outerPetalGeo, petalMaterialOuter);
      pitchGroup.add(petal);
      yawGroup.add(pitchGroup);
      lotusGroup.add(yawGroup);

      outerPetals.push({ pitchGroup });
    }

    // Petals Middle Whorl (8 Petals)
    const middlePetals = [];
    const midPetalGeo = createLotusPetalGeometry(1.85, 0.90, 0.28, 0.32);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const yawGroup = new THREE.Group();
      yawGroup.rotation.y = angle;

      const pitchGroup = new THREE.Group();
      pitchGroup.position.set(0, 0.06, 0.60);

      const petal = new THREE.Mesh(midPetalGeo, petalMaterialOuter);
      pitchGroup.add(petal);
      yawGroup.add(pitchGroup);
      lotusGroup.add(yawGroup);

      middlePetals.push({ pitchGroup });
    }

    // Petals Inner Whorl (8 Petals Cradling Ring)
    const innerPetals = [];
    const inPetalGeo = createLotusPetalGeometry(1.40, 0.72, 0.24, 0.26);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 16;
      const yawGroup = new THREE.Group();
      yawGroup.rotation.y = angle;

      const pitchGroup = new THREE.Group();
      pitchGroup.position.set(0, 0.10, 0.52);

      const petal = new THREE.Mesh(inPetalGeo, petalMaterialInner);
      pitchGroup.add(petal);
      yawGroup.add(pitchGroup);
      lotusGroup.add(yawGroup);

      innerPetals.push({ pitchGroup });
    }

    // Water Droplets on Petals
    const dropletGeo = new THREE.SphereGeometry(0.045, 12, 12);
    dropletGeo.scale(1, 0.55, 1);
    const dropCoords = [
      [0.35, 0.32, 1.15], [-0.28, 0.35, 1.1], [1.05, 0.25, 0.35],
      [-0.95, 0.30, -0.45], [0.55, 0.36, -0.95], [-0.45, 0.32, -1.05]
    ];
    dropCoords.forEach((c) => {
      const d = new THREE.Mesh(dropletGeo, waterDropletMaterial);
      d.position.set(c[0], c[1], c[2]);
      lotusGroup.add(d);
    });

    worldGroup.add(lotusGroup);

    // --- NODE B: GOLD WEDDING RING IN CENTER ---
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0.44, 0.05);
    // Front 3/4 camera view angle tilt
    ringGroup.rotation.set(0.38, -0.22, 0.14);

    const ringBandGeo = new THREE.TorusGeometry(0.66, 0.082, 32, 96);
    const ringBand = new THREE.Mesh(ringBandGeo, goldRingMaterial);
    ringGroup.add(ringBand);

    // 6-Prong Crown Setting
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.72, 0);

    const basketCollarGeo = new THREE.TorusGeometry(0.18, 0.022, 16, 32);
    const basketCollar = new THREE.Mesh(basketCollarGeo, goldRingMaterial);
    basketCollar.rotation.x = Math.PI / 2;
    crownGroup.add(basketCollar);

    const prongGeo = new THREE.CylinderGeometry(0.018, 0.026, 0.26, 12);
    const clawGeo = new THREE.SphereGeometry(0.028, 12, 12);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const ph = new THREE.Group();
      ph.rotation.y = a;

      const strut = new THREE.Mesh(prongGeo, goldRingMaterial);
      strut.position.set(0.20, 0.13, 0);
      strut.rotation.z = -0.12;
      ph.add(strut);

      const claw = new THREE.Mesh(clawGeo, goldRingMaterial);
      claw.position.set(0.22, 0.25, 0);
      claw.scale.set(1, 0.8, 1);
      ph.add(claw);

      crownGroup.add(ph);
    }

    // Solitaire Brilliant Diamond
    const diamondGeo = createBrilliantDiamondGeometry(0.32, 0.40);
    const diamond = new THREE.Mesh(diamondGeo, diamondMaterial);
    diamond.position.set(0, 0.14, 0);
    crownGroup.add(diamond);

    // Twinkling Diamond Starburst Flare
    const sparkleTexture = createSparkleTexture();
    const sparkleMat = new THREE.SpriteMaterial({
      map: sparkleTexture,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    const sparkleSprite = new THREE.Sprite(sparkleMat);
    sparkleSprite.scale.set(0.70, 0.70, 1);
    sparkleSprite.position.set(0, 0.32, 0);
    crownGroup.add(sparkleSprite);

    // Pavé Accent Diamonds
    const paveGeo = createBrilliantDiamondGeometry(0.065, 0.08);
    const paveAngles = [-0.14, -0.24, -0.34, 0.14, 0.24, 0.34];
    paveAngles.forEach((off) => {
      const a = Math.PI / 2 + off;
      const px = Math.cos(a) * 0.67;
      const py = Math.sin(a) * 0.67;

      const pave = new THREE.Mesh(paveGeo, diamondMaterial);
      pave.position.set(px, py, 0);
      pave.rotation.z = a - Math.PI / 2;
      ringGroup.add(pave);
    });

    ringGroup.add(crownGroup);
    worldGroup.add(ringGroup);

    // --- NODE C: LILY PADS GROUP (Floating Beside Lotus) ---
    const lilyPadsGroup = new THREE.Group();

    // 1. Large Main Lily Pad
    const pad1Geo = createCurvedLilyPadGeometry(1.5, 36);
    const pad1 = new THREE.Mesh(pad1Geo, lilyPadMaterial);
    pad1.position.set(-1.6, 0.015, -0.3);
    pad1.rotation.y = 0.45;
    lilyPadsGroup.add(pad1);

    const padDrop1 = new THREE.Mesh(dropletGeo, waterDropletMaterial);
    padDrop1.position.set(-1.6, 0.04, -0.3);
    lilyPadsGroup.add(padDrop1);

    // 2. Medium Lily Pad
    const pad2Geo = createCurvedLilyPadGeometry(1.15, 32);
    const pad2 = new THREE.Mesh(pad2Geo, lilyPadMaterial);
    pad2.position.set(1.55, 0.015, 0.55);
    pad2.rotation.y = -1.15;
    lilyPadsGroup.add(pad2);

    // 3. Small Young Lily Pad
    const pad3Geo = createCurvedLilyPadGeometry(0.80, 28);
    const pad3 = new THREE.Mesh(pad3Geo, lilyPadMaterial);
    pad3.position.set(1.25, 0.015, -1.25);
    pad3.rotation.y = 2.10;
    lilyPadsGroup.add(pad3);

    worldGroup.add(lilyPadsGroup);
    scene.add(worldGroup);

    // --- NODE D: FLOATING PETALS ON WATER SURFACE ---
    const floatingPetalCount = 18;
    const floatingPetals = [];
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.12, 0.2, 0, 0.36);
    petalShape.quadraticCurveTo(-0.12, 0.2, 0, 0);
    const waterPetalGeo = new THREE.ShapeGeometry(petalShape);
    waterPetalGeo.rotateX(Math.PI / 2); // lie flat on water

    for (let i = 0; i < floatingPetalCount; i++) {
      const angle = (i / floatingPetalCount) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 1.2 + Math.random() * 2.2;
      const pMesh = new THREE.Mesh(waterPetalGeo, petalMaterialOuter);
      pMesh.position.set(Math.cos(angle) * dist, 0.02, Math.sin(angle) * dist);
      pMesh.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.6 + Math.random() * 0.5;
      pMesh.scale.set(scale, scale, scale);

      floatingPetals.push({
        mesh: pMesh,
        angle: angle,
        dist: dist,
        driftSpeed: 0.002 + Math.random() * 0.003,
        rotSpeed: (Math.random() - 0.5) * 0.008
      });
      scene.add(pMesh);
    }

    // 7. Interactive Drag-to-Rotate & Cursor Parallax
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };
    let mouseParallax = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseParallax = { x: nx * 0.5, y: ny * 0.5 };

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        dragVelocity = { x: deltaX * 0.004, y: deltaY * 0.004 };
        worldGroup.rotation.y += dragVelocity.x;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const bloomDuration = 2800; // 2.8s organic blooming reveal

    replayTriggerRef.current = () => {
      bloomStartTimeRef.current = performance.now();
      setIsBloomed(false);
    };

    const computeBloomAngle = (closedAngle, openAngle, progress, delay, window) => {
      const localT = Math.max(0, Math.min(1, (progress - delay) / window));
      const ease = 1 - Math.pow(1 - localT, 3);
      return closedAngle + (openAngle - closedAngle) * ease;
    };

    // Pre-compile scene WebGL shaders so GPU is 100% prepared with 0 stutter
    renderer.compile(scene, camera);
    renderer.render(scene, camera);

    // Notify parent that the 3D model is compiled, rendered, and ready to bloom
    if (onReady) {
      requestAnimationFrame(() => {
        onReady();
      });
    }

    // 9. Animation Loop: Waves, Buoyant Floating & Staggered Bloom
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      // Blooming begins strictly after buffer screen has completely lifted
      let bloomProgress = 0.0;
      if (bloomStartTimeRef.current !== null) {
        const elapsedBloom = now - bloomStartTimeRef.current;
        bloomProgress = Math.min(1.0, elapsedBloom / bloomDuration);
      }

      if (bloomProgress >= 1.0 && !isBloomed) {
        setIsBloomed(true);
      }

      // --- A. ANIMATED WATER WAVE GEOMETRY DISPLACEMENT ---
      const posAttr = waterGeo.attributes.position;
      const posArr = posAttr.array;
      const vertCount = posArr.length / 3;

      for (let i = 0; i < vertCount; i++) {
        const bx = basePositions[i * 3];
        const bz = basePositions[i * 3 + 2];

        // Dual Gerstner-style harmonic wave calculation
        const wave1 = Math.sin(bx * 1.3 + elapsedTime * 1.6) * 0.022;
        const wave2 = Math.cos(bz * 1.5 + elapsedTime * 1.2) * 0.018;
        
        // Concentric ripple radiating outward from the floating lotus flower
        const dist = Math.sqrt(bx * bx + bz * bz);
        const ripple = Math.sin(dist * 3.6 - elapsedTime * 2.4) * Math.exp(-dist * 0.35) * 0.024;

        posArr[i * 3 + 1] = wave1 + wave2 + ripple;
      }
      posAttr.needsUpdate = true;
      waterGeo.computeVertexNormals();

      // --- B. FLOATING BUOYANCY (Lotus & Lily Pads Bobbing on Water) ---
      const waterBobY = Math.sin(elapsedTime * 1.4) * 0.028;
      const waterTiltZ = Math.sin(elapsedTime * 0.9) * 0.012;
      const waterTiltX = Math.cos(elapsedTime * 0.8) * 0.012;

      lotusGroup.position.y = 0.02 + waterBobY;
      lotusGroup.rotation.z = waterTiltZ;
      lotusGroup.rotation.x = waterTiltX;

      // Lily pads gently rock on the waves with slight phase offsets
      pad1.position.y = 0.015 + Math.sin(elapsedTime * 1.3 + 1.0) * 0.020;
      pad1.rotation.z = Math.sin(elapsedTime * 0.9 + 1.0) * 0.010;

      pad2.position.y = 0.015 + Math.sin(elapsedTime * 1.4 + 2.0) * 0.018;
      pad2.rotation.x = Math.cos(elapsedTime * 1.0 + 2.0) * 0.010;

      pad3.position.y = 0.015 + Math.sin(elapsedTime * 1.5 + 3.0) * 0.015;

      // Floating drift of petals on water
      floatingPetals.forEach(p => {
        p.angle += p.driftSpeed;
        p.mesh.position.x = Math.cos(p.angle) * p.dist;
        p.mesh.position.z = Math.sin(p.angle) * p.dist;
        p.mesh.position.y = 0.02 + Math.sin(elapsedTime * 1.2 + p.angle) * 0.015;
        p.mesh.rotation.y += p.rotSpeed;
      });

      // --- C. STAGGERED PETAL BLOOMING ANIMATION ---
      // Outer petals unfold first
      const outerPitch = computeBloomAngle(1.35, 0.44, bloomProgress, 0.0, 0.65);
      outerPetals.forEach(p => { p.pitchGroup.rotation.x = outerPitch; });

      // Middle petals unfold next
      const midPitch = computeBloomAngle(1.42, 0.30, bloomProgress, 0.20, 0.65);
      middlePetals.forEach(p => { p.pitchGroup.rotation.x = midPitch; });

      // Inner petals part gently to reveal the gold ring
      const innerPitch = computeBloomAngle(1.50, 0.18, bloomProgress, 0.40, 0.60);
      innerPetals.forEach(p => { p.pitchGroup.rotation.x = innerPitch; });

      // Gold Wedding Ring ascends into warm spotlight as lotus opens
      const ringRiseT = Math.max(0, Math.min(1, (bloomProgress - 0.40) / 0.60));
      const ringEase = 1 - Math.pow(1 - ringRiseT, 3);
      ringGroup.position.y = (0.24 + 0.20 * ringEase) + waterBobY;
      ringGroup.scale.setScalar(0.82 + 0.18 * ringEase);

      // Auto-rotation & Inertia
      if (!isDragging) {
        worldGroup.rotation.y += 0.0035 + dragVelocity.x;
        dragVelocity.x *= 0.94;
      }

      // Smooth camera parallax
      camera.position.x += (mouseParallax.x * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (2.4 - mouseParallax.y * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(0, 0.38, 0);

      // Diamond sparkle twinkle
      const twinkleWave = Math.sin(elapsedTime * 5.0) * 0.35 + 0.65;
      const diamondWorldPos = new THREE.Vector3();
      diamond.getWorldPosition(diamondWorldPos);
      const viewDot = Math.max(0, diamondWorldPos.clone().normalize().dot(new THREE.Vector3(0, 0, 1)));
      const flareScale = (Math.pow(viewDot, 1.8) * 0.65 + 0.30) * twinkleWave * ringEase;

      sparkleSprite.scale.set(flareScale, flareScale, 1);
      sparkleSprite.material.opacity = Math.min(1.0, flareScale * 1.5);
      sparkleSprite.material.rotation = elapsedTime * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      studioEnvMap.dispose();
      sparkleTexture.dispose();
      waterGeo.dispose();
      waterMaterial.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      petalMaterialOuter.dispose();
      petalMaterialInner.dispose();
      receptacleMaterial.dispose();
      stamenMaterial.dispose();
      lilyPadMaterial.dispose();
      goldRingMaterial.dispose();
      diamondMaterial.dispose();
      waterDropletMaterial.dispose();

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      if (bloomTriggerTimeoutRef.current) {
        clearTimeout(bloomTriggerTimeoutRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] flex items-center justify-center overflow-hidden select-none">
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top Floating Badges: Scene Elements & Download GLB */}
      <div className="absolute top-3 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-gold-300/80 shadow-sm text-[11px] font-semibold tracking-wider text-charcoal">
          <span className="text-sm">🌸</span>
          <span className="text-rani-800 font-bold">Blooming Lotus</span>
          <span className="text-charcoal/30">•</span>
          <span className="text-emerald-700 font-bold">Lily Pads</span>
          <span className="text-charcoal/30">•</span>
          <span className="text-gold-800 font-bold">18K Gold Ring</span>
        </div>

        <a
          href="/models/lotus.glb"
          download="lotus.glb"
          className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 hover:bg-gold-50 text-gold-900 border border-gold-300/80 shadow-sm text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105"
          title="Download Real-Time Web-Optimized 3D GLB Model (Lotus + Ring + LilyPads)"
        >
          <Download className="w-3.5 h-3.5 text-gold-700" />
          <span className="hidden sm:inline">Download</span> <span>lotus.glb (280KB)</span>
        </a>
      </div>

      {/* Bottom Interactive Control Bar: Replay Bloom & Navigation */}
      <div className="absolute bottom-3 z-10 flex flex-col sm:flex-row items-center gap-2 pointer-events-none">
        <button
          onClick={() => replayTriggerRef.current && replayTriggerRef.current()}
          className="pointer-events-auto px-4 py-1.5 rounded-full bg-gold-gradient hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          title="Watch the Lotus Petals Bloom on the Water Surface"
        >
          <RotateCw className="w-3.5 h-3.5 animate-spin-reverse" />
          <span>Replay Lotus Bloom 🌸</span>
        </button>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/80 backdrop-blur-md text-gold-900 border border-gold-300/70 shadow-sm">
          <Waves className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          <span>Calm Animated Water Waves • Drag to Rotate 3D Scene</span>
        </span>
      </div>
    </div>
  );
}
