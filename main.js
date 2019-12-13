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
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('rgb(255, 255, 255)');
renderer.shadowMap.enabled = true;
// Create scene
const scene = new THREE.Scene();

// Create table
const tableLength = 2700 * UNITS_PER_MM;
const tableWidth = tableLength / 2;
const tableHeight = 775 * UNITS_PER_MM;
const tableColor = 'darkgreen';
const tableGeometry = new THREE.BoxGeometry(tableWidth, tableLength, 1);
const tableMaterial =
  new THREE.MeshPhongMaterial({
    color: tableColor,
  });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotateX(-Math.PI / 2);
table.position.y = tableHeight;

table.castShadow = true;
table.receiveShadow = true;

scene.add(table);

// Create cushions
const sideCushionWidth = tableWidth / 15;
const sideCushionHeight = sideCushionWidth;
const sideCushionLength = tableLength + sideCushionWidth * 2;
const cushionColor = tableColor;
const sideCushionGeometry =
  new THREE.BoxBufferGeometry(
    sideCushionWidth, sideCushionHeight, sideCushionLength);
const sideCushionMaterial = new THREE.MeshPhongMaterial({ color: cushionColor });
const sideCushions = [
  new THREE.Mesh(sideCushionGeometry, sideCushionMaterial),
  new THREE.Mesh(sideCushionGeometry, sideCushionMaterial),
];
sideCushions[0].position.x = -(tableWidth / 2 + sideCushionWidth / 2);
sideCushions[1].position.x = tableWidth / 2 + sideCushionWidth / 2;
sideCushions[0].position.y = tableHeight + sideCushionHeight / 2;
sideCushions[1].position.y = tableHeight + sideCushionHeight / 2;

sideCushions[0].castShadow = true;
sideCushions[0].receiveShadow = true;
sideCushions[1].castShadow = true;
sideCushions[1].receiveShadow = true;

scene.add(sideCushions[0]);
scene.add(sideCushions[1]);

const backCushionWidth = tableWidth + 2 * sideCushionWidth;
const backCushionHeight = sideCushionHeight;
const backCushionDepth = sideCushionWidth;
const backCushionGeometry =
  new THREE.BoxBufferGeometry(
    backCushionWidth, backCushionHeight, backCushionDepth);
const backCushionMaterial = new THREE.MeshPhongMaterial({ color: cushionColor });
const backCushions = [
  new THREE.Mesh(backCushionGeometry, backCushionMaterial),
  new THREE.Mesh(backCushionGeometry, backCushionMaterial),
];
backCushions[0].position.y = sideCushions[0].position.y;
backCushions[1].position.y = sideCushions[0].position.y;
backCushions[0].position.z = -tableLength / 2 - sideCushionWidth / 2;
backCushions[1].position.z = tableLength / 2 + sideCushionWidth / 2;

backCushions[0].castShadow = true;
backCushions[0].receiveShadow = true;
backCushions[1].castShadow = true;
backCushions[1].receiveShadow = true;

scene.add(backCushions[0]);
scene.add(backCushions[1]);

// Add legs
const legColor = 'saddlebrown';
const legWidth = sideCushionWidth * 1.5;
const legHeight = tableHeight;
const legDepth = legWidth;
const legGeometry = new THREE.BoxBufferGeometry(legWidth, legHeight, legDepth);
const legMaterial = new THREE.MeshPhongMaterial({ color: legColor });
const legs = [];
const legYOffset = -2 * UNITS_PER_MM;
for (let i = 0; i < 4; ++i) {
  const leg = new THREE.Mesh(legGeometry, legMaterial);
  legs.push(leg);
  leg.position.y = legHeight / 2 + legYOffset;

  legs[i].castShadow = true;
  legs[i].receiveShadow = true;

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
const groundGeometry = new THREE.BoxBufferGeometry(groundWidth, groundHeight);
const groundMaterial =
  new THREE.MeshPhongMaterial({ color: groundColor, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotateX(-Math.PI / 2);
ground.position.y = groundYOffset;

ground.receiveShadow = true;

scene.add(ground);

// Add billiard balls
const numberOfBalls = 8;
const balls = [];
const ballRadius = 57.15 * UNITS_PER_MM / 2;
const ballRadiusSquared = ballRadius * ballRadius;
const ballDiameter = ballRadius * 2;
const ballColor = 'white';
const ballGeometryWidthSegments = 64;
const ballGeometryHeightSegments = 64;
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
  const newBall = new THREE.Mesh(ballGeometry, ballMaterial);

  newBall.castShadow = true;
  newBall.receiveShadow = true;

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
// ambientLight.castShadow = true;
scene.add(ambientLight);

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
ceiling.position.set(0, tableHeight * 5, 0);
scene.add(ceiling);

// Add lightbulb
const lightbulbColor = 'white';
const lightbulbRadius = 100 * UNITS_PER_MM;
const lightbulbGeometry =
    new THREE.SphereBufferGeometry(
        lightbulbRadius, ballGeometryWidthSegments, ballGeometryHeightSegments);
const lightbulbMaterial = new THREE.MeshPhongMaterial({color: lightbulbColor});
const lightbulb = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);
lightbulb.position.set(0, ceiling.position.y - 100, 0);
scene.add(lightbulb);

// Add cord
const cordRadius = 1;
const cordHeight = ceiling.position.y - lightbulb.position.y - lightbulbRadius;
const cordGeometry =
  new THREE.CylinderBufferGeometry(cordRadius, cordRadius, cordHeight);
const cordMaterial = new THREE.MeshBasicMaterial({color: 'black'});
const cord = new THREE.Mesh(cordGeometry, cordMaterial);
cord.position.y = lightbulb.position.y + cordHeight / 2;
scene.add(cord);

// Add spotlight
const spotlightColor = lightbulbColor;
const spotlight = new THREE.SpotLight(spotlightColor);
spotlight.position.set(1, 200, 10);
spotlight.castShadow = true;

scene.add(spotlight);
scene.add(spotlight.target);
spotlight.target = table;

// Set up shadow properties for the light
spotlight.shadow.mapSize.width = 4092;
spotlight.shadow.mapSize.height = 4092;
spotlight.shadow.camera.near = 0.5;
spotlight.shadow.camera.far = 500;

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

  for (let i = 0; i != balls.length; ++i) {
    const ball = balls[i];

    // Elastic Collisions:
    for (let j = i + 1; j != balls.length; ++j) {
      if (!ball.collided && !balls[j].collided) {
        const dist = ball.currentPosition.clone();
        dist.sub(balls[j].currentPosition);
        const distSq = dist.lengthSq();
        if (distSq <= 4 * ballRadiusSquared) {
          const diffU = ball.velocity.clone().sub(balls[j].velocity);
          const factor = dist.dot(diffU) / distSq;
          ball.velocity.sub(dist.clone().multiplyScalar(factor));
          balls[j].velocity.add(dist.clone().multiplyScalar(factor));

          ball.rotateAndTranslate();
          balls[j].rotateAndTranslate();
        }
      }
    }

    balls.forEach((ball) => {
      ball.castShadow = true;
      ball.receiveShadow = true;
    });

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
