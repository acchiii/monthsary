/* ============================================================
   KARYA — 8th Monthsary Landing Page
   script.js  |  GSAP + Three.js + Particles.js
   ============================================================ */

"use strict";

/* ── Register GSAP Plugins ──────────────────────────────────── */
gsap.registerPlugin(TextPlugin);

/* ── Constants ──────────────────────────────────────────────── */
const LOVE_MESSAGE =
  'Thank you for 8 amazing months, Karya. Every day with you is a gift I never take for granted. I love you always ❤️';

const HEART_EMOJIS  = ['❤️','💖','💗','💓','💝','🌸','💕','✨'];
const HEART_COUNT   = 22;          // hearts burst per click
let   isMessageShown = false;
let   clickCount     = 0;

/* ══════════════════════════════════════════════════════════════
   1 ▸ PARTICLES.JS — floating hearts background
   ══════════════════════════════════════════════════════════════ */
particlesJS('particles-js', {
  particles: {
    number: { value: 28, density: { enable: true, value_area: 800 } },
    color:  { value: ['#e8699a', '#ffb3ce', '#c0396b', '#e8d5f5', '#f9a8c0'] },
    shape: {
      type: 'char',
      character: [
        { value: '♥', font: 'Verdana', style: '', weight: '400' },
        { value: '✿', font: 'Verdana', style: '', weight: '400' },
        { value: '✦', font: 'Verdana', style: '', weight: '400' },
      ]
    },
    opacity: {
      value: 0.55,
      random: true,
      anim: { enable: true, speed: 0.8, opacity_min: 0.15, sync: false }
    },
    size: {
      value: 12,
      random: true,
      anim: { enable: true, speed: 2, size_min: 5, sync: false }
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 1.2,
      direction: 'top',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
  },
  retina_detect: true
});

/* ══════════════════════════════════════════════════════════════
   2 ▸ THREE.JS — 3-D animated flower
   ══════════════════════════════════════════════════════════════ */
(function initFlower() {
  const canvas  = document.getElementById('flowerCanvas');
  const wrapper = document.getElementById('flowerWrapper');

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);                 // transparent bg

  /* Scene & Camera */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 3.8);

  /* Resize helper */
  function resizeRenderer() {
    const size = wrapper.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);

  /* ── Lights ──────────────────────────────────────────────── */
  const ambient = new THREE.AmbientLight(0xffd6e7, 1.2);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);

  const pinkLight = new THREE.PointLight(0xff69b4, 2.5, 8);
  pinkLight.position.set(0, 0, 2);
  scene.add(pinkLight);

  /* ── Materials ───────────────────────────────────────────── */
  const petalMat = new THREE.MeshPhongMaterial({
    color:     0xffb3ce,
    emissive:  0xff80aa,
    emissiveIntensity: 0.08,
    shininess: 60,
    side:      THREE.DoubleSide,
    transparent: true,
    opacity:   0.92,
  });

  const innerPetalMat = new THREE.MeshPhongMaterial({
    color:     0xff8fb7,
    emissive:  0xff5090,
    emissiveIntensity: 0.12,
    shininess: 80,
    side:      THREE.DoubleSide,
    transparent: true,
    opacity:   0.95,
  });

  const centerMat = new THREE.MeshPhongMaterial({
    color:    0xffd700,
    emissive: 0xffaa00,
    emissiveIntensity: 0.3,
    shininess: 120,
  });

  const stemMat = new THREE.MeshPhongMaterial({
    color:    0x8bc34a,
    emissive: 0x4a8c0a,
    emissiveIntensity: 0.1,
    shininess: 30,
  });

  /* ── Petal builder ───────────────────────────────────────── */
  function buildPetal(radiusX, radiusY, material) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(
      -radiusX * 0.55, radiusY * 0.15,
      -radiusX * 0.7,  radiusY * 0.65,
       0,              radiusY
    );
    shape.bezierCurveTo(
       radiusX * 0.7,  radiusY * 0.65,
       radiusX * 0.55, radiusY * 0.15,
       0,              0
    );
    const geometry = new THREE.ShapeGeometry(shape, 24);
    return new THREE.Mesh(geometry, material);
  }

  /* ── Flower group ────────────────────────────────────────── */
  const flower = new THREE.Group();
  scene.add(flower);

  /* Outer petals (8) */
  const OUTER_COUNT  = 8;
  const outerPetals  = [];
  for (let i = 0; i < OUTER_COUNT; i++) {
    const petal = buildPetal(0.42, 1.15, petalMat);
    petal.rotation.z = (i / OUTER_COUNT) * Math.PI * 2;
    petal.position.z = -0.02;
    flower.add(petal);
    outerPetals.push(petal);
  }

  /* Inner petals (5) */
  const INNER_COUNT = 5;
  const innerPetals = [];
  for (let i = 0; i < INNER_COUNT; i++) {
    const petal = buildPetal(0.32, 0.75, innerPetalMat);
    petal.rotation.z = (i / INNER_COUNT) * Math.PI * 2 + Math.PI / INNER_COUNT;
    petal.position.z = 0.02;
    flower.add(petal);
    innerPetals.push(petal);
  }

  /* Center disc */
  const centerGeo  = new THREE.SphereGeometry(0.32, 32, 32);
  const centerMesh = new THREE.Mesh(centerGeo, centerMat);
  centerMesh.position.z = 0.12;
  flower.add(centerMesh);

  /* Center bumps (stamens) */
  for (let i = 0; i < 7; i++) {
    const bumpGeo  = new THREE.SphereGeometry(0.055, 12, 12);
    const bumpMesh = new THREE.Mesh(bumpGeo, centerMat);
    const angle    = (i / 7) * Math.PI * 2;
    bumpMesh.position.set(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0.34);
    flower.add(bumpMesh);
  }

  /* Stem */
  const stemGeo  = new THREE.CylinderGeometry(0.045, 0.065, 1.1, 12);
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.position.set(0, -1.0, -0.1);
  flower.add(stemMesh);

  /* Leaves */
  function buildLeaf(flip) {
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(
      flip * 0.5,  0.15,
      flip * 0.65, 0.55,
      0,           0.65
    );
    leafShape.bezierCurveTo(
      flip * -0.1, 0.45,
      flip * -0.1, 0.2,
      0,           0
    );
    const geo  = new THREE.ShapeGeometry(leafShape, 16);
    return new THREE.Mesh(geo, stemMat);
  }

  const leaf1 = buildLeaf(1);
  leaf1.position.set(0.12, -0.62, 0);
  flower.add(leaf1);

  const leaf2 = buildLeaf(-1);
  leaf2.position.set(-0.12, -0.88, 0);
  flower.add(leaf2);

  /* ── State flags ─────────────────────────────────────────── */
  flower.userData.bloomed   = false;
  flower.userData.baseTiltX = 0.18;
  flower.userData.baseTiltY = 0.05;

  flower.rotation.x = flower.userData.baseTiltX;
  flower.rotation.y = flower.userData.baseTiltY;

  /* ── Bloom animation (GSAP) ──────────────────────────────── */
  window.bloomFlower = function () {
    if (flower.userData.bloomed) return;
    flower.userData.bloomed = true;

    /* Scale up outer petals */
    outerPetals.forEach((p, i) => {
      gsap.to(p.scale, {
        x: 1.28, y: 1.28, z: 1,
        duration: 0.7,
        delay: i * 0.04,
        ease: 'back.out(1.4)'
      });
    });

    /* Scale inner petals */
    innerPetals.forEach((p, i) => {
      gsap.to(p.scale, {
        x: 1.2, y: 1.2, z: 1,
        duration: 0.6,
        delay: 0.2 + i * 0.04,
        ease: 'back.out(1.2)'
      });
    });

    /* Glow pulse on pink light */
    gsap.to(pinkLight, {
      intensity: 5.5,
      duration: 0.5,
      yoyo: true,
      repeat: 3,
      ease: 'power2.inOut'
    });

    /* Whole flower pulse */
    gsap.to(flower.scale, {
      x: 1.12, y: 1.12, z: 1.12,
      duration: 0.45,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    /* Petal color shift */
    petalMat.color.setHex(0xff80b0);
    innerPetalMat.color.setHex(0xff5090);
  };

  /* ── Animate loop ────────────────────────────────────────── */
  let   t         = 0;
  const clock     = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    t += delta;

    /* Gentle sway */
    flower.rotation.x = flower.userData.baseTiltX + Math.sin(t * 0.6) * 0.06;
    flower.rotation.y = flower.userData.baseTiltY + Math.sin(t * 0.4) * 0.08;

    /* Petal breathe */
    const breathe = 1 + Math.sin(t * 1.1) * 0.022;
    outerPetals.forEach((p, i) => {
      const base = flower.userData.bloomed ? 1.28 : 1.0;
      p.scale.x  = base * breathe;
      p.scale.y  = base * breathe;
    });

    /* Center glow pulse */
    centerMesh.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04);

    renderer.render(scene, camera);
  })();

  /* ── Expose renderer & flower for external use ───────────── */
  window._threeFlower   = flower;
  window._pinkLight     = pinkLight;
  window._petalMat      = petalMat;

})(); // end initFlower

/* ══════════════════════════════════════════════════════════════
   3 ▸ GSAP PAGE ENTRANCE
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Orbs fade in */
  tl.to('.orb', { opacity: 1, duration: 1.8, stagger: 0.3 }, 0);

  /* Eyebrow */
  tl.to('.hero__eyebrow', {
    opacity: 1, y: 0, duration: 0.9,
    from: { y: 20 }
  }, 0.4);

  /* Title — letter by letter feel via clip */
  tl.fromTo('.hero__title',
    { opacity: 0, y: 40, skewY: 2 },
    { opacity: 1, y: 0,  skewY: 0, duration: 1.1 },
    0.7
  );

  /* Subtitle */
  tl.fromTo('.hero__subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.9 },
    1.1
  );

  /* Flower wrapper */
  tl.fromTo('#flowerWrapper',
    { opacity: 0, scale: 0.6, rotation: -8 },
    { opacity: 1, scale: 1,   rotation: 0, duration: 1.1, ease: 'back.out(1.5)' },
    1.3
  );

  /* Footer */
  tl.to('.hero__footer', { opacity: 1, duration: 0.8 }, 1.9);

  /* ── Flower click handler ─────────────────────────────────── */
  const flowerWrapper = document.getElementById('flowerWrapper');
  const loveMessage   = document.getElementById('loveMessage');
  const loveText      = document.getElementById('loveText');

  flowerWrapper.addEventListener('click', () => {
    clickCount++;

    /* ── Bloom the 3-D flower ── */
    if (window.bloomFlower) window.bloomFlower();

    /* ── Glow ring burst ── */
    addGlowRing();

    /* ── GSAP flower scale bounce ── */
    gsap.to('#flowerWrapper', {
      scale:    1.15,
      duration: 0.25,
      yoyo:     true,
      repeat:   1,
      ease:     'power2.inOut',
      onComplete() {
        gsap.to('#flowerWrapper', { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      }
    });

    /* ── Burst hearts ── */
    burstHearts();

    /* ── Show message (first click) ── */
    if (!isMessageShown) {
      isMessageShown = true;
      showLoveMessage();
    }

    /* ── Hint fades away ── */
    gsap.to('.flower-hint', { opacity: 0, duration: 0.4 });
  });

  /* Small hover tilt */
  flowerWrapper.addEventListener('mousemove', (e) => {
    const rect = flowerWrapper.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2) * 5;
    const dy   = (e.clientY - cy) / (rect.height / 2) * 5;
    gsap.to('#flowerWrapper', { rotationY: dx, rotationX: -dy, duration: 0.4, ease: 'power1.out' });
  });
  flowerWrapper.addEventListener('mouseleave', () => {
    gsap.to('#flowerWrapper', { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  });

});

/* ══════════════════════════════════════════════════════════════
   4 ▸ GLOW RING
   ══════════════════════════════════════════════════════════════ */
function addGlowRing() {
  const wrapper = document.getElementById('flowerWrapper');
  const ring    = document.createElement('div');
  ring.className = 'glow-ring';
  wrapper.appendChild(ring);
  setTimeout(() => ring.remove(), 1600);

  /* Second ring with slight delay */
  setTimeout(() => {
    const ring2 = document.createElement('div');
    ring2.className = 'glow-ring';
    ring2.style.animationDelay = '0.2s';
    wrapper.appendChild(ring2);
    setTimeout(() => ring2.remove(), 1600);
  }, 200);
}

/* ══════════════════════════════════════════════════════════════
   5 ▸ BURST HEARTS  (GSAP)
   ══════════════════════════════════════════════════════════════ */
function burstHearts() {
  const container = document.getElementById('heartsContainer');
  const wrapper   = document.getElementById('flowerWrapper');
  const wRect     = wrapper.getBoundingClientRect();
  const originX   = wRect.left + wRect.width  / 2;
  const originY   = wRect.top  + wRect.height / 2;

  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    heart.style.left   = `${originX}px`;
    heart.style.top    = `${originY}px`;
    heart.style.fontSize = `${0.9 + Math.random() * 1.4}rem`;
    container.appendChild(heart);

    const angle    = -90 + (Math.random() - 0.5) * 200;  // spread fan
    const dist     = 120 + Math.random() * 260;
    const rad      = angle * (Math.PI / 180);
    const tx       = Math.cos(rad) * dist;
    const ty       = Math.sin(rad) * dist;
    const rotation = (Math.random() - 0.5) * 720;
    const delay    = Math.random() * 0.25;
    const dur      = 1.2 + Math.random() * 0.9;

    gsap.fromTo(heart,
      { opacity: 1, scale: 0.4, x: 0, y: 0, rotation: 0 },
      {
        opacity:  0,
        scale:    0.8 + Math.random() * 0.6,
        x:        tx,
        y:        ty,
        rotation: rotation,
        duration: dur,
        delay:    delay,
        ease:     'power2.out',
        onComplete() { heart.remove(); }
      }
    );
  }
}

/* ══════════════════════════════════════════════════════════════
   6 ▸ LOVE MESSAGE  (GSAP + TextPlugin typing effect)
   ══════════════════════════════════════════════════════════════ */
function showLoveMessage() {
  const loveMessage = document.getElementById('loveMessage');
  const loveText    = document.getElementById('loveText');

  /* Reveal the card */
  gsap.to(loveMessage, {
    opacity: 1,
    y:       0,
    duration: 0.8,
    ease:    'power3.out',
    onStart() {
      loveMessage.style.pointerEvents = 'auto';
    }
  });

  /* Type the message after card appears */
  gsap.to(loveText, {
    duration: 3.2,
    delay:    0.5,
    text: {
      value:    LOVE_MESSAGE,
      delimiter: '',
    },
    ease: 'none',
  });

  /* Scroll to message smoothly */
  setTimeout(() => {
    loveMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 300);
}

/* ══════════════════════════════════════════════════════════════
   7 ▸ AMBIENT FLOATING EXTRA HEARTS  (slow, gentle — GSAP)
   ══════════════════════════════════════════════════════════════ */
(function ambientHearts() {
  const container = document.getElementById('heartsContainer');

  function spawnAmbientHeart() {
    const heart = document.createElement('span');
    heart.className   = 'floating-heart';
    heart.textContent = ['💕','💗','✨','🌸'][Math.floor(Math.random() * 4)];
    heart.style.left  = `${5 + Math.random() * 90}vw`;
    heart.style.bottom = '-60px';
    heart.style.fontSize = `${0.6 + Math.random() * 0.7}rem`;
    heart.style.opacity  = '0';
    container.appendChild(heart);

    const dur = 7 + Math.random() * 8;
    const sway = (Math.random() - 0.5) * 120;

    gsap.to(heart, {
      bottom: `${100 + Math.random() * 30}vh`,
      x:      sway,
      opacity: 0.65,
      duration: dur * 0.2,
      ease: 'power1.out',
      onComplete() {
        gsap.to(heart, {
          bottom: `${110 + Math.random() * 20}vh`,
          opacity: 0,
          duration: dur * 0.8,
          ease: 'power1.in',
          onComplete() { heart.remove(); }
        });
      }
    });
  }

  /* Spawn one every 1.8 s */
  setInterval(spawnAmbientHeart, 1800);
  /* Kick off a few immediately */
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnAmbientHeart, i * 600);
  }
})();
