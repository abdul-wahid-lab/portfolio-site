// <tech-scene mode="circuit|cpu|robot"> — three.js scenes for the portfolio.
(() => {
  const CDN = 'https://esm.sh/three@0.169.0';
  let loading = null;
  const loadThree = () => (loading ||= (async () => {
    const THREE = await import(CDN);
    const { OrbitControls } = await import(CDN + '/examples/jsm/controls/OrbitControls.js');
    return { THREE, OrbitControls };
  })());

  const ACCENT = 0x5ce3a1, DIM = 0x2f3a35, INK = 0x8d8a82;

  class TechScene extends HTMLElement {
    static get observedAttributes() { return ['mode']; }
    connectedCallback() {
      this.style.display = 'block';
      this.style.position = this.style.position || 'relative';
      this.style.width = '100%';
      this.style.height = '100%';
      this._pointer = { x: 0, y: 0 };
      this._onMove = (e) => {
        const r = this.getBoundingClientRect();
        this._pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        this._pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      };
      window.addEventListener('pointermove', this._onMove);
      this._scroll = { p: 0, target: 0, vel: 0 };
      this._onScroll = () => {
        const el = document.scrollingElement || document.documentElement;
        const max = Math.max(1, el.scrollHeight - el.clientHeight);
        this._scroll.target = Math.min(1, Math.max(0, el.scrollTop / max));
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      this._onScroll();
      this._boot();
    }
    disconnectedCallback() {
      window.removeEventListener('pointermove', this._onMove);
      window.removeEventListener('scroll', this._onScroll);
      cancelAnimationFrame(this._raf);
      this._ro && this._ro.disconnect();
      this._controls && this._controls.dispose();
      if (this._renderer) { this._renderer.dispose(); this._renderer.domElement.remove(); this._renderer = null; }
    }
    attributeChangedCallback(n, o, v) { if (o !== null && o !== v) this._rebuild(); }
    set mode(v) { this.setAttribute('mode', v); }
    get mode() { return this.getAttribute('mode') || 'circuit'; }

    async _boot() {
      const { THREE, OrbitControls } = await loadThree();
      if (!this.isConnected) return;
      this._T = THREE; this._OC = OrbitControls;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(renderer.domElement);
      this._renderer = renderer;
      this._camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this.parentElement || this);
      this._rebuild();
      const clock = new THREE.Clock();
      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        this._update && this._update(t, clock.getDelta());
        this._controls && this._controls.update();
        renderer.render(this._scene, this._camera);
      };
      tick();
    }

    _resize() {
      if (!this._renderer) return;
      const box = this.parentElement || this;
      const w = box.clientWidth || this.clientWidth || 1;
      const h = box.clientHeight || this.clientHeight || 1;
      this._renderer.setSize(w, h, false);
      this._camera.aspect = w / h;
      this._camera.updateProjectionMatrix();
    }

    _rebuild() {
      if (!this._T) return;
      const THREE = this._T;
      if (this._controls) { this._controls.dispose(); this._controls = null; }
      this._scene = new THREE.Scene();
      this._scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 7, 5);
      this._scene.add(key);
      const rim = new THREE.PointLight(ACCENT, 26, 30); rim.position.set(-4, 2, -4);
      this._scene.add(rim);
      ({ circuit: () => this._circuit(), cpu: () => this._cpu(), robot: () => this._robot(), world: () => this._world(), buddy: () => this._buddy() }[this.mode] || (() => this._circuit()))();
      this._resize();
    }

    // ---- shared pieces -------------------------------------------------
    _chip(size = 1, h = 0.16) {
      const THREE = this._T, g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(size, h, size),
        new THREE.MeshStandardMaterial({ color: 0x16181a, roughness: 0.45, metalness: 0.35 })
      );
      g.add(body);
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(size * 0.5, h * 0.35, size * 0.5),
        new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.5, roughness: 0.3 })
      );
      die.position.y = h * 0.6; g.add(die);
      const pinGeo = new THREE.BoxGeometry(size * 0.05, h * 0.35, size * 0.16);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xb9b4a6, metalness: 0.9, roughness: 0.35 });
      const n = 8;
      for (let i = 0; i < n; i++) {
        const off = (i / (n - 1) - 0.5) * size * 0.8;
        [[off, size / 2 + size * 0.07, 0], [off, -size / 2 - size * 0.07, 0]].forEach(([x, z]) => {
          const p = new THREE.Mesh(pinGeo, pinMat); p.position.set(x, 0, z); g.add(p);
        });
        [[size / 2 + size * 0.07, off, Math.PI / 2], [-size / 2 - size * 0.07, off, Math.PI / 2]].forEach(([x, z, r]) => {
          const p = new THREE.Mesh(pinGeo, pinMat); p.position.set(x, 0, z); p.rotation.y = r; g.add(p);
        });
      }
      return g;
    }

    _traces(count, extent, step) {
      const THREE = this._T, group = new THREE.Group(), pulses = [];
      const mat = new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.85 });
      for (let i = 0; i < count; i++) {
        const pts = [];
        let x = (Math.random() - 0.5) * extent, z = (Math.random() - 0.5) * extent;
        pts.push(new THREE.Vector3(x, 0, z));
        const segs = 4 + Math.floor(Math.random() * 5);
        for (let s = 0; s < segs; s++) {
          if (Math.random() > 0.5) x += (Math.random() > 0.5 ? 1 : -1) * step * (1 + Math.floor(Math.random() * 3));
          else z += (Math.random() > 0.5 ? 1 : -1) * step * (1 + Math.floor(Math.random() * 3));
          pts.push(new THREE.Vector3(x, 0, z));
        }
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
        const pad = new THREE.Mesh(
          new THREE.TorusGeometry(step * 0.22, step * 0.07, 6, 16),
          new THREE.MeshStandardMaterial({ color: INK, metalness: 0.7, roughness: 0.4 })
        );
        pad.rotation.x = Math.PI / 2; pad.position.copy(pts[pts.length - 1]); group.add(pad);
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(step * 0.12, 10, 10),
          new THREE.MeshBasicMaterial({ color: ACCENT })
        );
        group.add(dot);
        pulses.push({ dot, pts, t: Math.random(), speed: 0.06 + Math.random() * 0.12 });
      }
      return { group, pulses };
    }

    _movePulses(pulses, boost = 1) {
      pulses.forEach((p) => {
        p.t = (p.t + p.speed * 0.016 * boost) % 1;
        const total = p.pts.length - 1;
        const f = p.t * total, i = Math.min(Math.floor(f), total - 1);
        p.dot.position.lerpVectors(p.pts[i], p.pts[i + 1], f - i);
        p.dot.material.opacity = 1;
      });
    }

    // ---- scenes --------------------------------------------------------
    _circuit() {
      const THREE = this._T;
      this._camera.position.set(0, 7.5, 11);
      this._camera.lookAt(0, 0, 0);
      const board = new THREE.Group();
      board.rotation.x = 0;
      const { group, pulses } = this._traces(26, 20, 1);
      board.add(group);
      for (let i = 0; i < 7; i++) {
        const c = this._chip(0.9 + Math.random() * 0.9);
        c.position.set((Math.random() - 0.5) * 16, 0.1, (Math.random() - 0.5) * 12);
        c.rotation.y = Math.round(Math.random() * 4) * Math.PI / 2;
        board.add(c);
      }
      const dustGeo = new THREE.BufferGeometry();
      const arr = new Float32Array(700 * 3);
      for (let i = 0; i < 700; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 30;
        arr[i * 3 + 1] = Math.random() * 9;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: ACCENT, size: 0.045, transparent: true, opacity: 0.55 }));
      this._scene.add(dust);
      this._scene.add(board);
      this._update = (t) => {
        board.rotation.y = t * 0.045 + this._pointer.x * 0.25;
        board.rotation.x = -0.06 + this._pointer.y * 0.08;
        dust.rotation.y = t * 0.02;
        this._movePulses(pulses);
      };
    }

    _cpu() {
      const THREE = this._T;
      this._camera.position.set(3.2, 2.6, 4.6);
      const controls = new this._OC(this._camera, this._renderer.domElement);
      controls.enableDamping = true; controls.enablePan = false;
      controls.minDistance = 3; controls.maxDistance = 9;
      controls.autoRotate = true; controls.autoRotateSpeed = 0.9;
      controls.target.set(0, 0.2, 0);
      this._controls = controls;
      const chip = this._chip(2.4, 0.34);
      chip.position.y = 0.2;
      this._scene.add(chip);
      const rings = [];
      [1.9, 2.4, 2.9].forEach((r, i) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.012, 6, 120),
          new THREE.MeshBasicMaterial({ color: i === 1 ? ACCENT : DIM })
        );
        ring.rotation.x = Math.PI / 2 + (i - 1) * 0.35;
        ring.position.y = 0.2;
        rings.push(ring); this._scene.add(ring);
      });
      const cage = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.4, 1),
        new THREE.MeshBasicMaterial({ color: DIM, wireframe: true, transparent: true, opacity: 0.5 })
      );
      cage.position.y = 0.2; this._scene.add(cage);
      const { group, pulses } = this._traces(10, 5.6, 0.6);
      group.position.y = -0.9; this._scene.add(group);
      this._update = (t) => {
        chip.rotation.y = t * 0.25;
        chip.position.y = 0.2 + Math.sin(t * 1.1) * 0.07;
        rings.forEach((r, i) => { r.rotation.z = t * (0.2 + i * 0.12) * (i % 2 ? -1 : 1); });
        cage.rotation.y = -t * 0.08;
        this._movePulses(pulses);
      };
    }

    // Full-page scroll-driven flythrough: overview board -> down to the die -> low graze.
    _world() {
      const THREE = this._T;
      const board = new THREE.Group();
      const { group, pulses } = this._traces(40, 46, 1.4);
      board.add(group);
      const hero = this._chip(6, 0.7);
      hero.position.set(0, 0.35, 0);
      board.add(hero);
      for (let i = 0; i < 16; i++) {
        const c = this._chip(1 + Math.random() * 2.2);
        const a = Math.random() * Math.PI * 2, r = 7 + Math.random() * 16;
        c.position.set(Math.cos(a) * r, 0.1, Math.sin(a) * r);
        c.rotation.y = Math.round(Math.random() * 4) * Math.PI / 2;
        board.add(c);
      }
      const cage = new THREE.Mesh(
        new THREE.IcosahedronGeometry(9, 1),
        new THREE.MeshBasicMaterial({ color: DIM, wireframe: true, transparent: true, opacity: 0.35 })
      );
      cage.position.y = 3.5; board.add(cage);
      this._scene.add(board);
      const arr = new Float32Array(1200 * 3);
      for (let i = 0; i < 1200; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 70;
        arr[i * 3 + 1] = Math.random() * 22 - 2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
      const dust = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(arr, 3)),
        new THREE.PointsMaterial({ color: ACCENT, size: 0.07, transparent: true, opacity: 0.5 })
      );
      this._scene.add(dust);
      const keys = [
        { pos: [0, 22, 34], tgt: [0, 0, 0] },
        { pos: [-14, 11, 18], tgt: [-2, 0.5, -2] },
        { pos: [5, 4.4, 9], tgt: [0, 0.6, 0] },
        { pos: [12, 1.7, -3], tgt: [-2, 0.5, -6] },
        { pos: [-6, 6, -20], tgt: [0, 1, 0] }
      ];
      const v = new THREE.Vector3(), tgt = new THREE.Vector3();
      const lerpKey = (p, field, out) => {
        const f = p * (keys.length - 1), i = Math.min(Math.floor(f), keys.length - 2), k = f - i;
        const a = keys[i][field], b = keys[i + 1][field];
        return out.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
      };
      this._update = (t) => {
        const s = this._scroll;
        const prev = s.p;
        s.p += (s.target - s.p) * 0.06;
        s.vel = s.vel * 0.9 + Math.abs(s.p - prev) * 40;
        lerpKey(s.p, 'pos', v);
        lerpKey(s.p, 'tgt', tgt);
        this._camera.position.set(v.x + this._pointer.x * 1.6, v.y, v.z + this._pointer.y * 1.2);
        this._camera.lookAt(tgt);
        board.rotation.y = t * 0.02 + s.p * 0.7;
        cage.rotation.y = -t * 0.05;
        cage.rotation.x = s.p * 0.6;
        hero.rotation.y = t * 0.12;
        dust.rotation.y = t * 0.01;
        this._movePulses(pulses, 1 + s.vel * 6);
      };
    }

    // Corner companion: robot bust that tracks the cursor and gestures.
    // Corner companion: the original full-body Lab robot, no orbit controls.
    _buddy() {
      this._robot(true);
    }

    _robot(corner) {
      const THREE = this._T;
      this._camera.position.set(0.4, 1.1, corner ? 6.4 : 6.2);
      if (corner) {
        this._camera.position.set(0, 1.0, 6.6);
        this._camera.lookAt(0, 0.3, 0);
        const front = new THREE.PointLight(0xffffff, 22, 16); front.position.set(2, 3, 4.5);
        this._scene.add(front);
      } else {
        const controls = new this._OC(this._camera, this._renderer.domElement);
        controls.enableDamping = true; controls.enablePan = false;
        controls.minDistance = 4; controls.maxDistance = 11;
        controls.target.set(0, 0.6, 0);
        this._controls = controls;
      }
      const shell = new THREE.MeshStandardMaterial({ color: 0x1c1e20, roughness: 0.4, metalness: 0.5 });
      const glow = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.8, roughness: 0.3 });
      const bot = new THREE.Group();
      const box = (w, h, d, m, x, y, z) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        mesh.position.set(x, y, z); return mesh;
      };
      const torso = box(1.5, 1.7, 0.95, shell, 0, 0.55, 0); bot.add(torso);
      const vent = box(0.9, 0.12, 0.06, glow, 0, 0.95, 0.5); bot.add(vent);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), glow);
      core.position.set(0, 0.4, 0.5); bot.add(core);
      const head = new THREE.Group();
      head.add(box(1.05, 0.85, 0.85, shell, 0, 0, 0));
      const visor = box(0.82, 0.26, 0.06, new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.1 }), 0, 0.04, 0.44);
      head.add(visor);
      const ant = box(0.05, 0.45, 0.05, shell, 0.32, 0.6, 0); head.add(ant);
      const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), glow);
      antTip.position.set(0.32, 0.86, 0); head.add(antTip);
      head.position.set(0, 1.85, 0); bot.add(head);
      const arms = [];
      [-1, 1].forEach((s) => {
        const arm = new THREE.Group();
        arm.add(box(0.3, 1.25, 0.3, shell, 0, -0.62, 0));
        arm.add(box(0.36, 0.2, 0.36, glow, 0, -1.28, 0));
        arm.position.set(s * 1.0, 1.25, 0);
        arms.push(arm); bot.add(arm);
      });
      [-1, 1].forEach((s) => bot.add(box(0.42, 1.15, 0.45, shell, s * 0.42, -0.9, 0)));
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 1.9, 0.08, 48),
        new THREE.MeshStandardMaterial({ color: 0x121312, roughness: 0.8 })
      );
      base.position.y = -1.5; this._scene.add(base);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.01, 6, 96), new THREE.MeshBasicMaterial({ color: ACCENT }));
      halo.rotation.x = Math.PI / 2; halo.position.y = -1.44; this._scene.add(halo);
      const { group, pulses } = this._traces(9, 3.4, 0.45);
      group.position.y = -1.44; this._scene.add(group);
      this._scene.add(bot);
      this._update = (t) => {
        bot.position.y = Math.sin(t * 1.2) * 0.06;
        head.rotation.y = this._pointer.x * 0.6;
        head.rotation.x = -this._pointer.y * 0.28;
        const wave = corner && (t % 7) < 2;
        arms[0].rotation.x = Math.sin(t * 1.4) * 0.22;
        arms[0].rotation.z = wave ? -1.9 + Math.sin(t * 8) * 0.25 : 0;
        arms[1].rotation.x = -Math.sin(t * 1.4) * 0.22;
        visor.material.emissiveIntensity = 0.9 + Math.sin(t * 4) * 0.25;
        this._movePulses(pulses);
      };
    }
  }
  if (!customElements.get('tech-scene')) customElements.define('tech-scene', TechScene);
})();
