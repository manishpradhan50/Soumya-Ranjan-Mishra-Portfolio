/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("active");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.add("active");
    mainNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    document.body.classList.add("menu-open");
}

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    /* Close menu after selecting a section */
    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    /* Close with Escape */
    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            closeMenu();
            menuToggle.focus();
        }
    });

    /* Close if user returns to desktop */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}


/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   SCROLL PROGRESS
========================================================= */

const progressBar = document.getElementById("progressBar");

function updateScrollProgress() {
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (pageHeight <= 0) return;

    const percentage = (scrollTop / pageHeight) * 100;
    progressBar.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();


/* =========================================================
   CERTIFICATE LIGHTBOX
========================================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const certificateButtons = document.querySelectorAll(".certificate-image");

function openLightbox(imagePath) {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = imagePath;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
}

function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.classList.remove("menu-open");
}

certificateButtons.forEach(button => {
    button.addEventListener("click", () => {
        const image = button.dataset.image;
        if (image) {
            openLightbox(image);
        }
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

/* Close lightbox with Escape */
document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        lightbox &&
        lightbox.classList.contains("open")
    ) {
        closeLightbox();
    }
});


/* =========================================================
   SCROLL REVEAL ANIMATION OBSERVER
========================================================= */

const revealElements = document.querySelectorAll(
    ".section, .dark-section, .contact-section, .research-card, .research-feature, .certificate-item, .timeline article, .education-list article, .publications article, .stats > div, .linkedin-box"
);

if ("IntersectionObserver" in window && revealElements.length) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}