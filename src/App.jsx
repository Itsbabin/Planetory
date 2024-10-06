import { useEffect, useState } from 'react'
import axios from "axios";
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './App.css'
import genarateComid from './components/genarateComid';
// import getData from './api/getData';
import earth from './planets/earth';
import calculate from './utils/calculate';



const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
function App() {
  const [focusOffsetT, setfocusOffsetT] = useState()
  const [data, setData] = useState([{
    "object": "1P/Halley",
    "epoch_tdb": "49400",
    "tp_tdb": "2446467.395",
    "e": "0.9671429085",
    "i_deg": "162.2626906",
    "w_deg": "111.3324851",
    "node_deg": "58.42008098",
    "q_au_1": "0.5859781115",
    "q_au_2": "35.08",
    "p_yr": "75.32",
    "moid_au": "0.063782",
    "a1_au_d_2": "0.000000000270",
    "a2_au_d_2": "0.000000000155",
    "ref": "J863/77",
    "object_name": "1P/Halley"
}])
  
const coltroler = new OrbitControls(camera, renderer.domElement)
coltroler.enableDamping = true ;
    coltroler.dampingFactor = 0.05; // Camera movement damping factor
    coltroler.enableZoom = true;    // Enable zooming
    coltroler.zoomSpeed = 0.8;      // Adjust zoom speed
     // Default target (can be changed)
coltroler.update()

useEffect(() => {
  
  // Set up Three.js scene
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // const centergeo = new THREE.SphereGeometry(1, 32, 32);
  // const centermeta = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const centerObject = new THREE.Mesh(centergeo, centermeta);
  // scene.add(centerObject);


  let data_list = [];
  let comid_list = [];
  async function getData() {
    await axios.get('https://data.nasa.gov/resource/b67r-rgxc.json')
      .then(( data) => {
         let coidliist =  data.data.map(({e , p_yr , q_au_1 , i_deg ,}) => {
  
           return genarateComid(e,i_deg,q_au_1,p_yr,setfocusOffsetT,focusOffsetT);
              
          })
          comid_list.push(coidliist)
          data_list.push(data.data)
          // console.log(data_list);
              // return data.data ;  
      })


      .catch((err) => {
        console.log(err);
      })
      
  }
 
  getData();

  // data.map(({e , p_yr , q_au_1 , i_deg}) => {
  
  //   genarateComid(e,i_deg,q_au_1,p_yr,setfocusOffsetT,focusOffsetT);
     
  // })

  function saturn() {
    scene.background = new THREE.Color(0x000000); // Pure black space

    // Lighting: Ambient and Directional Light (Sunlight)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Dim ambient light for space
    scene.add(ambientLight);

    // Sunlight: directional light casting shadows on one side of Saturn
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunlight.position.set(10, 5, 5); // Set the light source at an angle to Saturn
    sunlight.castShadow = true; // Enable shadows
    sunlight.shadow.mapSize.width = 2048;
    sunlight.shadow.mapSize.height = 2048;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 50;
    scene.add(sunlight);

    // Saturn creation with emissive material (slight glow effect)
    const saturnTexture = new THREE.TextureLoader().load('./src/img/earth1.jpg'); // Load your texture here
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: saturnTexture,
      emissive: new THREE.Color(0x222222),  // Slight glow effect
      emissiveIntensity: 0.4,
    });
    const saturn = new THREE.Mesh(geometry, material);
    
    // Enable shadow casting and receiving for Saturn
    saturn.castShadow = true;
    saturn.receiveShadow = true;

    // Position Saturn upright without tilt
    saturn.rotation.z = 0;
    scene.add(saturn);

    saturn.position.set(1.3,0,0)

    // Create a horizontal ring around Saturn with particles (celestial bodies)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,  // Slightly transparent
      depthWrite: false,  // Prevents z-fighting issues
      blending: THREE.AdditiveBlending,  // Smooth alpha transitions
    });

    // Generate particles for the ring with variable size
    const particlesCount = 9000;
    const ringParticles = new Float32Array(particlesCount * 3);
    const particleSizes = new Float32Array(particlesCount);

    const innerRadius = 2;
    const outerRadius = 3.5;

    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random());
      const x = radius * Math.cos(angle);
      const y = (Math.random() - 0.5) * 0.02; // Very thin vertical displacement
      const z = radius * Math.sin(angle);

      ringParticles[i * 3] = x;
      ringParticles[i * 3 + 1] = y;
      ringParticles[i * 3 + 2] = z;

      // Gradually increase the particle size towards the outer radius
      particleSizes[i] = THREE.MathUtils.lerp(0.02, 0.08, (radius - innerRadius) / (outerRadius - innerRadius));
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(ringParticles, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const ring = new THREE.Points(particlesGeometry, particlesMaterial);

    // Keep the ring horizontal without tilt
    ring.rotation.z = 0;
    
    // Enable shadow receiving for the ring
    ring.receiveShadow = true;
    // scene.add(ring);

    // Add celestial bodies of varying sizes
    const celestialBodiesGeometry = new THREE.SphereGeometry(0.01, 16, 16);
    const celestialBodiesMaterial = new THREE.MeshStandardMaterial({ color: 0xffddaa });

    for (let i = 0; i < 100; i++) { // Increase count for more celestial bodies
      const celestialBody = new THREE.Mesh(celestialBodiesGeometry, celestialBodiesMaterial);
      celestialBody.position.set(
        THREE.MathUtils.randFloatSpread(50), // Increase the spread to cover more space
        THREE.MathUtils.randFloatSpread(50),
        THREE.MathUtils.randFloatSpread(50)
      );
      celestialBody.castShadow = true;
      celestialBody.receiveShadow = true;
      scene.add(celestialBody);
    }

    // Star field with more stars
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 20000; i++) { // Increased star count
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

   
    // OrbitControls for mouse control
    
    // Animation function
    let time = 0;


    // const testGeomety = new THREE.SphereGeometry(0.1,16,16);
    // const tesMetarial = new THREE.MeshPhongMaterial({color : 0xffffff})
    // const testMesh = new THREE.InstancedMesh(testGeomety,tesMetarial,160)

    // scene.add(testMesh);
    // const dummy = new THREE.Object3D(); 
    // // Saturn rotation (around its axis - Y-axis)
    // for (let index = 0; index < data_list.length; index++) {
    //   // const element = comid_list[index];
    //   let {e , p_yr , q_au_1 , i_deg } =  data_list[index]
      
    //   time += 0.1;
    //   let {position} = calculate(e,i_deg,q_au_1,p_yr,time)
      
    //   position.x = position.x * 20
    //   position.z = position.z * 20
    //   position.y = position.y * 20
    
    
    //   dummy.position.set(position.x, position.y, position.z);
    //   dummy.updateMatrix();
    //   testMesh.setMatrixAt(index,dummy.matrix)
      
    // }
    
    function animate() {
      saturn.rotation.y += 0.002;  // Slight increase for continuous rotation
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
  }
  
    
    
    animate();
    
  

    // animate();

  }

saturn();

// Set up camera position
camera.position.z = 7;
// camera.position.y = 60;
camera.lookAt(0, 0, 0);



const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

window.addEventListener('resize', handleResize);
  


       
  }, [])
  

  return (
    <>
      <div id="myThreeJsCanvas"></div>
    </>
  )
}

export  {App , scene ,renderer , camera}
