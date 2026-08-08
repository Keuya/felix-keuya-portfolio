(() => {
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
  const params = new URLSearchParams(window.location.search);
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
      github: 'GitHub',
      referral: 'Referral'
    };
    if (sourceMap[source]) howFoundSelect.value = sourceMap[source];
  }

  showHint();
})();