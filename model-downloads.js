(() => {
  const requestPage = (model) => {
    const base = window.location.pathname.includes("/models/") || window.location.pathname.includes("/projects/")
      ? "../request.html"
      : "request.html";
    const params = new URLSearchParams({
      service: "Financial model review",
      model: model === "wheeling" ? "South Africa corporate PPA and wheeling workbook" : "Solar IPP project finance workbook"
    });
    window.location.href = `${base}?${params.toString()}`;
  };

  document.querySelectorAll("[data-model-download]").forEach((button) => {
    button.textContent = "Request Excel workbook";
    button.addEventListener("click", () => requestPage(button.dataset.modelDownload));
  });

  document.querySelectorAll(".kicker").forEach((element) => {
    if (element.textContent.trim() === "Downloadable public model") element.textContent = "Interactive public model";
  });

  document.querySelectorAll(".download-band h2").forEach((element) => {
    element.textContent = "Request the Excel workbook for formula-level review";
  });

  document.querySelectorAll(".download-band small").forEach((element) => {
    element.textContent = "Excel sample supplied after a brief fit check";
  });

  document.querySelectorAll("p").forEach((paragraph) => {
    paragraph.textContent = paragraph.textContent
      .replace("The Excel download contains formulas, scenario controls and all nine sheets.", "The Excel workbook available on request contains formulas, scenario controls and all nine sheets.")
      .replace("The public workbook contains eight linked sheets.", "The public model viewer covers eight linked workstreams.");
  });

  document.querySelectorAll("[data-model-tabs]").forEach((group) => {
    const buttons = [...group.querySelectorAll("[data-model-tab]")];
    const panels = [...group.querySelectorAll("[data-model-panel]")];

    const activate = (name) => {
      buttons.forEach((button) => {
        const selected = button.dataset.modelTab === name;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.modelPanel !== name;
      });
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button.dataset.modelTab));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        buttons[next].focus();
        activate(buttons[next].dataset.modelTab);
      });
    });

    if (buttons[0]) activate(buttons[0].dataset.modelTab);
  });
})();
