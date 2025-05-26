const WebSocket = require('ws');
const { WorldGenerator } = require('../dist/WorldGenerator.js');

const wss = new WebSocket.Server({ port: 8080 });
const worldGen = new WorldGenerator(12345);
const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);
  ws.on('message', msg => {
    const m = JSON.parse(msg);
    if (m.type === 'requestChunk') {
      const chunk = worldGen.generateChunk(m.cx, m.cz);
      ws.send(JSON.stringify({ type:'chunkData', ...chunk }));
    }
    if (m.type === 'blockUpdate') {
      // broadcast to all
      for (let c of clients) {
        if (c.readyState === WebSocket.OPEN) {
          c.send(msg);
        }
      }
    }
  });
  ws.on('close', ()=>clients.delete(ws));
});

console.log('Server listening on ws://localhost:8080');
