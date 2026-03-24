document.addEventListener("DOMContentLoaded", function () {

    /* ========================= */
    /* SAFE AUTO-WRAP (RUN FIRST) */
    /* ========================= */

    document.querySelectorAll("img.slide").forEach(img => {

        const wrapper = document.createElement("div");

        wrapper.className = img.className; // "slide active"
        img.className = ""; // remove from img

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

    });

    /* ========================= */
    /* IMAGE LOADING OPTIMIZATION */
    /* ========================= */

    document.querySelectorAll("img").forEach((img, i) => {
        img.loading = i < 4 ? "eager" : "lazy";
        img.decoding = "async";
    });

    /* ========================= */
    /* SHUFFLE (exclude webstore) */
    /* ========================= */

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
                s.style.backgroundImage = "";
                s.style.backgroundSize = "";
                s.style.backgroundPosition = "";
                s.style.cursor = "";
            });

            slides[i]?.classList.add("active");

            if (left) left.style.pointerEvents = "auto";
            if (right) right.style.pointerEvents = "auto";
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
/* ROBUST ZOOM (works with BOTH structures) */

slides.forEach(slide => {

    const img = slide.tagName === "IMG" ? slide : slide.querySelector("img");
    if (!img) return;

    let zoomed = false;

    slide.addEventListener("mousemove", (e) => {

        if (window.innerWidth <= 768) return;

        const rect = slide.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const edge = rect.width * 0.25;

        if (!zoomed) {
            if (slides.length > 1 && (x < edge || x > rect.width - edge)) {
                slide.style.cursor = "default";
            } else {
                slide.style.cursor = "zoom-in";
            }
        } else {
            slide.style.cursor = "zoom-out";

            const y = e.clientY - rect.top;

            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            slide.style.backgroundPosition = `${percentX}% ${percentY}%`;
        }

    });

    slide.addEventListener("click", (e) => {

        if (window.innerWidth <= 768) return;

        const rect = slide.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const edge = rect.width * 0.25;

        if (!zoomed && slides.length > 1 && (x < edge || x > rect.width - edge)) {
            return;
        }

        if (!zoomed) {

            zoomed = true;
            slide.classList.add("zoomed");

            if (left) left.style.pointerEvents = "none";
            if (right) right.style.pointerEvents = "none";

            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            slide.style.backgroundImage = `url(${img.src})`;
            slide.style.backgroundSize = `${naturalWidth}px ${naturalHeight}px`;

            // hide img if wrapped structure
            if (slide !== img) {
                img.style.opacity = "0";
            }

        } else {

            zoomed = false;
            slide.classList.remove("zoomed");

            if (left) left.style.pointerEvents = "auto";
            if (right) right.style.pointerEvents = "auto";

            slide.style.backgroundImage = "";
            slide.style.backgroundSize = "";
            slide.style.backgroundPosition = "";

            if (slide !== img) {
                img.style.opacity = "";
            }

        }

    });

});

            });

            slide.addEventListener("click", (e) => {

                if (window.innerWidth <= 768) return;

                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const edge = rect.width * 0.25;

                if (!zoomed && slides.length > 1 && (x < edge || x > rect.width - edge)) {
                    return;
                }

                if (!zoomed) {

                    zoomed = true;
                    slide.classList.add("zoomed");

                    if (left) left.style.pointerEvents = "none";
                    if (right) right.style.pointerEvents = "none";

                    const naturalWidth = img.naturalWidth;
                    const naturalHeight = img.naturalHeight;

                    slide.style.backgroundImage = `url(${img.src})`;
                    slide.style.backgroundSize = `${naturalWidth}px ${naturalHeight}px`;

                } else {

                    zoomed = false;
                    slide.classList.remove("zoomed");

                    if (left) left.style.pointerEvents = "auto";
                    if (right) right.style.pointerEvents = "auto";

                    slide.style.backgroundImage = "";
                    slide.style.backgroundSize = "";
                    slide.style.backgroundPosition = "";
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
