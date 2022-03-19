import * as THREE from 'three'
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'
import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js'
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js'
// import { TextureLoader } from './node_modules/three/examples/jsm/loaders/TextureLoader.js'
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js'
import "./cdn/math_tau.module.js";
import o_app_css_variables2 from "./app_css_variables/app_css_variables.js";
import o_hidstatusmap from "./cdn/o_hidstatusmap.module.js";

window.o_app_css_variables2= o_app_css_variables2


var o_stats = new Stats();
o_stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(o_stats.dom);

var o_scene = new THREE.Scene();
var o_camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
window.o_camera = o_camera
var n_camera_movement_speed = 0.02;
o_camera.position.z = 5
var o_renderer = new THREE.WebGLRenderer();
o_renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(o_renderer.domElement);
var o_geometry, o_material, o_mesh; 

const o_default_basic_material = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color(o_app_css_variables2.s_color_background_main_passive),
        transparent: true,
        wireframe: true, 
        opacity: 0.5,
    }
)
const o_default_line_material = new THREE.LineBasicMaterial(
    {
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
    }
)
const o_default_phong_material = new THREE.MeshPhongMaterial(
    {
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
    }
)

o_geometry = new THREE.BoxGeometry( 1, 1, 1 );
o_material = o_default_basic_material
o_mesh = new THREE.Mesh( o_geometry, o_material );
o_scene.add( o_mesh );


o_geometry = new THREE.CylinderGeometry( 
    0,
    0.5,
    1,
    32, 
    1, 
    1
    );
o_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const o_mesh_gun = new THREE.Mesh( o_geometry, o_material );
o_scene.add( o_mesh_gun );


var b_callbacks_done = false
var n_callback_counter = 0

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

const o_pointerlock_controls = new PointerLockControls( 
    o_camera,
    document.body
);

var o_button_pointer_lock = document.createElement("button")
o_button_pointer_lock.innerText = 'look around'
o_button_pointer_lock.style.position = 'absolute'
o_button_pointer_lock.style.bottom = '0%'
o_button_pointer_lock.style.right = '0%'

document.body.appendChild(o_button_pointer_lock)
var f_lock_pointer = function () {
    o_pointerlock_controls.lock();
}
o_pointerlock_controls.addEventListener( 'lock', function () {
        o_mesh_gun.visible = true
    o_button_pointer_lock.innerText = 'MOUSEMOVE to look around,\n W A S D to move,\n E Q to rise/sink,\n ESC to unlock pointer'
} );

o_pointerlock_controls.addEventListener( 'unlock', function () {
        o_mesh_gun.visible = false
        o_button_pointer_lock.innerText = 'look around'
} );

o_button_pointer_lock.addEventListener("click", f_lock_pointer) 



// the frame id should always stay positivte infinitly incrementing integer 
var n_frame_id = 0;
// the time, can be changed to go slower/faster/backwards
var n_time = 0;
// can be changed to -1 to, change from forwards to backwards
var n_time_summand = 1;
// window.o_scene = o_scene

var f_render = function () {
    
    if(o_pointerlock_controls.isLocked){
        o_mesh_gun.position.x = o_camera.position.x
        o_mesh_gun.position.y = o_camera.position.y
        o_mesh_gun.position.z = o_camera.position.z -2

        o_mesh_gun.lookAt(
            new THREE.Vector3(0,0,0)
        )
    }

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
