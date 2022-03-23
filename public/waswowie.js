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


// was / what / data 

// wo / where / layout 

// wie / how / style 

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

window.o_was_what_data = {

    "box": {
        "box": BoxGeometry,
        "color":  new THREE.Color(0xf0f0f0), 
        "location": new THREE.Vector3(1,1,1)
    },
    "cone": {
        "cone": ConeGeometry,
        "color":  new THREE.Color(0x0f0f0f), 
        "location": new THREE.Vector3(2,1,1)
    },
    "ring": {
        "ring": RingGeometry,
        "color":  new THREE.Color(0xef00fe), 
        "location": new THREE.Vector3(3,1,1)
    },
    "tube": {
        "tube": TubeGeometry, 
        "color":  new THREE.Color(0xee00ff), 
        "location": new THREE.Vector3(1,2,2)
    },
    "plane": {
        "plane": PlaneGeometry,
        "color":  new THREE.Color(0x0ef0ef), 
        "location": new THREE.Vector3(2,2,2)
    },
    "circle": {
        "circle": CircleGeometry,
        "color":  new THREE.Color(0xfeedee), 
        "location": new THREE.Vector3(3,2,2)
    },
    "cylinder": {
        "cylinder": CylinderGeometry,
        "color":  new THREE.Color(0x1f2f3f), 
        "location": new THREE.Vector3(1,3,3)
    },
    "torus": {
        "torus": TorusKnotGeometry,
        "color":  new THREE.Color(0xf1f2f3), 
        "location": new THREE.Vector3(2,3,3)
    },
    "octahedron": {
        "octahedron": OctahedronGeometry,
        "color":  new THREE.Color(0xaffaff), 
        "location": new THREE.Vector3(3,3,3)
    },
    "light":{
        "intensity": 1,
    }

}




var wo_where_layout_static_data = {
    t: Group, 
    c: [
        {
            "t": Mesh,
            "geometry":{ "t": BoxGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "box.color"
            }, 
            ":position": "box.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": ConeGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "cone.color"
            }, 
            ":position": "cone.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": RingGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "ring.color"
            }, 
            ":position": "ring.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": TubeGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "tube.color"
            } , 
            ":position": "tube.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": PlaneGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "plane.color"
            }, 
            ":position": "plane.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": CircleGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "circle.color"
            }, 
            ":position": "circle.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": CylinderGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "cylinder.color"
            }, 
            ":position": "cylinder.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": TorusKnotGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "torus.color"
            }, 
            ":position": "torus.location"
        },
        {
            "t": Mesh,
            "geometry":{ "t": OctahedronGeometry},
            "material": {
                t: MeshPhongMaterial, 
                ":color": "octahedron.color"
            }, 
            ":position": "octahedron.location"
        },

    ],
    
    "light": {
        "t": PointLight, 
        ":position": "new THREE.Vector3(10,10,10)", 
        "-intensity": "light.intensity",
        "intensity": "10"
    }
    

}
//converting data to three
var f_recursive_convert_object = function(o_object){
    var o_threejs_instance= new o_object.t()

    o_threejs_instance.c = []
    for(var s_prop_o_object_c in o_object.c){
        var o_object_child = f_recursive_convert_object(o_object.c[s_prop_o_object_c])
        o_threejs_instance.c.push(o_object_child)
        o_threejs_instance.add(o_object_child)
    }

    for(var s_prop_o_object in o_object){
        if(['c','t'].indexOf(s_prop_o_object) != -1){
            continue;
        }
        var value = o_object[s_prop_o_object]

        if(s_prop_o_object.indexOf(":") == 0){
            var s_scope_variables_initialization_lines = ''
            for(var s_prop_o_was_what_data in o_was_what_data){
                s_scope_variables_initialization_lines+= `var ${s_prop_o_was_what_data} = o_was_what_data.${s_prop_o_was_what_data}\n`
            } 
            var evaluated_value = new Function('o_was_what_data', 'THREE', 
                `
                ${s_scope_variables_initialization_lines}
                return ${value}
                `
            )(
                o_was_what_data, 
                THREE
            )
            // console.log(evaluated_value)
            // o_threejs_instance[s_prop_o_object.substring(1)].set(evaluated_value); 
            
            Object.defineProperty(o_threejs_instance, s_prop_o_object.substring(1), {
                writable: true
              });
              
            o_threejs_instance[s_prop_o_object.substring(1)] = (evaluated_value); 
            // Object.assign(o_threejs_instance[s_prop_o_object.substring(1)], evaluated_value)
            // o_threejs_instance[s_prop_o_object.substring(1)].copy(evaluated_value); 
            // o_threejs_instance[s_prop_o_object.substring(1)].x = Math.random()*0.5
            // o_threejs_instance[s_prop_o_object.substring(1)].y = Math.random()*0.5
            // o_threejs_instance[s_prop_o_object.substring(1)].z = Math.random()*0.5

        }
        if(s_prop_o_object.indexOf(":") != 0){
            // debugger
            if(typeof value === "object"){
                var o_evaluated  = f_recursive_convert_object(value);
                o_threejs_instance[s_prop_o_object] = o_evaluated
            }else{
                o_threejs_instance[s_prop_o_object] = value; 
            }
        }
        // if(s_prop_o_object.indexOf("-") == 0){
        //     o_threejs_instance[s_prop_o_object] = getDescendantProp(o_was_what_data, )
        // }

        
    }    
    
    // o_threejs_instance.proxy = new Proxy(o_object, {
    //     set: function (target, key, value) {
    //         console.log(`${key} set to ${value}`);
    //         target[key] = value;
    //         return true;
    //     }
    //   });

    // o_object.uuid = o_threejs_instance.uuid
    return o_threejs_instance


}

window.wo_where_layout = f_recursive_convert_object(wo_where_layout_static_data);



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.add( window.wo_where_layout );
for(var key in window.wo_where_layout){
    var val = window.wo_where_layout[key]; 
    if(typeof val === "object"){
        scene.add(val)

    }
}
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// // cube.position.copy(new THREE.Vector3(1,2,3))
// scene.add( cube );



camera.position.z = 15;

var n_frame_id = 0
var f_render_function= function() {
    
    // requestAnimationFrame( animate );

    scene.traverse( function( object ) {
        
        if(object.f_render_function){
            object.f_render_function(n_frame_id)
        }
    
    } );


    renderer.render( scene, camera );
    n_frame_id++
};

renderer.setAnimationLoop(f_render_function);

// f_render_function();