document.addEventListener("DOMContentLoaded", function () {

    /* SHUFFLE (exclude webstore) */

    if (!window.location.pathname.includes("webstore.html")) {

        const project = document.querySelector(".project");

        if (project) {
            const slideshows = Array.from(project.querySelectorAll(".slideshow"));

            for (let i = slideshows.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [slideshows[i], slideshows[j]] = [slideshows[j], slideshows[i]];
            }

            slideshows.forEach(slideshow => project.appendChild(slideshow));
        }
    }

    const sidebarDescription =
        document.getElementById("sidebar-description");

    document.querySelectorAll(".slideshow").forEach(slideshow => {

        const mobileDesc = slideshow.querySelector(".mobile-description");

        if (mobileDesc) {
            mobileDesc.innerHTML = slideshow.dataset.description || "";
        }

        const slidesContainer = slideshow.querySelector(".slides");
        const slides = slideshow.querySelectorAll(".slide");
        const counter = slideshow.querySelector(".slide-counter");

        let index = 0;

        function updateCounter(i) {
            index = i;
            if (counter) {
                counter.textContent =
                    (index + 1) + " / " + slides.length;
            }
        }

        function setActiveSlide(i) {
            slides.forEach(s => s.classList.remove("active"));
            slides[i]?.classList.add("active");
        }

        function showSlide(i) {
            index = (i + slides.length) % slides.length;
            setActiveSlide(index);
            updateCounter(index);

            if (slidesContainer) {
                const slideWidth = slides[0].getBoundingClientRect().width;
                slidesContainer.scrollLeft = index * slideWidth;
            }
        }

        /* Desktop click zones */

        const left = slideshow.querySelector(".click-left");
        const right = slideshow.querySelector(".click-right");

        if (left) left.onclick = () => showSlide(index - 1);
        if (right) right.onclick = () => showSlide(index + 1);

        /* Mobile scroll detection */

        if (slidesContainer) {

            let scrollTimeout;

            slidesContainer.addEventListener("scroll", () => {

                clearTimeout(scrollTimeout);

                scrollTimeout = setTimeout(() => {

                    const slideWidth = slides[0].getBoundingClientRect().width;
                    const newIndex =
                        Math.round(slidesContainer.scrollLeft / slideWidth);

                    setActiveSlide(newIndex);
                    updateCounter(newIndex);

                }, 50);

            });

            window.addEventListener("load", () => {
                slidesContainer.scrollLeft = 0;
                setActiveSlide(0);
                updateCounter(0);
            });

        }

        /* ZOOM FEATURE */

        slides.forEach(slide => {

            slide.addEventListener("click", (e) => {

                // Desktop: ignore edge clicks (so arrows still work)
                if (window.innerWidth > 768) {

                    const rect = slide.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const width = rect.width;

                    const edgeThreshold = width * 0.25;

                    if (x < edgeThreshold || x > width - edgeThreshold) {
                        return;
                    }
                }

                const overlay = document.createElement("div");
                overlay.className = "zoom-overlay";

                const img = document.createElement("img");
                img.src = slide.src;

                overlay.appendChild(img);
                document.body.appendChild(overlay);

                overlay.addEventListener("click", () => {
                    overlay.remove();
                });

            });

        });

        /* Hover description */

        if (sidebarDescription) {

            slideshow.addEventListener("mouseenter", () => {

                sidebarDescription.innerHTML =
                    slideshow.dataset.description || "";

                sidebarDescription.style.display = "block";

            });

            slideshow.addEventListener("mouseleave", () => {

                sidebarDescription.style.display = "none";

            });

        }

        /* Initialize */

        setActiveSlide(0);
        updateCounter(0);

    });

});
