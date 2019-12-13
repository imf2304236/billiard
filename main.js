'use strict';

const UNITS_PER_MM = 0.1;
const UNITS_PER_M = 1000 * UNITS_PER_MM;

/**
 * Checks if a number is within an interval range
 * @param {Number} number
 * @param {Number} lowerBound
 * @param {Number} upperBound
 * @return {Boolean} `true` if `number` is within the interval,
 * otherwise `false`
 */
function inRange(number, lowerBound, upperBound) {
  return lowerBound < number && number < upperBound;
}

/**
 * Checks if two balls are overlapping
 * @param {THREE.Vector3} ball1Position
 * @param {THREE.Vector3} ball2Position
 * @param {Number} ballRadius
 * @return {Boolean} `true` if balls are overlapping, otherwise `false`
 */
function areBallsOverlapping(ball1Position, ball2Position, ballRadius) {
  let result = false;

  const ball1LowerBoundX = ball1Position.x - ballRadius;
  const ball1UpperBoundX = ball1Position.x + ballRadius;
  const ball1LowerBoundZ = ball1Position.z - ballRadius;
  const ball1UpperBoundZ = ball1Position.z + ballRadius;

  const ball2LowerBoundX = ball2Position.x - ballRadius;
  const ball2UpperBoundX = ball2Position.x + ballRadius;
  const ball2LowerBoundZ = ball2Position.z - ballRadius;
  const ball2UpperBoundZ = ball2Position.z + ballRadius;

  if (
    (
      inRange(ball1LowerBoundX, ball2LowerBoundX, ball2UpperBoundX) ||
          inRange(ball1UpperBoundX, ball2LowerBoundX, ball2UpperBoundX)
    ) && (
      inRange(ball1LowerBoundZ, ball2LowerBoundZ, ball2UpperBoundZ) ||
          inRange(ball1UpperBoundZ, ball2LowerBoundZ, ball2UpperBoundZ)
    )
  ) {
    result = true;
  }

  return result;
}

// Initialize webGL Renderer
const canvas = document.getElementById('mycanvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setClearColor('rgb(255, 255, 255)');

// Create scene
const scene = new THREE.Scene();

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
const legYOffset = -2 * UNITS_PER_MM;
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
const groundYOffset = -5 * UNITS_PER_MM;
const groundGeometry = new THREE.PlaneBufferGeometry(groundWidth, groundHeight);
const groundMaterial =
    new THREE.MeshPhongMaterial({color: groundColor, side: THREE.DoubleSide});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotateX(-Math.PI / 2);
ground.position.y = groundYOffset;
scene.add(ground);

// Add billiard balls
const numberOfBalls = 8;
const balls = [];
const ballRadius = 57.15 * UNITS_PER_MM / 2;
const ballRadiusSquared = ballRadius * ballRadius;
const ballDiameter = ballRadius * 2;
const ballColor = 'white';
const ballGeometryWidthSegments = 16;
const ballGeometryHeightSegments = 16;
const ballGeometry =
    new THREE.SphereGeometry(
        ballRadius, ballGeometryWidthSegments, ballGeometryHeightSegments);

for (let i = 0; i < numberOfBalls; ++i) {
  // Add the texture images to the balls
  const image = new Image();
  image.src = imgBase64Array[i];
  const texture = new THREE.Texture(image);
  image.onloadend = () => texture.needsUpdate = true;
  const ballMaterial =
    new THREE.MeshPhongMaterial({color: ballColor, map: texture});
    // new THREE.MeshPhongMaterial({color: ballColor, wireframe: true});
  const newBall = new THREE.Mesh(ballGeometry, ballMaterial);
  newBall.matrixAutoUpdate = false;

  // Place balls at random, non-overlapping positions on the table
  let ballsAreOverlapping = false;
  do {
    newBall.currentPosition =
        new THREE.Vector3(
            (Math.random() - 0.5) * (tableWidth - ballDiameter),
            table.position.y + ballRadius,
            (Math.random() - 0.5) * (tableLength - ballDiameter),
        );
    for (const ball of balls) {
      if (
        areBallsOverlapping(
            ball.currentPosition, newBall.currentPosition, ballRadius)
      ) {
        ballsAreOverlapping = true;
        break;
      }
    }
  } while (ballsAreOverlapping);

  // Assign a random velocity vector to each ball
  const velocityScalar = UNITS_PER_M * 2;
  newBall.velocity =
      new THREE.Vector3(
          velocityScalar * (Math.random() - 0.5),
          0,
          velocityScalar * (Math.random() - 0.5),
      );

  // axis and angular velocity of rotational motion
  newBall.ax = new THREE.Vector3(0, 1, 0).cross(newBall.velocity).normalize();
  newBall.omega = newBall.velocity.length() / ballRadius;

  newBall.clock = new THREE.Clock();

  balls.push(newBall);
  scene.add(newBall);
}

// Add camera
const cameraFov = 45;
const cameraAspect = canvas.width / canvas.height;
const cameraNear = 0.1;
const cameraFar = 1000;
const cameraInitialPosition = [tableWidth, tableHeight * 3, tableLength];
const camera =
    new THREE.PerspectiveCamera(
        cameraFov, cameraAspect, cameraNear, cameraFar);
camera.position.set(...cameraInitialPosition);
camera.lookAt(scene.position);

// Add ambient light
const ambientLightColor = 0x606060;
const ambientLight = new THREE.AmbientLight(ambientLightColor);
scene.add(ambientLight);

// Add directional light
const directionalLightColor = 'white';
const directionalLight = new THREE.DirectionalLight(directionalLightColor);
directionalLight.position.set(0, tableHeight * 2, 0);
scene.add(directionalLight);

// Add ceiling
const ceilingGeometry =
    new THREE.PlaneBufferGeometry(
        tableWidth * 2, tableLength * 2, tableHeight * 2);
const ceilingMaterial =
    new THREE.MeshPhongMaterial({
      color: legColor,
      side: THREE.DoubleSide,
    });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.rotateX(-Math.PI / 2);
ceiling.position.set(0, tableHeight * 4, 0);
scene.add(ceiling);

// TODO: Add a spotlight above the table
// TODO: Add lightbulb
// TODO: Add cord
// TODO: Add shadow to table
// TODO: Add shadows to balls

const controls = new THREE.TrackballControls(camera, canvas);

/**
 * Rotates & translates
 */
THREE.Mesh.prototype.rotateAndTranslate = function() {
  this.deltaTime = this.clock.getDelta();

  // Reduce velocity of each ball by 20% per second due to friction
  this.velocity.sub(this.velocity.clone().multiplyScalar(0.2 * this.deltaTime));

  // Move each ball according to its velocity vector
  this.deltaPosition = this.velocity.clone().multiplyScalar(this.deltaTime);
  this.currentPosition.add(this.deltaPosition);

  // dR: incremental rotation matrix that performs
  // the rotation of the current time step.
  this.dR = new THREE.Matrix4();

  this.ax = new THREE.Vector3(0, 1, 0).cross(this.velocity).normalize();
  this.omega = this.velocity.length() / ballRadius;

  // multiply with dR from the left
  // (matrix.multiply multiplies from the right!)
  this.dR.makeRotationAxis(this.ax, this.omega * (0.8 * this.deltaTime));

  this.matrix.premultiply(this.dR);
  // set translational part of matrix to current position:
  this.matrix.setPosition(this.currentPosition);
};

/**
 * Renders frame
 */
function render() {
  requestAnimationFrame(render);

  for (const ball of balls) {
    ball.collided = false;
  }

  for (let i = 0; i != balls.length; ++i) {
    const ball = balls[i];

    // Elastic Collisions:
    for (let j = i + 1; j != balls.length; ++j) {
      if (!ball.collided && !balls[j].collided) {
        const dist = ball.currentPosition.clone();
        dist.sub(balls[j].currentPosition);
        const distSq = dist.lengthSq();
        if (distSq <= 4 * ballRadiusSquared) {
          ball.collided = true;
          balls[j].collided = true;
          const diffU = ball.velocity.clone().sub(balls[j].velocity);
          const factor = dist.dot(diffU) / distSq;
          ball.velocity.sub(dist.clone().multiplyScalar(factor));
          balls[j].velocity.add(dist.clone().multiplyScalar(factor));
          // ball.velocity.multiplyScalar(0.9);
          // balls[j].velocity.multiplyScalar(0.9);

          ball.rotateAndTranslate();
          balls[j].rotateAndTranslate();
        }
      }
    }

    // Specular Reflection:
    // Velocity of each ball reduced by 20% at each reflection
    if (ball.currentPosition.x + ballRadius > tableWidth / 2) {
      ball.velocity.x = -Math.abs(ball.velocity.x) * 0.8;
    }
    if (ball.currentPosition.x - ballRadius < -tableWidth / 2) {
      ball.velocity.x = Math.abs(ball.velocity.x) * 0.8;
    }
    if (ball.currentPosition.z + ballRadius > tableLength / 2) {
      ball.velocity.z = -Math.abs(ball.velocity.z) * 0.8;
    }
    if (ball.currentPosition.z - ballRadius < -tableLength / 2) {
      ball.velocity.z = Math.abs(ball.velocity.z) * 0.8;
    }

    ball.rotateAndTranslate();
  }

  controls.update();
  renderer.render(scene, camera);
}

render();
