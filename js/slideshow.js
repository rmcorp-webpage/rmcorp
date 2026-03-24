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
            slides.forEach(s => {
                s.classList.remove("active", "zoomed");
                s.style.transform = "";
                s.style.transformOrigin = "";
            });
            slides[i]?.classList.add("active");
        }

        function showSlide(i) {
            index = (i + slides.length) % slides.length;
            setActiveSlide(index);
            updateCounter(index);

            if (slidesContainer) {
                const w = slides[0].getBoundingClientRect().width;
                slidesContainer.scrollLeft = index * w;
            }
        }

        /* arrows */

        const left = slideshow.querySelector(".click-left");
        const right = slideshow.querySelector(".click-right");

        if (left) left.onclick = () => showSlide(index - 1);
        if (right) right.onclick = () => showSlide(index + 1);

        /* scroll sync */

        if (slidesContainer) {

            let t;

            slidesContainer.addEventListener("scroll", () => {

                clearTimeout(t);

                t = setTimeout(() => {

                    const w = slides[0].getBoundingClientRect().width;
                    const newIndex =
                        Math.round(slidesContainer.scrollLeft / w);

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

        /* ZOOM */

        slides.forEach(slide => {

            let zoomed = false;

            slide.addEventListener("mousemove", (e) => {

                if (window.innerWidth <= 768) return;

                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const edge = rect.width * 0.25;

                if (!zoomed) {
                    if (slides.length > 1 && (x < edge || x > rect.width - edge)) {
                        slide.style.cursor = "default";
                    } else {
                        slide.style.cursor = "zoom-in";
                    }
                } else {
                    slide.style.cursor = "zoom-out";

                    const px = (x / rect.width) * 100;
                    const py = (y / rect.height) * 100;

                    slide.style.transformOrigin = `${px}% ${py}%`;
                }

            });

            slide.addEventListener("click", (e) => {

                if (window.innerWidth <= 768) return;

                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const edge = rect.width * 0.25;

                if (slides.length > 1 && (x < edge || x > rect.width - edge)) {
                    return;
                }

                if (!zoomed) {
                    zoomed = true;
                    slide.classList.add("zoomed");
                    slide.style.transform = "scale(2)";
                } else {
                    zoomed = false;
                    slide.classList.remove("zoomed");
                    slide.style.transform = "";
                    slide.style.transformOrigin = "";
                }

            });

        });

        /* hover description */

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

        /* init */

        setActiveSlide(0);
        updateCounter(0);

    });

});
