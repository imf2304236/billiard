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
