import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./hero.css";

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

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    float distanceFromCenter = length(uv);
    float angle = atan(uv.y, uv.x);
    float glow = 0.0;

    for (int i = 0; i < 6; i++) {
      float index = float(i);
      float radius = 0.28 + index * 0.105 + mod(uTime * 0.018 + index * 0.17, 0.08);
      float ring = 1.0 - smoothstep(0.006, 0.012, abs(distanceFromCenter - radius));
      float edgeFade = 0.25 + 0.75 * abs(cos(angle));
      glow += ring * edgeFade * (1.0 - index * 0.08);
    }

    vec3 color = mix(uColor, uColorTwo, clamp(distanceFromCenter * 1.2, 0.0, 1.0));
    float vignette = 1.0 - smoothstep(0.38, 0.82, distanceFromCenter);
    gl_FragColor = vec4(color * glow * vignette, glow * vignette * 0.9);
  }
`;

type Props = {
  active?: boolean;
};

export function MagicRingsBackground({ active = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(active);
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
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount || !active || !isVisible || reducedMotion || webglFailed) return;

    if (typeof window !== "undefined" && !("WebGLRenderingContext" in window)) {
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

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color("#1c5cff") },
      uColorTwo: { value: new THREE.Color("#1a2cf0") },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(quad);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio(),
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    const render = (time: number) => {
      uniforms.uTime.value = time;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeChild(renderer.domElement);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [active, isVisible, reducedMotion, webglFailed]);

  return (
    <div
      ref={containerRef}
      className={`magic-rings-container${webglFailed || reducedMotion ? " magic-rings-container--fallback" : ""}`}
      aria-hidden="true"
    >
      <div className="magic-rings-fallback" />
    </div>
  );
}
