let currentSlide = 0;
const totalSlides = 4;
let autoplayInterval;

// Carousel Functions
function updateCarousel() {
  const track = document.getElementById("carousel-track");
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
    dot.classList.toggle("bg-white", index === currentSlide);
    dot.classList.toggle("bg-white/50", index !== currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Event Listeners
document.getElementById("next-btn").addEventListener("click", () => {
  stopAutoplay();
  nextSlide();
  startAutoplay();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  stopAutoplay();
  prevSlide();
  startAutoplay();
});

document.querySelectorAll(".dot").forEach((dot, index) => {
  dot.addEventListener("click", () => {
    stopAutoplay();
    goToSlide(index);
    startAutoplay();
  });
});

// Initialize carousel
updateCarousel();
startAutoplay();

// button register
document.querySelectorAll("button").forEach((button) => {
  if (button.id === "btn-one") {
    button.addEventListener("click", function () {
      window.location.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSfQ3-TeAEwCBrYTkMO-UkrmfSmMpTS9W66pPL4WESPsJV56OA/viewform?usp=sharing&ouid=111774558574650230745";
    });
  }

  if (button.id === "btn-two") {
    button.addEventListener("click", function () {
      window.location.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSc_sqqZCRGUGLZsVJV4rSXX17r2wMbYtyXGeQtyus8k317-_A/viewform?usp=sharing&ouid=111774558574650230745";
    });
  }
});
