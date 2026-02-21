document.querySelectorAll(".slideshow").forEach(slideshow => {

    let slides = slideshow.querySelectorAll(".slide");

    let index = 0;

    function showSlide(i) {

        slides[index].classList.remove("active");

        index = (i + slides.length) % slides.length;

        slides[index].classList.add("active");
    }

    slideshow.querySelector(".next").onclick = () => showSlide(index + 1);

    slideshow.querySelector(".prev").onclick = () => showSlide(index - 1);

    slideshow.querySelector(".click-left").onclick = () => showSlide(index - 1);

    slideshow.querySelector(".click-right").onclick = () => showSlide(index + 1);

    document.addEventListener("keydown", e => {

        if (e.key === "ArrowRight") showSlide(index + 1);

        if (e.key === "ArrowLeft") showSlide(index - 1);

    });

});
