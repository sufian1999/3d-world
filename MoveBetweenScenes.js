//Paste this code in clients.js to make it run
import * as THREE from '/build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

// Canvas and Renderer Setup
const canvas = document.querySelector('.web-gl');
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);

// Variables for scenes
let currentScene = 'first';  // Keep track of which scene is active

// Raycaster and mouse for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Camera Setup
const fov = 50;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 25);

// Controls Setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 40;

// Loader and textures for the first scene
const loader = new THREE.TextureLoader();
let textureArray1 = [];

// First scene textures
let frontTexture = loader.load('./model/MarriottMadisonWest/front.jpg');
let backTexture = loader.load('./model/MarriottMadisonWest/back.jpg');
let topTexture = loader.load('./model/MarriottMadisonWest/top.jpg');
let bottomTexture = loader.load('./model/MarriottMadisonWest/bottom.jpg');
let leftTexture = loader.load('./model/MarriottMadisonWest/left.jpg');
let rightTexture = loader.load('./model/MarriottMadisonWest/right.jpg');

textureArray1.push(new THREE.MeshBasicMaterial({ map: frontTexture }));
textureArray1.push(new THREE.MeshBasicMaterial({ map: backTexture }));
textureArray1.push(new THREE.MeshBasicMaterial({ map: topTexture }));
textureArray1.push(new THREE.MeshBasicMaterial({ map: bottomTexture }));
textureArray1.push(new THREE.MeshBasicMaterial({ map: leftTexture }));
textureArray1.push(new THREE.MeshBasicMaterial({ map: rightTexture }));

// Making cube for the first scene
const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
const skyBox1 = new THREE.Mesh(cubeGeometry, textureArray1);
for (let i = 0; i < textureArray1.length; i++) {
    textureArray1[i].side = THREE.BackSide;
}

// Scene 1
const scene1 = new THREE.Scene();
scene1.add(camera);
scene1.add(skyBox1);

// Loader and textures for the second scene
let textureArray2 = [];

// Second scene textures
let frontTexture2 = loader.load('./model/heaven/front.jpg');
let backTexture2 = loader.load('./model/heaven/back.jpg');
let topTexture2 = loader.load('./model/heaven/top.jpg');
let bottomTexture2 = loader.load('./model/heaven/bottom.jpg');
let leftTexture2 = loader.load('./model/Vasa/left.jpg');
let rightTexture2 = loader.load('./model/heaven/right.jpg');

textureArray2.push(new THREE.MeshBasicMaterial({ map: frontTexture2 }));
textureArray2.push(new THREE.MeshBasicMaterial({ map: backTexture2 }));
textureArray2.push(new THREE.MeshBasicMaterial({ map: topTexture2 }));
textureArray2.push(new THREE.MeshBasicMaterial({ map: bottomTexture2 }));
textureArray2.push(new THREE.MeshBasicMaterial({ map: leftTexture2 }));
textureArray2.push(new THREE.MeshBasicMaterial({ map: rightTexture2 }));

// Making cube for the second scene
const skyBox2 = new THREE.Mesh(cubeGeometry, textureArray2);
for (let i = 0; i < textureArray2.length; i++) {
    textureArray2[i].side = THREE.BackSide;
}

// Scene 2
const scene2 = new THREE.Scene();
scene2.add(camera);
scene2.add(skyBox2);

// Function to switch to the second scene
function switchToScene2() {
    currentScene = 'second';
    controls.reset();  // Reset controls to prevent old camera issues
    animate();         // Start the animation loop for the second scene
}

// Function to switch back to the first scene
function switchToScene1() {
    currentScene = 'first';
    controls.reset();  // Reset controls to prevent old camera issues
    animate();         // Start the animation loop for the first scene
}

// Raycast function to detect clicks
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections in the first scene
    if (currentScene === 'first') {
        const intersects = raycaster.intersectObject(skyBox1);
        if (intersects.length > 0) {
            const faceIndex = intersects[0].face.materialIndex;  // Detect which face was clicked
            if (faceIndex === 5) {  // RightTexture is typically at index 5
                switchToScene2();
            }
        }
    }
    // Check intersections in the second scene
    else if (currentScene === 'second') {
        const intersects = raycaster.intersectObject(skyBox2);
        if (intersects.length > 0) {
            const faceIndex = intersects[0].face.materialIndex;  // Detect which face was clicked
            if (faceIndex === 4) {  // LeftTexture in the second scene
                switchToScene1();
            }
        }
    }
}

// Add mouse click event listener
window.addEventListener('click', onMouseClick, false);

// Render function to render the appropriate scene
const render = () => {
    if (currentScene === 'first') {
        renderer.render(scene1, camera);
    } else if (currentScene === 'second') {
        renderer.render(scene2, camera);
    }
};

// Animation function
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    render();
};
animate();

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
});
