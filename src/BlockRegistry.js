export class BlockRegistry {
  constructor() {
    this.defs = {
      0: { id:0, name:'air',   opaque:false, solid:false,  uv:[[0,0]] },
      1: { id:1, name:'stone', opaque:true,  solid:true,   uv:[[1,0]] },
      2: { id:2, name:'dirt',  opaque:true,  solid:true,   uv:[[2,0]] },
      3: { id:3, name:'grass', opaque:true,  solid:true,   uv:[[3,0],[0,1],[0,1],[0,1],[0,1],[0,1]] }
    };
  }

  get(id) { return this.defs[id] || this.defs[0]; }

  // Simple greedy mesher: merges quads on same plane & block type
  greedyMesh(chunk) {
    // For brevity: using a naive per-face approach
    const positions = [], normals = [], uvs = [], indices = [];
    let idx = 0;
    const S = chunk.size;
    const DIRS = [
      { n:[ 0,  0, -1], verts:[[0,0,0],[1,0,0],[1,1,0],[0,1,0]] },
      { n:[ 0,  0,  1], verts:[[1,0,1],[0,0,1],[0,1,1],[1,1,1]] },
      { n:[-1,  0,  0], verts:[[0,0,1],[0,0,0],[0,1,0],[0,1,1]] },
      { n:[ 1,  0,  0], verts:[[1,0,0],[1,0,1],[1,1,1],[1,1,0]] },
      { n:[ 0, -1,  0], verts:[[0,0,1],[1,0,1],[1,0,0],[0,0,0]] },
      { n:[ 0,  1,  0], verts:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]] }
    ];
    for (let x=0; x<S; x++) for (let y=0; y<256; y++) for (let z=0; z<S; z++){
      const id = chunk.getBlock(x,y,z);
      if (id===0) continue;
      const def = this.get(id);
      for (let di=0; di<6; di++) {
        const {n, verts} = DIRS[di];
        const nx=x+n[0], ny=y+n[1], nz=z+n[2];
        const neighbor = (nx>=0&&nx<S&&ny>=0&&ny<256&&nz>=0&&nz<S)
          ? chunk.getBlock(nx,ny,nz) : 0;
        if (this.get(neighbor).opaque) continue;
        // emit quad
        for (let v=0; v<4; v++){
          const vx = x + verts[v][0];
          const vy = y + verts[v][1];
          const vz = z + verts[v][2];
          positions.push(vx, vy, vz);
          normals.push(...n);
          const [u,vv] = def.uv[di] || def.uv[0];
          uvs.push(u/16, vv/16);
        }
        indices.push(idx,idx+1,idx+2, idx,idx+2,idx+3);
        idx += 4;
      }
    }
    return { positions, normals, uvs, indices };
  }
}
