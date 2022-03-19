import "./cdn/math_tau.module.js";
import * as THREE from './node_modules/three/build/three.module.js'
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'
import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js'
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js'
// import { TextureLoader } from './node_modules/three/examples/jsm/loaders/TextureLoader.js'
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js'
import o_hidstatusmap from "./cdn/o_hidstatusmap.module.js";

var o_stats = new Stats();
o_stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(o_stats.dom);

var o_scene = new THREE.Scene();
var o_camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
window.o_camera = o_camera
o_camera.position.z = 5
var o_renderer = new THREE.WebGLRenderer();
o_renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(o_renderer.domElement);

const o_texture_loader = new THREE.TextureLoader();
const o_font_loader = new THREE.FontLoader()

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

var f_get_o_imagedata_rgba_by_lat_rad_lon_rad = function (
    n_lat_rad,
    n_lon_rad,
    o_canvas,
    a_data
    ) {
    //n_lat_rad // -tau/4 to tau/4 => y 0 to y 1
    //n_lon_rad // -tau/2 to tau/2 => x 0 to x 1
    n_lat_rad = n_lat_rad * -1;

    var n_lat_normalized = (n_lat_rad + Math.TAU / 4) / (Math.TAU / 2);
    var n_lon_normalized = (n_lon_rad + Math.TAU / 2) / Math.TAU;

    var n_img_coordinate_x = parseInt(o_canvas.width * n_lon_normalized);
    var n_img_coordinate_y = parseInt(o_canvas.height * n_lat_normalized);

    if (n_img_coordinate_y > 0) {
        n_img_coordinate_y = n_img_coordinate_y - 1;
    }
    var n_pixel_r_start_index = n_img_coordinate_y * o_canvas.width + n_img_coordinate_x;
    n_pixel_r_start_index = n_pixel_r_start_index * 4; // foreach pixel 4 array values [r,g,b,a,r,g,b,a...]

    // image_data is Uint8ClampedArray
    var o_imagedata_rgba_normalized = {
        n_r: a_data[n_pixel_r_start_index + 0] / 255,
        n_g: a_data[n_pixel_r_start_index + 1] / 255,
        n_b: a_data[n_pixel_r_start_index + 2] / 255,
        n_a: a_data[n_pixel_r_start_index + 3] / 255,
    };

    return o_imagedata_rgba_normalized
};

var f_foreach_vertex_get_image_pixel = function(
    s_src,
    s_attribute_name_prefix, 
    o_geometry, 
    // f_callback_vertex_pixel,
    f_callback_done = Function()
    ){
    
    var o_img = document.createElement("img");
    o_img.src = s_src;

    o_img.onload = function () {
        var o_canvas = document.createElement("canvas");
        o_canvas.width = o_img.width;
        o_canvas.height = o_img.height;

        o_canvas.getContext("2d").drawImage(
            o_img,
            0,
            0,
            o_img.width,
            o_img.height
        );
        var a_canvas_data = o_canvas.getContext("2d").getImageData(
            0,
            0,
            o_canvas.width,
            o_canvas.height
        ).data;

        // debugger
        o_geometry.rotateY( (Math.TAU/4)*3)//

        for (var key in o_geometry.vertices) {
            // debugger
            var o_vec3 = o_geometry.vertices[key];

            var o_spherical_coords = new THREE.Spherical().setFromCartesianCoords(
                o_vec3.x,
                o_vec3.y,
                o_vec3.z
            );
            
            var n_lat = o_spherical_coords.phi;
            var n_lon = o_spherical_coords.theta;

            n_lat = (n_lat-Math.TAU/4)*-1;

            var o_pixel_rgba_normalized = f_get_o_imagedata_rgba_by_lat_rad_lon_rad(
                n_lat, 
                n_lon, 
                o_canvas, 
                a_canvas_data
            )
            // f_callback_vertex_pixel(
            //     o_vec3, 
            //     o_pixel_for_lat_rad_lon_rad
            // )
            // unneccessary since the world_height_map is black white anyway, but why not
            var n_rgb_sum =
                o_pixel_rgba_normalized.n_r +
                o_pixel_rgba_normalized.n_g +
                o_pixel_rgba_normalized.n_b;

            // o_pixel_rgba_normalized.n_a
            var n_lightness_normalized = n_rgb_sum / 3;

            if (!o_vec3.o_spherical_coords_original) {
                o_vec3.o_spherical_coords_original = 
                    JSON.parse(JSON.stringify(o_spherical_coords));
            }

            // var s_prefix = s_src.split("/").pop().split(".").shift()

            o_vec3[s_attribute_name_prefix+"_o_pixel_rgba_normalized"] = o_pixel_rgba_normalized // uncomment to improve perfromance?
            o_vec3[s_attribute_name_prefix+"n_pixel_rgb_arithmetic_medium"] = n_lightness_normalized;

        }
        f_callback_done()

    }
}


o_texture_loader.load(
        o_universe.s_src_texture,
        function (
            o_texture
            ) {
        
            var n_radius = 10;
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

            let o_mesh = new THREE.Mesh( 
                o_geometry,
                o_material
            );
            
            o_scene.add( o_mesh );

    } );

var n_callback_counter = 0

for(let n_key_a_planets in a_planets){
    
    let o_planet = a_planets[n_key_a_planets]; 
    n_callback_counter++

    o_texture_loader.load(
        o_planet.s_src_texture,
        function (
            o_texture
            ) {
            

            var n_radius = 1; 
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
                }
            );
            

            f_foreach_vertex_get_image_pixel_data(
                o_planet.s_src_topography,
                "topography",        
                o_geometry,
                function(){
                    f_foreach_vertex_get_image_pixel_data(
                        o_planet.s_src_bathymetry, 
                        "bathymetry",
                        o_geometry
                    )
                }
            )

            let o_mesh = new THREE.Mesh( 
                o_geometry,
                o_material
            );

            o_mesh.o_planet = o_planet
            
            o_mesh.o_rotation_speed = new THREE.Vector3(
                // Math.random() * 0.03,
                0,
                // Math.random() * 0.03,
                0,
                // Math.random() * 0.03
                0,
            )
            window.o_mesh = o_mesh

            o_mesh.position.x = o_planets_position.n_radius * Math.cos((Math.TAU/a_planets.length) * n_key_a_planets); 
            o_mesh.position.z = o_planets_position.n_radius * Math.sin((Math.TAU/a_planets.length) * n_key_a_planets); 

            o_scene.add( o_mesh );

            n_callback_counter++
            o_font_loader.load(
                "./Montserrat_Regular.json",
                (o_font) => {
                    

                    //Geometry
                    var o_geometry = new THREE.TextBufferGeometry(
                        o_planet.s_name,
                        {
                            font: o_font,
                            size: 0.2,
                            height: 0.1,
                        }
                    )

                    o_geometry.center()  
                    var o_texture_clone = o_texture.clone()
                    o_texture_clone.wrapS = THREE.RepeatWrapping;
                    o_texture_clone.wrapT = THREE.RepeatWrapping;
                    o_texture_clone.repeat.set( 10, 10 );
                    o_texture_clone.needsUpdate = true;

                    var material = new THREE.MeshBasicMaterial( 
                        {   
                            map: o_texture_clone,
                        }
                    );

                    var o_font_mesh = new THREE.Mesh( 
                        o_geometry,
                        o_material
                    );

                    o_font_mesh.o_rotation_speed = new THREE.Vector3(
                        0, 
                        0.01, 
                        0
                    )
                    // window.o_font_mesh = o_font_mesh
                    o_font_mesh.position.y = 1.5
                    o_font_mesh.name = 'font.'+o_planet.s_name

                    o_mesh.add(o_font_mesh)
                    // o_scene.add(o_font_mesh)

                    n_callback_counter--


                }
            )
            
            n_callback_counter--
    } );



}

var o_controls = new PointerLockControls( 
    o_camera,
    document.body
);

document.body.addEventListener( 'click', function () {
    o_controls.lock();
}, false );

var n_animation_id = 0;
var n_movement_speed = 0.02;
var n_t = 0 // t => time
window.o_scene = o_scene


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

    for(var i in a_font_meshes){
        var o_mesh = a_font_meshes[i];
        // console.log(o_mesh)
        // o_mesh.quaternion.copy(o_camera.quaternion);
        o_mesh.lookAt(o_camera.position)
    }
    for(var i in a_planet_meshes){
        debugger
        var o_planet_mesh = a_planet_meshes[i]
        //apply topography
        if(o_planet_mesh.o_planet.s_src_topography != ''){
            for(var i in o_planet_mesh.vertices){

                var o_vec3 = o_planet_mesh.vertices[i]
                var o_spherical_coords_original = o_vec3.o_spherical_coords_original

                var s_attribute_name_prefix = "topography"; 

                var n_new_radius = o_spherical_coords_original.radius

                var n_pixel_rgb_arithmetic_medium_topography = o_vec3[s_attribute_name_prefix+"n_pixel_rgb_arithmetic_medium"]
                if(n_pixel_rgb_arithmetic_medium_topography){
                    n_new_radius += n_pixel_rgb_arithmetic_medium_topography
                }

                var s_attribute_name_prefix = "bathymetry"; 

                var n_pixel_rgb_arithmetic_medium_bathymetry = o_vec3[s_attribute_name_prefix+"n_pixel_rgb_arithmetic_medium"]
                if(n_pixel_rgb_arithmetic_medium_bathymetry){
                    n_new_radius += n_pixel_rgb_arithmetic_medium_bathymetry
                }

                var o_spherical = new THREE.Spherical(
                    n_new_radius +
                    o_spherical_coords_original.phi,  
                    o_spherical_coords_original.theta 
                )
                var o_new_o_vec3 = new THREE.Vector3().setFromSpherical(
                    o_spherical
                )

                o_vec3.copy(o_new_o_vec3)

            }
        }

        // if(o_planets_mesh.s_src_bathymetry != ''){

        // }

        // for(var key in o_planets_mesh){

        // }

    }

    if(o_hidstatusmap["w"] == true){
        o_controls.moveForward(n_movement_speed)
    }
    if(o_hidstatusmap["s"] == true){
        o_controls.moveForward(-n_movement_speed)
    }
    if(o_hidstatusmap["a"] == true){
        o_controls.moveRight(-n_movement_speed)
    }
    if(o_hidstatusmap["d"] == true){
        o_controls.moveRight(n_movement_speed)
    }
    if(o_hidstatusmap["e"] == true){
        o_camera.position.y += (n_movement_speed)
    }
    if(o_hidstatusmap["q"] == true){
        o_camera.position.y -= n_movement_speed
    }

    o_renderer.render(o_scene, o_camera);


    o_stats.end();
    n_animation_id = requestAnimationFrame(f_render);
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
