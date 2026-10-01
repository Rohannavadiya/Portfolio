/**
 * Rohan Navadiya — Portfolio 3D Animated Background
 * Subtle particle network with mouse-reactive floating geometry
 * Uses Three.js r128 — lazy-loaded, mobile-optimised
 */

(function () {
  "use strict";

  const canvas = document.getElementById("three-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  // ---- Config ----
  const isMobile = window.innerWidth < 768;
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const PARTICLE_COUNT = isMobile ? 800 : 2000;
  const GEOMETRY_COUNT = isMobile ? 4 : 8;
  const CAMERA_Z = isMobile ? 500 : 400;

  // ---- State ----
  let mouseX = 0,
    mouseY = 0;
  const target = { x: 0, y: 0 };

  // ---- Scene ----
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.position.z = CAMERA_Z;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- Particles ----
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const palette = [
    new THREE.Color("#06d6a0"), // teal
    new THREE.Color("#8b5cf6"), // violet
    new THREE.Color("#0ea5e9"), // sky-blue
  ];

  for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1200;
    positions[i + 1] = (Math.random() - 0.5) * 1200;
    positions[i + 2] = (Math.random() - 0.5) * 800;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 2.8 : 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ---- Floating Geometries ----
  const geometries = [];
  const geoTypes = [
    new THREE.IcosahedronGeometry(18, 0),
    new THREE.OctahedronGeometry(14, 0),
    new THREE.TetrahedronGeometry(16, 0),
    new THREE.TorusGeometry(12, 4, 8, 24),
    new THREE.DodecahedronGeometry(14, 0),
  ];

  for (let i = 0; i < GEOMETRY_COUNT; i++) {
    const geo = geoTypes[i % geoTypes.length];
    const mat = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length],
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.06 : 0.08,
    });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 400,
    );
    mesh.userData = {
      rotSpeed: {
        x: Math.random() * 0.005 + 0.002,
        y: Math.random() * 0.008 + 0.003,
      },
      floatSpeed: Math.random() * 0.0005 + 0.0003,
      floatOffset: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    geometries.push(mesh);
  }

  // ---- Mouse ----
  const onMove = (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.4;
  };

  // Only track on desktop for performance
  if (!isMobile) {
    document.addEventListener("mousemove", onMove, { passive: true });
  }

  // ---- Resize ----
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // ---- Animation Loop ----
  const clock = new THREE.Clock();
  let animationFrameId = null;

  function animate() {
    if (document.hidden || motionPreference.matches) return;

    const t = clock.getElapsedTime();

    // Smooth follow
    target.x += (mouseX - target.x) * 0.02;
    target.y += (mouseY - target.y) * 0.02;

    // Rotate particles
    particles.rotation.y = t * 0.04 + target.x * 0.001;
    particles.rotation.x = t * 0.025 + target.y * 0.001;

    // Subtle wave on particles
    const pos = particleGeometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += Math.sin(t * 0.6 + i * 0.01) * 0.12;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Rotate floating geometries
    geometries.forEach((m) => {
      m.rotation.x += m.userData.rotSpeed.x;
      m.rotation.y += m.userData.rotSpeed.y;
      m.position.y +=
        Math.sin(t * m.userData.floatSpeed * 100 + m.userData.floatOffset) *
        0.25;
    });

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  const stopAnimation = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const startAnimation = () => {
    if (
      !document.hidden &&
      !motionPreference.matches &&
      animationFrameId === null
    ) {
      animate();
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else if (motionPreference.matches) {
      renderer.render(scene, camera);
    } else {
      startAnimation();
    }
  });

  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      stopAnimation();
      renderer.render(scene, camera);
    } else {
      startAnimation();
    }
  });

  if (motionPreference.matches) {
    renderer.render(scene, camera);
  } else {
    startAnimation();
  }
})();
