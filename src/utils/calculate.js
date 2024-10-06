

function calculate(e,i,q,orbitalPeriod,time) {
   const a = q/(1-9)
// const a = 4.0
const focusOffset = a * e;

// Calculate Mean Anomaly M as a function of time
function getMeanAnomaly(t, period) {
  return (2 * Math.PI / period) * (t % period);  // M = (2π/period) * time
}

// Solve Kepler’s equation using Newton-Raphson method
function solveKepler(M, e) {
  let E = M;  // Initial guess for Eccentric Anomaly
  const tolerance = 1e-6;  // Define a tolerance level for accuracy

  // Iteratively solve for Eccentric Anomaly
  while (true) {
    let deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < tolerance) break;
  }

  return E;
}

// Convert Eccentric Anomaly to True Anomaly
function getTrueAnomaly(E, e) {
  const cosTheta = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const sinTheta = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
  return Math.atan2(sinTheta, cosTheta);
}

// Calculate the position in 3D space using True Anomaly
function getOrbitalPosition(a, e, i, theta) {
  // Distance from the focal point (radius vector)
  const r = a * (1 - e * e) / (1 + e * Math.cos(theta));

  // Position in orbital plane
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  // Rotate based on inclination (tilt in 3D)
  const z = y * Math.sin(i);
  const yInclined = y * Math.cos(i);

  return { x, y: yInclined, z };
  
}

// Calculate Mean Anomaly M
const M = getMeanAnomaly(time, orbitalPeriod);

// Solve for Eccentric Anomaly E using Kepler's equation
const E = solveKepler(M, e);

// Calculate the True Anomaly θ from E
const theta = getTrueAnomaly(E, e);

// Get 3D position of the orbiting object
const position = getOrbitalPosition(a, e, i, theta);
    return {M,E,theta,position ,focusOffset};
}

export default calculate ;