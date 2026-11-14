"use client";
import * as THREE from "three";
import { scrollState } from "./scroll";

const VERT = /* glsl */ `
uniform float uVel;
uniform float uHover;
uniform float uTime;
varying vec2 vUv;
varying float vDepth;
void main(){
  vUv = uv;
  vec3 p = position;
  float bend = sin(uv.x * 3.14159265) * uVel;
  p.y += bend * 0.42;
  p += normalize(vec3(p.x, 0.0, p.z)) * uHover * 0.08;
  p.y += sin(uTime * 1.2 + p.x * 1.5) * 0.015;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uTex;
uniform vec3 uBg;
uniform float uAspect;
uniform float uHover;
uniform float uNear;
uniform float uFar;
varying vec2 vUv;
varying float vDepth;
float rbox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
  float d = rbox(p, vec2(uAspect * 0.5, 0.5), 0.07);
  if (d > 0.0) discard;
  if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
  vec3 col = texture2D(uTex, uv).rgb;
  col = mix(col, vec3(0.07), smoothstep(-0.012, -0.004, d));
  if (!gl_FrontFacing) col = mix(col, uBg, 0.72);
  col = mix(col, uBg, smoothstep(uNear, uFar, vDepth) * 0.88);
  col += uHover * 0.04;
  gl_FragColor = vec4(col, 1.0);
}`;

type Opts = { perTurn: number; radius: number; pitch: number; cardWidth: number };

export class Helix {
  progress = 0;
  onFront: (i: number) => void = () => {};
  onHover: (i: number) => void = () => {};
  private r: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private cam: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private meshes: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = [];
  private textures: THREE.CanvasTexture[] = [];
  private ray = new THREE.Raycaster();
  private pointer = new THREE.Vector2(9, 9);
  private o: Opts;
  private dTheta: number;
  private current = 0;
  private prev = 0;
  private vel = 0;
  private frame = 0;
  private hovered = -1;
  private front = -1;
  private slow = 0;
  private lowDpr = false;
  private t0 = performance.now();
  private n: number;

  constructor(private host: HTMLElement, canvases: HTMLCanvasElement[], over?: { mobile?: Partial<Opts>; desktop?: Partial<Opts> }) {
    const mobile = innerWidth < 768;
    this.o = mobile
      ? { perTurn: 7, radius: 2.6, pitch: 0.62, cardWidth: 2.1, ...over?.mobile }
      : { perTurn: 7, radius: 3.1, pitch: 0.6, cardWidth: 2.35, ...over?.desktop };
    this.n = canvases.length;
    this.dTheta = (Math.PI * 2) / this.o.perTurn;
    this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.r.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.r.setClearColor(0x000000, 0);
    this.r.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(this.r.domElement);
    this.cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    this.resize();

    const R = this.o.radius;
    const aspect = canvases[0].width / canvases[0].height;
    const geo = new THREE.PlaneGeometry(this.o.cardWidth, this.o.cardWidth / aspect, 40, 12);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const th = x / R;
      pos.setXYZ(i, Math.sin(th) * R, pos.getY(i), Math.cos(th) * R);
    }
    geo.computeVertexNormals();

    this.textures = canvases.map((cv) => {
      const t = new THREE.CanvasTexture(cv);
      t.anisotropy = 4;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      return t;
    });

    for (let i = 0; i < this.n * 2; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        side: THREE.DoubleSide,
        uniforms: {
          uTex: { value: this.textures[i % this.n] },
          uBg: { value: new THREE.Vector3(0.071, 0.067, 0.063) },
          uAspect: { value: aspect },
          uVel: { value: 0 },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uNear: { value: R + 5.2 },
          uFar: { value: 2 * R + 7.5 },
        },
      });
      const m = new THREE.Mesh(geo, mat);
      m.rotation.y = i * this.dTheta;
      m.position.y = -i * this.o.pitch;
      m.userData.index = i;
      this.meshes.push(m);
      this.group.add(m);
    }
    this.group.rotation.z = 0.1;
    this.scene.add(this.group);

    // pre-warm textures + shaders off the critical path
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window ? (window as Window).requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 40);
    this.textures.forEach((t) => idle(() => this.r.initTexture(t)));
    idle(() => this.r.compile(this.scene, this.cam));
  }

  resize() {
    const w = this.host.clientWidth || innerWidth;
    const h = this.host.clientHeight || innerHeight;
    this.r.setSize(w, h, false);
    this.cam.aspect = w / h;
    this.cam.position.z = this.o.radius + (this.cam.aspect < 0.8 ? 9.5 : 6.4);
    this.cam.updateProjectionMatrix();
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  pick(): number {
    this.ray.setFromCamera(this.pointer, this.cam);
    const hit = this.ray.intersectObjects(this.meshes, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  }

  render(dtMs: number) {
    // adaptive DPR
    if (!this.lowDpr && dtMs > 24 && dtMs < 200 && ++this.slow > 45) {
      this.lowDpr = true;
      this.r.setPixelRatio(1);
      this.resize();
    }
    const N = this.n;
    const e = this.progress * (N - 1);
    const f = Math.floor(e);
    const t = e - f;
    const target = f + t - Math.sin(2 * Math.PI * t) / (2 * Math.PI) + 0.01 * scrollState.velocity;
    this.prev = this.current;
    this.current += (target - this.current) * 0.075;
    this.vel = THREE.MathUtils.clamp((this.current - this.prev) * 2.2, -0.9, 0.9);

    const g = this.group;
    g.rotation.y = -this.current * this.dTheta;
    g.position.y = this.current * this.o.pitch;
    const out = Math.abs(this.pointer.x) > 1.5;
    const px = out ? 0 : this.pointer.x;
    const py = out ? 0 : this.pointer.y;
    g.rotation.x += (0.06 * py + 0.04 - g.rotation.x) * 0.05;
    this.cam.position.x += (0.35 * px - this.cam.position.x) * 0.05;
    this.cam.lookAt(0, 0, 0);

    if (++this.frame % 2 === 0) {
      const h = this.pick();
      const hc = h >= 0 ? h % N : -1;
      if (hc !== (this.hovered >= 0 ? this.hovered % N : -1)) this.onHover(hc);
      this.hovered = h;
    }
    const time = (performance.now() - this.t0) / 1000;
    for (const m of this.meshes) {
      const u = m.material.uniforms;
      u.uVel.value += (this.vel - u.uVel.value) * 0.2;
      u.uTime.value = time;
      u.uHover.value += ((m.userData.index === this.hovered ? 1 : 0) - u.uHover.value) * 0.12;
    }

    const fi = ((Math.round(this.current) % N) + N) % N;
    if (fi !== this.front) {
      this.front = fi;
      this.onFront(fi);
    }
    this.r.render(this.scene, this.cam);
  }

  dispose() {
    this.meshes[0]?.geometry.dispose();
    this.meshes.forEach((m) => m.material.dispose());
    this.textures.forEach((t) => t.dispose());
    this.r.dispose();
    this.r.domElement.remove();
  }
}
