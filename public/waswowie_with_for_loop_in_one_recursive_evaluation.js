// was / what / data 

// import * as three from "three";
import * as THREE from "three"
import { MeshPhongMaterial } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import { BoxGeometry } from "three";
import { Group } from "three";
import { SphereGeometry } from "three";


// was / what / data 

// wo / where / layout 

// wie / how / style 

window.o_was_what_data = {
    o_house: {
        s_name: "kamehouse", 
        o_location: {
            n_x : 1, 
            n_y : 1, 
            n_z : 1, 
        },
        o_size: {
            n_x: 0.5, 
            n_y: 0.5, 
            n_z: 1
        }
    }, 
    a_o_room: [
        {
            s_name: "schlafzimmer", 
            o_location: {
                n_x : 0, 
                n_y : 0, 
                n_z : 0, 
            }, 
            o_size: {
                n_x: 0.5, 
                n_y: 1, 
                n_z: 0.5 
            }
        },
        {
            s_name: "kueche", 
            o_location: {
                n_x : 0.5, 
                n_y : 0, 
                n_z : 0, 
            }, 
            o_size: {
                n_x: 0.5, 
                n_y: 1, 
                n_z: 0.5
            }
        },
        {
            s_name: "bad", 
            o_location: {
                n_x : 0.5, 
                n_y : 0, 
                n_z : 0.5, 
            }, 
            o_size: {
                n_x: 0.5, 
                n_y: 1, 
                n_z: 0.5
            }
        }
    ], 
    a_o_furniture: [
        [
            {
                s_name: "bed", 
                o_location: {
                    n_x : 0.5, 
                    n_y : 0, 
                    n_z : 0.5, 
                }, 
                o_size: {
                    n_x: 0.2, 
                    n_y: 0.2, 
                    n_z: 0.2
                }
            }, 
            {
                s_name: "table", 
                o_location: {
                    n_x : 0.25, 
                    n_y : 0, 
                    n_z : 0.25, 
                }, 
                o_size: {
                    n_x: 0.2, 
                    n_y: 0.3, 
                    n_z: 0.2
                }
            }
        ]
    ], 
    o_vec3_1 : new THREE.Vector3(0.1,0.1,0.1),
    o_vec3_2 : new THREE.Vector3(0.2,0.2,0.2),
    o_vec3_3 : new THREE.Vector3(0.3,0.3,0.3),
    o_vec3_4 : new THREE.Vector3(0.4,0.4,0.4),

    a_o_vec3: [
        new THREE.Vector3(4,4,4),
        new THREE.Vector3(66,55,44),
    ]
}

var wo_where_layout = {
    t: BoxGeometry,
    name: 'house',
    c: [
        {
            t:BoxGeometry,
            name: "room",
            "for": "o_room in a_o_room",
            ":position":"new THREE.Vector3(o_room.o_location.nx,o_room.o_location.ny,o_room.o_location.nz)",
            ":scale":"new THREE.Vector3(o_room.o_size.nx,o_room.o_size.ny,o_room.o_size.nz)",
            c:[
                {
                    name: "o_furniture in a_o_furniture",
                    t: BoxGeometry,
                    name: "furniture",
                    c: [
                        {
                            t: SphereGeometry, 
                            name: 'earth',
                        }
                    ]
                }
            ]
        
        }
    ]
}






















var wo_where_layout_static_data = {
    t: BoxGeometry,
    name: 'house',
    f_render_function: function(n_frame_id){
        this.position.x = Math.sin(n_frame_id*0.01) * 3
    },
    // ":position": "new THREE.Vector3(0.1,0.1,0.1)",
    ":position": "o_vec3_1",
    c: [
        {
            t:BoxGeometry,
            // ":posithttps://localhost:3001/#waswowieion": "new THREE.Vector3(0.2,0.2,0.2)",
            name: "room",
            "for": "var o_vec3 in a_o_vec3",
            ":position": "o_vec3",
            c:[
                {
                    name: "o_furniture in a_o_furniture",
                    t: BoxGeometry,
                    // ":position": "new THREE.Vector3(0.3,0.3,0.3)",
                    ":position": "o_vec3_3",
                    name: "furniture",
                    c: [
                        {
                            // ":position": "new THREE.Vector3(0.4,0.4,0.4)",
                            ":position": "o_vec3_4",
                            t: SphereGeometry, 
                            name: 'earth',
                        }
                    ]
                }
            ]
        
        }
    ]
}


//converting data to three
var f_recursive_convert_object = function(o_object, a_s_for_strings =[], o_parent={}){
    var o_threejs_instance_geometry = new o_object.t()
    var o_threejs_instance_material = new MeshBasicMaterial({color:Math.random() * 0xffffff})
    var o_threejs_instance_mesh = new Mesh(o_threejs_instance_geometry, o_threejs_instance_material)
    o_object.a_s_for_strings = JSON.parse(JSON.stringify(a_s_for_strings))
    if(o_object.for){
        o_object.a_s_for_strings.push(o_object.for)
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
            
            var s_a_s_for_strings_opening_string = ``
            var s_a_s_for_strings_ending_string = ``
            
            for(var n_index_a_s_for_strings in o_object.a_s_for_strings){
                var s_for_string = o_object.a_s_for_strings[n_index_a_s_for_strings]
                s_a_s_for_strings_opening_string+=`for(${s_for_string}){\n`
                s_a_s_for_strings_ending_string+=`}\n`
            }
            var s_function_string =
            `
            ${s_scope_variables_initialization_lines}
            var a_evaluated_values = []
            ${s_a_s_for_strings_opening_string}
            a_evaluated_values.push(${value})
            ${s_a_s_for_strings_ending_string}
            return a_evaluated_values
            `
            console.log(s_function_string)
            var a_evaluated_values = new Function('o_was_what_data', 'THREE', 
                s_function_string
            )(
                o_was_what_data, 
                THREE
            )

            // // console.log(evaluated_value)
            // // o_threejs_instance_mesh[s_prop_o_object.substring(1)].set(evaluated_value); 
            // Object.defineProperty(o_threejs_instance_mesh, s_prop_o_object.substring(1), {
            //     writable: true
            //   });
              
            // o_threejs_instance_mesh[s_prop_o_object.substring(1)] = (evaluated_value); 
            // // Object.assign(o_threejs_instance_mesh[s_prop_o_object.substring(1)], evaluated_value)
            // // o_threejs_instance_mesh[s_prop_o_object.substring(1)].copy(evaluated_value); 
            // // o_threejs_instance_mesh[s_prop_o_object.substring(1)].x = Math.random()*0.5
            // // o_threejs_instance_mesh[s_prop_o_object.substring(1)].y = Math.random()*0.5
            // // o_threejs_instance_mesh[s_prop_o_object.substring(1)].z = Math.random()*0.5

        }else{

            // o_threejs_instance_mesh[s_prop_o_object] = value; 
        }
        
    }    

    o_threejs_instance_mesh.c = []
    for(var s_prop_o_object_c in o_object.c){
        var o_object_child = f_recursive_convert_object(o_object.c[s_prop_o_object_c], o_object.a_s_for_strings, o_object)
        o_threejs_instance_mesh.c.push(o_object_child)
        o_threejs_instance_mesh.add(o_object_child)
    }

    for(var n_index_a_evaluated_values in a_evaluated_values){
        var evaluated_value = a_evaluated_values[n_index_a_evaluated_values]
        console.log(evaluated_value)
        var o_threejs_instance_mesh_copy = Object.assign({}, o_threejs_instance_mesh)

        for(var s_prop_o_object in o_object){
            if(['c','t'].indexOf(s_prop_o_object) != -1){
                continue;
            }
            var value = o_object[s_prop_o_object]
            if(s_prop_o_object.indexOf(":") == 0){

                Object.defineProperty(o_threejs_instance_mesh, s_prop_o_object.substring(1), {
                    writable: true
                });
                
                o_threejs_instance_mesh[s_prop_o_object.substring(1)] = (evaluated_value); 

            }else{
                o_threejs_instance_mesh_copy[s_prop_o_object] = value; 
            }
        }

        if(o_parent.c){
            o_parent.c.push(
               o_threejs_instance_mesh_copy
            )   
        }
    }

    o_object = o_threejs_instance_mesh
    return o_object
}

window.wo_where_layout_static_data_rendered = f_recursive_convert_object(wo_where_layout_static_data);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.add( window.wo_where_layout_static_data_rendered );

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// // cube.position.copy(new THREE.Vector3(1,2,3))
// scene.add( cube );



camera.position.z = 5;

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