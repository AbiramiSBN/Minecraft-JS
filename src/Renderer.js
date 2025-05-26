import * as THREE from 'three';
import vert from '../shaders/voxel.vert.glsl';
import frag from '../shaders/voxel.frag.glsl';

export class Renderer {
  constructor(scene, blockRegistry) {
    this.scene = scene;
    this.blockRegistry = blockRegistry;
    this.chunks = new Map();

    // atlas texture
    const tex = new THREE.TextureLoader().load('/textures/atlas.png');
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestMipMapNearestFilter;
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: { uTexture: { value: tex } },
      side: THREE.DoubleSide
    });
  }

  addChunk(chunk) {
    const mesh = this._buildMesh(chunk);
    mesh.position.set(chunk.cx*16, 0, chunk.cz*16);
    this.scene.add(mesh);
    this.chunks.set(`${chunk.cx},${chunk.cz}`, { chunk, mesh });
  }

  updateChunk(chunk) {
    const key = `${chunk.cx},${chunk.cz}`;
    const { mesh } = this.chunks.get(key);
    const newMesh = this._buildMesh(chunk);
    newMesh.position.copy(mesh.position);
    this.scene.remove(mesh);
    this.scene.add(newMesh);
    this.chunks.set(key, { chunk, mesh:newMesh });
  }

  _buildMesh(chunk) {
    const { positions, normals, uvs, indices } = this.blockRegistry.greedyMesh(chunk);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    return new THREE.Mesh(geom, this.material);
  }

  render(camera) {
    // basic ambient + directional
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    {
      const d = new THREE.DirectionalLight(0xffffff, 0.6);
      d.position.set(100, 200, 100);
      this.scene.add(d);
    }
    camera.lookAt(0, 32, 0);
    camera.updateMatrixWorld();
    const renderer = camera.renderer || camera.parent.renderer;
    renderer.render(this.scene, camera);
  }
}
