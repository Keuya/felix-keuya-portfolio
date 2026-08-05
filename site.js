(() => {
  const isNestedPage = window.location.pathname.includes("/projects/") || window.location.pathname.includes("/models/");

  const ensureStylesheet = (filename) => {
    const hasStylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some((link) => (link.getAttribute("href") || "").split("?")[0].endsWith(filename));
    if (hasStylesheet) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = isNestedPage ? `../${filename}` : filename;
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

  const ensureLink = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("link");
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };

  ensureStylesheet("polish.css");
  ensureStylesheet("visuals.css");
  ensureStylesheet("alignment.css");
  ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#091520" });
  ensureMeta('meta[name="referrer"]', { name: "referrer", content: "strict-origin-when-cross-origin" });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg" });
  ensureMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Felix Keuya, renewable energy and project finance analyst" });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg" });
  ensureLink('link[rel="icon"]', { rel: "icon", type: "image/svg+xml", href: isNestedPage ? "../favicon.svg" : "favicon.svg" });

  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  if (links && !links.querySelector('a[href$="samples.html"]')) {
    const samplesLink = document.createElement("a");
    samplesLink.href = isNestedPage ? "../samples.html" : "samples.html";
    samplesLink.textContent = "Models & samples";
    const resumeLink = [...links.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(samplesLink, resumeLink);
    else links.insertBefore(samplesLink, links.querySelector(".nav-cta"));
  }

  document.querySelectorAll(".footer-heading").forEach((heading) => {
    if (heading.textContent.trim() !== "Explore") return;
    const column = heading.parentElement;
    if (!column || column.querySelector('a[href$="samples.html"]')) return;
    const samplesLink = document.createElement("a");
    samplesLink.href = isNestedPage ? "../samples.html" : "samples.html";
    samplesLink.textContent = "Models & samples";
    const resumeLink = [...column.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) column.insertBefore(samplesLink, resumeLink);
    else column.appendChild(samplesLink);
  });

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
    const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0].split("/").pop();
    if (target && target === path) link.setAttribute("aria-current", "page");
  });

  if (path === "work.html") {
    const grid = document.querySelector(".case-index-grid");
    if (grid && !grid.querySelector('a[href="projects/rec-readiness-commercial-model.html"]')) {
      const card = document.createElement("article");
      card.className = "case-index-card reveal";
      card.innerHTML = '<p class="card-tag">REC readiness · Synthetic public case</p><h2>500 kW REC readiness and commercial model</h2><p>Environmental-attribute rights, meter and data controls, generation reconciliation, REC scenarios and lender treatment.</p><dl class="mini-metrics"><div><dt>Readiness</dt><dd>67% · Conditional</dd></div><div><dt>Minimum DSCR</dt><dd>1.23x</dd></div></dl><a class="project-link" href="projects/rec-readiness-commercial-model.html">Read the full case study →</a>';
      grid.appendChild(card);
    }
  }

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

  const query = new URLSearchParams(window.location.search);
  const service = query.get("service");
  const select = document.querySelector("#service-select");
  if (service && select) {
    const option = [...select.options].find((item) => item.text === service || item.value === service);
    if (option) select.value = option.value;
  }

  const modelRequested = query.get("model");
  const decisionField = document.querySelector('textarea[name="Required decision or deliverable"]');
  if (modelRequested && decisionField && !decisionField.value) {
    decisionField.value = `I would like to review the ${modelRequested} and discuss how a similar model could be adapted for a live project.`;
  }

  const deadline = document.querySelector('input[name="Required by"]');
  if (deadline) {
    const today = new Date();
    deadline.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  }

  const budgetSelect = document.querySelector('select[name="Indicative budget"]');
  if (budgetSelect) {
    [...budgetSelect.options].forEach((option) => {
      if (/under\s+us\$?500/i.test(option.textContent)) option.remove();
    });
  }

  document.querySelectorAll(".service-price, .price-block strong").forEach((element) => {
    if (element.textContent.trim() === "From US$350") element.textContent = "From US$500";
  });

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
  if (caption) caption.innerHTML = "Felix Keuya<span>Renewable Energy and Project Finance Analyst</span>";

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
  if (fileNote && !fileNote.textContent.includes("10 MB")) fileNote.textContent += " Maximum recommended file size: 10 MB.";

  const consentText = document.querySelector(".consent span");
  if (consentText && !consentText.querySelector("a")) {
    consentText.append(" See the ");
    const privacyLink = document.createElement("a");
    privacyLink.href = isNestedPage ? "../privacy.html" : "privacy.html";
    privacyLink.textContent = "privacy notice";
    consentText.append(privacyLink, ".");
  }

  const formNote = document.querySelector(".intake-form .form-note");
  if (formNote) formNote.textContent = "Submitting this form does not create an engagement. Work begins only after written scope and commercial terms are agreed.";

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const address = (link.getAttribute("href") || "").split("?")[0];
    link.setAttribute("href", `${address}?subject=Renewable%20energy%20project%20enquiry`);
    link.textContent = "Email Felix";
    link.setAttribute("aria-label", "Email Felix");
    link.setAttribute("title", "Open your email application");
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.textContent = "Call Felix";
    link.setAttribute("aria-label", "Call Felix");
    link.setAttribute("title", "Open your telephone dialler");
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    link.setAttribute("rel", [...rel].join(" "));
  });

  const voiceReplacements = [
    [/\bI help\b/g, "Felix helps"],
    [/\bI support\b/g, "Felix supports"],
    [/\bI review\b/g, "Felix reviews"],
    [/\bI work\b/g, "Felix works"],
    [/\bI provide\b/g, "Felix provides"],
    [/\bI assess\b/g, "Felix assesses"],
    [/\bI analyse\b/g, "Felix analyses"],
    [/\bI prepare\b/g, "Felix prepares"],
    [/\bI produce\b/g, "Felix produces"],
    [/\bI conduct\b/g, "Felix conducts"],
    [/\bI develop\b/g, "Felix develops"],
    [/\bI build\b/g, "Felix builds"],
    [/\bI deliver\b/g, "Felix delivers"],
    [/\bI will confirm\b/g, "Felix will confirm"],
    [/\bI will review\b/g, "Felix will review"],
    [/\bI will recommend\b/g, "Felix will recommend"],
    [/\bI will request\b/g, "Felix will request"],
    [/\bI can support\b/g, "Felix can support"],
    [/\bWhen clients bring me in\b/g, "When clients engage Felix"],
    [/\bTell me the decision\b/g, "Share the decision"],
    [/\bHow did you find me\b/g, "How did you find Felix"],
    [/\bmy work\b/gi, "the work"],
    [/\bmy analysis\b/gi, "the analysis"]
  ];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, textarea, input, select, option, .consent, [contenteditable='true']")) return;
    let updated = node.nodeValue;
    voiceReplacements.forEach(([pattern, replacement]) => {
      updated = updated.replace(pattern, replacement);
    });
    if (updated !== node.nodeValue) node.nodeValue = updated;
  });
})();
