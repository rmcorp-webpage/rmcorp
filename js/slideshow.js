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

    slideshow.querySelector(".click-left").onclick = () => showSlide(index - 1);
    slideshow.querySelector(".click-right").onclick = () => showSlide(index + 1);

    slideshow.addEventListener("mouseenter", () => {
        sidebarDescription.style.display = "block";
    });

    slideshow.addEventListener("mouseleave", () => {
        sidebarDescription.style.display = "none";
    });

    updateCounter();

});
