document.addEventListener("DOMContentLoaded", () => {
  const SCROLL_SYNC_DELAY_MS = 50;

  function optimizeImages() {
    document.querySelectorAll("img").forEach((img, i) => {
      img.loading = i < 4 ? "eager" : "lazy";
      img.decoding = "async";
    });
  }

  function shuffleProjectSlideshows() {
    if (window.location.pathname.includes("webstore.html")) {
      return;
    }

    const project = document.querySelector(".project");
    if (!project) {
      return;
    }

    const slideshows = Array.from(project.querySelectorAll(".slideshow"));
    for (let i = slideshows.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [slideshows[i], slideshows[j]] = [slideshows[j], slideshows[i]];
    }

    slideshows.forEach((slideshow) => project.appendChild(slideshow));
  }

  function initSlideshow(slideshow, sidebarDescription) {
    const slidesContainer = slideshow.querySelector(".slides");
    const slides = Array.from(slideshow.querySelectorAll(".slide"));
    const counter = slideshow.querySelector(".slide-counter");
    const left = slideshow.querySelector(".click-left");
    const right = slideshow.querySelector(".click-right");
    const totalSlides = slides.length;

    if (totalSlides === 0) {
      if (counter) {
        counter.textContent = "0 / 0";
      }
      return;
    }

    const state = {
      index: 0,
    };

    function resetSlideVisualState(slide) {
      slide.classList.remove("active");
      slide.style.transform = "";
      slide.style.transformOrigin = "";
      slide.style.cursor = "";
      slide.style.backgroundImage = "";
      slide.style.backgroundSize = "";
      slide.style.backgroundPosition = "";
    }

    function clearAllSlides() {
      slides.forEach(resetSlideVisualState);
      if (left) {
        left.style.pointerEvents = "auto";
      }
      if (right) {
        right.style.pointerEvents = "auto";
      }
    }

    function getSlideWidth() {
      const firstSlide = slides[0];
      if (!firstSlide) {
        return 0;
      }
      return (
        firstSlide.getBoundingClientRect().width || firstSlide.clientWidth || 0
      );
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
      slides[index].classList.add("active");
      state.index = index;
      updateCounter();
    }

    function showSlide(nextIndex) {
      const normalizedIndex = (nextIndex + totalSlides) % totalSlides;
      setActiveSlide(normalizedIndex);
      syncScrollPosition();
    }

    if (left) {
      left.addEventListener("click", () => showSlide(state.index - 1));
    }
    if (right) {
      right.addEventListener("click", () => showSlide(state.index + 1));
    }

    if (slidesContainer) {
      let scrollSyncTimer = null;

      slidesContainer.addEventListener("scroll", () => {
        if (scrollSyncTimer) {
          clearTimeout(scrollSyncTimer);
        }

        scrollSyncTimer = setTimeout(() => {
          const width = getSlideWidth();
          if (width <= 0) {
            return;
          }

          const newIndex = Math.max(
            0,
            Math.min(
              totalSlides - 1,
              Math.round(slidesContainer.scrollLeft / width),
            ),
          );
          if (newIndex !== state.index) {
            setActiveSlide(newIndex);
          }
        }, SCROLL_SYNC_DELAY_MS);
      });

      window.addEventListener("resize", () => {
        syncScrollPosition();
      });
    }

    slides.forEach((slide) => {
      slide.style.cursor = "default";
    });

    if (sidebarDescription) {
      slideshow.addEventListener("mouseenter", () => {
        sidebarDescription.textContent = slideshow.dataset.description || "";
        sidebarDescription.style.display = "block";
      });

      slideshow.addEventListener("mouseleave", () => {
        sidebarDescription.style.display = "none";
      });
    }

    showSlide(0);
  }

  optimizeImages();
  shuffleProjectSlideshows();

  const sidebarDescription = document.getElementById("sidebar-description");
  document.querySelectorAll(".slideshow").forEach((slideshow) => {
    initSlideshow(slideshow, sidebarDescription);
  });
});
