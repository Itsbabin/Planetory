import { renderer, scene ,camera } from "../App";
import * as THREE from 'three'
import calculate from "../utils/calculate";

function genarateComid(e,i,q,orbitalPeriod,setfocusOffsetT ,focusOffset) {
    let time = Math.floor(Math.random() * 100);  
    const a = q/(1-e)
const geometry = new THREE.SphereGeometry(0.02, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const orbitingObject = new THREE.Mesh(geometry, material);
scene.add(orbitingObject);

let numSegments = 360
const points = [];

for (let i = 0; i <= numSegments; i++) {
    const theta = (i / numSegments) * 2 * Math.PI;  // Divide the orbit into 360 points
  
    // Get the radius r for a given true anomaly
    const r = (a * (1 - Math.pow(e, 2))) / (1 + e * Math.cos(theta));
  
    // Calculate position in the orbital plane (x, y) before considering i
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
  
    // Rotate by the i angle (tilt the orbit)
    const z = y * Math.sin(i);  // Apply i to y value to get z-axis component
    const yInclined = y * Math.cos(i);  // Adjust y value according to i
  
    // Offset the orbit to align with the focus (focusOffset is along x-axis
    
    points.push(new THREE.Vector3(x , yInclined, z));
  }
  
  // Create a BufferGeometry from the points
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // Create a line material for the orbit
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  
  // Create the orbit line and add it to the scene
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  // return orbitingObject ;
  //   scene.add(orbitLine);
  function animate() {
    requestAnimationFrame(animate);
  
    // Increment time (you can adjust this to control the speed of the orbit)
    time += 0.01;
  
    // Calculate Mean Anomaly M
   let {M,E,theta,position,focusOffset} = calculate(e,i,q,orbitalPeriod,time)
   
   setfocusOffsetT(focusOffset)
    //  M = getMeanAnomaly(time, orbitalPeriod);
  
    // // Solve for Eccentric Anomaly E using Kepler's equation
    //  E = solveKepler(M, e);

    position.x = position.x * 20
    position.z = position.z * 20
    position.y = position.y * 20
    
    // // Calculate the True Anomaly θ from E
    //  theta = getTrueAnomaly(E, e);
  
    // // Get 3D position of the orbiting object
    //  position = getOrbitalPosition(a, e, i, theta);
  
    // Update the position of the object in the Three.js scene

   // Avoid useState for rapidly changing values
    orbitingObject.position.set(position.x, position.y, position.z);
    orbitingObject.matrixAutoUpdate = true; // Update the mesh


    // Render the scene

    renderer.render(scene, camera);
    
  }
  
  // Start the animation loop
  animate();
  
  return orbitingObject


}

export default genarateComid ;