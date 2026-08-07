(() => {
  const pathName = window.location.pathname;
  const isNestedPage = pathName.includes("/projects/") || pathName.includes("/models/");
  const base = isNestedPage ? "../" : "";
  const path = pathName.split("/").pop() || "index.html";

  const ensureStylesheet = (filename) => {
    const hasStylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some((link) => (link.getAttribute("href") || "").split("?")[0].endsWith(filename));
    if (hasStylesheet) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${base}${filename}`;
    document.head.appendChild(link);
  };

  const ensureMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  ensureStylesheet("polish.css");
  ensureStylesheet("visuals.css");
  ensureStylesheet("alignment.css");
  ensureStylesheet("enhancements.css");

  ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#071f35" });
  ensureMeta('meta[name="referrer"]', { name: "referrer", content: "strict-origin-when-cross-origin" });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg" });
  ensureMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Felix Keuya, renewable energy project finance analyst" });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: "https://felix-keuya-portfolio.vercel.app/assets/felix.jpg" });

  /* Remove the old FK icon from browser UI and site chrome. */
  document.querySelectorAll('.logo-dot').forEach((element) => element.remove());
  document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]').forEach((element) => element.remove());
  const blankIcon = document.createElement("link");
  blankIcon.rel = "icon";
  blankIcon.type = "image/svg+xml";
  blankIcon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1' viewBox='0 0 1 1'%3E%3C/svg%3E";
  document.head.appendChild(blankIcon);
  document.querySelectorAll('.nav-logo,.footer-logo').forEach((element) => {
    element.textContent = "Felix Keuya";
    if (element.classList.contains("nav-logo")) element.setAttribute("aria-label", "Felix Keuya home");
  });

  const titleMap = {
    "index.html": "Felix Keuya | Renewable Energy Project Finance",
    "services.html": "Services | Felix Keuya",
    "work.html": "Work | Felix Keuya",
    "samples.html": "Samples | Felix Keuya",
    "engagement.html": "Process | Felix Keuya",
    "resume.html": "Resume | Felix Keuya",
    "request.html": "Contact | Felix Keuya"
  };
  if (titleMap[path]) document.title = titleMap[path];
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: document.title });

  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  if (links && !links.querySelector('a[href$="samples.html"]')) {
    const samplesLink = document.createElement("a");
    samplesLink.href = `${base}samples.html`;
    samplesLink.textContent = "Samples";
    const resumeLink = [...links.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(samplesLink, resumeLink);
    else links.insertBefore(samplesLink, links.querySelector(".nav-cta"));
  }

  if (links && !links.querySelector('a[href$="engagement.html"]')) {
    const engagementLink = document.createElement("a");
    engagementLink.href = `${base}engagement.html`;
    engagementLink.textContent = "Process";
    const resumeLink = [...links.querySelectorAll("a")].find((link) => (link.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(engagementLink, resumeLink);
    else links.insertBefore(engagementLink, links.querySelector(".nav-cta"));
  }

  const shortLabels = {
    "services.html": "Services",
    "work.html": "Work",
    "samples.html": "Samples",
    "engagement.html": "Process",
    "resume.html": "Resume",
    "request.html": "Contact"
  };
  document.querySelectorAll(".nav-links a, footer a").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0].split("/").pop();
    if (shortLabels[target]) link.textContent = shortLabels[target];
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

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0].split("/").pop();
    if (target && target === path) link.setAttribute("aria-current", "page");
  });

  /* Quiet scroll progress on longer pages. */
  if (!document.querySelector(".site-progress")) {
    const progress = document.createElement("div");
    progress.className = "site-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<span></span>";
    document.body.appendChild(progress);
    const bar = progress.querySelector("span");
    let ticking = false;
    const updateProgress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const value = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.width = `${value * 100}%`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" })
    : null;

  document.querySelectorAll(".reveal").forEach((element) => {
    if (io) io.observe(element);
    else element.classList.add("in");
  });

  /* Improve image loading without delaying the first visible image. */
  const images = [...document.querySelectorAll("img")];
  images.forEach((image, index) => {
    image.decoding = "async";
    const isPriority = index === 0 || Boolean(image.closest(".client-hero,.page-hero,.case-hero-authentic,.hero-analyst-photo"));
    if (isPriority) {
      image.loading = "eager";
      image.fetchPriority = "high";
    } else {
      image.loading = "lazy";
      image.fetchPriority = "low";
    }
  });

  /* Keep mobile visitors one tap from proof or contact. */
  if (!["request.html", "resume.html"].includes(path) && !document.querySelector(".mobile-action-bar")) {
    const mobileBar = document.createElement("nav");
    mobileBar.className = "mobile-action-bar";
    mobileBar.setAttribute("aria-label", "Quick actions");
    mobileBar.innerHTML = `<a href="${base}work.html">View work</a><a href="${base}request.html">Contact</a>`;
    document.body.appendChild(mobileBar);
    document.body.classList.add("has-mobile-actions");
  }

  const query = new URLSearchParams(window.location.search);
  const service = query.get("service");
  const select = document.querySelector("#service-select");
  if (service && select) {
    const normalised = service.toLowerCase();
    const option = [...select.options].find((item) => {
      const value = `${item.text} ${item.value}`.toLowerCase();
      return value === normalised || value.includes(normalised) || normalised.includes(item.text.toLowerCase());
    });
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

  /* Remove visible dashes and hyphenated marketing language while leaving URLs and form values alone. */
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,textarea,input,select,option,code,pre")) return;
    let text = node.nodeValue;
    text = text.replace(/\s*—\s*/g, ". ");
    text = text.replace(/(\d)\s*–\s*(\d)/g, "$1 to $2");
    text = text.replace(/\s*–\s*/g, " ");
    text = text.replace(/([A-Za-z])[-‑]([A-Za-z])/g, "$1 $2");
    text = text.replace(/\s{2,}/g, " ");
    node.nodeValue = text;
  });

  /* Add lightweight structured data for discovery. */
  if (!document.querySelector('script[data-site-schema="true"]')) {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.siteSchema = "true";
    const home = "https://felix-keuya-portfolio.vercel.app/";
    if (path === "index.html") {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "@id": `${home}#website`, "url": home, "name": "Felix Keuya", "inLanguage": "en" },
          { "@type": "Person", "@id": `${home}#felix`, "name": "Felix Keuya", "url": home, "image": `${home}assets/felix.jpg`, "jobTitle": "Renewable Energy Project Finance Analyst", "sameAs": ["https://www.linkedin.com/in/felix-keuya/", "https://github.com/Keuya"], "knowsAbout": ["Renewable energy project finance", "Solar PV", "Battery storage", "PPAs", "Power markets", "Financial modelling"] },
          { "@type": "ProfessionalService", "@id": `${home}#service`, "name": "Felix Keuya Renewable Energy Project Finance", "url": home, "founder": { "@id": `${home}#felix" }, "areaServed": ["Africa", "Emerging Markets"], "serviceType": ["Project finance analysis", "Financial model review", "Investment analysis", "Power market analysis"] }
        ]
      }).replace(`${home}#felix\"`, `${home}#felix`);
    } else {
      const currentName = (document.querySelector("h1")?.textContent || document.title.split("|")[0]).trim();
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": home },
          { "@type": "ListItem", "position": 2, "name": currentName, "item": window.location.href.split("#")[0].split("?")[0] }
        ]
      });
    }
    document.head.appendChild(schema);
  }
})();
