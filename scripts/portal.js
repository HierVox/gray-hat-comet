
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const canvas = document.getElementById('portalCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create portal geometry
const geometry = new THREE.RingGeometry(1, 1.6, 64);
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 }
    },
    vertexShader: \`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 p = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
    \`,
    fragmentShader: \`
        varying vec2 vUv;
        uniform float time;
        void main() {
            float glow = 0.2 + 0.3 * sin(10.0 * length(vUv - 0.5) - time * 2.0);
            vec3 color = vec3(0.1, 0.6, 1.0) * glow;
            gl_FragColor = vec4(color, 1.0);
        }
    \`,
    transparent: true
});

const portal = new THREE.Mesh(geometry, material);
scene.add(portal);

function animate(t) {
    requestAnimationFrame(animate);
    material.uniforms.time.value = t * 0.001;
    portal.rotation.z += 0.001;
    renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
