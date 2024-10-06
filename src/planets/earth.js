import { renderer, scene ,camera } from "../App";
import * as THREE from 'three'

function earth(planet,index) {
    // let diameter = 1
    // if (planet == 'venusmap' || planet =='earth') {
    //     diameter = 1 ;
    // } else if(planet == 'mercurymap'){
    //     diameter = 1/2
    // }
    //  else if(planet == 'jupitermap'){
    //     diameter =6
    // }
    //  else if(planet == 'uranusmap'){
    //     diameter = 4
    // }
    //  else if(planet == 'neptunemap'){
    //     diameter = 4
    // }
    //  else if(planet == 'plutomap1k'){
    //     diameter = 1/2
    // }

const loader = new THREE.TextureLoader();
loader.load(`../src/img/${planet}.jpg`, (texture) => {
  // Create a material using the loaded texture
  const material = new THREE.MeshBasicMaterial({ map: texture
   });
     console.log(diameter);
     
  // Create a sphere using the material
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50), material);
  // Add the sphere to the scene
  scene.add(sphere);
});


// Function to create a 3D star field around the Earth
function createStarField() {

  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
  
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const radius = 100; // Radius for the starfield sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    // Spherical to Cartesian conversion
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  // Create Points object for stars and add to the scene
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

}


// Create the star field
// createStarField();

 // Atmosphere Geometry (slightly larger than Earth)
 const atmosphereGeometry = new THREE.SphereGeometry(0.13,50,50);

 // Atmosphere Material with transparency and slight blue color
 const atmosphereMaterial = new THREE.MeshPhongMaterial({
   color: 0x00aaff,       // Light blue color for atmosphere
   transparent: true,     // Allows transparency
   opacity: 0.5,          // Adjust opacity for subtle effect
   side: THREE.BackSide,  // Make the material render from the inside of the sphere
   depthWrite: false      // Prevents writing to the depth buffer, ensuring the glow appears in front of the Earth
 });

 // Atmosphere Mesh
 const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
//  scene.add(atmosphere);

 // Add Lighting


}

export default earth ;