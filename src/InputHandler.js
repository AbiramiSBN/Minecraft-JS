import * as THREE from 'three';

export class InputHandler {
  constructor(camera, renderer, network, blockRegistry, audio) {
    this.camera = camera;
    this.net    = network;
    this.reg    = blockRegistry;
    this.audio  = audio;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    document.body.addEventListener('pointerdown', e=>this.onPointerDown(e));
    document.body.addEventListener('mousemove', e=>{
      this.mouse.x = (e.clientX / innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    });
  }

  onPointerDown(e) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.camera.parent.scene.children);
    if (!hits.length) return;
    const hit = hits[0];
    const pos = hit.point.clone().add(hit.face.normal.multiplyScalar(e.button===0?-0.001:0.999));
    const bx = Math.floor(pos.x), by=Math.floor(pos.y), bz=Math.floor(pos.z);
    const id = e.button===0 ? 0 : 1; // left destroy (id=0), right place stone (id=1)
    this.net.sendBlockUpdate(bx,by,bz, id);
    this.audio.play(id===0?'dig':'place');
  }

  update() {
    // placeholder for movement/physics
  }
}
