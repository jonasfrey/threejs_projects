// was / what / data 

// import * as three from "three";

import * as THREE from "three"
import { MeshPhongMaterial } from "three";
import { MeshBasicMaterial } from "three";
import { RingGeometry } from "three";
import { PlaneGeometry } from "three";
import { CylinderGeometry } from "three";
import { OctahedronGeometry } from "three";
import { PointLight } from "three";
import { Object3D } from "three";
import { Light } from "three";
import { TorusKnotGeometry } from "three";
import { CircleGeometry } from "three";
import { TubeGeometry } from "three";
import { ConeGeometry } from "three";
import { Mesh } from "three";
import { BoxGeometry } from "three";
import { Group } from "three";
import { SphereGeometry } from "three";


// f_render_function();

var f_link_properties = function(
    object_a,
    s_property_a, 
    object_b,
    s_property_b
    ){
    function property(object, prop) {
        return {
            get value () {
                return object[prop]
            },
            set value (val) {
                object[prop] = val;
            }
        };
    }
    var o_ref = property(object_a, s_property_a);

    var tmp = object_b[s_property_b]; 
    Object.defineProperty(
        object_b,
        s_property_b,
        {
    
            set: function(value) {
                o_ref.value = value;
            },
            get: function() {
                return o_ref.value
            }
        }
    );
    object_b[s_property_b] = tmp 
}

// was / what / data 

// wo / where / layout 

// wie / how / style 


// process 

// data object => { intensity_dark: 0.5 }

// layout object => { t: PointLight, ":intensity": "intensity_dark" }

// layout object gets a reference to a threejs object
// layout object get9 => { t: PointLight_instance_reference, ":intensity": "intensity_dark" }
window.THREE = THREE


window.scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


window.o_data = {

    "intensity_dark": 0.5, 
    "intensity_bright": 2,
    position_z : 3,
    position_y: 0, 
};

// window.o_layout = {
//     "t": PointLight, 
//     "<>intensity": "intensity_dark",
//     "position": {
//         x: 1,
//         y: 1,
//         "<>z": "position_z",
//     }
// }


window.o_layout = {
    t: Group, 
    c:[
        {
            "t": PointLight, 
            "<>intensity": "intensity_dark",
            "position": {
                x: 1,
                y: 1,
                "<>z": "position_z",
            }
        }, 
        {
            "t": Mesh, 
            "geometry": {
                    "t": BoxGeometry, 
                }, 
            "material": {
                "t": MeshPhongMaterial, 
                "color": {
                    r: 222, 
                    g:0, 
                    b:0
                }
            },
            scale: {
                x: 0.5,
                y: 0.5, 
                z: 0.5
            },
            position: {
                x: 1, 
                 "<>y": "position_y", 
                // y: 1,
                z: 1
            }
        },
        {
            "t": Mesh, 
            "geometry": {
                    "t": BoxGeometry, 
                }, 
            "material": {
                "t": MeshPhongMaterial, 
                "color": 0xff00ff
            },
            scale: {
                x: 0.5,
                y: 0.5, 
                z: 0.5
            },
            position: {
                x: 1, 
                 "<>y": "position_y", 
                // y: 1,
                z: 1
            }
        }
    ]
}
var f_render_o_layout = function(object, object_parent){
    var o_for_linking = object_parent

    if(object.hasOwnProperty("t")){
        var o_t = new object.t()
        window.o_t = o_t
        o_for_linking = o_t
        object.o_t = o_t
    }

    for(var s_prop in object){
        var value = object[s_prop]
        // handle recursive objects
        if(
            typeof value === "object" && 
            Array.isArray(value) == false && 
            // value.hasOwnProperty("t") == false && 
            ["t", "c", "o_t"].indexOf(s_prop) == -1
        ){
            if(value.hasOwnProperty("t") == false){
                // console.log(o_t[s_prop])
                // console.log("o_t[s_prop]")
                value = f_render_o_layout(value, o_t[s_prop])
            }else{
                // console.log(object)
                // console.log("object")
                o_t[s_prop] = f_render_o_layout(value, object)

            }
        }
        // handle linking 
        if(s_prop.indexOf('<>') == 0){ //<> sync in both directions
            var s_prop_o_threejs = s_prop.substring(2)
            var s_prop_o_data = value
            //create a reference 
            f_link_properties(
                o_for_linking, 
                s_prop_o_threejs,
                o_data, 
                s_prop_o_data)
        }
        //handle settings of normal "static" properties 
        if(
            s_prop.indexOf('<>') != 0 &&
            typeof value !== "object" && 
            ["t", "c", "o_t"].indexOf(s_prop) == -1 // "t" and "c" are keyword properties, todo: check if threejs uses them somewhere
        ){
            try {
                object_parent[s_prop] = value
                
            } catch (error) {
                debugger
            }
        }

        //handle children objects 
        if(s_prop == "c"){
            for(var s_c_index in object.c){
                var o_c_object = object.c[s_c_index]
                var o_handled_c_object = f_render_o_layout(o_c_object, object)
                
                object.o_t.add(o_handled_c_object)
            }
        }
    }
    if(o_t){
        return o_t
    }else{
        return object
    }
}
o_layout = f_render_o_layout(o_layout) 
scene.add(o_layout)
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// // cube.position.copy(new THREE.Vector3(1,2,3))
// scene.add( cube );


// const light = new THREE.PointLight( 0xffffff, 1, 100 );
// light.position.set( 1,1,1 );
// scene.add( light );

camera.position.z = 4;

var n_frame_id = 0
var f_render_function= function() {
    
    // requestAnimationFrame( animate );
    renderer.render( scene, camera );
    n_frame_id++
};

renderer.setAnimationLoop(f_render_function);

