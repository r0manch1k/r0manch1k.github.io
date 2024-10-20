import * as THREE from 'three'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js'
import {FirstPersonControls} from "three/addons/controls/FirstPersonControls.js";
// import {AsciiEffect} from "three/addons/effects/AsciiEffect.js";

let scene, camera, renderer, grid, composer, controls, clock, stars;

let colors = [
    0xfff,
    0x3c8296,
    0xf04114,
    0xf6019d,
    0x9700cc,
    0xffd319,
    0xd24922
]

function init() {

    clock = new THREE.Clock();

    //

    scene = new THREE.Scene();

    //

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0;

    //

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    document.body.appendChild(renderer.domElement);

    //

    const starsGeo = new THREE.BufferGeometry();
    const points = []

    for (let i = 0; i < 5000; i++) {
        const vertex_p = new THREE.Vector3();
        vertex_p.x = Math.random() * 2000;
        vertex_p.y = Math.random() * 2000 - 10;
        vertex_p.z = -Math.random() * 1000 - 10;
        points.push(vertex_p);

        const vertex_n = new THREE.Vector3();
        vertex_n.x = -Math.random() * 2000;
        vertex_n.y = Math.random() * 2000 - 10;
        vertex_n.z = -Math.random() * 1000 - 10;
        points.push(vertex_n);
    }

    const starsMat = new THREE.PointsMaterial({color: 0x888888});

    starsGeo.setFromPoints(points);
    stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    //
    //

    const size = 30000;
    const divisions = 150;
    grid = new THREE.GridHelper(size, divisions, 0x3c8296, 0x3c8296); // 0xf04114
    grid.position.y = -450;
    scene.add(grid);

    //

    scene.fog = new THREE.Fog(0x9700cc, -2000, 15000);
    // scene.fog = new THREE.FogExp2(0xfff, 0.0001);

    //

    const geometry = new THREE.IcosahedronGeometry(150, 5);
    const material = new THREE.MeshBasicMaterial({color: 0xffd319});
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
        1.2,
        0
    );
    composer.renderToScreen = true;
    composer.addPass(bloomPass);

    //

    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.lookSpeed = 0.1;

    animate();

}

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 10;

    grid.position.z += 2;
    if (grid.position.z > 2000) {
        grid.position.z = 0;
    }

    camera.rotation.z += 0.5 * time
    // camera.fov -= 0.01 * time
    if (camera.fov < 2) {
        camera.fov = 100;
        camera.rotation.z = 0
    }
    camera.updateProjectionMatrix();

    controls.update(delta);

    // renderer.render(scene, camera);
    composer.render(scene, camera);
}


function resizeRendererToDisplaySize(renderer) {

    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
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

    let domElement = renderer.domElement;

    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
    }
    camera.updateProjectionMatrix();
    controls.handleResize();

});