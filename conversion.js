(() => {
  const decisions = {
    screen: {
      eyebrow: "Origination and early-stage diligence",
      title: "Decide whether the opportunity deserves more time and cost.",
      text: "I test the commercial logic, evidence quality and bankability gaps before your team commits to full diligence.",
      outputs: [["Decision", "Go, pause or investigate"],["Output", "2–5 page opportunity screen"],["Focus", "Revenue, costs, offtake, grid and execution"]],
      service: "Project opportunity screen",
      cta: "Request a decision sprint"
    },
    model: {
      eyebrow: "Model assurance and lender readiness",
      title: "Find the assumptions or formulas that could change the financing case.",
      text: "I review model logic, operating assumptions, debt sizing, cover ratios and downside resilience, then prioritise the issues that matter to the decision.",
      outputs: [["Review", "Formula and assumption issue register"],["Analysis", "DSCR, LLCR, returns and sensitivities"],["Output", "Marked-up model and review memo"]],
      service: "Financial model review",
      cta: "Request a model review"
    },
    memo: {
      eyebrow: "Investment committee and lender documentation",
      title: "Turn scattered project information into a decision-ready pack.",
      text: "I connect project economics, commercial structure, valuation, risks and outstanding diligence into a coherent memo or presentation for management, IC or lenders.",
      outputs: [["Recommendation", "Clear decision and conditions"],["Analysis", "Valuation, financing and downside cases"],["Output", "Word memo or PowerPoint pack"]],
      service: "Investment memo and lender pack",
      cta: "Request a decision pack"
    },
    capacity: {
      eyebrow: "White-label execution capacity",
      title: "Add analyst capacity without adding permanent headcount.",
      text: "I work inside your templates and review process across models, memos, market diligence, client decks and recurring project work.",
      outputs: [["Cadence", "Weekly priorities and delivery rhythm"],["Format", "Your templates and house style"],["Use case", "Overflow, transaction and research support"]],
      service: "Embedded white label analyst",
      cta: "Discuss embedded support"
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
  const hints = {
    "Project opportunity screen": "Best for an early go, pause or investigate decision before full diligence.",
    "Financial model review": "Best for formula, assumption, debt sizing, coverage and sensitivity review.",
    "Investment memo and lender pack": "Best for IC, management, lender or investor decision documentation.",
    "Market and commercial diligence": "Best for market entry, tariffs, regulation, counterparties and project pipelines.",
    "Embedded white label analyst": "Best for recurring models, memos, research and client deliverables under your brand.",
    "Other renewable energy analysis": "Use the project description to explain the decision, output and deadline."
  };
  const showHint = () => {
    if (!serviceSelect || !serviceHint) return;
    const text = hints[serviceSelect.value] || "";
    serviceHint.textContent = text;
    serviceHint.classList.toggle("visible", Boolean(text));
  };
  serviceSelect?.addEventListener("change", showHint);
  showHint();
})();