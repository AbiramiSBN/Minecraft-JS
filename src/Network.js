export class Network {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.type==='chunkData' && this._onChunk) this._onChunk(m);
      if (m.type==='blockUpdate' && this._onBlock) this._onBlock(m);
    };
  }

  requestChunk(cx, cz, cb) {
    this._onChunk = data => { if (data.cx===cx&&data.cz===cz) cb(data); };
    this.ws.send(JSON.stringify({ type:'requestChunk', cx, cz }));
  }

  sendBlockUpdate(x,y,z, id) {
    this.ws.send(JSON.stringify({ type:'blockUpdate', x,y,z,id }));
  }

  onBlockUpdate(cb) { this._onBlock = cb; }
}
