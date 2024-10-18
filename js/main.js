import * as THREE from 'three'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js'

let scene, camera, renderer, grid, composer;

let colors = [
    0xfff,
    0x3c8296,
    0xf04114,
    0xf6019d,
    0x9700cc,
    0xffd319
]

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    document.body.appendChild(renderer.domElement);

    // const loader = new THREE.TextureLoader();
    // loader.load(
    //     'js/stars.jpg',
    //     (texture) => {
    //         const starsSphereGeometry = new THREE.SphereGeometry(5000, 1, 1);
    //         texture.colorSpace = THREE.SRGBColorSpace;
    //         const starsMaterial = new THREE.MeshBasicMaterial({
    //             map: texture,
    //             side: THREE.BackSide,
    //             transparent: true,
    //         });
    //         const starsSphere = new THREE.Mesh(starsSphereGeometry, starsMaterial);
    //         starsSphere.position.set(0, 0, -2500);
    //         scene.add(starsSphere);
    //     }
    // );

    const size = 30000;
    const divisions =  150;
    grid = new THREE.GridHelper(size, divisions, 0x3c8296, 0x3c8296); // 0xf04114
    grid.position.y = -450;
    scene.add(grid);

    // scene.fog = new THREE.Fog(0xfff, -2000, 15000);
    scene.fog = new THREE.FogExp2(0xf6019d, 0.0001);

    const geometry = new THREE.IcosahedronGeometry(150, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xfaaa0a });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, -2500);
    scene.add(sphere);

    composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        10,
        1,
        0
    );
    composer.renderToScreen = true;
    composer.addPass(bloomPass);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    grid.position.z += 2;
    if (grid.position.z > 2000) {
        grid.position.z = 0;
    }

    camera.fov -= 0.0005
    if (camera.fov < 2) {
        camera.fov = 100;
    }
    camera.updateProjectionMatrix();

    // renderer.render(scene, camera);
    composer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = Math.floor( canvas.clientWidth  * pixelRatio );
    const height = Math.floor( canvas.clientHeight * pixelRatio );
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
    }
    camera.updateProjectionMatrix();
});