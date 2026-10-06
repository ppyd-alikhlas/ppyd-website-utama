// Page Loader
window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});

//add function for open menu layanan
function openMenuLayanan() {
  const submenu = document.getElementById("submenu-layanan");

  // document.addEventListener('click', function(event) {
  //     if (!submenu.contains(event.target)) {
  //         submenu.classList.add('hidden');
  //     }
  // });

  submenu.classList.toggle("hidden");
}

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

  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    icon.textContent = "-";
  } else {
    content.classList.add("hidden");
    icon.textContent = "+";
  }
}

// Mobile Menu
document
  .getElementById("mobile-menu-btn")
  .addEventListener("click", function () {
    // Mobile menu functionality can be added here
    alert("Menu mobile akan ditampilkan di sini");
  });

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
  // Set target date to June 30, 2026
  const targetDate = new Date("2026-06-30T23:59:59");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days
        .toString()
        .padStart(2, "0");
      document.getElementById("hours").textContent = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").textContent = seconds
        .toString()
        .padStart(2, "0");
    } else {
      // Countdown finished
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";

      // Disable registration buttons and add alert
      const registrationButtons = document.querySelectorAll("#psb button");
      registrationButtons.forEach((button) => {
        if (button.textContent.includes("Daftar")) {
          button.textContent = "Pendaftaran Ditutup";
          button.disabled = true;
          button.classList.add("opacity-50", "cursor-not-allowed");
          button.classList.remove("hover:bg-red-600", "hover:bg-yellow-300");

          // Add click event for disabled state
          button.addEventListener("click", function (e) {
            e.preventDefault();
            alert(
              "Pendaftaran telah ditutup, silahkan menghubungi nomor admin untuk mendapatkan informasi terkait pendaftaran santri baru"
            );
          });
        }
      });
    }
  }

  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Start countdown when page loads
window.addEventListener("load", function () {
  setTimeout(startCountdown, 2500); // Start after loader finishes
});

// Testimonial Slider
let currentSlide = 0;
const totalSlides = 3;
let slideInterval;

function updateSlider() {
  const slider = document.getElementById("testimonial-slider");
  const translateX = -currentSlide * 100;
  slider.style.transform = `translateX(${translateX}%)`;

  // Update indicators
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.getElementById(`indicator-${i}`);
    if (i === currentSlide) {
      indicator.classList.remove("bg-gray-300");
      indicator.classList.add("bg-islamic-green");
    } else {
      indicator.classList.remove("bg-islamic-green");
      indicator.classList.add("bg-gray-300");
    }
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlider();
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

// Start auto-slide when page loads
window.addEventListener("load", function () {
  setTimeout(startAutoSlide, 3000); // Start after 3 seconds
});

// Pause auto-slide when user hovers over testimonial section
const testimonialSection = document.querySelector("#testimonial-slider")
  .parentElement.parentElement;
testimonialSection.addEventListener("mouseenter", stopAutoSlide);
testimonialSection.addEventListener("mouseleave", startAutoSlide);

// Form submission
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert(
    "Terima kasih! Pesan Anda telah dikirim. Kami akan segera menghubungi Anda."
  );
  this.reset();
});

// Button interactions
document.querySelectorAll("button").forEach((button) => {
  if (!button.onclick && button.textContent.includes("Daftar")) {
    button.addEventListener("click", function () {
      // alert(
      //   "Halaman pendaftaran akan segera tersedia. Silakan hubungi kami melalui kontak yang tersedia."
      // );
       window.location.href = "https://ppydalikhlas.org/psb";
      // window.location.href = "/assets-website-utama/pages/PSB/index.html";
    });
  }

  // if (button.textContent.includes("Download")) {
  //   button.addEventListener("click", function () {
  //     alert("Brosur akan segera diunduh. Fitur ini dalam tahap pengembangan.");
  //   });
  // }
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'96b3f573e277fd6c',t:'MTc1NDU0MDE4OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
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

// get data from restapi "api/wordpress"
// artikel 1
fetch("https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?_embed") // Tambahkan _embed agar media bisa diambil langsung
  .then((response) => response.json())
  .then((data) => {
    const article = data[0];
    const title = article.title.rendered;
    const categoryNames = article._embedded['wp:term'][0].map(term => term.name);
    const excerpt = article.excerpt.rendered;
    const link = article.link;
    //get resource_url
    const featuredMedia = article._embedded['wp:featuredmedia'][0];
    const resourceUrl = featuredMedia ? featuredMedia.source_url : '';

    const date = article.date;
    const articleDate = new Date(date);
    const now = new Date();
    const timeDiff = now - articleDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Set the article content
    document.getElementById("article-title").innerText = title;

    //get category name
    // document.getElementById("article-categories1").innerText = categories[0] === 2 ? "Artikel" : "Berita";

    document.getElementById("article-categories").innerText = categoryNames.join(", ");

    const excerptText = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    document.getElementById("article-excerpt").innerText = excerptText;

    document.getElementById("article-link").setAttribute("href", link);
    document.getElementById("article-date").innerText =
      daysDiff === 0 ? "Hari ini" : `${daysDiff} hari yang lalu`;

    const formattedDate = articleDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    document.getElementById("date-create").innerText = formattedDate;

    // Menampilkan gambar thumbnail from resource_url
    const imageElement = document.getElementById("article-thumbnail");
    imageElement.src = resourceUrl;
    imageElement.alt = title;

  })
  .catch((error) => {
    console.error('Error fetching the post data:', error);
  });


// artikel 2
fetch("https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?_embed") // Tambahkan _embed agar media bisa diambil langsung
  .then((response) => response.json())
  .then((data) => {
    const article = data[1];
    const title = article.title.rendered;
    // const categories = article.categories;
    const categoryNames = article._embedded['wp:term'][0].map(term => term.name);
    const excerpt = article.excerpt.rendered;
    const link = article.link;
    //get resource_url
    const featuredMedia = article._embedded['wp:featuredmedia'][0];
    const resourceUrl = featuredMedia ? featuredMedia.source_url : '';

    const date = article.date;
    const articleDate = new Date(date);
    const now = new Date();
    const timeDiff = now - articleDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Set the article content
    document.getElementById("article-title1").innerText = title;
    
    // document.getElementById("article-categories1").innerText = categories[0] === 2 ? "Artikel" : "Berita";

    document.getElementById("article-categories1").innerText = categoryNames.join(", ");

    const excerptText = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    document.getElementById("article-excerpt1").innerText = excerptText;

    document.getElementById("article-link1").setAttribute("href", link);
    document.getElementById("article-date1").innerText =
      daysDiff === 0 ? "Hari ini" : `${daysDiff} hari yang lalu`;

    const formattedDate = articleDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    document.getElementById("date-create1").innerText = formattedDate;

    // Menampilkan gambar thumbnail from resource_url
    const imageElement = document.getElementById("article-thumbnail1");
    imageElement.src = resourceUrl;
    imageElement.alt = title;

  })
  .catch((error) => {
    console.error('Error fetching the post data:', error);
  });


// artikel 3
fetch("https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?_embed") // Tambahkan _embed agar media bisa diambil langsung
  .then((response) => response.json())
  .then((data) => {
    const article = data[2];
    const title = article.title.rendered;
    // const categories = article.categories;
    const categoryNames = article._embedded['wp:term'][0].map(term => term.name);
    const excerpt = article.excerpt.rendered;
    const link = article.link;
    //get resource_url
    const featuredMedia = article._embedded['wp:featuredmedia'][0];
    const resourceUrl = featuredMedia ? featuredMedia.source_url : '';

    const date = article.date;
    const articleDate = new Date(date);
    const now = new Date();
    const timeDiff = now - articleDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Set the article content
    document.getElementById("article-title2").innerText = title;
    // document.getElementById("article-categories2").innerText = categories[0] === 2 ? "Artikel" : "Berita";

    document.getElementById("article-categories2").innerText = categoryNames.join(", ");

    const excerptText = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    document.getElementById("article-excerpt2").innerText = excerptText;

    document.getElementById("article-link2").setAttribute("href", link);
    document.getElementById("article-date2").innerText =
      daysDiff === 0 ? "Hari ini" : `${daysDiff} hari yang lalu`;

    const formattedDate = articleDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    document.getElementById("date-create2").innerText = formattedDate;

    // Menampilkan gambar thumbnail from resource_url
    const imageElement = document.getElementById("article-thumbnail2");
    imageElement.src = resourceUrl;
    imageElement.alt = title;

  })
  .catch((error) => {
    console.error('Error fetching the post data:', error);
  });

// artikel 4
fetch("https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?_embed") // Tambahkan _embed agar media bisa diambil langsung
  .then((response) => response.json())
  .then((data) => {
    const article = data[3];
    const title = article.title.rendered;
    // const categories = article.categories;
    const categoryNames = article._embedded['wp:term'][0].map(term => term.name);
    const excerpt = article.excerpt.rendered;
    const link = article.link;
    //get resource_url
    const featuredMedia = article._embedded['wp:featuredmedia'][0];
    const resourceUrl = featuredMedia ? featuredMedia.source_url : '';

    const date = article.date;
    const articleDate = new Date(date);
    const now = new Date();
    const timeDiff = now - articleDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Set the article content
    document.getElementById("article-title3").innerText = title;
    // document.getElementById("article-categories3").innerText = categories[0] === 2 ? "Artikel" : "Berita";

    document.getElementById("article-categories3").innerText = categoryNames.join(", ");

    const excerptText = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    document.getElementById("article-excerpt3").innerText = excerptText;

    document.getElementById("article-link3").setAttribute("href", link);
    document.getElementById("article-date3").innerText =
      daysDiff === 0 ? "Hari ini" : `${daysDiff} hari yang lalu`;

    const formattedDate = articleDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    document.getElementById("date-create3").innerText = formattedDate;

    // Menampilkan gambar thumbnail from resource_url
    const imageElement = document.getElementById("article-thumbnail3");
    imageElement.src = resourceUrl;
    imageElement.alt = title;

  })
  .catch((error) => {
    console.error('Error fetching the post data:', error);
  });
