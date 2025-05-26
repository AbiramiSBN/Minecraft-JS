export class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext||window.webkitAudioContext)();
    this.buffers = {};
    ['dig','place'].forEach(name => {
      fetch(`/sounds/${name}.ogg`)
        .then(r=>r.arrayBuffer())
        .then(b=>this.ctx.decodeAudioData(b))
        .then(buf=>this.buffers[name]=buf);
    });
  }

  play(name) {
    const buf = this.buffers[name];
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.ctx.destination);
    src.start();
  }
}
