'use strict';

const UNITS_PER_MM = 0.1;
const UNITS_PER_M = 1000 * UNITS_PER_MM;

// Initialize webGL Renderer
const canvas = document.getElementById('mycanvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setClearColor('rgb(255, 255, 255)');

// Create scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

// Create table
const tableLength = 2700 * UNITS_PER_MM;
const tableWidth = tableLength / 2;
const tableHeight = 775 * UNITS_PER_MM;
const tableColor = 'darkgreen';
const tableGeometry = new THREE.PlaneBufferGeometry(tableWidth, tableLength);
const tableMaterial =
    new THREE.MeshPhongMaterial({
      color: tableColor,
      side: THREE.DoubleSide,
    });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotateX(-Math.PI / 2);
table.position.y = tableHeight;
scene.add(table);

// Create cushions
const sideCushionWidth = tableWidth / 15;
const sideCushionHeight = sideCushionWidth;
const sideCushionLength = tableLength + sideCushionWidth * 2;
const cushionColor = tableColor;
const sideCushionGeometry =
    new THREE.BoxBufferGeometry(
        sideCushionWidth, sideCushionHeight, sideCushionLength);
const sideCushionMaterial = new THREE.MeshPhongMaterial({color: cushionColor});
const sideCushions = [
  new THREE.Mesh(sideCushionGeometry, sideCushionMaterial),
  new THREE.Mesh(sideCushionGeometry, sideCushionMaterial),
];
sideCushions[0].position.x = -(tableWidth / 2 + sideCushionWidth / 2);
sideCushions[1].position.x = tableWidth / 2 + sideCushionWidth / 2;
sideCushions[0].position.y = tableHeight + sideCushionHeight / 2;
sideCushions[1].position.y = tableHeight + sideCushionHeight / 2;
scene.add(sideCushions[0]);
scene.add(sideCushions[1]);

const backCushionWidth = tableWidth + 2 * sideCushionWidth;
const backCushionHeight = sideCushionHeight;
const backCushionDepth = sideCushionWidth;
const backCushionGeometry =
    new THREE.BoxBufferGeometry(
        backCushionWidth, backCushionHeight, backCushionDepth);
const backCushionMaterial = new THREE.MeshPhongMaterial({color: cushionColor});
const backCushions = [
  new THREE.Mesh(backCushionGeometry, backCushionMaterial),
  new THREE.Mesh(backCushionGeometry, backCushionMaterial),
];
backCushions[0].position.y = sideCushions[0].position.y;
backCushions[1].position.y = sideCushions[0].position.y;
backCushions[0].position.z = -tableLength / 2 - sideCushionWidth / 2;
backCushions[1].position.z = tableLength / 2 + sideCushionWidth / 2;
scene.add(backCushions[0]);
scene.add(backCushions[1]);

// Add legs
const legColor = 'saddlebrown';
const legWidth = sideCushionWidth * 1.5;
const legHeight = tableHeight;
const legDepth = legWidth;
const legGeometry = new THREE.BoxBufferGeometry(legWidth, legHeight, legDepth);
const legMaterial = new THREE.MeshPhongMaterial({color: legColor});
const legs = [];
const legYOffset = -0.5 * UNITS_PER_MM;
for (let i = 0; i < 4; ++i) {
  const leg = new THREE.Mesh(legGeometry, legMaterial);
  legs.push(leg);
  leg.position.y = legHeight / 2 + legYOffset;
  scene.add(leg);
}
legs[0].position.x = -(tableWidth - sideCushionWidth) / 2;
legs[1].position.x = -(tableWidth - sideCushionWidth) / 2;
legs[2].position.x = (tableWidth - sideCushionWidth) / 2;
legs[3].position.x = (tableWidth - sideCushionWidth) / 2;
legs[0].position.z = -(tableLength - sideCushionWidth) / 2;
legs[1].position.z = (tableLength - sideCushionWidth) / 2;
legs[2].position.z = -(tableLength - sideCushionWidth) / 2;
legs[3].position.z = (tableLength - sideCushionWidth) / 2;

// Add ground
const groundWidth = 10 * UNITS_PER_M;
const groundHeight = 10 * UNITS_PER_M;
const groundColor = 'grey';
const groundYOffset = -1.5 * UNITS_PER_MM;
const groundGeometry = new THREE.PlaneBufferGeometry(groundWidth, groundHeight);
const groundMaterial =
    new THREE.MeshPhongMaterial({color: groundColor, side: THREE.DoubleSide});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotateX(-Math.PI / 2);
ground.position.y = groundYOffset;
scene.add(ground);

// Add camera
const cameraFov = 45;
const cameraAspect = canvas.width / canvas.height;
const cameraNear = UNITS_PER_MM;
const cameraFar = 10000 * UNITS_PER_MM;
const cameraInitialPosition = [0, tableHeight * 2, tableLength];
const camera =
    new THREE.PerspectiveCamera(
        cameraFov, cameraAspect, cameraNear, cameraFar);
camera.position.set(...cameraInitialPosition);
camera.lookAt(scene.position);

// Add lighting
const ambientLightColor = 0x606060;
const ambientLight = new THREE.AmbientLight(ambientLightColor);
scene.add(ambientLight);

const directionalLightColor = 'white';
const directionalLight = new THREE.DirectionalLight(directionalLightColor);
directionalLight.position.set(0, tableHeight * 2, 0);
scene.add(directionalLight);

// TODO: Add 8 billiard balls as wireframe models of realistic size
// TODO: Place balls at random, non-overlapping positions on the table
// TODO: Move each balls according to its own random velocity vector
// TODO: Reduce velocity of each ball by 20% per second due to friction
// TODO: Make sure the balls are rolling without slip and not just sliding
// TODO: Reduce the velocity of each ball by 20% at each reflection
// TODO: Add the texture images to the balls
// TODO: Implement elastic collisions between the balls
// TODO: Reduce the speed of each ball by 30 % at each of its collision.
// TODO: Add ceiling
// TODO: Add a spotlight above the table
// TODO: Add lightbulb
// TODO: Add cord
// TODO: Add shadow to table
// TODO: Add shadows to balls

const controls = new THREE.TrackballControls(camera, canvas);

/**
 * Renders frame
 */
function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}

render();
