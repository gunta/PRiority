/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React, { useEffect, useRef } from "react";
import {
  CanvasTexture,
  Clock,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget
} from "three";

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const loadFont = async (fam: string) => {
  if ("fonts" in document) await document.fonts.load(`64px "${fam}"`);
};

const BASE_VERT = `
varying vec2 v_uv;
void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);v_uv=uv;}`;

const SIMPLEX = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
float snoise3(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=1./7.; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m*=m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const PERSIST_FRAG = `
uniform sampler2D sampler;
uniform float time;
uniform vec2 mousePos;
uniform float noiseFactor,noiseScale,rgbPersistFactor,alphaPersistFactor;
varying vec2 v_uv;
${SIMPLEX}
void main(){
  float a=snoise3(vec3(v_uv*noiseFactor,time*.1))*noiseScale;
  float b=snoise3(vec3(v_uv*noiseFactor,time*.1+100.))*noiseScale;
  vec4 t=texture2D(sampler,v_uv+vec2(a,b)+mousePos*.005);
  gl_FragColor=vec4(t.xyz*rgbPersistFactor,alphaPersistFactor);
}`;

const TEXT_FRAG = `
uniform sampler2D sampler;uniform vec3 color;varying vec2 v_uv;
void main(){
  vec4 t=texture2D(sampler,v_uv);
  float alpha=smoothstep(0.1,0.9,t.a);
  if(alpha<0.01)discard;
  gl_FragColor=vec4(color,alpha);
}`;

export interface TextTrailProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  noiseFactor?: number;
  noiseScale?: number;
  rgbPersistFactor?: number;
  alphaPersistFactor?: number;
  animateColor?: boolean;
  startColor?: string;
  textColor?: string;
  backgroundColor?: number | string;
  colorCycleInterval?: number;
  supersample?: number;
}

const TextTrail: React.FC<TextTrailProps> = ({
  text = "Trail",
  fontFamily = "Figtree",
  fontWeight = "900",
  noiseFactor = 1,
  noiseScale = 0.0005,
  rgbPersistFactor = 0.98,
  alphaPersistFactor = 0.95,
  animateColor = false,
  startColor = "#ffffff",
  textColor = "#ffffff",
  backgroundColor = 0x271e37,
  colorCycleInterval = 3000,
  supersample = 2,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const persistColor = useRef<[number, number, number]>(
    hexToRgb(textColor || startColor).map((c) => c / 255) as [
      number,
      number,
      number,
    ]
  );
  const targetColor = useRef<[number, number, number]>([
    ...persistColor.current,
  ]);

  useEffect(() => {
    if (!ref.current) return;

    const size = () => ({
      w: ref.current!.clientWidth,
      h: ref.current!.clientHeight,
    });
    let { w, h } = size();

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(new Color(backgroundColor as any), 1);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, h);
    ref.current.appendChild(renderer.domElement);

    const scene = new Scene();
    const fluidScene = new Scene();
    const clock = new Clock();
    const cam = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 10);
    cam.position.z = 1;

    let rt0 = new WebGLRenderTarget(w, h);
    let rt1 = rt0.clone();

    const quadMat = new ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        time: { value: 0 },
        mousePos: { value: new Vector2(-1, 1) },
        noiseFactor: { value: noiseFactor },
        noiseScale: { value: noiseScale },
        rgbPersistFactor: { value: rgbPersistFactor },
        alphaPersistFactor: { value: alphaPersistFactor },
      },
      vertexShader: BASE_VERT,
      fragmentShader: PERSIST_FRAG,
      transparent: true,
    });
    const quad = new Mesh(new PlaneGeometry(w, h), quadMat);
    fluidScene.add(quad);

    const labelMat = new ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        color: { value: new Vector3(...persistColor.current) },
      },
      vertexShader: BASE_VERT,
      fragmentShader: TEXT_FRAG,
      transparent: true,
    });
    const label = new Mesh(
      new PlaneGeometry(Math.min(w, h), Math.min(w, h)),
      labelMat
    );
    scene.add(label);

    const texCanvas = document.createElement("canvas");
    const ctx = texCanvas.getContext("2d", {
      alpha: true,
      colorSpace: "srgb",
    })!;
    const drawText = () => {
      const max = Math.min(renderer.capabilities.maxTextureSize, 4096);
      const pixelRatio = (window.devicePixelRatio || 1) * supersample;
      const canvasSize = max * pixelRatio;
      texCanvas.width = canvasSize;
      texCanvas.height = canvasSize;
      texCanvas.style.width = `${max}px`;
      texCanvas.style.height = `${max}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, max, max);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 2;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const refSize = 250;
      ctx.font = `${fontWeight} ${refSize}px ${fontFamily}`;
      const width = ctx.measureText(text).width;
      ctx.font = `${fontWeight} ${(refSize * max) / width}px ${fontFamily}`;

      const cx = max / 2,
        cy = max / 2;
      const offs = [
        [0, 0],
        [0.1, 0],
        [-0.1, 0],
        [0, 0.1],
        [0, -0.1],
        [0.1, 0.1],
        [-0.1, -0.1],
        [0.1, -0.1],
        [-0.1, 0.1],
      ];
      ctx.globalAlpha = 1 / offs.length;
      offs.forEach(([dx, dy]) => ctx.fillText(text, cx + dx, cy + dy));
      ctx.globalAlpha = 1;

      const tex = new CanvasTexture(texCanvas);
      tex.generateMipmaps = true;
      tex.minFilter = LinearMipmapLinearFilter;
      tex.magFilter = LinearFilter;
      labelMat.uniforms.sampler.value = tex;
    };
    loadFont(fontFamily).finally(drawText);

    const mouse = [0, 0],
      target = [0, 0];
    const onMove = (e: PointerEvent) => {
      const r = ref.current!.getBoundingClientRect();
      target[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
      target[1] = ((r.top + r.height - e.clientY) / r.height) * 2 - 1;
    };
    ref.current.addEventListener("pointermove", onMove);

    const ro = new ResizeObserver(() => {
      ({ w, h } = size());
      renderer.setSize(w, h);
      cam.left = -w / 2;
      cam.right = w / 2;
      cam.top = h / 2;
      cam.bottom = -h / 2;
      cam.updateProjectionMatrix();
      quad.geometry.dispose();
      quad.geometry = new PlaneGeometry(w, h);
      rt0.setSize(w, h);
      rt1.setSize(w, h);
      label.geometry.dispose();
      label.geometry = new PlaneGeometry(Math.min(w, h), Math.min(w, h));
    });
    ro.observe(ref.current);

    const timer = setInterval(() => {
      if (!textColor) {
        targetColor.current = [Math.random(), Math.random(), Math.random()];
      }
    }, colorCycleInterval);

    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      if (animateColor && !textColor) {
        for (let i = 0; i < 3; i++)
          persistColor.current[i] +=
            (targetColor.current[i] - persistColor.current[i]) * dt;
      }
      const speed = dt * 5;
      mouse[0] += (target[0] - mouse[0]) * speed;
      mouse[1] += (target[1] - mouse[1]) * speed;

      quadMat.uniforms.mousePos.value.set(mouse[0], mouse[1]);
      quadMat.uniforms.sampler.value = rt1.texture;
      quadMat.uniforms.time.value = clock.getElapsedTime();
      labelMat.uniforms.color.value.set(...persistColor.current);

      renderer.autoClearColor = false;
      renderer.setRenderTarget(rt0);
      renderer.clearColor();
      renderer.render(fluidScene, cam);
      renderer.render(scene, cam);
      renderer.setRenderTarget(null);
      renderer.render(fluidScene, cam);
      renderer.render(scene, cam);
      [rt0, rt1] = [rt1, rt0];
    });

    return () => {
      renderer.setAnimationLoop(null);
      clearInterval(timer);
      ref.current?.removeEventListener("pointermove", onMove);
      ro.disconnect();
      ref.current?.removeChild(renderer.domElement);
      renderer.dispose();
      rt0.dispose();
      rt1.dispose();
      quadMat.dispose();
      quad.geometry.dispose();
      labelMat.dispose();
      label.geometry.dispose();
    };
  }, [
    text,
    fontFamily,
    fontWeight,
    noiseFactor,
    noiseScale,
    rgbPersistFactor,
    alphaPersistFactor,
    animateColor,
    startColor,
    textColor,
    backgroundColor,
    colorCycleInterval,
    supersample,
  ]);

  return <div ref={ref} className="w-full h-full" />;
};

export default TextTrail;
