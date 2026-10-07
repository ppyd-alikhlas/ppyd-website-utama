// Page Loader
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    requestAnimationFrame(() => loader.classList.add("hidden"));
  }
});


// Lazy-load hero video only on desktop after the initial page is ready.
// This prevents the 11+ MB MP4 from competing with the first render on mobile.
(function initHeroVideo() {
  const video = document.getElementById("hero-background-video");
  if (!video) return;

  const loadVideo = () => {
    if (video.dataset.loaded || window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.src = video.dataset.src;
    video.dataset.loaded = "true";
    video.load();
    video.play().catch(() => {});
  };

  if (window.matchMedia("(min-width: 768px)").matches) {
    const start = () => setTimeout(loadVideo, 1200);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 2500 });
    } else {
      window.addEventListener("load", start, { once: true });
    }
  }

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) loadVideo();
  }, { passive: true });
})();

//add function for open menu layanan
function openMenuLayanan() {
  const submenu = document.getElementById("submenu-layanan");
  if (!submenu) return;

  const isOpen = !submenu.classList.contains("hidden");
  submenu.classList.toggle("hidden", isOpen);
  const trigger = document.querySelector('#menu-layanan > button');
  if (trigger) trigger.setAttribute("aria-expanded", String(!isOpen));
}

// Tutup submenu Layanan saat menu lain atau item submenu dipilih
document.addEventListener("click", function (event) {
  const menuLayanan = document.getElementById("menu-layanan");
  const submenu = document.getElementById("submenu-layanan");

  if (!menuLayanan || !submenu) return;

  // Jika klik terjadi di luar menu Layanan, tutup submenu
  if (!menuLayanan.contains(event.target)) {
    submenu.classList.add("hidden");
  }
});

// Tutup submenu setelah salah satu item Layanan diklik
document.querySelectorAll("#submenu-layanan a").forEach((link) => {
  link.addEventListener("click", function () {
    const submenu = document.getElementById("submenu-layanan");
    if (submenu) submenu.classList.add("hidden");
  });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// FAQ Toggle
function toggleFAQ(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector("span");
  if (!content) return;

  const isOpen = !content.classList.contains("hidden");
  content.classList.toggle("hidden", isOpen);
  button.setAttribute("aria-expanded", String(!isOpen));
  if (icon) icon.textContent = isOpen ? "+" : "-";
}

// Mobile Menu
(function initMobileMenu() {
  const menuButton = document.getElementById("mobile-menu-btn");
  if (!menuButton) return;

  const nav = menuButton.closest("nav");
  const mobileMenu = document.createElement("div");
  mobileMenu.id = "mobile-menu";
  mobileMenu.className =
    "mobile-menu md:hidden fixed left-0 right-0 bg-white border-t border-gray-100 shadow-lg opacity-0 invisible -translate-y-2 transition-all duration-200";
  mobileMenu.innerHTML = `
    <div class="container mx-auto px-6 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <a href="#tentang" class="mobile-menu-link block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-islamic-green">Tentang</a>
      <a href="#program-pendidikan" class="mobile-menu-link block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-islamic-green">Program Pendidikan</a>

      <div class="mobile-service-menu">
        <button type="button" id="mobile-service-btn"
          class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-islamic-green transition-colors">
          <span>Layanan</span>
          <svg id="mobile-service-icon" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <div id="mobile-service-submenu" class="hidden pl-4 pr-2 pb-1 space-y-1">
          <a href="#artikel" class="mobile-menu-link block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-islamic-green">Suara Al-Ikhlas</a>
          <a href="#testimoni" class="mobile-menu-link block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-islamic-green">Testimoni</a>
          <a href="#faq" class="mobile-menu-link block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-islamic-green">FAQ</a>
          <a href="#usaha-produktif" class="mobile-menu-link block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-islamic-green">Usaha Produktif</a>
        </div>
      </div>

      <a href="#kontak" class="mobile-menu-link block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-islamic-green">Kontak</a>
      <div class="h-px bg-gray-100 my-2"></div>
      <a href="#psb" class="mobile-menu-link block px-4 py-3 rounded-lg bg-islamic-green text-white font-semibold text-center hover:bg-light-green">PSB</a>
    </div>
  `;

  if (nav) {
    nav.appendChild(mobileMenu);
    const updateMenuPosition = () => {
      mobileMenu.style.top = `${nav.offsetHeight}px`;
    };
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
  }

  const icon = menuButton.querySelector("svg");
  const openIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
  const closeIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`;

  const serviceButton = mobileMenu.querySelector("#mobile-service-btn");
  const serviceSubmenu = mobileMenu.querySelector("#mobile-service-submenu");
  const serviceIcon = mobileMenu.querySelector("#mobile-service-icon");

  function closeServiceSubmenu() {
    if (!serviceSubmenu) return;
    serviceSubmenu.classList.add("hidden");
    if (serviceIcon) serviceIcon.classList.remove("rotate-180");
    if (serviceButton) serviceButton.setAttribute("aria-expanded", "false");
  }

  function toggleServiceSubmenu() {
    if (!serviceSubmenu) return;
    const isOpen = !serviceSubmenu.classList.contains("hidden");
    if (isOpen) {
      closeServiceSubmenu();
    } else {
      serviceSubmenu.classList.remove("hidden");
      if (serviceIcon) serviceIcon.classList.add("rotate-180");
      if (serviceButton) serviceButton.setAttribute("aria-expanded", "true");
    }
  }

  if (serviceButton) {
    serviceButton.setAttribute("aria-expanded", "false");
    serviceButton.setAttribute("aria-controls", "mobile-service-submenu");
    serviceButton.addEventListener("click", toggleServiceSubmenu);
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("opacity-100", "visible", "translate-y-0");
    mobileMenu.classList.add("opacity-0", "invisible", "-translate-y-2");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu navigasi");
    if (icon) icon.innerHTML = closeIcon;
    closeServiceSubmenu();
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains("visible");
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.remove("opacity-0", "invisible", "-translate-y-2");
      mobileMenu.classList.add("opacity-100", "visible", "translate-y-0");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Tutup menu navigasi");
      if (icon) icon.innerHTML = openIcon;
    }
  }

  menuButton.setAttribute("aria-label", "Buka menu navigasi");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("type", "button");
  menuButton.addEventListener("click", toggleMobileMenu);

  mobileMenu.querySelectorAll(".mobile-menu-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", function (event) {
    if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) closeMobileMenu();
  });
})();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Contact Form submission to WhatsApp
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const telepon = document.getElementById("telepon").value;
    const pesan = document.getElementById("pesan").value;

    // Create WhatsApp message
    const whatsappMessage = `*Pesan dari Website Al-Ikhlas*
            Assalamu'alaikum warahmatullahi wabarakatuh

            *Nama:* ${nama}
            *Email:* ${email}
            *Telepon:* ${telepon}

            *Pesan:*
            ${pesan}

            ---
            Dikirim melalui website Pondok Pesantren Al-Ikhlas`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp number (remove + and spaces)
    const whatsappNumber = "6281252599947";

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Reset form and show success message
    this.reset();
    alert(
      "Terima kasih! Anda akan diarahkan ke WhatsApp untuk mengirim pesan."
    );
  });

// Countdown Timer
function startCountdown() {
  // Target pendaftaran. Ubah tanggal ini jika periode PSB berikutnya sudah ditetapkan.
  const targetDate = new Date("2026-12-31T23:59:59+07:00");
  const registerButton = document.getElementById("psb-register-button");

  if (!registerButton) return;

  function setRegistrationState(isOpen) {
    registerButton.disabled = !isOpen;
    registerButton.setAttribute("aria-disabled", String(!isOpen));

    if (isOpen) {
      registerButton.textContent = "Daftar Sekarang!";
      registerButton.classList.remove("opacity-50", "cursor-not-allowed", "bg-gray-500");
      registerButton.classList.add("bg-red-500", "hover:bg-red-600");
    } else {
      registerButton.textContent = "Pendaftaran Ditutup";
      registerButton.classList.add("opacity-50", "cursor-not-allowed", "bg-gray-500");
      registerButton.classList.remove("bg-red-500", "hover:bg-red-600");
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate.getTime() - now;
    const isOpen = distance > 0;

    if (isOpen) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days.toString().padStart(2, "0");
      document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
      document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
      document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
    } else {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
    }

    // Sinkronkan tombol setiap update: aktif selama countdown masih berjalan,
    // dan benar-benar disabled setelah waktunya habis.
    setRegistrationState(isOpen);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

// Start countdown as early as possible so tombol tidak sempat aktif
// ketika periode pendaftaran sebenarnya sudah berakhir.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCountdown, { once: true });
} else {
  startCountdown();
}

// Testimonial Slider
let currentSlide = 0;
let slideInterval;

function isMobileTestimonialView() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getTotalSlides() {
  // Desktop: 3 slide berisi masing-masing 2 card.
  // Mobile: 6 slide, masing-masing hanya 1 card.
  return isMobileTestimonialView() ? 6 : 3;
}

function updateSlider() {
  const slider = document.getElementById("testimonial-slider");
  if (!slider) return;

  const totalSlides = getTotalSlides();
  if (currentSlide >= totalSlides) currentSlide = 0;

  const translateX = -currentSlide * 100;
  slider.style.transform = `translateX(${translateX}%)`;

  // Indikator desktop tetap 3. Pada mobile indikator menunjukkan 6 card.
  document.querySelectorAll('[id^="indicator-"]').forEach((indicator, index) => {
    const active = index === currentSlide;
    indicator.classList.toggle("bg-islamic-green", active);
    indicator.classList.toggle("bg-gray-300", !active);
    indicator.setAttribute("aria-current", active ? "true" : "false");
  });
}

function nextSlide() {
  const totalSlides = getTotalSlides();
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function previousSlide() {
  const totalSlides = getTotalSlides();
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(slideIndex) {
  const totalSlides = getTotalSlides();
  currentSlide = Math.min(Math.max(slideIndex, 0), totalSlides - 1);
  updateSlider();
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

window.addEventListener("load", function () {
  updateSlider();
  setTimeout(startAutoSlide, 3000);
});

window.addEventListener("resize", function () {
  const totalSlides = getTotalSlides();
  if (currentSlide >= totalSlides) currentSlide = 0;
  updateSlider();
});

// Pause auto-slide when user hovers over testimonial section
const testimonialSlider = document.getElementById("testimonial-slider");
const testimonialSection = testimonialSlider?.parentElement?.parentElement;
if (testimonialSection) {
  testimonialSection.addEventListener("mouseenter", stopAutoSlide);
  testimonialSection.addEventListener("mouseleave", startAutoSlide);
}

// Button interactions
document.querySelectorAll("button").forEach((button) => {
  // Tombol PSB ditangani langsung oleh countdown/onclick pada elemen PSB.
  // Tidak ada redirect generik berdasarkan teks agar tombol yang sudah disabled
  // tetap benar-benar tidak dapat diklik.
});

// Load the latest four articles with one request, only when the article section is near the viewport.
(function initArticles() {
  const section = document.getElementById("artikel");
  if (!section) return;

  let loaded = false;

  function loadArticles() {
    if (loaded) return;
    loaded = true;

    fetch("https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?per_page=4&_embed")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((posts) => {
        posts.slice(0, 4).forEach((article, index) => {
          const suffix = index === 0 ? "" : String(index);
          const titleElement = document.getElementById(`article-title${suffix}`);
          const categoryElement = document.getElementById(`article-categories${suffix}`);
          const excerptElement = document.getElementById(`article-excerpt${suffix}`);
          const linkElement = document.getElementById(`article-link${suffix}`);
          const dateElement = document.getElementById(`article-date${suffix}`);
          const createDateElement = document.getElementById(`date-create${suffix}`);
          const imageElement = document.getElementById(`article-thumbnail${suffix}`);

          if (!titleElement || !linkElement) return;

          const title = article.title?.rendered || "Artikel Al-Ikhlas";
          const link = article.link || "#";
          const excerpt = article.excerpt?.rendered || "";

          // WordPress dapat mengirim entity HTML seperti &hellip;.
          // Decode entity terlebih dahulu agar yang tampil menjadi karakter normal (…),
          // bukan teks mentah "&hellip;".
          const decodeHtmlEntities = (value) => {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = value;
            return textarea.value;
          };
          const terms = article._embedded?.["wp:term"]?.[0] || [];
          const featuredMedia = article._embedded?.["wp:featuredmedia"]?.[0];
          const resourceUrl = featuredMedia?.source_url || "";

          const articleDate = new Date(article.date);
          const now = new Date();
          const daysDiff = Math.max(
            0,
            Math.floor((now - articleDate) / (1000 * 60 * 60 * 24))
          );

          const cleanTitle = decodeHtmlEntities(title);
          titleElement.textContent = cleanTitle;
          titleElement.href = link;
          linkElement.href = link;

          if (categoryElement) {
            categoryElement.textContent = terms
              .map((term) => decodeHtmlEntities(term.name))
              .join(", ");
          }

          if (excerptElement) {
            const cleanExcerpt = excerpt
              .replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/\s+/g, " ")
              .trim();
            excerptElement.textContent = decodeHtmlEntities(cleanExcerpt);
          }

          if (dateElement) {
            dateElement.textContent = daysDiff === 0 ? "Hari ini" : `${daysDiff} hari yang lalu`;
          }

          if (createDateElement) {
            createDateElement.textContent = articleDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }

          if (imageElement && resourceUrl) {
            imageElement.src = resourceUrl;
            imageElement.alt = cleanTitle;
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching article data:", error);
      });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadArticles();
        obs.disconnect();
      }
    }, { rootMargin: "400px 0px" });

    observer.observe(section);
  } else {
    loadArticles();
  }
})();
