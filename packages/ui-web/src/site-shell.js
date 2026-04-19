export function initMarketingSiteShell(options = {}) {
  const {
    navToggleSelector = "[data-nav-toggle]",
    navGroupSelector = "[data-nav-group]",
    navLinkSelector = "[data-nav-link]",
    revealSelector = "[data-reveal]",
    yearSelector = "[data-year]",
    contactFormSelector = "[data-contact-form]",
    formStatusSelector = "[data-form-status]",
    contactSuccessMessage = "Inquiry captured for the demo flow. Connect this form to your inbox, CRM, or automation before launch."
  } = options;

  const navToggle = document.querySelector(navToggleSelector);
  const navGroup = document.querySelector(navGroupSelector);

  function setNavState(isOpen) {
    if (!navToggle || !navGroup) return;
    navGroup.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle && navGroup) {
    navToggle.addEventListener("click", () => {
      setNavState(!navGroup.classList.contains("is-open"));
    });

    navGroup.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavState(false));
    });

    document.addEventListener("click", (event) => {
      if (!navGroup.classList.contains("is-open")) return;
      if (navGroup.contains(event.target) || navToggle.contains(event.target)) return;
      setNavState(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setNavState(false);
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(navLinkSelector).forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const isHome = currentPage === "" || currentPage === "index.html";
    if ((isHome && href === "index.html") || href === currentPage) {
      link.classList.add("is-active");
    }
  });

  const revealElements = [...document.querySelectorAll(revealSelector)];
  revealElements.forEach((element) => {
    const delay = Number(element.dataset.delay || 0);
    element.style.setProperty("--reveal-delay", String(delay));
  });

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const yearNode = document.querySelector(yearSelector);
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const contactForm = document.querySelector(contactFormSelector);
  const formStatus = document.querySelector(formStatusSelector);

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      contactForm.reset();
      formStatus.textContent = contactSuccessMessage;
      formStatus.classList.remove("is-idle");
      formStatus.classList.add("is-success");
    });
  }
}
