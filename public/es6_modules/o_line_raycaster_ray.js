
import * as THREE from 'three'

const o_material_raycaster_ray = new THREE.LineBasicMaterial({
	color: 0x0000ff
});
const a_points_raycaster_ray = [];
a_points_raycaster_ray.push( new THREE.Vector3( 0,0,0 ) );
a_points_raycaster_ray.push( new THREE.Vector3( 0,0,0 ) );
const o_geometry_raycaster_ray = new THREE.BufferGeometry().setFromPoints( a_points_raycaster_ray );

const o_line_raycaster_ray = new THREE.Line( o_geometry_raycaster_ray, o_material_raycaster_ray );
o_scene.add( o_line_raycaster_ray ); 

export default o_line_raycaster_ray