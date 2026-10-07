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

// download brochure
document.querySelectorAll("a").forEach((link) => {
    if (link.id === "download-brochure-one") {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const a = document.createElement("a");
            a.href = "./assets/pdf/psb-ppyd-alikhlas.pdf";
            a.download = "brosur-psb-ppyd-alikhlas.pdf";
            a.click();
        });
    }

    if (link.id === "download-brochure-two") {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const a = document.createElement("a");
            a.href = "./assets/pdf/psb-rh-annuha.pdf";
            a.download = "brosur-rh-annuha.pdf";
            a.click();
        });
    }
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'9bda616b24380fad',t:'MTc2ODM2NDg0My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
