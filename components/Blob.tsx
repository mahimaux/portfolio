"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, reduced } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT).
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uSquish;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vObj;
varying float vNoise;
${SNOISE}
float disp(vec3 n){
  // keep the face region calm so the features stay readable
  float calm = 1.0 - 0.7 * smoothstep(0.45, 0.95, n.z);
  float d = snoise(n * 1.05 + vec3(0.0, uTime * 0.24, uTime * 0.1)) * 0.13;
  d += snoise(n * 2.1 - vec3(uTime * 0.16)) * 0.022;
  return d * uAmp * calm;
}
void main(){
  vec3 n = normalize(position);
  float d = disp(n);
  vec3 p = n * (1.0 + d);
  // finite-difference normal on the displaced sphere
  vec3 up = abs(n.y) > 0.98 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tA = normalize(cross(n, up));
  vec3 tB = normalize(cross(n, tA));
  float e = 0.012;
  vec3 nA = normalize(n + tA * e);
  vec3 nB = normalize(n + tB * e);
  vec3 pA = nA * (1.0 + disp(nA));
  vec3 pB = nB * (1.0 + disp(nB));
  vec3 dn = normalize(cross(pA - p, pB - p));
  if (dot(dn, n) < 0.0) dn = -dn;
  p.y *= 1.0 - uSquish * 0.22;
  p.xz *= 1.0 + uSquish * 0.14;
  vObj = n;
  vNoise = d;
  vNormal = normalize(normalMatrix * dn);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec3 uInk;
uniform float uBlink;
uniform float uFace;
uniform float uSmile;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vObj;
varying float vNoise;

vec3 env(vec3 r){
  float y = r.y;
  vec3 c = mix(vec3(0.05), vec3(0.96, 0.95, 0.92), smoothstep(-0.15, 0.7, y));
  c += smoothstep(0.82, 0.97, y) * 0.5;
  c = mix(c, uA, (1.0 - smoothstep(0.0, 0.16, abs(y - 0.04))) * 0.85);
  c = mix(c, uC, smoothstep(0.55, 0.95, r.x) * 0.6);
  c = mix(c, uB, smoothstep(0.55, 0.95, -r.x) * 0.55);
  return c;
}
float ring(vec2 p, vec2 c, float r, float a, float b){
  return 1.0 - smoothstep(a, b, abs(length(p - c) - r));
}
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPos);
  vec3 R = reflect(-V, N);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);
  vec3 base = mix(uA, uB, smoothstep(-0.7, 1.0, -N.y + vNoise * 3.0));
  base = mix(base, uC, smoothstep(0.35, 1.0, N.x) * 0.45);
  vec3 col = mix(base, env(R), 0.38 + fres * 0.5);
  float spec = pow(max(dot(R, normalize(vec3(-0.45, 0.8, 0.6))), 0.0), 70.0);
  float spec2 = pow(max(dot(R, normalize(vec3(0.7, 0.2, 0.7))), 0.0), 22.0);
  col += spec * 1.1 + spec2 * 0.18;

  if (uFace > 0.5 && vObj.z > 0.0) {
    vec2 p = vObj.xy;
    float bl = max(uBlink, 0.08);
    vec2 e1 = (p - vec2(-0.19, 0.17)) / vec2(0.058, 0.088 * bl);
    vec2 e2 = (p - vec2( 0.19, 0.17)) / vec2(0.058, 0.088 * bl);
    float eyes = max(1.0 - smoothstep(0.85, 1.0, length(e1)), 1.0 - smoothstep(0.85, 1.0, length(e2)));
    float smile = ring(p, vec2(0.0, 0.1), 0.27, 0.018, 0.03) * step(p.y, 0.0) * (1.0 - smoothstep(0.15, 0.2, abs(p.x)));
    vec2 q = (p - vec2(0.0, -0.09)) * vec2(1.0, 0.85);
    float oh = 1.0 - smoothstep(0.016, 0.028, abs(length(q) - 0.055));
    float mouth = mix(oh, smile, clamp(uSmile, 0.0, 1.0));
    col = mix(col, uInk + spec * 0.6, max(eyes, mouth));
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return new THREE.Color(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

type Props = { className?: string; face?: boolean; amp?: number; colors?: [string, string, string]; interactive?: boolean };

export function Blob({ className = "", face = true, amp = 1, colors = ["#c8f53c", "#2e3bff", "#ff8fcf"], interactive = true }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 4.6);
    const u = {
      uTime: { value: 0 },
      uAmp: { value: amp },
      uSquish: { value: 0 },
      uA: { value: hex(colors[0]) },
      uB: { value: hex(colors[1]) },
      uC: { value: hex(colors[2]) },
      uInk: { value: hex("#121110") },
      uBlink: { value: 1 },
      uFace: { value: face ? 1 : 0 },
      uSmile: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 28), mat);
    scene.add(mesh);

    const size = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();
    renderer.compile(scene, camera);

    const dispose = () => {
      mesh.geometry.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };

    if (reduced()) {
      u.uTime.value = 3;
      mesh.rotation.set(0.06, -0.18, 0);
      ro.disconnect();
      const ro2 = new ResizeObserver(() => {
        size();
        renderer.render(scene, camera);
      });
      ro2.observe(el);
      renderer.render(scene, camera);
      return () => {
        ro2.disconnect();
        dispose();
      };
    }

    const m = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      m.x = gsap.utils.clamp(-1, 1, (e.clientX - cx) / (window.innerWidth / 2));
      m.y = gsap.utils.clamp(-1, 1, (e.clientY - cy) / (window.innerHeight / 2));
    };
    window.addEventListener("pointermove", move, { passive: true });

    const poke = () => {
      sfx.pop(0.8 + 0.5 * Math.random());
      gsap.fromTo(u.uSquish, { value: 1 }, { value: 0, duration: 1.1, ease: "elastic.out(1.2, 0.3)" });
      gsap.fromTo(u.uSmile, { value: 0.2 }, { value: 1, duration: 0.9, ease: "back.out(2)" });
    };
    if (interactive) el.addEventListener("pointerdown", poke);

    let blinkT: ReturnType<typeof setTimeout>;
    const blink = () => {
      gsap.to(u.uBlink, { value: 0.05, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut" });
      blinkT = setTimeout(blink, 2200 + 3000 * Math.random());
    };
    blinkT = setTimeout(blink, 1800);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    const t0 = performance.now();
    const tick = () => {
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      u.uTime.value = t;
      const ry = 0.55 * m.x + 0.08 * Math.sin(0.6 * t);
      const rx = 0.4 * m.y + 0.05 * Math.cos(0.5 * t);
      mesh.rotation.y += (ry - mesh.rotation.y) * 0.06;
      mesh.rotation.x += (rx - mesh.rotation.x) * 0.06;
      mesh.position.y = 0.04 * Math.sin(1.1 * t);
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(blinkT);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", poke);
      dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={className} data-cursor={interactive ? "poke" : undefined} />;
}
