

import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { FBXLoader } from 'fbxloader';
import { OrbitControls } from 'orbitControls';
import { TransformControls } from 'transformControls';


class GrannyKnot extends THREE.Curve {

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const point = optionalTarget;
        t = 2 * Math.PI * t;
        const x = - 0.22 * Math.cos(t) - 1.28 * Math.sin(t) - 0.44 * Math.cos(3 * t) - 0.78 * Math.sin(3 * t);
        const y = - 0.1 * Math.cos(2 * t) - 0.27 * Math.sin(2 * t) + 0.38 * Math.cos(4 * t) + 0.46 * Math.sin(4 * t);
        const z = 0.7 * Math.cos(3 * t) - 0.4 * Math.sin(3 * t);
        // const x = 0.2,
        //     y = 0.1,
        //     z = 0.10;
        return point.set(x, y, z).multiplyScalar(30);

    }

}


class DawaiCurve extends THREE.Curve {

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const point = optionalTarget;
        t = 2 * Math.PI * t;
        const x = - 0.22 * Math.cos(t) - 1.28 * Math.cos(t) - 0.44 * Math.cos(3 * t) - 0.78 * Math.cos(3 * t);
        const y = - 0.1 * Math.cos(2 * t) - 0.27 * Math.cos(2 * t) + 0.38 * Math.cos(4 * t) + 0.46 * Math.cos(4 * t);
        const z = 0.7 * Math.cos(3 * t) - 0.4 * Math.cos(3 * t);
        return point.set(x, y, z).multiplyScalar(20);

    }

}

class VivianiCurve extends THREE.Curve {

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const point = optionalTarget;
        const a = 30; // radius

        const b = 150; // height

        const t2 = 2 * Math.PI * t * b / 30;
        const x = Math.cos(t2) * a;
        const y = Math.sin(t2) * a;
        const z = b * t;
        return point.set(x, y, z);

    }

}


let fbxLoader = new FBXLoader();
let gltfLoader = new GLTFLoader();

const canvas = document.querySelector('.canvas');
const video = document.querySelector('video');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 3000);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize( 900, 500 );
renderer.setClearColor(0x404040);

const planeTexture = new THREE.TextureLoader().load('../imgs/image.jpg');
const texture = new THREE.VideoTexture(video);

// const Tcontrols = new TransformControls(camera, canvas);
// const controls = new OrbitControls(camera, canvas);

// controls.update();


let light = new THREE.AmbientLight(0xFFFFFF);
scene.add(light);

let light2 = new THREE.PointLight();
scene.add(light2);

light.position.y = 0;
light.position.x = -80;

light2.position.y = 0;
light2.position.x = -280;

// const curve = new VivianiCurve();
const curve = new GrannyKnot();
// const curve = new DawaiCurve();
const geometrie = new THREE.TubeBufferGeometry(curve, 100, 4, 10, true);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, wireframe: true, side: THREE.DoubleSide });
const Tube = new THREE.Mesh(geometrie, material);
scene.add(Tube);

for (let i; i < Tube.geometry.parameters.path.cacheArcLengths.lenght; i++) {

    const loopTime = 20;
    const t = (i % loopTime) / loopTime;
    const t2 = ((i + 0.1) % loopTime) / loopTime;
    const pos = Tube.geometry.parameters.path.getPointAt(t);
    const pos2 = Tube.geometry.parameters.path.getPointAt(t2 + 0.02);

    const planeGeo = new THREE.PlaneGeometry(2, 2, 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMaterial);

    plane.position.copy(pos);
    plane.lookAt(pos2);

    scene.add(plane);

}

// console.log(Tube.geometry.parameters.path.cacheArcLengths);
console.log(Tube.geometry);

Tube.receiveShadow = true;

const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const mat = new THREE.MeshBasicMaterial({ color: 0x09F });

const cube = new THREE.Mesh(cubeGeo, mat);

scene.add(cube);

cube.receiveShadow = true;

// cube.rotateX(-Math.PI / 2);

// Tube.geometry.parameters.path.cacheArcLengths


let characterControl;
let gll;
let mixer;
let mixer2;
let soldier;
let animation;
let anim;
let walk;
let run;
let still;

gltfLoader.load('./gltf/Soldier.glb', (gl) => {
    gl.scene.traverse(c => {
        c.castShadow = true;
    });
    gll = gl;
    soldier = gl.scene;
    // soldier.children[1].material.map = texture;
    scene.add(soldier);
    // soldier.receiveShadow = true;
    animation = gl.animations;
    console.log(gl);
    mixer = new THREE.AnimationMixer(gl.scene);


    walk = mixer.clipAction(animation[3]);
    run = mixer.clipAction(animation[1]);
    still = mixer.clipAction(animation[0]);

    // mixer.clipAction(gl.animations[1]).play();
    // anim = mixer.clipAction(animation[1]);
    // anim.play();

    console.log(mixer);
    // console.log(anim);

    fbxLoader.load('../animation/Praying.fbx', (fbx) => {
        fbx.scale.setScalar(0, 1);
        fbx.traverse(c => {
            c.castShadow = true;
        });

        mixer2 = new THREE.AnimationMixer(fbx);
        const idl = mixer2.clipAction(fbx.animations[1], soldier);
        console.log(fbx);

        scene.add(fbx);
        idl.play();
    });

    let angle = 0;
    document.addEventListener("down", (e) => {
        // console.log(e.keyCode);
        // console.log(soldier)
        if (e.shiftKey && characterControl) {
            characterControl.switchToggle();
        } else {
            keysPressed[e.key.toLowerCase()] = true;
        }
        if (e.keyCode === 38) {//TOP
            // soldier.position.x += -0.05;
            video.play();
            console.log(camera);
        }
        if (e.keyCode === 37) {//LEFT
            soldier.position.z += 0.05;
        }
        if (e.keyCode === 39) {//RIGHT
            soldier.position.z += -0.05;
        }
        if (e.keyCode === 40) {//BOTTOM
            soldier.position.x += 0.05;
        }
    }, false);
});

camera.position.x = 1.5;
camera.position.y = 8.3;
camera.position.z = 50.7;

let clock = new THREE.Clock();

let authorized = false;

let started = false;

let time = 0;
let lookat = 0;
let step = 0;

setInterval(() => {
    if (authorized == true) {
        if (step < 0.03) {
            step += 0.0005
        }

    } else {
        if (step > 0) {
            step -= 0.0005
        }
    }
    time += step;
}, 50);

function updateCamera() {
    // let time = clock.getElapsedTime();

    const loopTime = 20;
    const t = (time % loopTime) / loopTime;
    const t2 = ((time + 0.1) % loopTime) / loopTime;
    const pos = Tube.geometry.parameters.path.getPointAt(t);
    const pos2 = Tube.geometry.parameters.path.getPointAt(t2);

    // console.table(Tube.geometry.parameters.path.cacheArcLengths);
    pos.y += 1

    camera.position.copy(pos);
    // camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(pos2);
}

function updatePlayer() {
    // let time = clock.getElapsedTime();

    const loopTime = 20;
    const t = (time % loopTime) / loopTime;
    const t2 = ((time + 0.1) % loopTime) / loopTime;
    const pos = Tube.geometry.parameters.path.getPointAt(0.01 + t);
    const pos2 = Tube.geometry.parameters.path.getPointAt((- 0.001) + t2);

    // cube.position.copy(pos);
    // console.log(soldier)
    if (soldier != undefined) {
        // if (step < 0.2) {
        //     run.stop();
        //     still.stop();
        //     walk.play();
        // } else if (step > 0.1) {
        //     still.stop();
        //     walk.stop();
        //     run.play();
        // } else if (step = 0) {
        //     run.stop();
        //     walk.stop();
        //     still.play();
        // }
        soldier.position.set(pos.x + 0.05, pos.y - 2, pos.z);
        // soldier.lookAt(pos2.x + 0.05, pos2.y, pos2.z);
    }

}


window.addEventListener('keydown', (e) => {
    // console.log(e.keyCode);
    started = true;
    if (e.keyCode == 38 && authorized == false) {
        authorized = true;
    }
})

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 38 && authorized == true) {
        // console.log(e.keyCode);
        authorized = false;
    }
})

// updateCamera();
// updatePlayer();

function animate() {

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    if (mixer2) {
        mixer2.update(clock.getDelta());
    }

    // Tube.rotation.x += 0.01;
    // Tube.rotation.y += 0.01;
    // Tube.rotation.z += 0.01;

    // if (true) {
    if (started == true) {
        updateCamera();
    }
    updatePlayer();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();