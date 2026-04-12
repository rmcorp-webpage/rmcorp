document.addEventListener('DOMContentLoaded', () => {
  const MOBILE_BREAKPOINT = 768;
  const EDGE_NAVIGATION_RATIO = 0.25;
  const SCROLL_SYNC_DELAY_MS = 50;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function optimizeImages() {
    document.querySelectorAll('img').forEach((img, i) => {
      img.loading = i < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
    });
  }

  function shuffleProjectSlideshows() {
    if (window.location.pathname.includes('webstore.html')) {
      return;
    }

    const project = document.querySelector('.project');
    if (!project) {
      return;
    }

    const slideshows = Array.from(project.querySelectorAll('.slideshow'));
    for (let i = slideshows.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [slideshows[i], slideshows[j]] = [slideshows[j], slideshows[i]];
    }

    slideshows.forEach(slideshow => project.appendChild(slideshow));
  }

  function initSlideshow(slideshow, sidebarDescription) {
    const slidesContainer = slideshow.querySelector('.slides');
    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const counter = slideshow.querySelector('.slide-counter');
    const left = slideshow.querySelector('.click-left');
    const right = slideshow.querySelector('.click-right');
    const totalSlides = slides.length;

    if (totalSlides === 0) {
      if (counter) {
        counter.textContent = '0 / 0';
      }
      return;
    }

    const state = {
      index: 0,
      zoomedSlide: null,
    };

    function setArrowInteractivity(enabled) {
      const value = enabled ? 'auto' : 'none';
      if (left) {
        left.style.pointerEvents = value;
      }
      if (right) {
        right.style.pointerEvents = value;
      }
    }

    function resetSlideVisualState(slide) {
      slide.classList.remove('active', 'zoomed');
      slide.style.transform = '';
      slide.style.transformOrigin = '';
      slide.style.cursor = '';
      slide.style.backgroundImage = '';
      slide.style.backgroundSize = '';
      slide.style.backgroundPosition = '';
    }

    function clearAllSlides() {
      slides.forEach(resetSlideVisualState);
      state.zoomedSlide = null;
      setArrowInteractivity(true);
    }

    function getSlideWidth() {
      const firstSlide = slides[0];
      if (!firstSlide) {
        return 0;
      }
      return firstSlide.getBoundingClientRect().width || firstSlide.clientWidth || 0;
    }

    function updateCounter() {
      if (counter) {
        counter.textContent = `${state.index + 1} / ${totalSlides}`;
      }
    }

    function syncScrollPosition() {
      if (!slidesContainer) {
        return;
      }
      const width = getSlideWidth();
      if (width <= 0) {
        return;
      }
      slidesContainer.scrollLeft = state.index * width;
    }

    function setActiveSlide(index) {
      clearAllSlides();
      slides[index].classList.add('active');
      state.index = index;
      updateCounter();
    }

    function showSlide(nextIndex) {
      const normalizedIndex = (nextIndex + totalSlides) % totalSlides;
      setActiveSlide(normalizedIndex);
      syncScrollPosition();
    }

    if (left) {
      left.addEventListener('click', () => showSlide(state.index - 1));
    }
    if (right) {
      right.addEventListener('click', () => showSlide(state.index + 1));
    }

    if (slidesContainer) {
      let scrollSyncTimer = null;

      slidesContainer.addEventListener('scroll', () => {
        if (scrollSyncTimer) {
          clearTimeout(scrollSyncTimer);
        }

        scrollSyncTimer = setTimeout(() => {
          const width = getSlideWidth();
          if (width <= 0) {
            return;
          }

          const newIndex = clamp(Math.round(slidesContainer.scrollLeft / width), 0, totalSlides - 1);
          if (newIndex !== state.index) {
            setActiveSlide(newIndex);
          }
        }, SCROLL_SYNC_DELAY_MS);
      });

      window.addEventListener('resize', () => {
        syncScrollPosition();
      });
    }

    slides.forEach(slide => {
      slide.addEventListener('mousemove', event => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          return;
        }

        const rect = slide.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          return;
        }

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const edge = rect.width * EDGE_NAVIGATION_RATIO;
        const isZoomed = state.zoomedSlide === slide;

        if (!isZoomed) {
          if (totalSlides > 1 && (x < edge || x > rect.width - edge)) {
            slide.style.cursor = 'default';
          } else {
            slide.style.cursor = 'zoom-in';
          }
          return;
        }

        slide.style.cursor = 'zoom-out';
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        slide.style.transformOrigin = `${px}% ${py}%`;
      });

      slide.addEventListener('click', event => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          return;
        }

        const rect = slide.getBoundingClientRect();
        if (rect.width <= 0) {
          return;
        }

        const x = event.clientX - rect.left;
        const edge = rect.width * EDGE_NAVIGATION_RATIO;
        const isZoomed = state.zoomedSlide === slide;

        if (!isZoomed && totalSlides > 1 && (x < edge || x > rect.width - edge)) {
          return;
        }

        if (!isZoomed) {
          if (state.zoomedSlide) {
            resetSlideVisualState(state.zoomedSlide);
          }

          state.zoomedSlide = slide;
          slide.classList.add('zoomed');
          setArrowInteractivity(false);

          const naturalWidth = Number(slide.naturalWidth) || rect.width;
          let scale = naturalWidth / rect.width;
          scale = clamp(scale, 1, 3);
          slide.style.transform = `scale(${scale})`;
          return;
        }

        resetSlideVisualState(slide);
        state.zoomedSlide = null;
        setArrowInteractivity(true);
      });
    });

    if (sidebarDescription) {
      slideshow.addEventListener('mouseenter', () => {
        sidebarDescription.textContent = slideshow.dataset.description || '';
        sidebarDescription.style.display = 'block';
      });

      slideshow.addEventListener('mouseleave', () => {
        sidebarDescription.style.display = 'none';
      });
    }

    showSlide(0);
  }

  optimizeImages();
  shuffleProjectSlideshows();

  const sidebarDescription = document.getElementById('sidebar-description');
  document.querySelectorAll('.slideshow').forEach(slideshow => {
    initSlideshow(slideshow, sidebarDescription);
  });
});
