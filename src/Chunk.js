export class Chunk {
  constructor(cx, cz, blocks, blockRegistry) {
    this.cx = cx; this.cz = cz;
    this.size = 16;
    this.blocks = Uint16Array.from(blocks);
    this.blockRegistry = blockRegistry;
  }

  getBlock(x,y,z) {
    return this.blocks[x + z*this.size + y*this.size*this.size];
  }

  setBlock(x,y,z, id) {
    this.blocks[x + z*this.size + y*this.size*this.size] = id;
  }

  static deserialize(data, blockRegistry) {
    return new Chunk(data.cx, data.cz, data.blocks, blockRegistry);
  }
}
