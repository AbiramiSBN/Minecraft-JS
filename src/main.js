import * as THREE from 'three';
import { WorldGenerator } from './WorldGenerator';
import { Chunk } from './Chunk';
import { Renderer } from './Renderer';
import { BlockRegistry } from './BlockRegistry';
import { CraftingManager } from './CraftingManager';
import { InputHandler } from './InputHandler';
import { Network } from './Network';
import { UI } from './UI';
import { AudioManager } from './AudioManager';

// Init Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

const renderer3 = new THREE.WebGLRenderer({ antialias: true });
renderer3.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer3.domElement);

// Core systems
const blockRegistry   = new BlockRegistry();
const craftingManager = new CraftingManager();
const worldGen        = new WorldGenerator(12345);
const network         = new Network('ws://localhost:8080');
const ui              = new UI(blockRegistry, craftingManager);
const audio           = new AudioManager();

const renderer = new Renderer(scene, blockRegistry);
const input    = new InputHandler(camera, renderer, network, blockRegistry, audio);

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer3.setSize(innerWidth, innerHeight);
});

// Main loop
function animate() {
  requestAnimationFrame(animate);
  input.update();
  renderer.render(camera);
  ui.update();
}
animate();

// Load initial chunks around 0,0
for (let x=-1; x<=1; x++) {
  for (let z=-1; z<=1; z++) {
    network.requestChunk(x, z, chunkData => {
      const chunk = Chunk.deserialize(chunkData, blockRegistry);
      renderer.addChunk(chunk);
    });
  }
}
