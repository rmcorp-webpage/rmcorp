const sidebarDescription = document.getElementById("sidebar-description");

document.querySelectorAll(".slideshow").forEach(slideshow => {

    let slides = slideshow.querySelectorAll(".slide");
    let counter = slideshow.querySelector(".slide-counter");

    let index = 0;

    function updateCounter() {
        counter.textContent = (index + 1) + " / " + slides.length;
    }

    function showSlide(i) {

        slides[index].classList.remove("active");

        index = (i + slides.length) % slides.length;

        slides[index].classList.add("active");

        updateCounter();
    }

    slideshow.querySelector(".next").onclick = () => showSlide(index + 1);
    slideshow.querySelector(".prev").onclick = () => showSlide(index - 1);
    slideshow.querySelector(".click-left").onclick = () => showSlide(index - 1);
    slideshow.querySelector(".click-right").onclick = () => showSlide(index + 1);

    slideshow.onmouseenter = () => {
        sidebarDescription.textContent = slideshow.dataset.description;
        sidebarDescription.style.display = "block";
    };

    slideshow.onmouseleave = () => {
        sidebarDescription.style.display = "none";
    };

    updateCounter();

});

document.addEventListener("keydown", e => {

    const activeSlideshow = document.querySelector(".slideshow:hover");

    if (!activeSlideshow) return;

    const slides = activeSlideshow.querySelectorAll(".slide");

    let index = [...slides].findIndex(slide => slide.classList.contains("active"));

    if (e.key === "ArrowRight") {

        slides[index].classList.remove("active");

        slides[(index + 1) % slides.length].classList.add("active");

    }

    if (e.key === "ArrowLeft") {

        slides[index].classList.remove("active");

        slides[(index - 1 + slides.length) % slides.length].classList.add("active");

    }

});
