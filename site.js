(() => {
  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  if (button && links) {
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("open", !open);
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        button.setAttribute("aria-expanded", "false");
        links.classList.remove("open");
      });
    });
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

  const service = new URLSearchParams(window.location.search).get("service");
  const select = document.querySelector("#service-select");
  if (service && select) {
    const option = [...select.options].find((item) => item.text === service || item.value === service);
    if (option) select.value = option.value;
  }
})();
