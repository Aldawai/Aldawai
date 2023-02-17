
import * as THREE from 'three';
import { GLTFLoader } from 'addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'addons/loaders/FBXLoader.js';
import { OrbitControls } from 'addons/controls/OrbitControls.js';
import { TransformControls } from 'addons/controls/TransformControls.js';
import { RectAreaLightHelper } from 'addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'addons/lights/RectAreaLightUniformsLib.js';
import { NURBSCurve } from 'addons/curves/NURBSCurve.js';
import { NURBSSurface } from 'addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'addons/geometries/ParametricGeometry.js';
import { TextGeometry } from 'addons/geometries/TextGeometry.js';
import { HTMLMesh } from 'addons/interactive/HTMLMesh.js';
import { ShadowMapViewer } from 'addons/utils/ShadowMapViewer.js';

import { FontLoader } from "addons/loaders/FontLoader.js";

const SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 1024;

let SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

let lightShadowMapViewer;

let fbxLoader = new FBXLoader();
let gltfLoader = new GLTFLoader();

const canvas = document.querySelector('.canvas');

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x59472b, 1000, 1500);

const camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1500);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
renderer.setClearColor(0xf3b3b3);
renderer.setClearColor(0x000000);
renderer.background = 0x000000;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

console.log(renderer);

const planeTexture = new THREE.TextureLoader().load('../assets/imgs/image.jpg');

// const Tcontrols = new TransformControls(camera, canvas);
const controls = new OrbitControls(camera, canvas);

let light = new THREE.AmbientLight({ color: 0xFFFFFF });
scene.add(light);

let light2 = new THREE.SpotLight(
    /*{*/
    /*color:*/ 0xFFFFFF,
    /*intensity:*/ 1,
    /*distance:*/ 1,
    /*angle:*/ 1,
    // /*decay:*/ 2
/*}*/
);

light2.castShadow = true;
light2.focus = 7;
light2.decay = 1;

light2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
light2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
light2.shadow.camera.near = 12;
light2.shadow.camera.far = 25;
light2.shadow.bias = 0.00001;
light2.shadow.normalBias = 1;

scene.add(light2);

console.log(light2);

light2.position.set(-4.5, 21.6, 0.1);

const cubeGeo = new THREE.BoxGeometry(2000, 0.1, 2000);
const mat = new THREE.MeshStandardMaterial({ color: 0xf3b3b3 });

const cube = new THREE.Mesh(cubeGeo, mat);

cube.receiveShadow = true;
cube.castShadow = true;

scene.add(cube);

function createHUD() {
    lightShadowMapViewer = new ShadowMapViewer(light2);

    lightShadowMapViewer.position.x = 10;
    lightShadowMapViewer.position.y = SCREEN_HEIGHT - (SHADOW_MAP_HEIGHT / 4) - 10;
    lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
    lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
    lightShadowMapViewer.update();
}

createHUD();
const loader = new FontLoader();

loader.load('assets/fonts/helvetiker_regular.typeface.json', function (font) {

    const geometry = new TextGeometry('Hello! I am Dawaï', {
        font: font,
        size: 1,
        height: 5,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 0.02
    });
    const textMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const text = new THREE.Mesh(geometry, textMat)
    // scene.add(text);
    text.castShadow = true;
    text.receiveShadow = true;
});

const helper = new THREE.CameraHelper(light2.shadow.camera);
// scene.add(helper);

// elm.position.set(-4.5, 11.6, 0.1);

camera.position.x = 2.5;
camera.position.y = 7.3;
camera.position.z = -8.1;

// camera.lookAt(0, 10, 10);

let desktop;
let chair;

gltfLoader.load("../assets/gltf/dev desk.glb", (obj) => {
    obj.scene.traverse(c => {
        c.castShadow = true;
        c.receiveShadow = true;
    });

    let desk = obj.scene;
    desktop = obj.scene;
    let ecran = desk.children[17];
    ecran.texture = planeTexture;
    console.log(ecran);

    chair = desk.children[12].children[0];

    // chair.lookAt(-2.53, 4.11, -10.09);

    desk.receiveShadow = true;
    desk.castShadow = true;

    scene.add(desk);
    camera.lookAt(ecran.position);
    light2.target = desk.children[17];
    console.log(desk.children);
    console.log("Content loaded");
});

window.addEventListener("keydown", (e) => {
    if (e.key == 'ArrowUp') {
        console.log(camera.position);
    }
});

function onWindowResize(e) {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize);

let clock = new THREE.Clock();

console.log(clock);

function animate() {

    let time = 10 * 0.05;

    if (light2.distance < 25 && desktop) {
        light2.distance += time;
        // console.log(time);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

animate();