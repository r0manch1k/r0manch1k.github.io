import * as THREE from 'three'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

let scene, camera, renderer, grid;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a larger grid with bigger squares
    const size = 20000;
    const divisions =  150; // Reduced divisions for larger squares
    grid = new THREE.GridHelper(size, divisions, 0x00ff00, 0x00ff00);
    grid.position.y = -450; // Lower the grid to ensure it covers the bottom
    scene.add(grid);

    // Add fog to create depth effect
    scene.fog = new THREE.Fog(0x000000, 200, 5000);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 2; //intensity of glow
    bloomPass.radius = 0;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // Adjust camera position and angle
    camera.position.set(0, 100, 1000);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Move the grid towards the camera (slower speed)
    grid.position.z += 2; // Reduced speed from 5 to 2
    if (grid.position.z > 2000) {
        grid.position.z = 0;
    }

    renderer.render(scene, camera);
}

// Wrap the init() call in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    init();
});