(() => {
  const siteOrigin = "https://felixkeuya.com";
  const params = new URLSearchParams(window.location.search);

  /* Preserve the first useful touchpoint for project enquiries in this browser session. */
  try {
    if (!sessionStorage.getItem("fk_landing_url")) {
      sessionStorage.setItem("fk_landing_url", window.location.href);
    }
    if (!sessionStorage.getItem("fk_initial_referrer")) {
      sessionStorage.setItem("fk_initial_referrer", document.referrer || "Direct");
    }
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
      const value = params.get(key);
      if (value && !sessionStorage.getItem(`fk_${key}`)) sessionStorage.setItem(`fk_${key}`, value);
    });
  } catch (_) {
    /* Attribution is helpful, but the site must continue if storage is unavailable. */
  }

  const decisions = {
    screen: {
      eyebrow: "Project screen",
      title: "Is this worth pursuing?",
      text: "I test the market, revenue case, costs and key risks before more time and money are committed.",
      outputs: [["Decision", "Go, pause or review"],["Output", "Short project screen"],["Focus", "Revenue, costs, buyer and grid"]],
      service: "Project screen",
      cta: "Discuss a screen"
    },
    model: {
      eyebrow: "Model review",
      title: "Does the model hold up?",
      text: "I review assumptions, debt, returns and downside cases, then flag the points that can change the answer.",
      outputs: [["Review", "Model issues"],["Analysis", "DSCR, LLCR and returns"],["Output", "Updated model and note"]],
      service: "Model review",
      cta: "Discuss a model review"
    },
    memo: {
      eyebrow: "Decision pack",
      title: "Is the case ready?",
      text: "I turn project data, finance and key risks into a clear pack for management, investors or lenders.",
      outputs: [["Decision", "Clear recommendation"],["Analysis", "Finance and downside cases"],["Output", "Memo or presentation"]],
      service: "Investment memo",
      cta: "Discuss a decision pack"
    },
    capacity: {
      eyebrow: "Team support",
      title: "Does the team need help?",
      text: "I add project finance and research capacity for models, memos, market work and presentations.",
      outputs: [["Cadence", "Weekly priorities"],["Format", "Your templates"],["Use", "Project and research support"]],
      service: "Team support",
      cta: "Discuss team support"
    }
  };

  const decisionButtons = [...document.querySelectorAll("[data-decision]")];
  const decisionPanel = document.querySelector("[data-decision-panel]");
  const renderDecision = (key) => {
    const data = decisions[key];
    if (!data || !decisionPanel) return;
    decisionButtons.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.decision === key)));
    decisionPanel.querySelector("[data-decision-eyebrow]").textContent = data.eyebrow;
    decisionPanel.querySelector("[data-decision-title]").textContent = data.title;
    decisionPanel.querySelector("[data-decision-text]").textContent = data.text;
    const outputGrid = decisionPanel.querySelector("[data-decision-outputs]");
    outputGrid.innerHTML = data.outputs.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
    const cta = decisionPanel.querySelector("[data-decision-cta]");
    cta.textContent = data.cta;
    cta.href = `request.html?service=${encodeURIComponent(data.service)}`;
  };
  decisionButtons.forEach((button, index) => {
    button.addEventListener("click", () => renderDecision(button.dataset.decision));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const next = (index + direction + decisionButtons.length) % decisionButtons.length;
      decisionButtons[next].focus();
      renderDecision(decisionButtons[next].dataset.decision);
    });
  });
  if (decisionButtons.length) renderDecision(decisionButtons[0].dataset.decision);

  const filterButtons = [...document.querySelectorAll("[data-work-filter]")];
  const workCards = [...document.querySelectorAll("[data-work-tags]")];
  const filterWork = (filter) => {
    filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.workFilter === filter)));
    workCards.forEach((card) => {
      const tags = (card.dataset.workTags || "").split(" ");
      card.hidden = filter !== "all" && !tags.includes(filter);
    });
  };
  filterButtons.forEach((button) => button.addEventListener("click", () => filterWork(button.dataset.workFilter)));

  const serviceSelect = document.querySelector('#service-select');
  const serviceHint = document.querySelector('[data-service-hint]');
  const howFoundSelect = document.querySelector('select[name="How found"]');
  const hints = {
    "Project screen": "For an early go, pause or review decision.",
    "Model review": "For model logic, debt, returns and downside cases.",
    "Investment memo": "For management, investor or lender decisions.",
    "Market review": "For market entry, tariffs, grids and project pipelines.",
    "Team support": "For recurring models, research, memos and presentations.",
    "Other": "Use the project note to explain what you need."
  };
  const showHint = () => {
    if (!serviceSelect || !serviceHint) return;
    const text = hints[serviceSelect.value] || "";
    serviceHint.textContent = text;
    serviceHint.classList.toggle("visible", Boolean(text));
  };

  if (serviceSelect) {
    const requestedService = params.get('service');
    const validService = [...serviceSelect.options].some((option) => option.value === requestedService || option.text === requestedService);
    if (requestedService && validService) serviceSelect.value = requestedService;
    serviceSelect.addEventListener("change", showHint);
  }

  if (howFoundSelect && !howFoundSelect.value) {
    const source = (params.get('utm_source') || params.get('source') || '').toLowerCase();
    const sourceMap = {
      linkedin: 'LinkedIn',
      google: 'Web search',
      bing: 'Web search',
      search: 'Web search',
      chatgpt: 'Web search',
      github: 'GitHub',
      referral: 'Referral'
    };
    if (sourceMap[source]) howFoundSelect.value = sourceMap[source];
  }

  const intakeForm = document.querySelector("form.intake-form");
  if (intakeForm) {
    const nextField = intakeForm.querySelector('input[name="_next"]');
    if (nextField) nextField.value = `${siteOrigin}/thank-you.html`;

    const addHidden = (name, value) => {
      if (!value || intakeForm.querySelector(`input[name="${name}"]`)) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      intakeForm.appendChild(input);
    };

    let stored = {};
    try {
      stored = {
        landing: sessionStorage.getItem("fk_landing_url"),
        referrer: sessionStorage.getItem("fk_initial_referrer"),
        source: sessionStorage.getItem("fk_utm_source"),
        medium: sessionStorage.getItem("fk_utm_medium"),
        campaign: sessionStorage.getItem("fk_utm_campaign"),
        content: sessionStorage.getItem("fk_utm_content"),
        term: sessionStorage.getItem("fk_utm_term")
      };
    } catch (_) {}

    addHidden("Landing page", stored.landing || window.location.href);
    addHidden("Initial referrer", stored.referrer || document.referrer || "Direct");
    addHidden("UTM source", params.get("utm_source") || stored.source || "");
    addHidden("UTM medium", params.get("utm_medium") || stored.medium || "");
    addHidden("UTM campaign", params.get("utm_campaign") || stored.campaign || "");
    addHidden("UTM content", params.get("utm_content") || stored.content || "");
    addHidden("UTM term", params.get("utm_term") || stored.term || "");
    addHidden("Enquiry page", `${window.location.origin}${window.location.pathname}`);
  }

  /* Public launch record badge supplied by Website Launches. */
  const footerBrand = document.querySelector("footer .footer-grid > div:first-child");
  if (footerBrand && !footerBrand.querySelector('.website-launch-badge')) {
    const badge = document.createElement('a');
    badge.className = 'website-launch-badge';
    badge.href = 'https://websitelaunches.com/site/felixkeuya.com';
    badge.target = '_blank';
    badge.rel = 'noopener';
    badge.title = 'View the public launch record for felixkeuya.com';
    badge.style.display = 'inline-block';
    badge.style.marginTop = '16px';

    const image = document.createElement('img');
    image.src = 'https://websitelaunches.com/badge/felixkeuya.com.svg?theme=dark';
    image.alt = 'Established online - Public launch record';
    image.width = 255;
    image.height = 55;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.style.display = 'block';
    image.style.maxWidth = '100%';
    image.style.height = 'auto';

    badge.appendChild(image);
    footerBrand.appendChild(badge);
  }

  showHint();
})();