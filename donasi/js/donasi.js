document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-toggle"),
    mobileNav = document.getElementById("mobileNav"),
    modal = document.getElementById("donationModal"),
    form = document.getElementById("donationForm"),
    programSelect = document.getElementById("donationProgram"),
    modalTitle = document.getElementById("donationModalTitle"),
    amountSelect = document.getElementById("donationAmount"),
    customAmount = document.getElementById("customAmount");
  document.getElementById("year").textContent = new Date().getFullYear();
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }),
    );
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  const openModal = (program) => {
    if (!modal) return;
    programSelect.value = program || "";
    modalTitle.textContent = program
      ? "Donasi untuk " + program
      : "Mulai dukung program";
    form.reset();
    programSelect.value = program || "";
    customAmount.hidden = true;
    customAmount.required = false;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => programSelect.focus(), 50);
  };
  document
    .querySelectorAll(".program-donate")
    .forEach((button) =>
      button.addEventListener("click", () => openModal(button.dataset.program)),
    );
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("open"))
      closeModal();
  });
  amountSelect.addEventListener("change", () => {
    const custom = amountSelect.value === "Lainnya";
    customAmount.hidden = !custom;
    customAmount.required = custom;
    if (custom) {
      customAmount.focus();
    } else {
      customAmount.value = "";
    }
  });
  const formatCurrency = (value) => {
    const digits = String(value || "").replace(/[^0-9]/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(digits));
  };
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const program = programSelect.value;
      const name = document.getElementById("donorName").value.trim();
      const contact = document.getElementById("donorContact").value.trim();
      const rawAmount =
        amountSelect.value === "Lainnya"
          ? customAmount.value.trim()
          : amountSelect.value;
      const amount = formatCurrency(rawAmount);
      const message = document.getElementById("donorMessage").value.trim();
      if (!program || !name || !contact || !rawAmount) {
        form.reportValidity();
        return;
      }
      const whatsappMessage = [
        "Assalamu'alaikum warahmatullahi wabarakaatuh",
        "saya ingin berdonasi melalui PP. Yatim Dhuafa Al-Ikhlas Malang.",
        " ",
        "*Program Donasi:* " + program,
        "*Nama Donatur:* " + name,
        "*No. WhatsApp/Kontak:* " + contact,
        "*Nominal Donasi:* " + amount,
        message ? "*Pesan/Doa:* " + message : "",
      ]
        .filter(Boolean)
        .join("\n");
      const whatsappUrl =
        "https://wa.me/6285311891925?text=" +
        encodeURIComponent(whatsappMessage);
      window.location.href = whatsappUrl;
    });
  }
});
