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
  ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#071f35" });
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
    samplesLink.textContent = "Samples";
    const resumeLink = [...links.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(samplesLink, resumeLink);
    else links.insertBefore(samplesLink, links.querySelector(".nav-cta"));
  }

  if (links && !links.querySelector('a[href$="engagement.html"]')) {
    const engagementLink = document.createElement("a");
    engagementLink.href = isNestedPage ? "../engagement.html" : "engagement.html";
    engagementLink.textContent = "Process";
    const resumeLink = [...links.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(engagementLink, resumeLink);
    else links.insertBefore(engagementLink, links.querySelector(".nav-cta"));
  }

  document.querySelectorAll(".footer-heading").forEach((heading) => {
    if (heading.textContent.trim() !== "Explore") return;
    const column = heading.parentElement;
    if (!column) return;

    const insertBeforeResume = (newLink) => {
      const resumeLink = [...column.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
      if (resumeLink) column.insertBefore(newLink, resumeLink);
      else column.appendChild(newLink);
    };

    if (!column.querySelector('a[href$="samples.html"]')) {
      const samplesLink = document.createElement("a");
      samplesLink.href = isNestedPage ? "../samples.html" : "samples.html";
      samplesLink.textContent = "Samples";
      insertBeforeResume(samplesLink);
    }

    if (!column.querySelector('a[href$="engagement.html"]')) {
      const engagementLink = document.createElement("a");
      engagementLink.href = isNestedPage ? "../engagement.html" : "engagement.html";
      engagementLink.textContent = "Process";
      insertBeforeResume(engagementLink);
    }
  });

  const processSection = document.querySelector("#process .container");
  if (processSection && !processSection.querySelector('a[href$="engagement.html"]')) {
    const processCta = document.createElement("div");
    processCta.className = "section-cta";
    processCta.innerHTML = `<a class="btn btn-dark" href="${isNestedPage ? "../" : ""}engagement.html">View full process</a>`;
    processSection.appendChild(processCta);
  }

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

  const portrait = document.querySelector(".portrait");
  const portraitImage = portrait?.querySelector("img");
  if (portrait && portraitImage) {
    portraitImage.classList.add("portrait-image");
    portraitImage.alt = "Felix Keuya, renewable energy and project finance analyst";
    portraitImage.decoding = "async";
    portraitImage.fetchPriority = "high";
  }

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
})();
