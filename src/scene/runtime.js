import * as THREE from "three";

export function mount(host, options = {}) {
  const {
    template = "portfolio",
    color = "#a0b58a",
    background = "#eef1e9",
    motion = "gentle",
    thumbnail = false,
  } = options;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    host.dataset.fallback = "true";
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.55;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70);
  camera.position.set(0, 1.1, 8.5);
  camera.lookAt(0, 0, 0);
  const group = new THREE.Group();
  scene.add(group);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6a6f5d, 3));
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(3, 5, 4);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xffffff, 2);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.28,
    roughness: 0.27,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: "#f5f2e7",
    roughness: 0.62,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#394536",
    roughness: 0.58,
  });
  let page;
  if (template === "portfolio") {
    for (let i = 0; i < 6; i++) {
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(1.68, 0.14 + i * 0.014, 16, 80),
        i % 2 ? ivory : material,
      );
      arch.position.z = -i * 0.62;
      arch.scale.y = 1.23;
      group.add(arch);
    }
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.53, 2),
      material,
    );
    core.position.set(0, -0.1, 0.8);
    group.add(core);
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.88, 0.2, 48),
      ivory,
    );
    pedestal.position.set(0, -2.14, 0.2);
    group.add(pedestal);
    group.rotation.set(0.08, -0.36, -0.13);
  } else if (template === "agency") {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 101 }, (_, i) => {
        const t = (i / 100) * Math.PI * 2;
        return new THREE.Vector3(
          Math.sin(t) * (1.45 + 0.25 * Math.cos(t * 3)),
          Math.cos(t) * 1.7,
          Math.sin(t * 2) * 0.65,
        );
      }),
      true,
    );
    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 180, 0.28, 16, true),
      material,
    );
    ribbon.rotation.z = -0.4;
    group.add(ribbon);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 24),
      ivory,
    );
    sphere.position.set(0.05, 0, 0.2);
    group.add(sphere);
    group.rotation.y = -0.45;
  } else {
    group.rotation.set(0.4, -0.25, -0.22);
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.16, 2.65),
      material,
    );
    cover.position.y = -0.2;
    group.add(cover);
    for (let side = -1; side <= 1; side += 2) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(1.88, 0.22, 2.47),
        ivory,
      );
      block.position.set(side * 0.97, -0.04, 0);
      group.add(block);
      for (let i = 0; i < 6; i++) {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(1.3 - (i === 5 ? 0.3 : 0), 0.007, 0.018),
          material,
        );
        line.position.set(side * 0.96, 0.077, -0.78 + i * 0.23);
        group.add(line);
      }
    }
    const geo = new THREE.PlaneGeometry(1.85, 2.43, 24, 1);
    geo.translate(0.925, 0, 0);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++)
      pos.setY(i, Math.sin((pos.getX(i) / 1.85) * Math.PI) * 0.24);
    geo.computeVertexNormals();
    page = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: "#fffdf3",
        side: THREE.DoubleSide,
        roughness: 0.8,
      }),
    );
    page.position.y = 0.085;
    page.rotation.z = 0.18;
    group.add(page);
    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 2.9, 6),
      dark,
    );
    pencil.rotation.z = Math.PI / 2 + 0.13;
    pencil.position.set(0.5, -0.05, 1.9);
    group.add(pencil);
    camera.position.set(0, 4, 6.8);
    camera.lookAt(0, 0, 0);
  }
  // A contact plane with a soft procedural shadow, owned by the scene.
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
    g.addColorStop(0, "rgba(30,35,25,.22)");
    g.addColorStop(1, "rgba(30,35,25,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas),
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = template === "journal" ? -0.32 : -2.42;
    scene.add(shadow);
  }
  let visible = true,
    disposed = false,
    queued = 0,
    firstRender = true;
  const baseRotation = group.rotation.clone();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function draw() {
    queued = 0;
    if (disposed || (!firstRender && (!visible || document.hidden))) return;
    const rect = host.getBoundingClientRect();
    const progress = thumbnail
      ? 0
      : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    const strength =
      motion === "none" || reduce.matches ? 0 : motion === "full" ? 1 : 0.45;
    group.rotation.y = baseRotation.y + progress * 1.8 * strength;
    group.rotation.z = baseRotation.z + progress * 0.28 * strength;
    const scale = 1 + progress * 0.32 * strength;
    group.scale.setScalar(scale);
    if (page) page.rotation.z = 0.18 + progress * 1.6 * strength;
    renderer.render(scene, camera);
    firstRender = false;
  }
  function requestDraw() {
    if (!queued && !disposed) queued = requestAnimationFrame(draw);
  }
  function resize() {
    const w = host.clientWidth || 400,
      h = host.clientHeight || 400;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.zoom = Math.min(1, camera.aspect / 0.95);
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw();
  });
  io.observe(host);
  window.addEventListener("scroll", requestDraw, { passive: true });
  document.addEventListener("visibilitychange", requestDraw);
  reduce.addEventListener("change", requestDraw);
  const lost = (event) => {
    event.preventDefault();
    host.dataset.fallback = "true";
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(queued);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("scroll", requestDraw);
    document.removeEventListener("visibilitychange", requestDraw);
    reduce.removeEventListener("change", requestDraw);
    scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material)
        for (const m of [o.material].flat()) {
          m.map?.dispose();
          m.dispose();
        }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    renderer.domElement.remove();
  };
}
