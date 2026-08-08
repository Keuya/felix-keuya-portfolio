(() => {
  const siteOrigin = "https://felixkeuya.com";
  const legacyOrigin = "https://felix-keuya-portfolio.vercel.app";
  const pathName = window.location.pathname;
  const isNestedPage = ["/projects/", "/models/", "/services/", "/insights/", "/tools/"].some((segment) => pathName.includes(segment));
  const base = isNestedPage ? "../" : "";
  const path = pathName.split("/").pop() || "index.html";

  const canonicalPath = pathName === "/" || pathName.endsWith("/index.html") ? "/" : pathName;
  const canonicalUrl = `${siteOrigin}${canonicalPath}`;

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

  const ensureLink = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("link");
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
  ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: `${siteOrigin}/assets/felix.jpg` });
  ensureMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Felix Keuya, renewable energy project finance analyst" });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: `${siteOrigin}/assets/felix.jpg` });
  ensureLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });
  ensureLink('link[rel="author"]', { rel: "author", href: `${siteOrigin}/about.html` });
  ensureLink('link[rel="alternate"][type="application/rss+xml"], link[rel="alternate"][type="application/atom+xml"]', {
    rel: "alternate",
    type: "application/atom+xml",
    title: "Felix Keuya renewable energy and project finance updates",
    href: `${siteOrigin}/feed.xml`
  });

  document.querySelectorAll('link[rel*="icon"]').forEach((element) => element.remove());
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href = `${base}favicon.svg`;
  document.head.appendChild(favicon);

  document.querySelectorAll('.logo-dot').forEach((element) => element.remove());
  document.querySelectorAll('.nav-logo,.footer-logo').forEach((element) => {
    element.textContent = "Felix Keuya";
    if (element.classList.contains("nav-logo")) element.setAttribute("aria-label", "Felix Keuya home");
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    if (script.textContent.includes(legacyOrigin)) {
      script.textContent = script.textContent.split(legacyOrigin).join(siteOrigin);
    }
  });

  document.querySelectorAll(`a[href^="${legacyOrigin}"]`).forEach((link) => {
    link.href = link.href.replace(legacyOrigin, siteOrigin);
  });

  const titleMap = {
    "index.html": "Felix Keuya | Renewable Energy Project Finance",
    "services.html": "Services | Felix Keuya",
    "work.html": "Work | Felix Keuya",
    "samples.html": "Samples | Felix Keuya",
    "insights.html": "Insights | Felix Keuya",
    "tools.html": "Tools | Felix Keuya",
    "media.html": "Media, Speaking & Citation Resources | Felix Keuya",
    "engagement.html": "Process | Felix Keuya",
    "resume.html": "Resume | Felix Keuya",
    "request.html": "Contact | Felix Keuya"
  };
  if (titleMap[path]) document.title = titleMap[path];
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: document.title });

  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  const insertBeforeResumeOrContact = (link) => {
    if (!links) return;
    const resumeLink = [...links.querySelectorAll("a")].find((item) => (item.getAttribute("href") || "").endsWith("resume.html"));
    if (resumeLink) links.insertBefore(link, resumeLink);
    else links.insertBefore(link, links.querySelector(".nav-cta"));
  };

  if (links && !links.querySelector('a[href$="samples.html"]')) {
    const samplesLink = document.createElement("a");
    samplesLink.href = `${base}samples.html`;
    samplesLink.textContent = "Samples";
    insertBeforeResumeOrContact(samplesLink);
  }

  if (links && !links.querySelector('a[href$="insights.html"]')) {
    const insightsLink = document.createElement("a");
    insightsLink.href = `${base}insights.html`;
    insightsLink.textContent = "Insights";
    insertBeforeResumeOrContact(insightsLink);
  }

  if (links && !links.querySelector('a[href$="tools.html"]')) {
    const toolsLink = document.createElement("a");
    toolsLink.href = `${base}tools.html`;
    toolsLink.textContent = "Tools";
    insertBeforeResumeOrContact(toolsLink);
  }

  if (links && !links.querySelector('a[href$="engagement.html"]')) {
    const engagementLink = document.createElement("a");
    engagementLink.href = `${base}engagement.html`;
    engagementLink.textContent = "Process";
    insertBeforeResumeOrContact(engagementLink);
  }

  const shortLabels = {
    "services.html": "Services",
    "work.html": "Work",
    "samples.html": "Samples",
    "insights.html": "Insights",
    "tools.html": "Tools",
    "media.html": "Media",
    "engagement.html": "Process",
    "resume.html": "Resume",
    "request.html": "Contact"
  };
  document.querySelectorAll(".nav-links a, footer a").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0].split("/").pop();
    if (shortLabels[target]) link.textContent = shortLabels[target];
  });

  document.querySelectorAll("footer .footer-grid > div:nth-child(2)").forEach((group) => {
    if (!group.querySelector('a[href$="tools.html"]')) {
      const toolLink = document.createElement("a");
      toolLink.href = `${base}tools.html`;
      toolLink.textContent = "Tools";
      group.appendChild(toolLink);
    }
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
      const text = item.text.toLowerCase();
      const value = item.value.toLowerCase();
      return text === normalised || value === normalised || text.includes(normalised) || normalised.includes(text);
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
    const href = link.getAttribute("href") || "";
    if (!href.includes("?")) link.setAttribute("href", `${href}?subject=Renewable%20energy%20project%20enquiry`);
    link.setAttribute("aria-label", link.getAttribute("aria-label") || "Email Felix");
    link.setAttribute("title", link.getAttribute("title") || "Open your email application");
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

  /* Small wording corrections for older case-study labels. Source copy is being revised separately; this avoids mechanical punctuation rewriting. */
  const exactTextReplacements = new Map([
    ["Analyst note", "My read"],
    ["Human judgement", "My read"],
    ["The human judgement", "My read"],
    ["The point", "What changed my view"],
    ["Decision reached", "What I recommended"],
    ["The commercial question is not whether the PPA tariff is lower than the grid tariff. It is whether the buyer's full delivered cost is lower after timing, network charges, losses and residual supply are included.", "A low PPA tariff can still produce an expensive power bill. I compare the buyer's full delivered cost after timing, network charges, losses and residual grid supply."]
  ]);
  document.querySelectorAll("body *").forEach((element) => {
    if (element.children.length || element.closest("script,style,textarea,input,select,option,code,pre")) return;
    const text = element.textContent.trim();
    if (exactTextReplacements.has(text)) element.textContent = exactTextReplacements.get(text);
  });

  const toolMap = {
    "solar-project-finance-model-dscr-cfads.html": {
      href: `${base}tools/project-finance-dscr-debt-capacity.html`,
      title: "Run the DSCR and debt-capacity check",
      text: "Use the free calculator to test CFADS, target DSCR, level debt service and indicative debt capacity before opening a full model."
    },
    "renewable-energy-project-finance-africa.html": {
      href: `${base}tools/project-finance-dscr-debt-capacity.html`,
      title: "Run a quick debt-capacity screen",
      text: "Test the first-pass relationship between CFADS, target DSCR, interest rate and tenor."
    },
    "zambia-solar-project-finance-model.html": {
      href: `${base}tools/project-finance-dscr-debt-capacity.html`,
      title: "Try the DSCR calculator on your own assumptions",
      text: "A quick screen will not replace the lender model, but it is useful for checking whether the debt quantum is in the right range."
    },
    "public-solar-ipp-model.html": {
      href: `${base}tools/project-finance-dscr-debt-capacity.html`,
      title: "Check debt capacity without opening Excel",
      text: "Use the free DSCR calculator for an indicative first pass, then compare it with the full public model."
    },
    "south-africa-corporate-ppa-wheeling-economics.html": {
      href: `${base}tools/ppa-wheeling-savings-calculator.html`,
      title: "Run the buyer savings check",
      text: "Compare grid-only cost with PPA energy, network and service charges, residual supply and the break-even PPA price."
    },
    "ppa-wheeling-analysis-africa.html": {
      href: `${base}tools/ppa-wheeling-savings-calculator.html`,
      title: "Use the PPA and wheeling calculator",
      text: "Start with a simple delivered-cost comparison before moving into interval data and settlement detail."
    },
    "south-africa-corporate-ppa-wheeling.html": {
      href: `${base}tools/ppa-wheeling-savings-calculator.html`,
      title: "Rebuild the Year 1 buyer comparison",
      text: "Use your own load, PPA price, network charges and grid benchmark to see where the saving comes from."
    },
    "sa-corporate-ppa-wheeling-model.html": {
      href: `${base}tools/ppa-wheeling-savings-calculator.html`,
      title: "Run a quick delivered-cost screen",
      text: "Use the calculator for a first pass, then use the full model for profiles, settlement and sensitivities."
    }
  };

  if (toolMap[path] && !document.querySelector(".related-tool-callout")) {
    ensureStylesheet("tools.css");
    const target = document.querySelector(".case-story, .prose, .energy-project-narrative, main .container");
    if (target) {
      const callout = document.createElement("div");
      callout.className = "related-tool-callout";
      callout.innerHTML = `<div><strong>${toolMap[path].title}</strong><p>${toolMap[path].text}</p></div><a class="btn btn-dark" href="${toolMap[path].href}">Open free tool</a>`;
      target.appendChild(callout);
    }
  }

  const shareableResource = (pathName.includes("/insights/") || pathName.includes("/tools/")) && path.endsWith(".html");
  if (shareableResource && !document.querySelector(".resource-share")) {
    const ctaBand = document.querySelector(".cta-band");
    const share = document.createElement("aside");
    share.className = "resource-share";
    share.setAttribute("aria-label", "Share this resource");
    const linkedInUrl = new URL(canonicalUrl);
    linkedInUrl.searchParams.set("utm_source", "linkedin");
    linkedInUrl.searchParams.set("utm_medium", "social");
    linkedInUrl.searchParams.set("utm_campaign", "resource-share");
    share.innerHTML = `<div><strong>Useful for a project team?</strong><span>Share the clean public resource rather than a screenshot.</span></div><div class="resource-share-actions"><button type="button" data-copy-resource>Copy link</button><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedInUrl.toString())}" target="_blank" rel="noopener">Share on LinkedIn</a></div><span class="resource-share-status" data-copy-status aria-live="polite"></span>`;
    if (ctaBand) ctaBand.insertAdjacentElement("beforebegin", share);
    else document.querySelector("main")?.appendChild(share);

    share.querySelector("[data-copy-resource]")?.addEventListener("click", async () => {
      const status = share.querySelector("[data-copy-status]");
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        if (status) status.textContent = "Link copied.";
      } catch (_) {
        const input = document.createElement("textarea");
        input.value = canonicalUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
        if (status) status.textContent = "Link copied.";
      }
    });
  }

  if (path !== "index.html" && !document.querySelector('script[type="application/ld+json"]')) {
    const currentName = (document.querySelector("h1")?.textContent || document.title.split("|")[0]).trim();
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.siteSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteOrigin}/` },
        { "@type": "ListItem", "position": 2, "name": currentName, "item": canonicalUrl }
      ]
    });
    document.head.appendChild(schema);
  }
})();
