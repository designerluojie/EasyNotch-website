import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HERO_RING_CONFIG } from "./hero-ring-config";

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform vec3 uColorTwo;
  uniform float uRingCount;
  uniform float uSpeed;
  uniform float uAttenuation;
  uniform float uLineThickness;
  uniform float uBaseRadius;
  uniform float uRadiusStep;
  uniform float uScaleRate;
  uniform float uOpacity;
  uniform float uBlur;
  uniform float uNoiseAmount;
  uniform float uRotation;
  uniform float uRingGap;
  uniform float uFadeIn;
  uniform float uFadeOut;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    float distanceFromCenter = length(uv);
    float angle = atan(uv.y, uv.x) + uRotation;
    float rings = 0.0;

    for (int i = 0; i < 12; i++) {
      float index = float(i);
      if (index >= uRingCount) continue;
      float radius = uBaseRadius + index * uRadiusStep * uRingGap * 0.55;
      radius += sin(uTime * 0.001 * uSpeed + index * 0.46) * uScaleRate * 0.03;
      float noise = sin(angle * 5.0 + index * 1.7 + uTime * 0.001 * uSpeed) * uNoiseAmount * 0.015;
      float edgeWidth = 0.0035 * max(uLineThickness, 1.0) + uBlur * 0.003;
      float edge = 1.0 - smoothstep(edgeWidth, edgeWidth * 2.7, abs(distanceFromCenter - radius + noise));
      float breathing = mix(uFadeOut, 1.0, 0.5 + 0.5 * sin(angle * 2.0 + index * 0.9 + uTime * 0.001 * uSpeed * 0.8));
      float attenuation = 1.0 - (index / max(uAttenuation, 1.0)) * 0.45;
      rings += edge * breathing * attenuation;
    }

    float fadeIn = smoothstep(0.0, max(uFadeIn, 0.001), distanceFromCenter);
    float fadeOut = 1.0 - smoothstep(0.56, 0.56 + max(uFadeOut, 0.001), distanceFromCenter);
    float glow = rings * fadeIn * fadeOut;
    vec3 color = mix(uColor, uColorTwo, clamp(distanceFromCenter * 1.15, 0.0, 1.0));
    gl_FragColor = vec4(color * glow, glow * uOpacity);
  }
`;

export function HeroPcBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reducedMotion || !("WebGLRenderingContext" in window)) {
      setWebglFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color(HERO_RING_CONFIG.color) },
      uColorTwo: { value: new THREE.Color(HERO_RING_CONFIG.colorTwo) },
      uRingCount: { value: HERO_RING_CONFIG.ringCount },
      uSpeed: { value: HERO_RING_CONFIG.speed },
      uAttenuation: { value: HERO_RING_CONFIG.attenuation },
      uLineThickness: { value: HERO_RING_CONFIG.lineThickness },
      uBaseRadius: { value: HERO_RING_CONFIG.baseRadius },
      uRadiusStep: { value: HERO_RING_CONFIG.radiusStep },
      uScaleRate: { value: HERO_RING_CONFIG.scaleRate },
      uOpacity: { value: HERO_RING_CONFIG.opacity },
      uBlur: { value: HERO_RING_CONFIG.blur },
      uNoiseAmount: { value: HERO_RING_CONFIG.noiseAmount },
      uRotation: { value: HERO_RING_CONFIG.rotation },
      uRingGap: { value: HERO_RING_CONFIG.ringGap },
      uFadeIn: { value: HERO_RING_CONFIG.fadeIn },
      uFadeOut: { value: HERO_RING_CONFIG.fadeOut },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(mesh);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio(),
      );
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frame = 0;
    const render = (time: number) => {
      uniforms.uTime.value = time;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`hero-pc__background${webglFailed || reducedMotion ? " hero-pc__background--fallback" : ""}`}
      aria-hidden="true"
    >
      <div className="hero-pc__rings-fallback" />
    </div>
  );
}
