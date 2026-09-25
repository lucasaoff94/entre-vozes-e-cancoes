const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
    menu.hidden = open;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }));
}

const tracks = [...document.querySelectorAll('.recordings-grid video')];
const heroAudio = document.querySelector('#hero-audio');
if (tracks.length && heroAudio) {
  const allVideos = [...document.querySelectorAll('video')];
  const label = heroAudio.querySelector('.hero-audio-label');
  const icon = heroAudio.querySelector('.hero-audio-icon');
  let currentTrack = tracks[0];

  const syncAudioButton = () => {
    const title = currentTrack.closest('.recording-card').querySelector('h3').textContent.trim();
    const playing = !currentTrack.paused && !currentTrack.ended;
    label.textContent = `${playing ? 'Pausar' : 'Ouvir'} ${title}`;
    icon.textContent = playing ? 'Ⅱ' : '▶';
    heroAudio.setAttribute('aria-label', label.textContent);
    heroAudio.setAttribute('aria-pressed', String(playing));
    heroAudio.setAttribute('aria-controls', currentTrack.id);
  };

  allVideos.forEach(video => video.addEventListener('play', () => {
    if (tracks.includes(video)) currentTrack = video;
    allVideos.forEach(other => { if (other !== video && !other.paused) other.pause(); });
    syncAudioButton();
  }));

  tracks.forEach((video, index) => {
    if (!video.id) video.id = `gravacao-${index + 1}`;
    video.addEventListener('pause', syncAudioButton);
    video.addEventListener('ended', () => {
      if (index < tracks.length - 1) {
        currentTrack = tracks[index + 1];
        currentTrack.currentTime = 0;
        currentTrack.play().catch(syncAudioButton);
      } else {
        currentTrack = tracks[0];
        syncAudioButton();
      }
    });
  });

  heroAudio.addEventListener('click', () => {
    if (currentTrack.paused || currentTrack.ended) {
      if (currentTrack.ended) currentTrack.currentTime = 0;
      currentTrack.play().catch(syncAudioButton);
    } else {
      currentTrack.pause();
    }
    syncAudioButton();
  });

  tracks[0].play().then(syncAudioButton).catch(syncAudioButton);
}
