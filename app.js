const works = [
  { title: 'Desert Light', type: 'photo', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Ocean Motion', type: 'youtube', src: 'https://www.youtube.com/watch?v=LXb3EKWsInQ' },
  { title: 'Electric Blue', type: 'photo', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Form & Shadow', type: 'photo', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85' }
];

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

const left = document.querySelector('#gallery-left');
const right = document.querySelector('#gallery-right');
left.appendChild(makeFrame(works[0], -4.5, 2.4, -5, '0 18 0'));
left.appendChild(makeFrame(works[1], -4.5, 2.4, 1, '0 18 0'));
right.appendChild(makeFrame(works[2], 4.5, 2.4, -5, '0 -18 0'));
right.appendChild(makeFrame(works[3], 4.5, 2.4, 1, '0 -18 0'));

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
