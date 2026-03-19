document.addEventListener("DOMContentLoaded", function () {

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

        function showSlide(i) {
            slides[index].classList.remove("active");
            index = (i + slides.length) % slides.length;
            slides[index].classList.add("active");
            updateCounter(index);
        }

        /* Desktop click zones */

        const left = slideshow.querySelector(".click-left");
        const right = slideshow.querySelector(".click-right");

        if (left) left.onclick = () => showSlide(index - 1);
        if (right) right.onclick = () => showSlide(index + 1);

/* Mobile scroll detection + reset */

if (slidesContainer) {

    /* force slideshow to start at first slide (iOS-safe) */
    setTimeout(() => {
        slidesContainer.scrollLeft = 0;
    }, 0);

    let scrollTimeout;

    slidesContainer.addEventListener("scroll", () => {

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {

            const slideWidth = slidesContainer.clientWidth;
            const newIndex =
                Math.floor((slidesContainer.scrollLeft + slideWidth / 2) / slideWidth);

            updateCounter(newIndex);

        }, 50);

    });

}

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

        /* Initialize counter */

        updateCounter(0);

    });

});
