"use strict";

(function()
{
	window.addEventListener( "load", main );
	window.addEventListener( "resize", onWindowResize, false );
}());

function main() {
	var container, controls;
	var camera, scene, renderer, light;

	init();
	animate();
}

function init(container, controls, camera, scene) {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.0001, 200000);
	camera.position.set( -2, 1, 3 );

	controls = new THREE.OrbitControls( camera );
	controls.target.set( 0, -0.2, -0.2 );
	controls.update();

	scene = new THREE.Scene();
}

function animate() {

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}