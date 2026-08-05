(() => {
  const addStylesheet = () => {
    if (document.querySelector('link[href="polish.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "polish.css";
    document.head.appendChild(link);
  };

  const ensureMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };

  addStylesheet();
  ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#091520" });
  ensureMeta('meta[name="referrer"]', { name: "referrer", content: "strict-origin-when-cross-origin" });
  ensureMeta('meta[property="og:image"]', {
    property: "og:image",
    content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg"
  });
  ensureMeta('meta[property="og:image:alt"]', {
    property: "og:image:alt",
    content: "Felix Keuya, renewable energy and project finance analyst"
  });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
  ensureMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg"
  });

  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  const closeMenu = () => {
    if (!button || !links) return;
    button.setAttribute("aria-expanded", "false");
    links.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (button && links) {
    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willOpen));
      links.classList.toggle("open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
    });

    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        button.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!links.classList.contains("open")) return;
      if (!links.contains(event.target) && !button.contains(event.target)) closeMenu();
    });
  }

  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0];
    if (target && target === path) link.setAttribute("aria-current", "page");
  });

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 })
    : null;

  document.querySelectorAll(".reveal").forEach((element) => {
    if (io) io.observe(element);
    else element.classList.add("in");
  });

  const service = new URLSearchParams(window.location.search).get("service");
  const select = document.querySelector("#service-select");
  if (service && select) {
    const option = [...select.options].find((item) => item.text === service || item.value === service);
    if (option) select.value = option.value;
  }

  const deadline = document.querySelector('input[name="Required by"]');
  if (deadline) {
    const today = new Date();
    deadline.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }

  const portrait = document.querySelector(".portrait");
  const portraitImage = portrait?.querySelector("img");
  if (portrait && portraitImage) {
    portraitImage.classList.add("portrait-image");
    portraitImage.alt = "Felix Keuya, renewable energy and project finance analyst";
    portraitImage.decoding = "async";
    portraitImage.fetchPriority = "high";

    if (!portrait.querySelector(".portrait-fallback")) {
      const fallback = document.createElement("span");
      fallback.className = "portrait-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.textContent = "FK";
      portrait.appendChild(fallback);
    }

    const markReady = () => portrait.classList.add("image-ready");
    portraitImage.addEventListener("load", markReady);
    portraitImage.addEventListener("error", () => portrait.classList.add("image-error"));
    if (portraitImage.complete && portraitImage.naturalWidth > 0) markReady();
  }

  const caption = document.querySelector(".portrait-caption");
  if (caption) {
    caption.innerHTML = "Felix Keuya<span>Renewable Energy and Project Finance Analyst</span>";
  }

  const stats = document.querySelectorAll(".hero-stats .stat");
  if (stats.length >= 4) {
    stats[2].querySelector(".stat-num").textContent = "c. US$96m";
    stats[3].querySelector(".stat-num").textContent = "3";
    stats[3].querySelector(".stat-label").textContent = "core areas: solar, BESS and C&I energy";
  }

  document.querySelectorAll(".trust-line span").forEach((item) => {
    if (item.textContent.trim() === "NDA friendly") item.textContent = "NDA available";
  });

  document.querySelectorAll(".process-grid p").forEach((paragraph) => {
    paragraph.textContent = paragraph.textContent.replace("secure intake form", "project brief form");
  });

  const fileNote = document.querySelector('input[type="file"]')?.closest("fieldset")?.querySelector(".field-note");
  if (fileNote && !fileNote.textContent.includes("10 MB")) {
    fileNote.textContent += " Maximum recommended file size: 10 MB.";
  }

  const consentText = document.querySelector(".consent span");
  if (consentText && !consentText.querySelector("a")) {
    consentText.append(" See the ");
    const privacyLink = document.createElement("a");
    privacyLink.href = "privacy.html";
    privacyLink.textContent = "privacy notice";
    consentText.append(privacyLink, ".");
  }

  const formNote = document.querySelector(".intake-form .form-note");
  if (formNote) {
    formNote.textContent = "Submitting this form does not create an engagement. Work begins only after written scope and commercial terms are agreed.";
  }
})();
