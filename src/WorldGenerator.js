import perlin from 'perlin-noise';

export class WorldGenerator {
  constructor(seed=0) {
    this.seed = seed;
    this.noise2D = perlin.generatePerlinNoise(256, 256, { octaveCount:4, amplitude:1, persistence:0.5 });
  }

  generateChunk(cx, cz) {
    const size = 16;
    const blocks = new Uint16Array(size*size*256);
    for (let x=0; x<size; x++) {
      for (let z=0; z<size; z++) {
        // simple heightmap
        const gx = (cx*size + x) & 255;
        const gz = (cz*size + z) & 255;
        const h = Math.floor((this.noise2D[gx + gz*256] + 1)*0.5 * 32) + 32;
        for (let y=0; y<256; y++) {
          const idx = x + z*size + y*size*size;
          if (y < h) {
            blocks[idx] = y < h-4 ? 1 : 2; // stone vs dirt
          } else if (y===h) {
            blocks[idx] = 3; // grass
          } else {
            blocks[idx] = 0; // air
          }
        }
      }
    }
    return { cx, cz, blocks: Array.from(blocks) };
  }
}
