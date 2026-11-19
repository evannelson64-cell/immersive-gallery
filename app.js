const works = [
  {
    title: 'Diwali · India',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Flower_Decor_with_Diwali_Candles.jpg/1920px-Flower_Decor_with_Diwali_Candles.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Flower_Decor_with_Diwali_Candles.jpg',
    credit: 'humdingor',
    license: 'CC BY-SA 2.0'
  },
  {
    title: 'Christmas Market · United Kingdom',
    type: 'photo',
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Christmas_Market_on_the_South_Bank_-_geograph.org.uk_-_1598983.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Christmas_Market_on_the_South_Bank_-_geograph.org.uk_-_1598983.jpg',
    credit: 'Peter Trimming',
    license: 'CC BY-SA 2.0'
  },
  {
    title: 'Lunar New Year · United States',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Lunar_New_Year_Celebration_-_53582318400.jpg/1920px-Lunar_New_Year_Celebration_-_53582318400.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Lunar_New_Year_Celebration_-_53582318400.jpg',
    credit: 'MDGovpics',
    license: 'CC BY 2.0'
  },
  {
    title: 'Hanukkah · Russia',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Rostov-on-Don%2C_Hanukkah_celebration%2C_Hanukkah_menorah%2C_Judaism_in_Russia.jpg/1920px-Rostov-on-Don%2C_Hanukkah_celebration%2C_Hanukkah_menorah%2C_Judaism_in_Russia.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Rostov-on-Don,_Hanukkah_celebration,_Hanukkah_menorah,_Judaism_in_Russia.jpg',
    credit: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0'
  },
  {
    title: 'Eid al-Fitr · Somalia',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Eid_al-Fitr_celebrations%2C_Somalia%3B_June_2019_%2802%29.jpg/1920px-Eid_al-Fitr_celebrations%2C_Somalia%3B_June_2019_%2802%29.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Eid_al-Fitr_celebrations,_Somalia;_June_2019_(02).jpg',
    credit: 'AMISOM Public Information',
    license: 'CC0'
  },
  {
    title: 'Holi · India',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Holi_Festival_of_Colors.jpg/1920px-Holi_Festival_of_Colors.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Holi_Festival_of_Colors.jpg',
    credit: 'Ramesh Lalwani',
    license: 'CC BY 2.0'
  },
  {
    title: 'Día de Muertos · Mexico',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Catrinas_and_Catrines.jpg/1920px-Catrinas_and_Catrines.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Catrinas_and_Catrines.jpg',
    credit: 'Tomas Castelazo',
    license: 'CC BY-SA 4.0'
  },
  {
    title: 'Rio Carnival · Brazil',
    type: 'photo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Samba_Parade_-_Rio%27s_Carnival_2008.jpg/1920px-Samba_Parade_-_Rio%27s_Carnival_2008.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Samba_Parade_-_Rio%27s_Carnival_2008.jpg',
    credit: 'Randal Sheppard',
    license: 'CC BY-SA 2.0'
  }
];

AFRAME.registerComponent('quest-locomotion', {
  schema: {
    speed: { type: 'number', default: 3 },
    turnSpeed: { type: 'number', default: 1.8 },
    deadzone: { type: 'number', default: 0.15 }
  },

  tick: function (_time, delta) {
    const session = this.el.sceneEl.renderer.xr.getSession();
    if (!session || !delta) return;

    const sources = Array.from(session.inputSources);
    const leftGamepad = sources.find((source) => source.handedness === 'left' && source.gamepad)?.gamepad;
    const rightGamepad = sources.find((source) => source.handedness === 'right' && source.gamepad)?.gamepad;
    const stickAxes = (gamepad) => gamepad?.axes.length >= 4
      ? gamepad.axes.slice(2, 4)
      : gamepad?.axes.slice(0, 2);
    const leftAxes = stickAxes(leftGamepad);
    const rightAxes = stickAxes(rightGamepad);
    const travel = this.data.speed * (delta / 1000);

    if (leftAxes) {
      const strafe = -leftAxes[0];
      const forwardAmount = -leftAxes[1];
      if (Math.abs(strafe) >= this.data.deadzone || Math.abs(forwardAmount) >= this.data.deadzone) {
        const camera = this.el.querySelector('a-camera');
        const forward = camera.object3D.getWorldDirection(new THREE.Vector3());
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3(-forward.z, 0, forward.x);

        const position = this.el.object3D.position;
        const nextX = position.x + (right.x * strafe + forward.x * forwardAmount) * travel;
        const nextZ = position.z + (right.z * strafe + forward.z * forwardAmount) * travel;
        if (Math.hypot(nextX, nextZ) <= 9.5) {
          position.x = nextX;
          position.z = nextZ;
        }
      }
    }

    if (rightAxes) {
      const turnAmount = -rightAxes[0];
      if (Math.abs(turnAmount) >= this.data.deadzone) {
        this.el.object3D.rotation.y -= turnAmount * this.data.turnSpeed * (delta / 1000);
      }
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
    const imageFrame = document.createElement('div');
    imageFrame.className = 'media-image';
    const img = document.createElement('img');
    img.src = work.src; img.alt = work.title;
    imageFrame.appendChild(img);
    content.appendChild(imageFrame);

    if (work.source && work.credit && work.license) {
      const attribution = document.createElement('p');
      attribution.className = 'media-credit';
      attribution.append('Photo: ');
      const sourceLink = document.createElement('a');
      sourceLink.href = work.source;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = `${work.credit} · ${work.license}`;
      attribution.appendChild(sourceLink);
      content.appendChild(attribution);
    }
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
