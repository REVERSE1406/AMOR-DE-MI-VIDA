document.addEventListener('DOMContentLoaded', () => {
  const captions = [
    'Tu sonrisa lo ilumina todo',
    'Contigo cada instante es mágico',
    'Mi lugar favorito en el mundo',
    'Te amo hoy y siempre',
    'Nuestras risas infinitas',
    'El día en que el tiempo se detuvo',
    'Tus ojos, mi cielo',
    'Juntos, sin prisa',
    'Un abrazo que es casa',
    'Tú y yo, siempre',
    'La magia de encontrarte',
    'Promesas en silencio',
    'Mi persona favorita',
    'Amor en cada detalle',
    'Ese instante eterno',
    'Tú haces bello el mundo',
    'Nuestra historia sigue',
    'Contigo aprendí a soñar',
    'Un sí que lo cambió todo',
    'Luz de mis días',
    'Cerca, aunque el mundo gire',
    'Tus manos, mi calma',
    'El universo cabe en nosotros',
    'Gracias por existir',
    'Mi corazón te eligió',
    'Cada foto, un te quiero',
    'Lo nuestro brilla',
    'Eres mi canción',
    'Hoy celebro tu vida',
    'Para siempre, Mickaela',
  ];

  const photos = captions.map((caption, i) => ({
    src: `fotos/${i + 1}.jpg`,
    caption,
    label: `Foto ${i + 1}`,
  }));

  const splashScreen = document.getElementById('splash-screen');
  const openBtn = document.getElementById('open-btn');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const vinyl = document.getElementById('vinyl');
  const bgAudio = document.getElementById('bg-audio');
  const trackStatus = document.getElementById('track-subtitle');
  const playerCard = document.getElementById('player-card');
  const albumCover = document.getElementById('album-cover');
  const clickBurst = document.getElementById('click-burst');
  const progressBar = document.getElementById('progress-bar');
  const carousel = document.getElementById('carousel');
  const dotsWrap = document.getElementById('dots');
  const particlesContainer = document.getElementById('particles');
  const lightbox = document.getElementById('lightbox');
  const lightboxSlide = document.getElementById('lightbox-slide');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxFallback = document.getElementById('lightbox-fallback');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');

  const PLAY_ICON = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
  const PAUSE_ICON = '<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  let isPlaying = false;
  let lightboxIndex = 0;
  let touchStartX = 0;

  function hasAudioSource() {
    return Boolean(bgAudio.currentSrc || (bgAudio.querySelector('source') && bgAudio.querySelector('source').src));
  }

  function setPlayingUI(playing) {
    isPlaying = playing;
    playerCard.classList.toggle('is-playing', playing);
    vinyl.classList.toggle('spin', playing);
    playIcon.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
    playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    trackStatus.textContent = playing ? 'Reproduciendo con amor' : 'Toca para escuchar';
  }

  function burstHearts() {
    for (let i = 0; i < 8; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'burst-heart';
      heart.textContent = i % 2 ? '♥' : '🤍';
      const angle = (Math.PI * 2 * i) / 8;
      heart.style.setProperty('--dx', `${Math.cos(angle) * 70}px`);
      heart.style.setProperty('--dy', `${Math.sin(angle) * 70}px`);
      clickBurst.appendChild(heart);
      setTimeout(() => heart.remove(), 900);
    }
  }

  async function playSong() {
    burstHearts();
    if (!hasAudioSource()) {
      setPlayingUI(true);
      return;
    }
    try {
      await bgAudio.play();
      setPlayingUI(true);
    } catch {
      trackStatus.textContent = 'Toca de nuevo para escuchar';
    }
  }

  function pauseSong() {
    bgAudio.pause();
    setPlayingUI(false);
    trackStatus.textContent = 'En pausa';
  }

  async function toggleSong() {
    if (isPlaying && !bgAudio.paused) {
      pauseSong();
    } else {
      await playSong();
    }
  }

  function renderCarousel() {
    const fragment = document.createDocumentFragment();
    const dotsFragment = document.createDocumentFragment();

    photos.forEach((photo, index) => {
      const card = document.createElement('article');
      card.className = `polaroid${index === 0 ? ' is-active' : ''}`;
      card.dataset.index = String(index);

      const box = document.createElement('div');
      box.className = 'photo-box';

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.textContent = photo.label;
        img.replaceWith(placeholder);
      });

      const caption = document.createElement('p');
      caption.textContent = photo.caption;

      box.appendChild(img);
      card.appendChild(box);
      card.appendChild(caption);
      fragment.appendChild(card);

      const dot = document.createElement('button');
      dot.className = `dot${index === 0 ? ' active' : ''}`;
      dot.type = 'button';
      dot.dataset.index = String(index);
      dot.setAttribute('aria-label', `Ir a la foto ${index + 1}`);
      dotsFragment.appendChild(dot);
    });

    carousel.appendChild(fragment);
    dotsWrap.appendChild(dotsFragment);
  }

  function updateActiveSlide() {
    const cards = carousel.querySelectorAll('.polaroid');
    const dots = dotsWrap.querySelectorAll('.dot');
    const center = carousel.scrollLeft + carousel.offsetWidth / 2;
    let closest = 0;
    let closestDist = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });

    cards.forEach((card, i) => card.classList.toggle('is-active', i === closest));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === closest));
  }

  function showLightboxImage(index, direction) {
    lightboxIndex = (index + photos.length) % photos.length;
    const photo = photos[lightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption;
    lightboxFallback.textContent = photo.label;
    lightboxCaption.textContent = photo.caption;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${photos.length}`;

    lightboxImg.classList.remove('is-hidden');
    lightboxFallback.classList.add('is-hidden');
    lightboxImg.onerror = () => {
      lightboxImg.classList.add('is-hidden');
      lightboxFallback.classList.remove('is-hidden');
    };

    lightboxSlide.classList.remove('is-enter-next', 'is-enter-prev', 'is-zoom-in');
    void lightboxSlide.offsetWidth;
    if (direction === 'next') lightboxSlide.classList.add('is-enter-next');
    else if (direction === 'prev') lightboxSlide.classList.add('is-enter-prev');
    else lightboxSlide.classList.add('is-zoom-in');
  }

  function openLightbox(index) {
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    showLightboxImage(index, 'open');
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
  }

  openBtn.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
  });

  playBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSong();
  });

  playerCard.addEventListener('click', () => {
    if (isPlaying && !bgAudio.paused) {
      burstHearts();
      return;
    }
    playSong();
  });

  albumCover.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isPlaying && !bgAudio.paused) burstHearts();
    else playSong();
  });

  bgAudio.addEventListener('timeupdate', () => {
    if (!bgAudio.duration) return;
    progressBar.style.width = `${(bgAudio.currentTime / bgAudio.duration) * 100}%`;
  });

  bgAudio.addEventListener('ended', () => {
    if (!bgAudio.loop) setPlayingUI(false);
  });

  carousel.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActiveSlide);
  });

  carousel.addEventListener('click', (event) => {
    const card = event.target.closest('.polaroid');
    if (!card) return;
    openLightbox(Number(card.dataset.index));
  });

  dotsWrap.addEventListener('click', (event) => {
    const dot = event.target.closest('.dot');
    if (!dot) return;
    const index = Number(dot.dataset.index);
    const card = carousel.querySelector(`[data-index="${index}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-bg').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', () => showLightboxImage(lightboxIndex + 1, 'next'));
  document.getElementById('lightbox-prev').addEventListener('click', () => showLightboxImage(lightboxIndex - 1, 'prev'));

  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });

  lightbox.addEventListener('touchend', (event) => {
    const diff = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) < 40) return;
    if (diff < 0) showLightboxImage(lightboxIndex + 1, 'next');
    else showLightboxImage(lightboxIndex - 1, 'prev');
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1, 'next');
    if (event.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1, 'prev');
  });

  function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = Math.random() > 0.5 ? '🤍' : '♥';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = '-20px';
    heart.style.animationDuration = `${Math.random() * 3 + 4}s`;
    heart.style.fontSize = `${Math.random() * 8 + 10}px`;
    particlesContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }

  renderCarousel();
  setPlayingUI(false);
  setInterval(createHeart, 900);
});
