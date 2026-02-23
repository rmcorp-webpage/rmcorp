const sidebarDescription =
    document.getElementById("sidebar-description");

document.querySelectorAll(".slideshow").forEach(slideshow => {

    const slides = slideshow.querySelectorAll(".slide");
    const counter = slideshow.querySelector(".slide-counter");

    let index = 0;

    function updateCounter() {
        if (counter) {
            counter.textContent =
                (index + 1) + " / " + slides.length;
        }
    }

    function showSlide(i) {
        slides[index].classList.remove("active");
        index = (i + slides.length) % slides.length;
        slides[index].classList.add("active");
        updateCounter();
    }

    const left = slideshow.querySelector(".click-left");
    const right = slideshow.querySelector(".click-right");

    if (left) left.onclick = () => showSlide(index - 1);
    if (right) right.onclick = () => showSlide(index + 1);

    if (sidebarDescription) {

        slideshow.addEventListener("mouseenter", () => {
            sidebarDescription.textContent =
                slideshow.dataset.description || "";
            sidebarDescription.style.display = "block";
        });

        slideshow.addEventListener("mouseleave", () => {
            sidebarDescription.style.display = "none";
        });

    }

    updateCounter();

});
