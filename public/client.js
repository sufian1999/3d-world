import * as THREE from './build/three.module.js'; // Changed path to relative
import Stats from './jsm/libs/stats.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

// Get the canvas element
const canvas = document.querySelector('.web-gl');

// Scene Setup
const scene = new THREE.Scene();

// Camera Setup
const fov = 50;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 25);
scene.add(camera);

// Render Setup
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.autoClear = false;

// Adding orbit controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 40;

// Loader for loading textures
let loader = new THREE.TextureLoader();
let textureArray = [];

// Load textures
let frontTexture = loader.load('./model/MarriottMadisonWest/front.jpg');
let backTexture = loader.load('./model/MarriottMadisonWest/back.jpg');
let topTexture = loader.load('./model/MarriottMadisonWest/top.jpg');
let bottomTexture = loader.load('./model/MarriottMadisonWest/bottom.jpg');
let rightTexture = loader.load('./model/MarriottMadisonWest/right.jpg');
let leftTexture = loader.load('./model/MarriottMadisonWest/left.jpg');

textureArray.push(new THREE.MeshBasicMaterial({ map: frontTexture }));
textureArray.push(new THREE.MeshBasicMaterial({ map: backTexture }));
textureArray.push(new THREE.MeshBasicMaterial({ map: topTexture }));
textureArray.push(new THREE.MeshBasicMaterial({ map: bottomTexture }));
textureArray.push(new THREE.MeshBasicMaterial({ map: leftTexture }));
textureArray.push(new THREE.MeshBasicMaterial({ map: rightTexture }));

for (let i = 0; i < textureArray.length; i++) {
    textureArray[i].side = THREE.BackSide;
}

// Creating the cube
const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
const skyBox = new THREE.Mesh(cubeGeometry, textureArray);
scene.add(skyBox);

// Render function to render the scene
const render = () => {
    renderer.render(scene, camera);
};

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    render();
};
animate();

// Resize window
const windowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', windowResize, false);

// Load the COCO-SSD model and detect objects
const detectObjects = async (imageElement) => {
    console.log('imageElement = ', imageElement);
    
    const model = await cocoSsd.load(); // Load the model
    console.log('model = ', model);
    
    // Create a canvas and draw the image
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    context.drawImage(imageElement, 0, 0);

    // Use the canvas for detection
    const predictions = await model.detect(canvas);
    console.log('predictions = ', predictions); // Log all predictions

    predictions.forEach(prediction => {
        // Now this prediction is defined inside the loop
        console.log(`Detected: ${prediction.class} at:`, prediction.bbox); // Log the class and bounding box
        if (prediction.class === 'door') {
            console.log(`Detected door at:`, prediction.bbox); // Log the bounding box coordinates
        }
    });
};


// Set a texture as the image for detection
const img = new Image();
img.src = './model/door1.jpg'; // Use the right texture for detection
img.onload = () => {
    console.log('Image loaded:', img); // Check if the image is loaded
    detectObjects(img);
};
img.onerror = () => {
    console.error('Error loading image');
};
