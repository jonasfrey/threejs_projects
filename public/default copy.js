import "./cdn/math_tau.module.js";
import * as THREE from 'three'
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'
import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js'
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js'
// import { TextureLoader } from './node_modules/three/examples/jsm/loaders/TextureLoader.js'
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js'
import o_hidstatusmap from "./cdn/o_hidstatusmap.module.js";
import { BufferAttribute } from "three";

var o_stats = new Stats();
o_stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(o_stats.dom);

var o_scene = new THREE.Scene();
var o_camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
window.o_camera = o_camera
var n_camera_movement_speed = 0.02;
o_camera.position.z = 1
var o_renderer = new THREE.WebGLRenderer();
o_renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(o_renderer.domElement);

// s
var b_callbacks_done = false

var a_font_meshes = []
var a_planet_meshes = []

var f_callbacks_done = function(){
    b_callbacks_done = true; 
    // debugger
    o_scene.traverse( function( object ) {
        if ( object.isMesh ){
            if(object?.name?.includes("font")){
                a_font_meshes.push(object)
            }
            if(object.o_planet){
                a_planet_meshes.push(object)
            }
        }

    } );
}

var n_callback_counter = 0

const o_pointerlock_controls = new PointerLockControls( 
    o_camera,
    document.body
);

var o_button_pointer_lock = document.createElement("button")
o_button_pointer_lock.innerText = 'look around'
document.body.appendChild(o_button_pointer_lock)
o_button_pointer_lock.onclick = function () {
    o_pointerlock_controls.lock();
}

// the frame id should always stay positivte infinitly incrementing integer 
var n_frame_id = 0;
// the time, can be changed to go slower/faster/backwards
var n_time = 0;
// can be changed to -1 to, change from forwards to backwards
var n_time_summand = 1;
// window.o_scene = o_scene

var f_render = function () {
    
    o_stats.begin();

    if(
        b_callbacks_done == false &&
        n_callback_counter == 0
    ){
        b_callbacks_done = true; 
        f_callbacks_done()
    }

    // console.log(a_font_meshes)

    if(o_hidstatusmap["w"] == true){
        o_pointerlock_controls.moveForward(n_camera_movement_speed)
    }
    if(o_hidstatusmap["s"] == true){
        o_pointerlock_controls.moveForward(-n_camera_movement_speed)
    }
    if(o_hidstatusmap["a"] == true){
        o_pointerlock_controls.moveRight(-n_camera_movement_speed)
    }
    if(o_hidstatusmap["d"] == true){
        o_pointerlock_controls.moveRight(n_camera_movement_speed)
    }
    if(o_hidstatusmap["e"] == true){
        o_camera.position.y += (n_camera_movement_speed)
    }
    if(o_hidstatusmap["q"] == true){
        o_camera.position.y -= n_camera_movement_speed
    }

    o_renderer.render(o_scene, o_camera);

    o_stats.end();

    n_time += n_time_summand
    n_frame_id = requestAnimationFrame(f_render);
    
};

window.o_scene = o_scene
f_render();

window.addEventListener(
    "resize",
    function () {
        o_camera.aspect = window.innerWidth / window.innerHeight;
        o_camera.updateProjectionMatrix();
        o_renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);
