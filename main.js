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
camera.position.z = 100;
camera.lookAt(scene.position);

// TODO: Create table of realistic proportions
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
