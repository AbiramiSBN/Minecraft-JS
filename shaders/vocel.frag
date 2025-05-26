precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;
void main(){
  float light = dot(normalize(vNormal), vec3(0.5,0.7,1.0))*0.5 + 0.5;
  gl_FragColor = texture2D(uTexture, vUv) * light;
}
