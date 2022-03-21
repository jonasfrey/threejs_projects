// import * as THREE from 'three';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { VRButton } from './node_modules/three/examples/jsm/webxr/VRButton.js';

import * as THREE from 'three'
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js'

import "math_tau_module";
import o_app_css_variables_static from "./app_css_variables/app_css.mjs";
import o_hidstatusmap from "o_hidstatusmap";
import { VRButton } from './node_modules/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from './node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js';



var o_stats = new Stats();
o_stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(o_stats.dom);

var o_scene = new THREE.Scene();    
var o_camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
//important for VR
o_camera.position.set( 0, 1.6, 3 );



var n_camera_movement_speed = 0.02;
var o_renderer = new THREE.WebGLRenderer({ antialias: true });
o_renderer.setPixelRatio( window.devicePixelRatio );
o_renderer.setSize(window.innerWidth, window.innerHeight);

o_renderer.outputEncoding = THREE.sRGBEncoding;
o_renderer.shadowMap.enabled = true;
o_renderer.xr.enabled = true;
document.body.appendChild(o_renderer.domElement);
document.body.appendChild( VRButton.createButton( o_renderer ) );


///
var group = new THREE.Group();
o_scene.add( group );

const geometries = [
    new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
    new THREE.ConeGeometry( 0.2, 0.2, 64 ),
    new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 64 ),
    new THREE.IcosahedronGeometry( 0.2, 8 ),
    new THREE.TorusGeometry( 0.2, 0.04, 64, 32 )
];

for ( let i = 0; i < 50; i ++ ) {

    const geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
    const material = new THREE.MeshStandardMaterial( {
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    } );

    const object = new THREE.Mesh( geometry, material );

    object.position.x = Math.random() * 4 - 2;
    object.position.y = Math.random() * 2;
    object.position.z = Math.random() * 4 - 2;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.userData.o_vec3_rotation_velocity = new THREE.Vector3(
        Math.random() * 0.01 * Math.PI, 
        Math.random() * 0.01 * Math.PI, 
        Math.random() * 0.01 * Math.PI
    )

    object.scale.x = Math.random() + 0.5
    object.scale.y = Math.random() + 0.5
    object.scale.z = Math.random() + 0.5

    object.castShadow = true;
    object.receiveShadow = true;

    group.add( object );

}
///

///
o_scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

const light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 6, 0 );
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = - 2;
light.shadow.camera.right = 2;
light.shadow.camera.left = - 2;
light.shadow.mapSize.set( 4096, 4096 );
o_scene.add( light );
///



///
const o_texture_loader = new THREE.TextureLoader();
var o_geometry, o_material, o_mesh;
///


///
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
///

///
const o_default_basic_material = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color(o_app_css_variables_static.s_color_background_main_passive),
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
        color: new THREE.Color(o_app_css_variables_static.s_color_blue_passive),
        emissive: new THREE.Color(o_app_css_variables_static.s_color_blue_passive),
        side: THREE.DoubleSide,
        flatShading: true,
    }
)
///


///
n_callback_counter++
o_texture_loader.load(
    "./images/Milky_Way_360_equirectangular_rendering_with_foreground_stars_removed.jpg",
    function (
        o_texture
        ) {
    
        var n_radius = 5;
        var n_width_segments = 64;
        var n_height_segments = 64;
        
        let o_geometry = new THREE.SphereGeometry( 
            n_radius, 
            n_width_segments, 
            n_height_segments
        );
        var o_material = new THREE.MeshBasicMaterial( 
            {   
                map: o_texture,
                side: THREE.DoubleSide
            }
        );

        o_mesh = new THREE.Mesh( 
            o_geometry,
            o_material
        );
        o_mesh.name = "universe"
        o_scene.add( o_mesh );

        o_geometry = new THREE.CircleGeometry( n_radius, n_width_segments );
        o_mesh = new THREE.Mesh( o_geometry, o_default_basic_material );
        o_mesh.rotation.x = Math.PI /2 
        o_scene.add( o_mesh );
        n_callback_counter--

} );

///

///
var o_vec3_o_raycaster_mesh_universe_point = new THREE.Vector3(0,0,0)
///


///
var ui_console = document.createElement('pre')
ui_console.log = function(s_name, object){
    this.innerText += "--------\n";
    this.innerText += s_name + "\n";
    this.innerText += "--------\n";
    this.innerText += JSON.stringify(object, null, 4)+"\n"
}
ui_console.className = "ui_console"
document.documentElement.appendChild(ui_console)


var controller1 = o_renderer.xr.getController( 0 );

o_scene.add( controller1 );
controller1.addEventListener( 'connected', (e) => {

	controller1.gamepad = e.data.gamepad
    ui_console.log("controller1", controller1)
    ui_console.log("controller1.gamepad", controller1.gamepad)

});
var controller2 = o_renderer.xr.getController( 1 );
controller2.addEventListener( 'connected', (e) => {

	controller2.gamepad = e.data.gamepad

});
o_scene.add( controller2 );

ui_console.innerText += JSON.stringify(ui_console, null, 4);


const controllerModelFactory = new XRControllerModelFactory();

var controllerGrip1 = o_renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
o_scene.add( controllerGrip1 );

var controllerGrip2 = o_renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
o_scene.add( controllerGrip2 );

///

///
var o_geometry = new THREE.CylinderGeometry( 
    0,
    0.5,
    1,
    32, 
    1, 
    1
);
o_material = o_default_basic_material
const o_mesh_right_hand = new THREE.Mesh( o_geometry, o_material );
o_scene.add( o_mesh_right_hand );

// o_mesh_right_hand.up = new THREE.Vector3(0,0,1);//Z axis up
// o_mesh_right_hand.rotation.x = Math.PI /2
window.o_mesh_right_hand = o_mesh_right_hand

o_mesh_right_hand.f_render_function = function(){
    var self = this
    self.position.copy(o_camera.position)
    self.rotation.copy( o_camera.rotation );
    self.updateMatrix();
    self.translateZ( - 2 );
    self.translateX( + 1 );
    self.translateY( - 1 );
    // self.position.z-=2
    // self.position.y-=0.5
    // self.position.x+=0.5
    // // self.lookAt(o_vec3_o_raycaster_mesh_universe_point)

    // // //create a point to lookAt
    // // var newPoint = new THREE.Vector3(
    // //     self.position.x + o_vec3_o_raycaster_mesh_universe_point.x,
    // //     self.position.y + o_vec3_o_raycaster_mesh_universe_point.y,
    // //     self.position.z + o_vec3_o_raycaster_mesh_universe_point.z
    // // );
    // // o_mesh_right_hand.up = new THREE.Vector3(0,0,1)
    // // // self.up = face.normal;//Z axis up
    // // self.lookAt(newPoint); 

    var axis = new THREE.Vector3(0, 1, 0);
    self.quaternion.setFromUnitVectors(axis, o_vec3_o_raycaster_mesh_universe_point.clone().normalize());

}
/// 


///
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    o_camera.aspect = window.innerWidth / window.innerHeight;
    o_camera.updateProjectionMatrix();
    o_renderer.setSize( window.innerWidth, window.innerHeight );
}
///


///
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
        // o_mesh_gun.visible = true
        o_hidstatusmap.o_mouse.x_normalized = 0.5        
        o_hidstatusmap.o_mouse.y_normalized = 0.5
    o_button_pointer_lock.innerText = 'MOUSEMOVE to look around,\n W A S D to move,\n E Q to rise/sink,\n ESC to unlock pointer'
} );

o_pointerlock_controls.addEventListener( 'unlock', function () {
        // o_mesh_gun.visible = false
        o_hidstatusmap.o_mouse.x_normalized = 0.5        
        o_hidstatusmap.o_mouse.y_normalized = 0.5
        o_button_pointer_lock.innerText = 'look around'
} );

o_button_pointer_lock.addEventListener("click", f_lock_pointer) 
///



///
const raycaster = new THREE.Raycaster();
const o_material_raycaster_ray = new THREE.LineBasicMaterial({
	color: 0x0000ff
});
const o_geometry_raycaster_ray = new THREE.BufferGeometry().setFromPoints( 
    [
        new THREE.Vector3( 0,0,0 ), 
        new THREE.Vector3( 0,0,0 )
    ]
);
const o_line_raycaster_ray = new THREE.Line( o_geometry_raycaster_ray, o_material_raycaster_ray );
o_scene.add( o_line_raycaster_ray ); 
///

///
// the frame id should always stay positivte infinitly incrementing integer 
var n_frame_id = 0;
// the time, can be changed to go slower/faster/backwards
var n_time = 0;
// can be changed to -1 to, change from forwards to backwards
var n_time_summand = 1;
// window.o_scene = o_scene
var f_render = function () {

    raycaster.setFromCamera( 
        {
            x: o_hidstatusmap.o_mouse.x_normalized * 2 - 1, 
            y: - o_hidstatusmap.o_mouse.y_normalized * 2 + 1, 
        },
        o_camera
    );
    // debugger
    // points_for_line[1].copy(laser_vector)


    o_scene.traverse( function( object ) {
        if ( object.isMesh ){
            if(object.userData.o_vec3_rotation_velocity){
                object.rotation.x += object.userData.o_vec3_rotation_velocity.x
                object.rotation.y += object.userData.o_vec3_rotation_velocity.y
                object.rotation.z += object.userData.o_vec3_rotation_velocity.z
            }
        }

    } );

    
    const intersects = raycaster.intersectObjects( o_scene.children );

    if(b_callbacks_done){

        for ( let i = 0; i < intersects.length; i ++ ) {
            var o_intersection = intersects[i]
            // debugger
            if(o_intersection.object.name == "universe"){
                
                o_vec3_o_raycaster_mesh_universe_point = o_intersection.point
                
                o_line_raycaster_ray.geometry.attributes.position.array[0+0] = o_mesh_right_hand.position.x
                o_line_raycaster_ray.geometry.attributes.position.array[0+1] = o_mesh_right_hand.position.y
                o_line_raycaster_ray.geometry.attributes.position.array[0+2] = o_mesh_right_hand.position.z
                
                o_line_raycaster_ray.geometry.attributes.position.array[3+0] = o_intersection.point.x
                o_line_raycaster_ray.geometry.attributes.position.array[3+1] = o_intersection.point.y
                o_line_raycaster_ray.geometry.attributes.position.array[3+2] = o_intersection.point.z
                
                
                o_line_raycaster_ray.geometry.verticesNeedUpdate = true
                o_line_raycaster_ray.geometry.attributes.position.needsUpdate = true
                
            }
            
        }
	}

    // debugger
    // o_geometry_cylinder.position.copy(vec)



    o_stats.begin();

    if(
        b_callbacks_done == false &&
        n_callback_counter == 0
    ){
        b_callbacks_done = true; 
        f_callbacks_done()
    }

    // console.log(a_font_meshes)

    if(o_hidstatusmap.o_keyboard["w"] == true){
        o_pointerlock_controls.moveForward(n_camera_movement_speed)
    }
    if(o_hidstatusmap.o_keyboard["s"] == true){
        o_pointerlock_controls.moveForward(-n_camera_movement_speed)
    }
    if(o_hidstatusmap.o_keyboard["a"] == true){
        o_pointerlock_controls.moveRight(-n_camera_movement_speed)
    }
    if(o_hidstatusmap.o_keyboard["d"] == true){
        o_pointerlock_controls.moveRight(n_camera_movement_speed)
    }
    if(o_hidstatusmap.o_keyboard["e"] == true){
        o_camera.position.y += (n_camera_movement_speed)
    }
    if(o_hidstatusmap.o_keyboard["q"] == true){
        o_camera.position.y -= n_camera_movement_speed
    }

    o_renderer.render(o_scene, o_camera);

    o_mesh_right_hand.f_render_function()


    o_stats.end();

    n_time += n_time_summand

    // requestAnimationFrame not working for VR 
    // n_frame_id = requestAnimationFrame(f_render);
    n_frame_id++
};

var f_render_for_vr = function(){

    o_renderer.setAnimationLoop( f_render );

}

f_render_for_vr();
///