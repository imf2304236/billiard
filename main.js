'use strict';

// Initialize webGL Renderer
const canvas = document.getElementById('mycanvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setClearColor('rgb(255, 255, 255)');

// Create scene & camera
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const camera =
    new THREE.PerspectiveCamera(
        45, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 45, 100);
camera.lookAt(scene.position);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(0, 100, 0);
scene.add(light);

// Create table of realistic proportions
const tableWidth = 45;
const tableHeight = 90;
const tableColor = 'green';
const tableGeometry = new THREE.PlaneBufferGeometry(tableWidth, tableHeight);
const tableMaterial =
    new THREE.MeshPhongMaterial({color: tableColor, side: THREE.DoubleSide});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotateX(Math.PI / 2);
scene.add(table);

// TODO: Add cushions
// TODO: Add legs
// TODO: Place table on ground
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
