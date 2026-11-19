const works = [
  { title: 'Desert Light', type: 'photo', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Ocean Motion', type: 'youtube', src: 'https://www.youtube.com/watch?v=LXb3EKWsInQ' },
  { title: 'Electric Blue', type: 'photo', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Form & Shadow', type: 'photo', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Quiet Peaks', type: 'photo', src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Into the Blue', type: 'youtube', src: 'https://www.youtube.com/watch?v=ysz5S6PUM-U' },
  { title: 'Misty Morning', type: 'photo', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Last Light', type: 'photo', src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=85' }
];

AFRAME.registerComponent('quest-locomotion', {
  schema: {
    speed: { type: 'number', default: 3 },
    deadzone: { type: 'number', default: 0.15 }
  },

  tick: function (_time, delta) {
    const session = this.el.sceneEl.renderer.xr.getSession();
    if (!session || !delta) return;

    const leftSource = Array.from(session.inputSources).find((source) =>
      source.handedness === 'left' && source.gamepad
    );
    if (!leftSource) return;

    const axes = leftSource.gamepad.axes;
    const stickX = axes.length >= 4 ? axes[2] : axes[0];
    const stickY = axes.length >= 4 ? axes[3] : axes[1];
    if (Math.abs(stickX) < this.data.deadzone && Math.abs(stickY) < this.data.deadzone) return;

    const camera = this.el.querySelector('a-camera');
    const forward = camera.object3D.getWorldDirection(new THREE.Vector3());
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    const travel = this.data.speed * (delta / 1000);

    const position = this.el.object3D.position;
    const nextX = position.x + (right.x * stickX - forward.x * stickY) * travel;
    const nextZ = position.z + (right.z * stickX - forward.z * stickY) * travel;
    if (Math.hypot(nextX, nextZ) <= 9.5) {
      position.x = nextX;
      position.z = nextZ;
    }
  }
});

function youtubeEmbed(url) {
  try {
    const parsed = new URL(url);
    let id = parsed.searchParams.get('v');
    if (!id && parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
  } catch (_) { return null; }
}

function makeFrame(work, x, y, z, rotation) {
  const entity = document.createElement('a-entity');
  entity.setAttribute('class', 'artwork');
  entity.setAttribute('position', `${x} ${y} ${z}`);
  entity.setAttribute('rotation', rotation);

  const frame = document.createElement('a-box');
  frame.setAttribute('position', '0 0 0.02');
  frame.setAttribute('depth', '.08');
  frame.setAttribute('height', '2.35');
  frame.setAttribute('width', '3.55');
  frame.setAttribute('material', 'color: #d8d3c7; roughness: 0.8');
  entity.appendChild(frame);

  const art = document.createElement('a-plane');
  art.setAttribute('position', '0 0 0.08');
  art.setAttribute('width', '3.25');
  art.setAttribute('height', '2.05');
  if (work.type === 'photo') art.setAttribute('src', work.src);
  else art.setAttribute('material', 'color: #3e3654; shader: flat');
  entity.appendChild(art);

  if (work.type === 'youtube') {
    const play = document.createElement('a-circle');
    play.setAttribute('position', '0 0 0.12');
    play.setAttribute('radius', '.28');
    play.setAttribute('material', 'color: #fff; opacity: 0.9');
    entity.appendChild(play);
  }

  const label = document.createElement('a-text');
  label.setAttribute('value', work.title);
  label.setAttribute('align', 'center');
  label.setAttribute('position', '0 -1.42 0.1');
  label.setAttribute('width', '3');
  label.setAttribute('color', '#eee');
  entity.appendChild(label);

  entity.addEventListener('click', () => openWork(work));
  return entity;
}

function openWork(work) {
  const modal = document.querySelector('#content-modal');
  const content = document.querySelector('#modal-content');
  content.replaceChildren();
  if (work.type === 'photo') {
    const img = document.createElement('img');
    img.src = work.src; img.alt = work.title;
    content.appendChild(img);
  } else {
    const embed = youtubeEmbed(work.src);
    if (embed) {
      const iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      content.appendChild(iframe);
    }
  }
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}

const galleryRing = document.querySelector('#gallery-ring');
const galleryRadius = 10.5;
works.forEach((work, index) => {
  const angle = (index / works.length) * Math.PI * 2;
  const x = Math.sin(angle) * galleryRadius;
  const z = -Math.cos(angle) * galleryRadius;
  const facingCenter = -(angle * 180 / Math.PI);
  galleryRing.appendChild(makeFrame(work, x, 2.45, z, `0 ${facingCenter} 0`));
});

for (let index = 0; index < 48; index += 1) {
  const angle = (index / 48) * Math.PI * 2;
  const rib = document.createElement('a-cylinder');
  rib.setAttribute('position', `${Math.sin(angle) * 11.96} 3.5 ${-Math.cos(angle) * 11.96}`);
  rib.setAttribute('radius', '0.035');
  rib.setAttribute('height', '7');
  rib.setAttribute('material', 'color: #55545b; roughness: 0.85');
  galleryRing.appendChild(rib);
}

document.querySelector('#enter').addEventListener('click', () => {
  document.body.classList.add('inside');
  const scene = document.querySelector('a-scene');
  if (scene.enterVR) scene.enterVR();
});
document.querySelector('#close').addEventListener('click', () => {
  document.body.classList.remove('inside');
  const scene = document.querySelector('a-scene');
  if (scene.exitVR) scene.exitVR();
});
document.querySelector('#modal-close').addEventListener('click', () => {
  const modal = document.querySelector('#content-modal');
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  document.querySelector('#modal-content').replaceChildren();
});
