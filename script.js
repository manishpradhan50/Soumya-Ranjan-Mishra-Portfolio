/* =========================================================
   SOUMYA RANJAN MISHRA
   FIREBASE ACADEMIC PORTFOLIO
   FIXED CLASSIC SCRIPT
   ---------------------------------------------------------
   This file is intentionally NOT an ES module.
   It uses dynamic import() so it also works when index.html
   contains: <script src="script.js"></script>
========================================================= */

(async function startPortfolio() {
  try {
    const [
      firebaseApp,
      firebaseAuth,
      firebaseFirestore,
      firebaseStorage
    ] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js")
    ]);

    const { initializeApp } = firebaseApp;

    const {
      getAuth,
      signInWithEmailAndPassword,
      onAuthStateChanged,
      signOut,
      updatePassword
    } = firebaseAuth;

    const {
      getFirestore,
      collection,
      doc,
      getDoc,
      getDocs,
      setDoc,
      addDoc,
      updateDoc,
      deleteDoc,
      query,
      orderBy
    } = firebaseFirestore;

    const {
      getStorage,
      ref,
      uploadBytes,
      getDownloadURL
    } = firebaseStorage;

  const firebaseConfig = {
    apiKey: "AIzaSyBZVKKk5VD3QLdfLTgYdTk4KxR4bsrnZ-k",
    authDomain: "soumya-ranjan-portfolio.firebaseapp.com",
    projectId: "soumya-ranjan-portfolio",
    storageBucket: "soumya-ranjan-portfolio.firebasestorage.app",
    messagingSenderId: "523526340312",
    appId: "1:523526340312:web:9e35d672c887ebc34021ad",
    measurementId: "G-8W496R2QXV"
  };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    console.log(
      "Firebase initialized successfully:",
      firebaseConfig.projectId
    );

// Initialize the portfolio after Firebase modules load.
const initializePortfolioDOM = () => {

  /* ======================================================
     CONFIGURATION
  ====================================================== */

  const COLLECTIONS = {

    experiences: {

      title: "Professional Experience",

      icon: "fa-briefcase",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "start_date",
          label: "Start Date",
          type: "text"
        },

        {
          name: "end_date",
          label: "End Date",
          type: "text"
        },

        {
          name: "title",
          label: "Job Title",
          type: "text",
          required: true
        },

        {
          name: "organization",
          label: "Organization",
          type: "text"
        },

        {
          name: "location",
          label: "Location",
          type: "text"
        },

        {
          name: "description",
          label: "Description",
          type: "textarea"
        },

        {
          name: "tags",
          label: "Tags",
          type: "text"
        }

      ]

    },

    education: {

      title: "Education",

      icon: "fa-graduation-cap",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "period",
          label: "Period",
          type: "text"
        },

        {
          name: "degree",
          label: "Degree",
          type: "text",
          required: true
        },

        {
          name: "field",
          label: "Field / Specialization",
          type: "text"
        },

        {
          name: "institution",
          label: "Institution",
          type: "text"
        },

        {
          name: "location",
          label: "Location",
          type: "text"
        },

        {
          name: "description",
          label: "Description",
          type: "textarea"
        }

      ]

    },

    research: {

      title: "Research Interests",

      icon: "fa-microscope",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "title",
          label: "Research Area",
          type: "text",
          required: true
        },

        {
          name: "icon",
          label: "Font Awesome Icon",
          type: "text"
        },

        {
          name: "description",
          label: "Description",
          type: "textarea"
        }

      ]

    },

    publications: {

      title: "Publications",

      icon: "fa-book-open",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "year",
          label: "Year",
          type: "number"
        },

        {
          name: "publication_type",
          label: "Publication Type",
          type: "text"
        },

        {
          name: "title",
          label: "Publication Name",
          type: "textarea",
          required: true
        },

        {
          name: "authors",
          label: "Authors",
          type: "textarea"
        },

        {
          name: "journal_or_book",
          label: "Journal / Book / Conference",
          type: "text"
        },

        {
          name: "volume_issue",
          label: "Volume / Issue",
          type: "text"
        },

        {
          name: "pages",
          label: "Pages",
          type: "text"
        },

        {
          name: "doi",
          label: "DOI",
          type: "text"
        },

        {
          name: "url",
          label: "Publication URL",
          type: "url"
        },

        {
          name: "abstract",
          label: "Abstract",
          type: "textarea"
        },

        {
          name: "tags",
          label: "Keywords / Tags",
          type: "text"
        }

      ]

    },

    achievements: {

      title: "Achievements",

      icon: "fa-award",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "title",
          label: "Achievement Title",
          type: "text",
          required: true
        },

        {
          name: "value",
          label: "Year / Value",
          type: "text"
        },

        {
          name: "description",
          label: "Description",
          type: "textarea"
        },

        {
          name: "link_url",
          label: "Link",
          type: "url"
        }

      ]

    },

    skills: {

      title: "Skills & Expertise",

      icon: "fa-layer-group",

      fields: [

        {
          name: "sort_order",
          label: "Order",
          type: "number"
        },

        {
          name: "name",
          label: "Skill Name",
          type: "text",
          required: true
        },

        {
          name: "category",
          label: "Category",
          type: "text"
        }

      ]

    }

  };

  /* ======================================================
     DOM
  ====================================================== */

  const views =
    document.querySelectorAll(".view");

  const navLinks =
    document.querySelectorAll("[data-view]");

  const mainNav =
    document.getElementById("mainNav");

  const menuToggle =
    document.getElementById("menuToggle");

  const year =
    document.getElementById("year");

  const ownerLoginBtn =
    document.getElementById("ownerLoginBtn");

  const loginModal =
    document.getElementById("loginModal");

  const adminModal =
    document.getElementById("adminModal");

  const editorModal =
    document.getElementById("editorModal");

  const loginForm =
    document.getElementById("loginForm");

  const profileForm =
    document.getElementById("profileForm");

  const passwordForm =
    document.getElementById("passwordForm");

  const profileImage =
    document.getElementById("profileImage");

  const adminImagePreview =
    document.getElementById("adminImagePreview");

  const editorForm =
    document.getElementById("editorForm");

  const editorFields =
    document.getElementById("editorFields");

  const editorTitle =
    document.getElementById("editorTitle");

  const adminCollectionList =
    document.getElementById("adminCollectionList");

  const addCollectionBtn =
    document.getElementById("addCollectionBtn");

  const collectionTitle =
    document.getElementById("collectionTitle");

  const collectionEyebrow =
    document.getElementById("collectionEyebrow");

  const toast =
    document.getElementById("toast");

  const toastMessage =
    document.getElementById("toastMessage");

  /* ======================================================
     STATE
  ====================================================== */

  let currentUser = null;

  let isOwner = false;

  let currentProfile = null;

  let activeCollection = null;

  let editingDocumentId = null;

  /* ======================================================
     HELPERS
  ====================================================== */

  function escapeHTML(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }

    return String(value)

      .replaceAll("&", "&amp;")

      .replaceAll("<", "&lt;")

      .replaceAll(">", "&gt;")

      .replaceAll('"', "&quot;")

      .replaceAll("'", "&#039;");

  }

  function safeURL(url) {

    if (!url) {

      return "#";

    }

    const value =
      String(url).trim();

    if (
      value.startsWith("https://") ||
      value.startsWith("http://") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:")
    ) {

      return value;

    }

    return "#";

  }

  function showToast(
    message,
    type = "success"
  ) {

    toastMessage.textContent =
      message;

    const icon =
      toast.querySelector("i");

    if (type === "error") {

      icon.className =
        "fa-solid fa-circle-exclamation";

      icon.style.color =
        "#ff7777";

    } else {

      icon.className =
        "fa-solid fa-circle-check";

      icon.style.color =
        "#6bcf8e";

    }

    toast.classList.add("show");

    setTimeout(() => {

      toast.classList.remove("show");

    }, 3000);

  }

  function openModal(element) {

    if (!element) return;

    element.classList.remove("hidden");

    document.body.style.overflow =
      "hidden";

  }

  function closeModal(element) {

    if (!element) return;

    element.classList.add("hidden");

    document.body.style.overflow =
      "";

  }

  function formatText(text) {

    if (!text) {

      return "";

    }

    return escapeHTML(text)

      .split("\n")

      .filter(Boolean)

      .map(
        paragraph =>
          `<p>${paragraph}</p>`
      )

      .join("");

  }

  function getPublicationLink(item) {

    if (item.url) {

      return safeURL(item.url);

    }

    if (item.doi) {

      let doi =
        String(item.doi).trim();

      if (
        doi.startsWith("http://") ||
        doi.startsWith("https://")
      ) {

        return safeURL(doi);

      }

      return safeURL(
        `https://doi.org/${doi}`
      );

    }

    return "#";

  }

  /* ======================================================
     NAVIGATION
  ====================================================== */

  function showView(
    viewId,
    updateURL = true
  ) {

    const target =
      document.getElementById(viewId);

    if (!target) {

      return;

    }

    views.forEach(view => {

      view.classList.remove("active");

    });

    target.classList.add("active");

    document
      .querySelectorAll(".nav-link")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.view === viewId
        );

      });

    if (updateURL) {

      const newHash =
        `#${viewId}`;

      if (
        window.location.hash !==
        newHash
      ) {

        history.pushState(
          { view: viewId },
          "",
          newHash
        );

      }

    }

    mainNav.classList.remove("open");

    menuToggle.innerHTML =
      '<i class="fa-solid fa-bars"></i>';

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  navLinks.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const view =
          button.dataset.view;

        if (view) {

          showView(view);

        }

      }
    );

  });

  menuToggle.addEventListener(
    "click",
    () => {

      const open =
        mainNav.classList.toggle(
          "open"
        );

      menuToggle.innerHTML =
        open
          ? '<i class="fa-solid fa-xmark"></i>'
          : '<i class="fa-solid fa-bars"></i>';

    }
  );

  window.addEventListener(
    "popstate",
    event => {

      const view =
        event.state?.view ||
        window.location.hash
          .replace("#", "") ||
        "home";

      showView(
        view,
        false
      );

    }
  );

  const initialView =
    window.location.hash
      .replace("#", "") ||
    "home";

  showView(
    initialView,
    false
  );

  /* ======================================================
     YEAR
  ====================================================== */

  year.textContent =
    new Date().getFullYear();

  /* ======================================================
     PROFILE
  ====================================================== */

  async function loadProfile() {

    try {

      const snapshot =
        await getDoc(
          doc(
            db,
            "profile",
            "main"
          )
        );

      if (!snapshot.exists()) {

        return null;

      }

      currentProfile =
        snapshot.data();

      renderProfile(
        currentProfile
      );

      return currentProfile;

    } catch (error) {

      console.error(
        "Profile error:",
        error
      );

      return null;

    }

  }

  /* ======================================================
     LOAD WEBSITE
  ====================================================== */

  async function loadWebsite() {

    await loadProfile();

    const [
      experiences,
      education,
      research,
      publications,
      achievements,
      skills
    ] = await Promise.all([

      getCollection(
        "experiences"
      ),

      getCollection(
        "education"
      ),

      getCollection(
        "research"
      ),

      getCollection(
        "publications"
      ),

      getCollection(
        "achievements"
      ),

      getCollection(
        "skills"
      )

    ]);

    renderExperience(
      experiences
    );

    renderEducation(
      education
    );

    renderResearch(
      research
    );

    renderPublications(
      publications
    );

    renderAchievements(
      achievements
    );

    renderSkills(
      skills
    );

  }



  /* ======================================================
     EXPERIENCE RENDER
  ====================================================== */

  function renderExperience(items) {

    const container =
      document.getElementById(
        "experienceContainer"
      );

    if (!items.length) {

      container.innerHTML =
        emptyMessage(
          "No experience added yet."
        );

      return;

    }

    container.innerHTML =
      items.map(item => {

        const tags =
          item.tags
            ? item.tags
                .split(",")
                .map(
                  tag =>
                    `<span>${escapeHTML(tag.trim())}</span>`
                )
                .join("")
            : "";

        return `

          <article class="timeline-item">

            <div class="timeline-date">

              ${escapeHTML(
                item.start_date || ""
              )}

              —

              ${escapeHTML(
                item.end_date || "PRESENT"
              )}

            </div>

            <div class="timeline-dot"></div>

            <div class="timeline-card">

              <span>
                ACADEMIC / PROFESSIONAL EXPERIENCE
              </span>

              <h3>
                ${escapeHTML(
                  item.title
                )}
              </h3>

              <h4>
                ${escapeHTML(
                  item.organization
                )}
              </h4>

              ${
                item.location
                  ? `<small>
                      ${escapeHTML(
                        item.location
                      )}
                    </small>`
                  : ""
              }

              <p>
                ${escapeHTML(
                  item.description || ""
                )}
              </p>

              ${
                tags
                  ? `<div class="tag-row">
                      ${tags}
                    </div>`
                  : ""
              }

            </div>

          </article>

        `;

      }).join("");

  }



  /* ======================================================
     EDUCATION RENDER
  ====================================================== */

  function renderEducation(items) {

    const container =
      document.getElementById(
        "educationContainer"
      );

    if (!items.length) {

      container.innerHTML =
        emptyMessage(
          "No education records added yet."
        );

      return;

    }

    container.innerHTML =
      items.map(
        (item, index) => `

          <article
            class="education-card ${
              index === 0
                ? "featured"
                : ""
            }"
          >

            <div class="education-icon">

              <i class="fa-solid fa-graduation-cap"></i>

            </div>

            <span>
              ${escapeHTML(
                item.period || "EDUCATION"
              )}
            </span>

            <h3>
              ${escapeHTML(
                item.degree
              )}
            </h3>

            <p>
              ${escapeHTML(
                item.institution
              )}
            </p>

            <small>

              ${escapeHTML(
                item.field || ""
              )}

              ${
                item.location
                  ? `<br>${escapeHTML(
                      item.location
                    )}`
                  : ""
              }

            </small>

          </article>

        `
      ).join("");

  }



  /* ======================================================
     RESEARCH RENDER
  ====================================================== */

  function renderResearch(items) {

    const container =
      document.getElementById(
        "researchContainer"
      );

    if (!items.length) {

      container.innerHTML =
        emptyMessage(
          "No research interests added yet."
        );

      return;

    }

    container.innerHTML =
      items.map(
        (item, index) => {

          const icon =
            item.icon ||
            "fa-brain";

          return `

            <article
              class="research-card ${
                index === 0
                  ? "large"
                  : ""
              }"
            >

              <div class="research-number">

                ${String(
                  index + 1
                ).padStart(2, "0")}

              </div>

              <i
                class="fa-solid ${escapeHTML(
                  icon
                )}"
              ></i>

              <h3>
                ${escapeHTML(
                  item.title
                )}
              </h3>

              <p>
                ${escapeHTML(
                  item.description || ""
                )}
              </p>

            </article>

          `;

        }
      ).join("");

  }



  /* ======================================================
     PUBLICATIONS RENDER
  ====================================================== */

  function renderPublications(items) {

    const tbody =
      document.getElementById(
        "publicationsTableBody"
      );

    if (!items.length) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="8"
            style="text-align:center;padding:35px"
          >

            No publications added yet.

          </td>

        </tr>

      `;

      return;

    }

    tbody.innerHTML =
      items.map(
        (item, index) => {

          const link =
            getPublicationLink(
              item
            );

          const doi =
            item.doi
              ? escapeHTML(
                  item.doi
                )
              : "—";

          return `

            <tr>

              <td>
                ${index + 1}
              </td>

              <td>
                ${
                  item.year ||
                  "—"
                }
              </td>

              <td>
                ${escapeHTML(
                  item.publication_type ||
                  "Publication"
                )}
              </td>

              <td class="publication-name">

                ${escapeHTML(
                  item.title
                )}

              </td>

              <td>
                ${escapeHTML(
                  item.authors ||
                  "—"
                )}
              </td>

              <td>
                ${escapeHTML(
                  item.journal_or_book ||
                  "—"
                )}
              </td>

              <td class="publication-doi">

                ${doi}

              </td>

              <td>

                ${
                  link !== "#"
                    ? `
                      <a
                        class="publication-link"
                        href="${link}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        View

                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                      </a>
                    `
                    : "—"
                }

              </td>

            </tr>

          `;

        }
      ).join("");

  }



  /* ======================================================
     ACHIEVEMENTS
  ====================================================== */

  function renderAchievements(items) {

    const container =
      document.getElementById(
        "achievementContainer"
      );

    if (!items.length) {

      container.innerHTML =
        emptyMessage(
          "No achievements added yet."
        );

      return;

    }

    container.innerHTML =
      items.map(
        item => `

          <article class="achievement-card">

            <div class="achievement-icon">

              <i class="fa-solid fa-award"></i>

            </div>

            <div>

              <span>

                ${escapeHTML(
                  item.value ||
                  "ACHIEVEMENT"
                )}

              </span>

              <h3>

                ${escapeHTML(
                  item.title
                )}

              </h3>

              <p>

                ${escapeHTML(
                  item.description || ""
                )}

              </p>

              ${
                item.link_url
                  ? `
                    <a
                      href="${safeURL(
                        item.link_url
                      )}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="publication-link"
                      style="margin-top:12px"
                    >
                      View
                    </a>
                  `
                  : ""
              }

            </div>

          </article>

        `
      ).join("");

  }



  /* ======================================================
     SKILLS
  ====================================================== */

  function renderSkills(items) {

    const container =
      document.getElementById(
        "skillsContainer"
      );

    if (!items.length) {

      container.innerHTML =
        emptyMessage(
          "No skills added yet."
        );

      return;

    }

    container.innerHTML =
      items.map(
        item => `

          <span>

            ${escapeHTML(
              item.name
            )}

          </span>

        `
      ).join("");

  }



  function emptyMessage(text) {

    return `

      <div
        style="
          background:white;
          border:1px solid var(--border);
          border-radius:10px;
          padding:25px;
          color:var(--muted);
          font-size:12px;
          grid-column:1/-1;
        "
      >

        ${escapeHTML(text)}

      </div>

    `;

  }



  /* ======================================================
     AUTHENTICATION
  ====================================================== */

  onAuthStateChanged(
    auth,
    async user => {

      currentUser =
        user || null;

      if (!user) {

        isOwner = false;

        ownerLoginBtn.innerHTML =
          '<i class="fa-solid fa-lock"></i> Owner Login';

        return;

      }

      try {

        const adminSnapshot =
          await getDoc(
            doc(
              db,
              "admins",
              user.uid
            )
          );

        if (
          adminSnapshot.exists() &&
          adminSnapshot.data().role === "owner"
        ) {

          isOwner = true;

          ownerLoginBtn.innerHTML =
            '<i class="fa-solid fa-user-shield"></i> Owner Panel';

        } else {

          isOwner = false;

          await signOut(auth);

          showToast(
            "This account is not authorized as the profile owner.",
            "error"
          );

        }

      } catch (error) {

        console.error(error);

        isOwner = false;

      }

    }
  );



  /* ======================================================
     OWNER LOGIN BUTTON
  ====================================================== */

  ownerLoginBtn.addEventListener(
    "click",
    () => {

      if (isOwner) {

        openAdmin();

      } else {

        openModal(
          loginModal
        );

      }

    }
  );



  /* ======================================================
     LOGIN
  ====================================================== */

  loginForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const email =
        document
          .getElementById(
            "loginEmail"
          )
          .value
          .trim();

      const password =
        document
          .getElementById(
            "loginPassword"
          )
          .value;

      const submit =
        document.getElementById(
          "loginSubmit"
        );

      submit.disabled = true;

      submit.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user =
          auth.currentUser;

        if (!user) {

          throw new Error(
            "Authentication failed."
          );

        }

        const adminSnapshot =
          await getDoc(
            doc(
              db,
              "admin_users",
              user.uid
            )
          );

        if (
          !adminSnapshot.exists() ||
          adminSnapshot.data().role !== "owner"
        ) {

          await signOut(auth);

          throw new Error(
            "You are not authorized as the profile owner."
          );

        }

        closeModal(
          loginModal
        );

        loginForm.reset();

        showToast(
          "Welcome back, profile owner."
        );

        openAdmin();

      } catch (error) {

        console.error(error);

        showToast(
          getFirebaseError(
            error
          ),
          "error"
        );

      } finally {

        submit.disabled = false;

        submit.innerHTML =
          '<i class="fa-solid fa-right-to-bracket"></i> Login';

      }

    }
  );



  /* ======================================================
     LOGOUT
  ====================================================== */

  document
    .getElementById("logoutBtn")
    .addEventListener(
      "click",
      async () => {

        try {

          await signOut(auth);

          closeModal(
            adminModal
          );

          showToast(
            "You have been logged out."
          );

        } catch (error) {

          showToast(
            "Logout failed.",
            "error"
          );

        }

      }
    );



  /* ======================================================
     OPEN ADMIN
  ====================================================== */

  async function openAdmin() {

    if (!isOwner) {

      openModal(
        loginModal
      );

      return;

    }

    openModal(
      adminModal
    );

    await loadAdminProfile();

    switchAdminTab(
      "profile"
    );

  }



  /* ======================================================
     ADMIN TABS
  ====================================================== */

  document
    .querySelectorAll(
      "[data-admin-tab]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          switchAdminTab(
            button.dataset.adminTab
          );

        }
      );

    });


  function switchAdminTab(
    tab
  ) {

    document
      .querySelectorAll(
        ".admin-tab"
      )
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.adminTab ===
            tab
        );

      });

    document
      .querySelectorAll(
        ".admin-section"
      )
      .forEach(section => {

        section.classList.remove(
          "active"
        );

      });

    if (tab === "profile") {

      document
        .getElementById(
          "adminProfileSection"
        )
        .classList.add(
          "active"
        );

      return;

    }

    if (tab === "account") {

      document
        .getElementById(
          "adminAccountSection"
        )
        .classList.add(
          "active"
        );

      document
        .getElementById(
          "ownerEmail"
        )
        .textContent =
        currentUser?.email ||
        "-";

      return;

    }

    activeCollection =
      tab;

    document
      .getElementById(
        "adminCollectionSection"
      )
      .classList.add(
        "active"
      );

    renderAdminCollection(
      tab
    );

  }



  /* ======================================================
     LOAD ADMIN PROFILE
  ====================================================== */

  async function loadAdminProfile() {

    const snapshot =
      await getDoc(
        doc(
          db,
          "profile",
          "main"
        )
      );

    if (!snapshot.exists()) {

      currentProfile = {};

      profileForm.reset();

      return;

    }

    currentProfile =
      snapshot.data();

    const fields =
      profileForm.querySelectorAll(
        "[name]"
      );

    fields.forEach(field => {

      field.value =
        currentProfile[
          field.name
        ] || "";

    });

    adminImagePreview.src =
      currentProfile.hero_image_url ||
      "photo.jpg";

  }



  /* ======================================================
     PROFILE IMAGE PREVIEW
  ====================================================== */

  profileImage.addEventListener(
    "change",
    () => {

      const file =
        profileImage.files[0];

      if (!file) return;

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        showToast(
          "Please select an image file.",
          "error"
        );

        profileImage.value = "";

        return;

      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        showToast(
          "Image must be smaller than 5 MB.",
          "error"
        );

        profileImage.value = "";

        return;

      }

      const reader =
        new FileReader();

      reader.onload =
        event => {

          adminImagePreview.src =
            event.target.result;

        };

      reader.readAsDataURL(
        file
      );

    }
  );
    /* ======================================================
     SAVE PROFILE
  ====================================================== */

  profileForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      if (!isOwner) {

        showToast(
          "Owner login required.",
          "error"
        );

        return;

      }


      const submit =
        profileForm.querySelector(
          ".save-btn"
        );


      submit.disabled = true;

      submit.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


      try {

        const formData =
          new FormData(
            profileForm
          );


        const data = {

          id: "main",

          full_name:
            formData.get(
              "full_name"
            ),

          short_name:
            formData.get(
              "short_name"
            ),

          role:
            formData.get(
              "role"
            ),

          role_line:
            formData.get(
              "role_line"
            ),

          institution:
            formData.get(
              "institution"
            ),

          location:
            formData.get(
              "location"
            ),

          phone:
            formData.get(
              "phone"
            ),

          linkedin_url:
            formData.get(
              "linkedin_url"
            ),

          hero_label:
            formData.get(
              "hero_label"
            ),

          description:
            formData.get(
              "description"
            ),

          about_title:
            formData.get(
              "about_title"
            ),

          about_text:
            formData.get(
              "about_text"
            ),

          stat_1_value:
            formData.get(
              "stat_1_value"
            ),

          stat_1_label:
            formData.get(
              "stat_1_label"
            ),

          stat_2_value:
            formData.get(
              "stat_2_value"
            ),

          stat_2_label:
            formData.get(
              "stat_2_label"
            ),

          stat_3_value:
            formData.get(
              "stat_3_value"
            ),

          stat_3_label:
            formData.get(
              "stat_3_label"
            )

        };


        let imageURL =
          currentProfile?.hero_image_url ||
          "photo.jpg";


        const file =
          profileImage.files[0];


        if (file) {

          const extension =
            file.name
              .split(".")
              .pop()
              .toLowerCase();


          const fileName =
            `profile-${Date.now()}.${extension}`;


          const imageRef =
            ref(
              storage,
              `profile-images/${currentUser.uid}/${fileName}`
            );


          await uploadBytes(
            imageRef,
            file
          );


          imageURL =
            await getDownloadURL(
              imageRef
            );

        }


        data.hero_image_url =
          imageURL;


        await setDoc(
          doc(
            db,
            "profile",
            "main"
          ),
          data,
          {
            merge: true
          }
        );


        currentProfile =
          data;


        renderProfile(
          data
        );


        showToast(
          "Profile updated successfully."
        );


      } catch (error) {

        console.error(error);


        showToast(
          getFirebaseError(
            error
          ),
          "error"
        );

      } finally {

        submit.disabled = false;

        submit.innerHTML =
          '<i class="fa-solid fa-floppy-disk"></i> Save Profile';

      }

    }
  );



  /* ======================================================
     ADD COLLECTION
  ====================================================== */

  addCollectionBtn.addEventListener(
    "click",
    () => {

      if (!activeCollection) {

        return;

      }


      openEditor(
        activeCollection
      );

    }
  );



  /* ======================================================
     RENDER ADMIN COLLECTION
  ====================================================== */

  async function renderAdminCollection(
    collectionName
  ) {

    const config =
      COLLECTIONS[
        collectionName
      ];


    if (!config) return;


    collectionTitle.textContent =
      config.title;


    collectionEyebrow.textContent =
      "CONTENT MANAGEMENT";


    adminCollectionList.innerHTML =
      `<div class="admin-item">
        Loading...
      </div>`;


    const items =
      await getCollection(
        collectionName
      );


    if (!items.length) {

      adminCollectionList.innerHTML = `

        <div class="admin-item">

          <div class="admin-item-info">

            <strong>
              No content yet
            </strong>

            <span>
              Click "Add New" to create your first item.
            </span>

          </div>

        </div>

      `;

      return;

    }


    adminCollectionList.innerHTML =
      items.map(
        item => {

          const title =
            item.title ||
            item.name ||
            item.degree ||
            item.full_name ||
            "Untitled";


          let subtitle = "";


          if (
            collectionName ===
            "publications"
          ) {

            subtitle =
              `${item.year || "—"} · ${
                item.publication_type ||
                "Publication"
              }`;

          } else if (
            collectionName ===
            "experiences"
          ) {

            subtitle =
              `${item.organization || ""} · ${
                item.start_date || ""
              }`;

          } else if (
            collectionName ===
            "education"
          ) {

            subtitle =
              `${item.institution || ""} · ${
                item.period || ""
              }`;

          } else if (
            collectionName ===
            "skills"
          ) {

            subtitle =
              item.category || "";

          } else {

            subtitle =
              item.value ||
              item.description ||
              "";

          }


          return `

            <div class="admin-item">

              <div class="admin-item-info">

                <strong>
                  ${escapeHTML(
                    title
                  )}
                </strong>

                <span>
                  ${escapeHTML(
                    subtitle
                  )}
                </span>

              </div>


              <div class="admin-item-actions">

                <button
                  class="edit-btn"
                  data-action="edit"
                  data-id="${item.id}"
                  title="Edit"
                >

                  <i class="fa-solid fa-pen"></i>

                </button>


                <button
                  class="delete-btn"
                  data-action="delete"
                  data-id="${item.id}"
                  title="Delete"
                >

                  <i class="fa-solid fa-trash"></i>

                </button>

              </div>

            </div>

          `;

        }
      ).join("");


    adminCollectionList
      .querySelectorAll(
        "[data-action]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          async () => {

            const id =
              button.dataset.id;


            if (
              button.dataset.action ===
              "edit"
            ) {

              await editCollectionItem(
                collectionName,
                id
              );

            }


            if (
              button.dataset.action ===
              "delete"
            ) {

              await deleteCollectionItem(
                collectionName,
                id
              );

            }

          }
        );

      });

  }



  /* ======================================================
     OPEN EDITOR
  ====================================================== */

  async function openEditor(
    collectionName,
    item = null
  ) {

    const config =
      COLLECTIONS[
        collectionName
      ];


    if (!config) return;


    activeCollection =
      collectionName;


    editingDocumentId =
      item?.id || null;


    editorTitle.textContent =
      item
        ? `Edit ${config.title}`
        : `Add ${config.title}`;


    editorFields.innerHTML =
      config.fields.map(
        field => {

          const value =
            item?.[
              field.name
            ] ?? "";


          const inputType =
            field.type === "number"
              ? "number"
              : field.type === "url"
              ? "url"
              : "text";


          if (
            field.type ===
            "textarea"
          ) {

            return `

              <label
                class="${
                  [
                    "description",
                    "abstract",
                    "title",
                    "authors"
                  ].includes(
                    field.name
                  )
                    ? "full-field"
                    : ""
                }"
              >

                ${escapeHTML(
                  field.label
                )}

                <textarea
                  name="${escapeHTML(
                    field.name
                  )}"
                  rows="${
                    field.name ===
                    "abstract"
                      ? 6
                      : 4
                  }"
                  ${
                    field.required
                      ? "required"
                      : ""
                  }
                >${escapeHTML(
                  value
                )}</textarea>

              </label>

            `;

          }


          return `

            <label>

              ${escapeHTML(
                field.label
              )}

              <input
                type="${inputType}"
                name="${escapeHTML(
                  field.name
                )}"
                value="${escapeHTML(
                  value
                )}"
                ${
                  field.required
                    ? "required"
                    : ""
                }
              >

            </label>

          `;

        }
      ).join("");


    openModal(
      editorModal
    );

  }



  /* ======================================================
     EDIT COLLECTION ITEM
  ====================================================== */

  async function editCollectionItem(
    collectionName,
    id
  ) {

    const snapshot =
      await getDoc(
        doc(
          db,
          collectionName,
          id
        )
      );


    if (!snapshot.exists()) {

      showToast(
        "Record not found.",
        "error"
      );

      return;

    }


    openEditor(
      collectionName,
      {
        id,
        ...snapshot.data()
      }
    );

  }



  /* ======================================================
     SAVE COLLECTION ITEM
  ====================================================== */

  editorForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      if (!isOwner) {

        showToast(
          "Owner login required.",
          "error"
        );

        return;

      }


      const config =
        COLLECTIONS[
          activeCollection
        ];


      if (!config) return;


      const formData =
        new FormData(
          editorForm
        );


      const data = {};


      config.fields.forEach(
        field => {

          let value =
            formData.get(
              field.name
            );


          if (
            field.type ===
            "number"
          ) {

            value =
              value === ""
                ? 0
                : Number(value);

          }


          data[field.name] =
            value;

        }
      );


      const submit =
        editorForm.querySelector(
          ".save-btn"
        );


      submit.disabled = true;

      submit.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


      try {

        if (
          editingDocumentId
        ) {

          await updateDoc(
            doc(
              db,
              activeCollection,
              editingDocumentId
            ),
            data
          );


          showToast(
            "Updated successfully."
          );

        } else {

          await addDoc(
            collection(
              db,
              activeCollection
            ),
            data
          );


          showToast(
            "Added successfully."
          );

        }


        closeModal(
          editorModal
        );


        await renderAdminCollection(
          activeCollection
        );


        await loadWebsite();


      } catch (error) {

        console.error(error);


        showToast(
          getFirebaseError(
            error
          ),
          "error"
        );

      } finally {

        submit.disabled = false;

        submit.innerHTML =
          '<i class="fa-solid fa-floppy-disk"></i> Save';

      }

    }
  );



  /* ======================================================
     DELETE COLLECTION ITEM
  ====================================================== */

  async function deleteCollectionItem(
    collectionName,
    id
  ) {

    const confirmed =
      confirm(
        "Are you sure you want to delete this item?"
      );


    if (!confirmed) {

      return;

    }


    try {

      await deleteDoc(
        doc(
          db,
          collectionName,
          id
        )
      );


      showToast(
        "Deleted successfully."
      );


      await renderAdminCollection(
        collectionName
      );


      await loadWebsite();


    } catch (error) {

      console.error(error);


      showToast(
        getFirebaseError(
          error
        ),
        "error"
      );

    }

  }



  /* ======================================================
     CHANGE PASSWORD
  ====================================================== */

  passwordForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const password =
        document.getElementById(
          "newPassword"
        ).value;


      const confirmPassword =
        document.getElementById(
          "confirmPassword"
        ).value;


      if (
        password !==
        confirmPassword
      ) {

        showToast(
          "Passwords do not match.",
          "error"
        );

        return;

      }


      if (
        password.length < 6
      ) {

        showToast(
          "Password must contain at least 6 characters.",
          "error"
        );

        return;

      }


      try {

        await updatePassword(
          currentUser,
          password
        );


        passwordForm.reset();


        showToast(
          "Password changed successfully."
        );

      } catch (error) {

        console.error(error);


        showToast(
          getFirebaseError(
            error
          ),
          "error"
        );

      }

    }
  );



  /* ======================================================
     CLOSE MODALS
  ====================================================== */

  document
    .querySelectorAll(
      "[data-close]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.close;


          closeModal(
            document.getElementById(
              id
            )
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".modal-backdrop"
    )
    .forEach(backdrop => {

      backdrop.addEventListener(
        "click",
        event => {

          if (
            event.currentTarget
              .dataset.close
          ) {

            closeModal(
              document.getElementById(
                event.currentTarget
                  .dataset.close
              )
            );

          }

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeModal(
          loginModal
        );

        closeModal(
          editorModal
        );

      }

    }
  );



  /* ======================================================
     VIEW SITE
  ====================================================== */

  document
    .getElementById(
      "adminViewSite"
    )
    .addEventListener(
      "click",
      () => {

        closeModal(
          adminModal
        );


        showView(
          "home"
        );

      }
    );



  /* ======================================================
     FIREBASE ERROR MESSAGES
  ====================================================== */

  function getFirebaseError(
    error
  ) {

    const code =
      error?.code || "";


    if (
      code.includes(
        "auth/invalid-credential"
      )
    ) {

      return "Invalid email or password.";

    }


    if (
      code.includes(
        "auth/invalid-email"
      )
    ) {

      return "Please enter a valid email address.";

    }


    if (
      code.includes(
        "auth/too-many-requests"
      )
    ) {

      return "Too many login attempts. Please try again later.";

    }


    if (
      code.includes(
        "permission-denied"
      )
    ) {

      return "Permission denied. Check Firebase Security Rules.";

    }


    if (
      code.includes(
        "storage/unauthorized"
      )
    ) {

      return "You are not authorized to upload this image.";

    }


    return (
      error?.message ||
      "Something went wrong."
    );

  }



  /* ======================================================
     INITIAL LOAD
  ====================================================== */

    };

    // Run initialization even if the page has already loaded.
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        initializePortfolioDOM,
        { once: true }
      );
    } else {
      initializePortfolioDOM();
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);

    alert(
      "Firebase could not be initialized. " +
      "Open the website using Live Server and check the browser console."
    );
  }
})();
