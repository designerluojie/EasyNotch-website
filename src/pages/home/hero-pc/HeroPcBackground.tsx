import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    float distanceFromCenter = length(uv);
    float angle = atan(uv.y, uv.x);
    float rings = 0.0;

    for (int i = 0; i < 8; i++) {
      float index = float(i);
      float radius = 0.18 + index * 0.092 + sin(uTime * 0.00012 + index * 0.46) * 0.006;
      float edge = 1.0 - smoothstep(0.003, 0.014, abs(distanceFromCenter - radius));
      float breathing = 0.68 + 0.32 * sin(angle * 2.0 + index * 0.9 + uTime * 0.0002);
      rings += edge * breathing * (1.0 - index * 0.045);
    }

    float vignette = 1.0 - smoothstep(0.3, 0.86, distanceFromCenter);
    vec3 blue = mix(vec3(0.07, 0.18, 1.0), vec3(0.13, 0.32, 1.0), clamp(distanceFromCenter * 1.5, 0.0, 1.0));
    float glow = rings * vignette;
    gl_FragColor = vec4(blue * glow * 0.9, glow * 0.78);
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
    if (!container || reducedMotion || !("WebGLRenderingContext" in window)) return;

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
