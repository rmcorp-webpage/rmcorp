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

        const left = slideshow.querySelector(".click-left");
        const right = slideshow.querySelector(".click-right");

        let index = 0;
        let zoomActive = false;

        function updateCounter(i) {
            index = i;
            if (counter) {
                counter.textContent =
                    (index + 1) + " / " + slides.length;
            }
        }

        function setActiveSlide(i) {
            slides.forEach(s => {
                s.classList.remove("active");
                s.style.backgroundImage = "";
                s.style.backgroundSize = "";
                s.style.backgroundPosition = "";
            });
            slides[i]?.classList.add("active");
            zoomActive = false;
            enableArrows();
        }

        function showSlide(i) {
            if (zoomActive) return;

            index = (i + slides.length) % slides.length;
            setActiveSlide(index);
            updateCounter(index);

            if (slidesContainer) {
                const w = slides[0].getBoundingClientRect().width;
                slidesContainer.scrollLeft = index * w;
            }
        }

        function disableArrows() {
            if (left) left.style.pointerEvents = "none";
            if (right) right.style.pointerEvents = "none";
        }

        function enableArrows() {
            if (left) left.style.pointerEvents = "auto";
            if (right) right.style.pointerEvents = "auto";
        }

        if (left) left.onclick = () => showSlide(index - 1);
        if (right) right.onclick = () => showSlide(index + 1);

        /* scroll sync */

        if (slidesContainer) {

            let t;

            slidesContainer.addEventListener("scroll", () => {

                if (zoomActive) return;

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

        /* ZOOM (background-based, sharp) */

        slides.forEach(slide => {

            slide.addEventListener("mousemove", (e) => {

                if (window.innerWidth <= 768) return;
                if (!zoomActive) return;

                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;

                slide.style.backgroundPosition = `${percentX}% ${percentY}%`;

            });

            slide.addEventListener("click", (e) => {

                if (window.innerWidth <= 768) return;

                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const edge = rect.width * 0.25;

                if (!zoomActive && slides.length > 1 && (x < edge || x > rect.width - edge)) {
                    return;
                }

                if (!zoomActive) {

                    zoomActive = true;
                    disableArrows();

                    const imgSrc = slide.src;

                    const naturalWidth = slide.naturalWidth;
                    const naturalHeight = slide.naturalHeight;

                    slide.style.backgroundImage = `url(${imgSrc})`;
                    slide.style.backgroundRepeat = "no-repeat";
                    slide.style.backgroundSize = `${naturalWidth}px ${naturalHeight}px`;
                    slide.style.cursor = "zoom-out";

                    slide.style.opacity = "0";

                } else {

                    zoomActive = false;
                    enableArrows();

                    slide.style.backgroundImage = "";
                    slide.style.backgroundSize = "";
                    slide.style.backgroundPosition = "";
                    slide.style.cursor = "";
                    slide.style.opacity = "";

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

        setActiveSlide(0);
        updateCounter(0);

    });

});
