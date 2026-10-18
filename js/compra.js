document.addEventListener("DOMContentLoaded", () => {

buttonAba = document.getElementById("buttonAba");
buttonAba.addEventListener('click', function() {
    window.location = "https://luiscript-ed.github.io/AtividadeSenai/compra";
});

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;

  function showSlide(index) {
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    // Se mudar para outro slide, pausa o vídeo para economizar recursos
    const video = slides[0].querySelector("video");
    if (video) {
      if (currentIndex === 0) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      showSlide(index);
    });
  });
});
