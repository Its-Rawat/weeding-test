import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';

// Node.js FileReader polyfill for GLTFExporter binary export
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

console.log('Generating lotus.glb: Lotus + Ring + LilyPads (Water handled separately in Three.js)...');

// 1. Parametric Lotus Petal Geometry
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

// 2. Parametric Organic Curved Lily Pad Geometry
function createCurvedLilyPadGeometry(radius = 1.3, segments = 36) {
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  const rings = 4;
  const notchAngle = 0.52; // ~30 degree V-notch (sinus cleft)
  const startAngle = notchAngle / 2;
  const endAngle = Math.PI * 2 - notchAngle / 2;

  // Center depression
  vertices.push(0, -0.03, 0);
  uvs.push(0.5, 0.5);

  for (let rIdx = 1; rIdx <= rings; rIdx++) {
    const rFrac = rIdx / rings;
    const curR = radius * rFrac;
    // Edge curls slightly upward
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

// 3. Brilliant Cut Diamond Geometry
function createBrilliantDiamondGeometry(radius = 0.28, height = 0.35) {
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

  const centerTable = new THREE.Vector3(0, tableY, 0);
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    vertices.push(
      centerTable.x, centerTable.y, centerTable.z,
      tableVerts[i].x, tableVerts[i].y, tableVerts[i].z,
      tableVerts[next].x, tableVerts[next].y, tableVerts[next].z
    );
  }

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

  for (let i = 0; i < 16; i++) {
    const next = (i + 1) % 16;
    const gt1 = girdleTopVerts[i], gt2 = girdleTopVerts[next];
    const gb1 = girdleBottomVerts[i], gb2 = girdleBottomVerts[next];
    vertices.push(gt1.x, gt1.y, gt1.z, gb1.x, gb1.y, gb1.z, gt2.x, gt2.y, gt2.z);
    vertices.push(gt2.x, gt2.y, gt2.z, gb1.x, gb1.y, gb1.z, gb2.x, gb2.y, gb2.z);
  }

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

// Scene Root
const root = new THREE.Group();
root.name = 'Lotus_Wedding_Scene';

// 4. Materials
const petalMaterialOuter = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#FFB0BE'), // Dawn blush lotus pink
  roughness: 0.38,
  metalness: 0.04,
  side: THREE.DoubleSide
});
petalMaterialOuter.name = 'Material_Petal_Outer';

const petalMaterialInner = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#FFF2F6'), // Soft ivory pearl blush
  roughness: 0.32,
  metalness: 0.04,
  side: THREE.DoubleSide
});
petalMaterialInner.name = 'Material_Petal_Inner';

const receptacleMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#D8C358'), // Golden lime seed pericarp
  roughness: 0.42,
  metalness: 0.18
});
receptacleMaterial.name = 'Material_Receptacle';

const stamenMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#FFD700'),
  roughness: 0.28,
  metalness: 0.35
});
stamenMaterial.name = 'Material_Stamen';

const lilyPadMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#2D6A4F'), // Fresh rich lotus garden green
  roughness: 0.36,
  metalness: 0.08,
  side: THREE.DoubleSide
});
lilyPadMaterial.name = 'Material_LilyPad';

const goldRingMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#F2BA49'), // 18K Royal Gold
  roughness: 0.10,
  metalness: 0.98
});
goldRingMaterial.name = 'Material_Gold_Ring';

const diamondMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#FFFFFF'),
  roughness: 0.05,
  metalness: 0.05
});
diamondMaterial.name = 'Material_Diamond';

const dropletMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#EBF6FF'),
  roughness: 0.05,
  metalness: 0.05,
  transparent: true,
  opacity: 0.85
});
dropletMaterial.name = 'Material_Water_Droplet';

// ==========================================
// 1. LOTUS GROUP
// ==========================================
const lotusGroup = new THREE.Group();
lotusGroup.name = 'Lotus';

// Receptacle (pericarp seed pod)
const recGeo = new THREE.CylinderGeometry(0.70, 0.45, 0.40, 32);
const receptacle = new THREE.Mesh(recGeo, receptacleMaterial);
receptacle.name = 'Receptacle';
receptacle.position.set(0, 0.15, 0);
lotusGroup.add(receptacle);

// Golden Stamens
const stamensGroup = new THREE.Group();
stamensGroup.name = 'Stamens';
const stamenGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8);
const antherGeo = new THREE.SphereGeometry(0.024, 8, 8);
for (let i = 0; i < 48; i++) {
  const a = (i / 48) * Math.PI * 2;
  const sg = new THREE.Group();
  sg.position.set(Math.cos(a) * 0.72, 0.25, Math.sin(a) * 0.72);
  sg.rotation.y = a;
  sg.rotation.z = -0.22;

  const filament = new THREE.Mesh(stamenGeo, stamenMaterial);
  filament.position.set(0, 0.18, 0);
  sg.add(filament);

  const anther = new THREE.Mesh(antherGeo, stamenMaterial);
  anther.position.set(0, 0.36, 0);
  sg.add(anther);

  stamensGroup.add(sg);
}
lotusGroup.add(stamensGroup);

// Petals Outer (6 large petals)
const outerPetalsGroup = new THREE.Group();
outerPetalsGroup.name = 'Petals_Outer';
const outerPetalGeo = createLotusPetalGeometry(2.3, 1.15, 0.32, 0.38);
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const pg = new THREE.Group();
  pg.rotation.y = angle;

  const petal = new THREE.Mesh(outerPetalGeo, petalMaterialOuter);
  petal.name = 'Petal_Outer_' + (i + 1);
  petal.position.set(0, 0.02, 0.65);
  petal.rotation.x = Math.PI * 0.44;
  pg.add(petal);
  outerPetalsGroup.add(pg);
}
lotusGroup.add(outerPetalsGroup);

// Petals Middle (8 petals)
const middlePetalsGroup = new THREE.Group();
middlePetalsGroup.name = 'Petals_Middle';
const midPetalGeo = createLotusPetalGeometry(1.85, 0.90, 0.28, 0.32);
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
  const pg = new THREE.Group();
  pg.rotation.y = angle;

  const petal = new THREE.Mesh(midPetalGeo, petalMaterialOuter);
  petal.name = 'Petal_Middle_' + (i + 1);
  petal.position.set(0, 0.06, 0.60);
  petal.rotation.x = Math.PI * 0.30;
  pg.add(petal);
  middlePetalsGroup.add(pg);
}
lotusGroup.add(middlePetalsGroup);

// Petals Inner (8 petals)
const innerPetalsGroup = new THREE.Group();
innerPetalsGroup.name = 'Petals_Inner';
const inPetalGeo = createLotusPetalGeometry(1.40, 0.72, 0.24, 0.26);
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2 + Math.PI / 16;
  const pg = new THREE.Group();
  pg.rotation.y = angle;

  const petal = new THREE.Mesh(inPetalGeo, petalMaterialInner);
  petal.name = 'Petal_Inner_' + (i + 1);
  petal.position.set(0, 0.10, 0.52);
  petal.rotation.x = Math.PI * 0.18;
  pg.add(petal);
  innerPetalsGroup.add(pg);
}
lotusGroup.add(innerPetalsGroup);

// Water Droplets on Petals
const dropletsGroup = new THREE.Group();
dropletsGroup.name = 'Water_Droplets';
const dropletGeo = new THREE.SphereGeometry(0.045, 12, 12);
dropletGeo.scale(1, 0.55, 1);
const dropCoords = [
  [0.35, 0.32, 1.15], [-0.28, 0.35, 1.1], [1.05, 0.25, 0.35],
  [-0.95, 0.30, -0.45], [0.55, 0.36, -0.95], [-0.45, 0.32, -1.05]
];
dropCoords.forEach((c, idx) => {
  const d = new THREE.Mesh(dropletGeo, dropletMaterial);
  d.name = 'Water_Droplet_' + (idx + 1);
  d.position.set(c[0], c[1], c[2]);
  dropletsGroup.add(d);
});
lotusGroup.add(dropletsGroup);

root.add(lotusGroup);

// ==========================================
// 2. RING GROUP (In Center of Lotus)
// ==========================================
const ringGroup = new THREE.Group();
ringGroup.name = 'Ring';
ringGroup.position.set(0, 0.44, 0.05);
ringGroup.rotation.set(0.38, -0.22, 0.14); // Front 3/4 camera view tilt

// Band
const ringBandGeo = new THREE.TorusGeometry(0.66, 0.082, 32, 96);
const ringBand = new THREE.Mesh(ringBandGeo, goldRingMaterial);
ringBand.name = 'Ring_Band';
ringGroup.add(ringBand);

// Crown Setting & Prongs
const crownGroup = new THREE.Group();
crownGroup.name = 'Crown_Setting';
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

// Solitaire Diamond
const diamondGeo = createBrilliantDiamondGeometry(0.32, 0.40);
const diamond = new THREE.Mesh(diamondGeo, diamondMaterial);
diamond.name = 'Solitaire_Diamond';
diamond.position.set(0, 0.14, 0);
crownGroup.add(diamond);

// Pavé Diamonds
const paveGroup = new THREE.Group();
paveGroup.name = 'Pave_Diamonds';
const paveGeo = createBrilliantDiamondGeometry(0.065, 0.08);
const paveAngles = [-0.14, -0.24, -0.34, 0.14, 0.24, 0.34];
paveAngles.forEach((off, idx) => {
  const a = Math.PI / 2 + off;
  const px = Math.cos(a) * 0.67;
  const py = Math.sin(a) * 0.67;

  const pave = new THREE.Mesh(paveGeo, diamondMaterial);
  pave.name = 'Pave_Diamond_' + (idx + 1);
  pave.position.set(px, py, 0);
  pave.rotation.z = a - Math.PI / 2;
  paveGroup.add(pave);
});

ringGroup.add(crownGroup);
ringGroup.add(paveGroup);
root.add(ringGroup);

// ==========================================
// 3. LILY PADS GROUP (Floating on Water)
// ==========================================
const lilyPadsGroup = new THREE.Group();
lilyPadsGroup.name = 'LilyPads';

// Main Large Lily Pad
const pad1Geo = createCurvedLilyPadGeometry(1.5, 36);
const pad1 = new THREE.Mesh(pad1Geo, lilyPadMaterial);
pad1.name = 'LilyPad_Main';
pad1.position.set(-1.6, 0.01, -0.3);
pad1.rotation.y = 0.45;
lilyPadsGroup.add(pad1);

// Dew bead on main lily pad
const padDrop1 = new THREE.Mesh(dropletGeo, dropletMaterial);
padDrop1.name = 'LilyPad_Main_Dew_1';
padDrop1.position.set(-1.6, 0.03, -0.3);
lilyPadsGroup.add(padDrop1);

// Medium Lily Pad
const pad2Geo = createCurvedLilyPadGeometry(1.15, 32);
const pad2 = new THREE.Mesh(pad2Geo, lilyPadMaterial);
pad2.name = 'LilyPad_Medium';
pad2.position.set(1.55, 0.01, 0.55);
pad2.rotation.y = -1.15;
lilyPadsGroup.add(pad2);

// Small Young Lily Pad
const pad3Geo = createCurvedLilyPadGeometry(0.80, 28);
const pad3 = new THREE.Mesh(pad3Geo, lilyPadMaterial);
pad3.name = 'LilyPad_Small';
pad3.position.set(1.25, 0.01, -1.25);
pad3.rotation.y = 2.10;
lilyPadsGroup.add(pad3);

root.add(lilyPadsGroup);

// Export to GLB
const exporter = new GLTFExporter();
exporter.parse(
  root,
  (gltfBuffer) => {
    const buf = Buffer.from(gltfBuffer);
    fs.writeFileSync('./public/models/lotus.glb', buf);
    fs.writeFileSync('./public/models/blooming_lotus_ring.glb', buf);
    const stats = fs.statSync('./public/models/lotus.glb');
    console.log('SUCCESS: Exported lotus.glb size:', (stats.size / 1024).toFixed(1), 'KB');
    console.log('Hierarchy: Lotus + Ring + LilyPads (Water excluded from GLB as recommended).');
  },
  (error) => {
    console.error('Error during GLTF export:', error);
  },
  { binary: true }
);
