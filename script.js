/* =========================================================
   script.js
   Robust navigation and interaction
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const views = document.querySelectorAll(".view");

  const navLinks = document.querySelectorAll("[data-view]");

  const mainNav = document.getElementById("mainNav");

  const menuToggle = document.getElementById("menuToggle");

  const year = document.getElementById("year");


  /* ================= CURRENT YEAR ================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* ================= VALID VIEW IDS ================= */

  const validViews = new Set(
    [...views].map(view => view.id)
  );


  /* ================= CLOSE MOBILE MENU ================= */

  function closeMobileMenu() {

    if (!mainNav || !menuToggle) {
      return;
    }

    mainNav.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open menu"
    );

    menuToggle.innerHTML =
      '<i class="fa-solid fa-bars"></i>';
  }


  /* ================= RESET SCROLL ================= */

  function resetViewScroll(target) {

    if (!target) {
      return;
    }

    target.scrollTop = 0;

    const container =
      target.querySelector(".section-container");

    if (container) {
      container.scrollTop = 0;
    }
  }


  /* ================= SHOW VIEW ================= */

  function showView(viewId, updateURL = false) {

    const id = validViews.has(viewId)
      ? viewId
      : "home";

    const target =
      document.getElementById(id);

    if (!target) {
      return;
    }


    /* Activate selected view */

    views.forEach(view => {

      view.classList.toggle(
        "active",
        view === target
      );

    });


    /* Update navigation */

    navLinks.forEach(button => {

      if (!button.classList.contains("nav-link")) {
        return;
      }

      const active =
        button.dataset.view === id;

      button.classList.toggle(
        "active",
        active
      );


      if (active) {

        button.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        button.removeAttribute(
          "aria-current"
        );

      }

    });


    /* Reset scroll position */

    resetViewScroll(target);


    /* Close mobile menu */

    closeMobileMenu();


    /* Update browser URL */

    if (updateURL) {

      const hash = `#${id}`;

      if (window.location.hash !== hash) {

        history.pushState(
          { view: id },
          "",
          hash
        );

      }

    }

  }


  /* ================= NAVIGATION ================= */

  function navigate(viewId) {

    if (!validViews.has(viewId)) {
      return;
    }

    showView(
      viewId,
      true
    );
  }


  /* ================= ALL DATA-VIEW BUTTONS ================= */

  navLinks.forEach(button => {

    button.addEventListener(
      "click",
      event => {

        const viewId =
          button.dataset.view;

        if (!viewId) {
          return;
        }

        event.preventDefault();

        navigate(viewId);

      }
    );

  });


  /* ================= MOBILE MENU ================= */

  if (menuToggle && mainNav) {

    menuToggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const isOpen =
          mainNav.classList.toggle("open");


        menuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );


        menuToggle.setAttribute(
          "aria-label",
          isOpen
            ? "Close menu"
            : "Open menu"
        );


        menuToggle.innerHTML = isOpen
          ? '<i class="fa-solid fa-xmark"></i>'
          : '<i class="fa-solid fa-bars"></i>';

      }
    );


    /* Close menu when clicking outside */

    document.addEventListener(
      "click",
      event => {

        if (!mainNav.classList.contains("open")) {
          return;
        }

        if (
          !mainNav.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {

          closeMobileMenu();

        }

      }
    );

  }


  /* ================= HASH CHANGE ================= */

  window.addEventListener(
    "hashchange",
    () => {

      const viewId =
        window.location.hash.slice(1) ||
        "home";

      showView(
        viewId,
        false
      );

    }
  );


  /* ================= BROWSER BACK / FORWARD ================= */

  window.addEventListener(
    "popstate",
    event => {

      const viewId =
        event.state?.view ||
        window.location.hash.slice(1) ||
        "home";

      showView(
        viewId,
        false
      );

    }
  );


  /* ================= ESCAPE KEY ================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }


      const active =
        document.querySelector(".view.active");


      if (
        active &&
        active.id !== "home"
      ) {

        navigate("home");

      } else {

        closeMobileMenu();

      }

    }
  );


  /* ================= EXTERNAL LINKS ================= */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {
          closeMobileMenu();
        }
      );

    });


  /* ================= INITIAL VIEW ================= */

  const initialView =
    window.location.hash.slice(1) ||
    "home";


  showView(
    validViews.has(initialView)
      ? initialView
      : "home",
    false
  );

});