/* =========================================================
   SOUMYA RANJAN MISHRA
   FIREBASE ACADEMIC PORTFOLIO
   COMPREHENSIVE FIRESTORE CLIENT APPLICATION
   ---------------------------------------------------------
   - Full Firestore CRUD for all sections
   - Dynamic public rendering from Firestore
   - Secure Owner Authentication & Authorization
   - Idempotent PDF-to-Firestore 1-Click Import
   - Image upload support with storage error fallbacks
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

    console.log("Firebase initialized successfully for project:", firebaseConfig.projectId);

    // Initialize the portfolio DOM handlers and renderers
    const initializePortfolioDOM = () => {

      /* ======================================================
         COLLECTIONS CONFIGURATION
      ====================================================== */

      const COLLECTIONS = {
        experiences: {
          title: "Professional Experience",
          icon: "fa-briefcase",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "start_date", label: "Start Date", type: "text" },
            { name: "end_date", label: "End Date", type: "text" },
            { name: "title", label: "Job Title", type: "text", required: true },
            { name: "organization", label: "Organization", type: "text" },
            { name: "location", label: "Location", type: "text" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "tags", label: "Tags (comma separated)", type: "text" }
          ]
        },

        education: {
          title: "Education",
          icon: "fa-graduation-cap",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "period", label: "Period", type: "text" },
            { name: "degree", label: "Degree", type: "text", required: true },
            { name: "field", label: "Field / Specialization", type: "text" },
            { name: "institution", label: "Institution", type: "text" },
            { name: "location", label: "Location", type: "text" },
            { name: "description", label: "Description", type: "textarea" }
          ]
        },

        research: {
          title: "Research Interests",
          icon: "fa-microscope",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "title", label: "Research Area", type: "text", required: true },
            { name: "icon", label: "Font Awesome Icon (e.g. fa-brain)", type: "text" },
            { name: "description", label: "Description", type: "textarea" }
          ]
        },

        publications: {
          title: "Publications",
          icon: "fa-book-open",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "year", label: "Year", type: "number" },
            { name: "publication_type", label: "Publication Type", type: "text" },
            { name: "title", label: "Publication Name", type: "textarea", required: true },
            { name: "authors", label: "Authors", type: "textarea" },
            { name: "journal_or_book", label: "Journal / Book / Conference", type: "text" },
            { name: "volume_issue", label: "Volume / Issue", type: "text" },
            { name: "pages", label: "Pages", type: "text" },
            { name: "doi", label: "DOI", type: "text" },
            { name: "url", label: "Publication URL", type: "url" },
            { name: "abstract", label: "Abstract", type: "textarea" },
            { name: "tags", label: "Keywords / Tags", type: "text" }
          ]
        },

        achievements: {
          title: "Achievements",
          icon: "fa-award",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "title", label: "Achievement Title", type: "text", required: true },
            { name: "value", label: "Year / Value", type: "text" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "link_url", label: "Link URL", type: "url" }
          ]
        },

        skills: {
          title: "Skills & Expertise",
          icon: "fa-layer-group",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "name", label: "Skill Name", type: "text", required: true },
            { name: "category", label: "Category", type: "text" }
          ]
        },

        certifications: {
          title: "Certifications",
          icon: "fa-certificate",
          fields: [
            { name: "sort_order", label: "Order", type: "number" },
            { name: "title", label: "Certificate Title", type: "text", required: true },
            { name: "issuer", label: "Issuing Organization", type: "text" },
            { name: "issue_date", label: "Issue Date", type: "text" },
            { name: "credential_id", label: "Credential ID", type: "text" },
            { name: "credential_url", label: "Credential URL", type: "url" },
            { name: "description", label: "Description", type: "textarea" }
          ]
        }
      };

      /* ======================================================
         VERIFIED DATA FROM PROFILE.PDF (FOR 1-CLICK IMPORT)
      ====================================================== */

      const VERIFIED_PDF_DATA = {
        profile: {
          id: "main",
          full_name: "Soumya Ranjan Mishra",
          short_name: "Soumya Mishra",
          prefix: "Mr.",
          role: "Assistant Professor",
          role_line: "GIET University, Gunupur · Computer Applications",
          department: "Computer Applications",
          institution: "GIET University, Gunupur",
          location: "Berhampur, Odisha, India",
          phone: "+91 89175 56682",
          linkedin_url: "https://www.linkedin.com/in/mr-soumya",
          hero_label: "ASSISTANT PROFESSOR · RESEARCHER · MENTOR",
          description: "Assistant Professor working across Machine Learning, Artificial Intelligence, Software Engineering and research-oriented computing.",
          about_title: "An educator, researcher and academic professional.",
          about_text: "Dedicated to teaching, research and academic development in Artificial Intelligence, Machine Learning, and Computer Applications at GIET University, Gunupur.\n\nPassionate about mentoring students and conducting research in deep learning, remote sensing, and healthcare applications.",
          stat_1_value: "3+",
          stat_1_label: "Years at GIET",
          stat_2_value: "5",
          stat_2_label: "Publications",
          stat_3_value: "M.Tech",
          stat_3_label: "AI / ML",
          hero_image_url: "photo.jpg"
        },

        experiences: [
          {
            id: "exp-1",
            sort_order: 1,
            title: "Assistant Professor",
            organization: "GIET University, Gunupur",
            start_date: "July 2025",
            end_date: "Present",
            location: "Gunupur, Odisha, India",
            description: "Faculty member in the Department of Computer Applications, actively engaged in teaching core computer science courses, research guidance, and curriculum development.",
            tags: "Teaching, Research, Machine Learning, Artificial Intelligence"
          },
          {
            id: "exp-2",
            sort_order: 2,
            title: "Lecturer",
            organization: "GIET University, Gunupur",
            start_date: "September 2024",
            end_date: "June 2025",
            location: "Gunupur, Odisha, India",
            description: "Delivered lectures, conducted laboratory sessions, and mentored undergraduate students in computing fundamentals.",
            tags: "Lectures, Academics, Mentorship"
          },
          {
            id: "exp-3",
            sort_order: 3,
            title: "Teaching Assistant",
            organization: "GIET University, Gunupur",
            start_date: "January 2024",
            end_date: "August 2024",
            location: "Gunupur, Odisha, India",
            description: "Assisted faculty with laboratory instructions, coursework grading, student queries, and academic tutorials.",
            tags: "Teaching Assistant, Academic Support"
          },
          {
            id: "exp-4",
            sort_order: 4,
            title: "Research Assistant",
            organization: "GIET University, Gunupur",
            start_date: "July 2023",
            end_date: "December 2023",
            location: "Gunupur, Odisha, India",
            description: "Assisted with computational research projects in machine learning, data processing, and predictive modeling.",
            tags: "Research, Data Processing, ML Models"
          },
          {
            id: "exp-5",
            sort_order: 5,
            title: "Intern",
            organization: "GIET University, Gunupur",
            start_date: "March 2023",
            end_date: "June 2023",
            location: "Gunupur, Odisha, India",
            description: "Academic internship focusing on software development and institutional computing projects.",
            tags: "Internship, Software Development"
          },
          {
            id: "exp-6",
            sort_order: 6,
            title: "Intern",
            organization: "InternPe",
            start_date: "October 2023",
            end_date: "November 2023",
            location: "Remote",
            description: "Internship program focused on hands-on practical software development and coding challenges.",
            tags: "Internship, Practical Coding"
          },
          {
            id: "exp-7",
            sort_order: 7,
            title: "Intern",
            organization: "SYNC Intern's",
            start_date: "October 2023",
            end_date: "November 2023",
            location: "Remote",
            description: "Hands-on project work in web technologies and software implementations.",
            tags: "Internship, Web Technologies"
          },
          {
            id: "exp-8",
            sort_order: 8,
            title: "Intern",
            organization: "Oasis Infobyte",
            start_date: "October 2023",
            end_date: "November 2023",
            location: "Remote",
            description: "Virtual internship focusing on web development and technical problem solving.",
            tags: "Internship, Web Development"
          }
        ],

        education: [
          {
            id: "edu-1",
            sort_order: 1,
            degree: "Master of Technology (MTech)",
            field: "Computer Science Engineering (AI/ML)",
            institution: "GIET University, Gunupur",
            period: "September 2023 to May 2025",
            location: "Gunupur, Odisha, India",
            description: "Specialized postgraduate program focusing on advanced machine learning algorithms, deep learning architectures, data intelligence, and computer engineering."
          },
          {
            id: "edu-2",
            sort_order: 2,
            degree: "Master of Computer Applications (MCA)",
            field: "Computer and Information Sciences and Support Services",
            institution: "Gandhi Institute of Engineering and Technology (GIET), Gunupur",
            period: "July 2021 to May 2023",
            location: "Gunupur, Odisha, India",
            description: "Comprehensive masters curriculum in enterprise application architecture, database systems, and software engineering."
          },
          {
            id: "edu-3",
            sort_order: 3,
            degree: "Bachelor's degree",
            field: "Computer Software Engineering",
            institution: "Berhampur University",
            period: "August 2018 to July 2021",
            location: "Berhampur, Odisha, India",
            description: "Undergraduate degree establishing foundations in data structures, algorithms, programming paradigms, and software systems."
          }
        ],

        skills: [
          {
            id: "skill-1",
            sort_order: 1,
            name: "Research",
            category: "Academic & Methodological"
          },
          {
            id: "skill-2",
            sort_order: 2,
            name: "Image Processing",
            category: "Technical Expertise"
          },
          {
            id: "skill-3",
            sort_order: 3,
            name: "Healthcare",
            category: "Domain Application"
          }
        ],

        certifications: [
          {
            id: "cert-1",
            sort_order: 1,
            title: "Machine Learning",
            issuer: "",
            issue_date: "",
            credential_id: "",
            credential_url: "",
            description: ""
          },
          {
            id: "cert-2",
            sort_order: 2,
            title: "Artificial Intelligence/Machine Learning",
            issuer: "",
            issue_date: "",
            credential_id: "",
            credential_url: "",
            description: ""
          },
          {
            id: "cert-3",
            sort_order: 3,
            title: "Web Development",
            issuer: "",
            issue_date: "",
            credential_id: "",
            credential_url: "",
            description: ""
          },
          {
            id: "cert-4",
            sort_order: 4,
            title: "Web Development and Designing",
            issuer: "",
            issue_date: "",
            credential_id: "",
            credential_url: "",
            description: ""
          }
        ],

        publications: [
          {
            id: "pub-1",
            sort_order: 1,
            year: null,
            publication_type: "Scholarly Paper",
            title: "Predicting diabetic patients coronary artery calcium score, deep learning using retinal images.",
            authors: "",
            journal_or_book: "",
            volume_issue: "",
            pages: "",
            doi: "",
            url: "",
            abstract: "",
            tags: "Deep Learning, Retinal Images, Healthcare, Diabetes"
          },
          {
            id: "pub-2",
            sort_order: 2,
            year: null,
            publication_type: "Scholarly Paper",
            title: "Combating food insecurity through remote sensing and machine learning for enhanced crop yield prediction.",
            authors: "",
            journal_or_book: "",
            volume_issue: "",
            pages: "",
            doi: "",
            url: "",
            abstract: "",
            tags: "Remote Sensing, Machine Learning, Agriculture, Crop Yield"
          },
          {
            id: "pub-3",
            sort_order: 3,
            year: null,
            publication_type: "Scholarly Paper",
            title: "Effective Diabetes Mellitus Prediction Using a Hybrid Ensemble Machine Learning Model with IoT.",
            authors: "",
            journal_or_book: "",
            volume_issue: "",
            pages: "",
            doi: "",
            url: "",
            abstract: "",
            tags: "Hybrid Ensemble, Machine Learning, IoT, Healthcare"
          },
          {
            id: "pub-4",
            sort_order: 4,
            year: null,
            publication_type: "Scholarly Paper",
            title: "Integrating Multi-Omics Data for Advanced Diabetes Prediction and Understanding.",
            authors: "",
            journal_or_book: "",
            volume_issue: "",
            pages: "",
            doi: "",
            url: "",
            abstract: "",
            tags: "Multi-Omics, Diabetes, Bioinformatics, Predictive Analytics"
          },
          {
            id: "pub-5",
            sort_order: 5,
            year: null,
            publication_type: "Scholarly Paper",
            title: "Enhancing Diabetes Prediction using Hybrid Ensemble Approach.",
            authors: "",
            journal_or_book: "",
            volume_issue: "",
            pages: "",
            doi: "",
            url: "",
            abstract: "",
            tags: "Ensemble Learning, Diabetes Prediction, Machine Learning"
          }
        ],

        research: [
          {
            id: "res-1",
            sort_order: 1,
            title: "Machine Learning & Deep Learning",
            icon: "fa-brain",
            description: "Design and evaluation of deep neural network architectures and ensemble models for medical imaging, diagnostic predictive modeling, and remote sensing."
          },
          {
            id: "res-2",
            sort_order: 2,
            title: "Artificial Intelligence in Healthcare",
            icon: "fa-heart-pulse",
            description: "Application of intelligent diagnostic systems, retinal image analysis for coronary artery calcification scoring, and multi-omics data integration for chronic disease prediction."
          }
        ]
      };

      /* ======================================================
         DOM REFERENCES
      ====================================================== */

      const views = document.querySelectorAll(".view");
      const navLinks = document.querySelectorAll("[data-view]");
      const mainNav = document.getElementById("mainNav");
      const menuToggle = document.getElementById("menuToggle");
      const year = document.getElementById("year");
      const ownerLoginBtn = document.getElementById("ownerLoginBtn");
      const loginModal = document.getElementById("loginModal");
      const adminModal = document.getElementById("adminModal");
      const editorModal = document.getElementById("editorModal");
      const loginForm = document.getElementById("loginForm");
      const profileForm = document.getElementById("profileForm");
      const passwordForm = document.getElementById("passwordForm");
      const profileImage = document.getElementById("profileImage");
      const adminImagePreview = document.getElementById("adminImagePreview");
      const editorForm = document.getElementById("editorForm");
      const editorFields = document.getElementById("editorFields");
      const editorTitle = document.getElementById("editorTitle");
      const adminCollectionList = document.getElementById("adminCollectionList");
      const addCollectionBtn = document.getElementById("addCollectionBtn");
      const collectionTitle = document.getElementById("collectionTitle");
      const collectionEyebrow = document.getElementById("collectionEyebrow");
      const toast = document.getElementById("toast");
      const toastMessage = document.getElementById("toastMessage");
      const btnImportPdfData = document.getElementById("btnImportPdfData");
      const importStatus = document.getElementById("importStatus");
      const themeToggleBtn = document.getElementById("themeToggleBtn");
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');

      /* ======================================================
         THEME (DARK / LIGHT MODE)
      ====================================================== */

      function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        try {
          localStorage.setItem("portfolio_theme", theme);
        } catch (e) {}

        if (themeToggleBtn) {
          themeToggleBtn.innerHTML = theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
          themeToggleBtn.setAttribute(
            "title",
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          );
          themeToggleBtn.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          );
        }

        if (metaThemeColor) {
          metaThemeColor.setAttribute("content", theme === "dark" ? "#0a1120" : "#081426");
        }
      }

      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem("portfolio_theme");
      } catch (e) {}

      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
      applyTheme(initialTheme);

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
          const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          applyTheme(newTheme);
          showToast(newTheme === "dark" ? "Dark Mode enabled" : "Light Mode enabled", "success");
        });
      }

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
        if (value === null || value === undefined) return "";
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function safeURL(url) {
        if (!url) return "#";
        const value = String(url).trim();
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

      function showToast(message, type = "success") {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        const icon = toast.querySelector("i");
        if (icon) {
          if (type === "error") {
            icon.className = "fa-solid fa-circle-exclamation";
            icon.style.color = "#ff7777";
          } else {
            icon.className = "fa-solid fa-circle-check";
            icon.style.color = "#6bcf8e";
          }
        }
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3500);
      }

      function openModal(element) {
        if (!element) return;
        element.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }

      function closeModal(element) {
        if (!element) return;
        element.classList.add("hidden");
        document.body.style.overflow = "";
      }

      function formatText(text) {
        if (!text) return "";
        return escapeHTML(text)
          .split("\n")
          .filter(Boolean)
          .map(paragraph => `<p>${paragraph}</p>`)
          .join("");
      }

      function getPublicationLink(item) {
        if (item.url) return safeURL(item.url);
        if (item.doi) {
          let doi = String(item.doi).trim();
          if (doi.startsWith("http://") || doi.startsWith("https://")) {
            return safeURL(doi);
          }
          return safeURL(`https://doi.org/${doi}`);
        }
        return "#";
      }

      function emptyMessage(text) {
        return `
          <div style="
            background: white;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 25px;
            color: var(--muted);
            font-size: 12px;
            grid-column: 1/-1;
          ">
            ${escapeHTML(text)}
          </div>
        `;
      }

      /* ======================================================
         FIRESTORE DATA ACCESS
      ====================================================== */

      async function getCollection(collectionName) {
        try {
          const colRef = collection(db, collectionName);
          let items = [];

          try {
            const q = query(colRef, orderBy("sort_order", "asc"));
            const snapshot = await getDocs(q);
            snapshot.forEach(docSnap => {
              items.push({ id: docSnap.id, ...docSnap.data() });
            });
          } catch (orderErr) {
            // Fallback: Retrieve all documents without orderBy index constraint
            const snapshot = await getDocs(colRef);
            snapshot.forEach(docSnap => {
              items.push({ id: docSnap.id, ...docSnap.data() });
            });
          }

          // Sort stably in memory by sort_order
          items.sort((a, b) => {
            const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== "")
              ? Number(a.sort_order)
              : 999999;
            const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== "")
              ? Number(b.sort_order)
              : 999999;
            return orderA - orderB;
          });

          return items;
        } catch (error) {
          console.warn(`Firestore read notice for collection "${collectionName}":`, error.message);
          return [];
        }
      }

      /* ======================================================
         NAVIGATION
      ====================================================== */

      function showView(viewId, updateURL = true) {
        const target = document.getElementById(viewId);
        if (!target) return;

        views.forEach(view => view.classList.remove("active"));
        target.classList.add("active");

        document.querySelectorAll(".nav-link").forEach(button => {
          button.classList.toggle("active", button.dataset.view === viewId);
        });

        if (updateURL) {
          const newHash = `#${viewId}`;
          if (window.location.hash !== newHash) {
            history.pushState({ view: viewId }, "", newHash);
          }
        }

        if (mainNav) mainNav.classList.remove("open");
        if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      navLinks.forEach(button => {
        button.addEventListener("click", () => {
          const view = button.dataset.view;
          if (view) showView(view);
        });
      });

      if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
          const open = mainNav.classList.toggle("open");
          menuToggle.innerHTML = open
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
        });
      }

      window.addEventListener("popstate", event => {
        const view = event.state?.view || window.location.hash.replace("#", "") || "home";
        showView(view, false);
      });

      const initialView = window.location.hash.replace("#", "") || "home";
      showView(initialView, false);

      if (year) {
        year.textContent = new Date().getFullYear();
      }

      /* ======================================================
         PROFILE RENDER
      ====================================================== */

      function renderProfile(data) {
        if (!data) return;

        const brandName = document.getElementById("brandName");
        if (brandName) brandName.textContent = data.full_name || "Soumya Ranjan Mishra";

        const footerBrandName = document.getElementById("footerBrandName");
        if (footerBrandName) footerBrandName.textContent = data.full_name || "Soumya Ranjan Mishra";

        const heroLabel = document.getElementById("heroLabel");
        if (heroLabel) heroLabel.textContent = data.hero_label || "ASSISTANT PROFESSOR · RESEARCHER · MENTOR";

        const heroPrefix = document.getElementById("heroPrefix");
        if (heroPrefix) heroPrefix.textContent = data.prefix || "Mr.";

        const heroName = document.getElementById("heroName");
        if (heroName) heroName.textContent = data.full_name || "Soumya Ranjan Mishra";

        const heroRole = document.getElementById("heroRole");
        if (heroRole) {
          heroRole.textContent = data.role_line || (data.institution ? `${data.role || "Assistant Professor"} · ${data.institution}` : "GIET University, Gunupur · Computer Applications");
        }

        const heroDescription = document.getElementById("heroDescription");
        if (heroDescription && data.description) {
          heroDescription.textContent = data.description;
        }

        const heroLinkedin = document.getElementById("heroLinkedin");
        if (heroLinkedin && data.linkedin_url) {
          heroLinkedin.href = safeURL(data.linkedin_url);
        }

        const stat1Val = document.getElementById("stat1Value");
        if (stat1Val && data.stat_1_value !== undefined && data.stat_1_value !== "") stat1Val.textContent = data.stat_1_value;
        const stat1Lbl = document.getElementById("stat1Label");
        if (stat1Lbl && data.stat_1_label) stat1Lbl.textContent = data.stat_1_label;

        const stat2Val = document.getElementById("stat2Value");
        if (stat2Val && data.stat_2_value !== undefined && data.stat_2_value !== "") stat2Val.textContent = data.stat_2_value;
        const stat2Lbl = document.getElementById("stat2Label");
        if (stat2Lbl && data.stat_2_label) stat2Lbl.textContent = data.stat_2_label;

        const stat3Val = document.getElementById("stat3Value");
        if (stat3Val && data.stat_3_value !== undefined && data.stat_3_value !== "") stat3Val.textContent = data.stat_3_value;
        const stat3Lbl = document.getElementById("stat3Label");
        if (stat3Lbl && data.stat_3_label) stat3Lbl.textContent = data.stat_3_label;

        const heroImage = document.getElementById("heroImage");
        if (heroImage && data.hero_image_url) {
          heroImage.src = data.hero_image_url;
          heroImage.alt = data.full_name || "Soumya Ranjan Mishra";
        }

        const profileCardName = document.getElementById("profileCardName");
        if (profileCardName) profileCardName.textContent = data.full_name || "Soumya Ranjan Mishra";

        const aboutTitle = document.getElementById("aboutTitle");
        if (aboutTitle && data.about_title) aboutTitle.textContent = data.about_title;

        const aboutText = document.getElementById("aboutText");
        if (aboutText && data.about_text) aboutText.innerHTML = formatText(data.about_text);

        const aboutRole = document.getElementById("aboutRole");
        if (aboutRole && data.role) aboutRole.textContent = data.role;

        const aboutDepartment = document.getElementById("aboutDepartment");
        if (aboutDepartment && data.department) aboutDepartment.textContent = data.department;

        const aboutInstitution = document.getElementById("aboutInstitution");
        if (aboutInstitution && data.institution) aboutInstitution.textContent = data.institution;

        const aboutLocation = document.getElementById("aboutLocation");
        if (aboutLocation && data.location) aboutLocation.textContent = data.location;

        const contactPhone = document.getElementById("contactPhone");
        if (contactPhone && data.phone) contactPhone.textContent = data.phone;

        const phoneLink = document.getElementById("phoneLink");
        if (phoneLink && data.phone) phoneLink.href = `tel:${data.phone.replace(/[^+\d]/g, "")}`;

        const linkedinLink = document.getElementById("linkedinLink");
        if (linkedinLink && data.linkedin_url) linkedinLink.href = safeURL(data.linkedin_url);

        const contactInstitution = document.getElementById("contactInstitution");
        if (contactInstitution && data.institution) contactInstitution.textContent = data.institution;

        const contactLocation = document.getElementById("contactLocation");
        if (contactLocation && data.location) contactLocation.textContent = data.location;
      }

      async function loadProfile() {
        try {
          const snapshot = await getDoc(doc(db, "profile", "main"));
          if (!snapshot.exists()) return null;
          currentProfile = snapshot.data();
          renderProfile(currentProfile);
          return currentProfile;
        } catch (error) {
          console.warn("Profile load notice:", error.message);
          return null;
        }
      }

      /* ======================================================
         EXPERIENCE RENDER
      ====================================================== */

      function renderExperience(items) {
        const container = document.getElementById("experienceContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No experience records added yet.");
          return;
        }

        container.innerHTML = items.map(item => {
          const tags = item.tags
            ? item.tags.split(",").map(tag => `<span>${escapeHTML(tag.trim())}</span>`).join("")
            : "";

          return `
            <article class="timeline-item">
              <div class="timeline-date">
                ${escapeHTML(item.start_date || "")}
                —
                ${escapeHTML(item.end_date || "PRESENT")}
              </div>
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <span>ACADEMIC / PROFESSIONAL EXPERIENCE</span>
                <h3>${escapeHTML(item.title)}</h3>
                <h4>${escapeHTML(item.organization || "")}</h4>
                ${item.location ? `<small>${escapeHTML(item.location)}</small>` : ""}
                <p>${escapeHTML(item.description || "")}</p>
                ${tags ? `<div class="tag-row">${tags}</div>` : ""}
              </div>
            </article>
          `;
        }).join("");
      }

      /* ======================================================
         EDUCATION RENDER
      ====================================================== */

      function renderEducation(items) {
        const container = document.getElementById("educationContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No education records added yet.");
          return;
        }

        container.innerHTML = items.map((item, index) => `
          <article class="education-card ${index === 0 ? "featured" : ""}">
            <div class="education-icon">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <span>${escapeHTML(item.period || "EDUCATION")}</span>
            <h3>${escapeHTML(item.degree)}</h3>
            <p>${escapeHTML(item.institution || "")}</p>
            <small>
              ${escapeHTML(item.field || "")}
              ${item.location ? `<br>${escapeHTML(item.location)}` : ""}
            </small>
            ${item.description ? `<p style="margin-top:10px; font-size:11px; line-height:1.6; color:var(--muted);">${escapeHTML(item.description)}</p>` : ""}
          </article>
        `).join("");
      }

      /* ======================================================
         RESEARCH RENDER
      ====================================================== */

      function renderResearch(items) {
        const container = document.getElementById("researchContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No research interests added yet.");
          return;
        }

        container.innerHTML = items.map((item, index) => {
          const icon = item.icon || "fa-brain";
          return `
            <article class="research-card ${index === 0 ? "large" : ""}">
              <div class="research-number">${String(index + 1).padStart(2, "0")}</div>
              <i class="fa-solid ${escapeHTML(icon)}"></i>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description || "")}</p>
            </article>
          `;
        }).join("");
      }

      /* ======================================================
         PUBLICATIONS RENDER
      ====================================================== */

      function renderPublications(items) {
        const tbody = document.getElementById("publicationsTableBody");
        if (!tbody) return;

        if (!items || !items.length) {
          tbody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align:center;padding:35px">
                No publications added yet.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = items.map((item, index) => {
          const link = getPublicationLink(item);
          const doi = item.doi ? escapeHTML(item.doi) : "—";

          return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.year || "—"}</td>
              <td>${escapeHTML(item.publication_type || "Scholarly Paper")}</td>
              <td class="publication-name">${escapeHTML(item.title)}</td>
              <td>${escapeHTML(item.authors || "—")}</td>
              <td>${escapeHTML(item.journal_or_book || "—")}</td>
              <td class="publication-doi">${doi}</td>
              <td>
                ${link !== "#" ? `
                  <a class="publication-link" href="${link}" target="_blank" rel="noopener noreferrer">
                    View <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                ` : "—"}
              </td>
            </tr>
          `;
        }).join("");
      }

      /* ======================================================
         ACHIEVEMENTS RENDER
      ====================================================== */

      function renderAchievements(items) {
        const container = document.getElementById("achievementContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No achievements added yet.");
          return;
        }

        container.innerHTML = items.map(item => `
          <article class="achievement-card">
            <div class="achievement-icon">
              <i class="fa-solid fa-award"></i>
            </div>
            <div>
              <span>${escapeHTML(item.value || "ACHIEVEMENT")}</span>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description || "")}</p>
              ${item.link_url ? `
                <a href="${safeURL(item.link_url)}" target="_blank" rel="noopener noreferrer" class="publication-link" style="margin-top:12px; display:inline-block;">
                  View
                </a>
              ` : ""}
            </div>
          </article>
        `).join("");
      }

      /* ======================================================
         SKILLS RENDER
      ====================================================== */

      function renderSkills(items) {
        const container = document.getElementById("skillsContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No skills added yet.");
          return;
        }

        container.innerHTML = items.map(item => `
          <span title="${escapeHTML(item.category || '')}">
            ${escapeHTML(item.name)}
          </span>
        `).join("");
      }

      /* ======================================================
         CERTIFICATIONS RENDER
      ====================================================== */

      function renderCertifications(items) {
        const container = document.getElementById("certificationsContainer");
        if (!container) return;

        if (!items || !items.length) {
          container.innerHTML = emptyMessage("No certifications added yet.");
          return;
        }

        container.innerHTML = items.map(item => {
          const link = item.credential_url ? safeURL(item.credential_url) : null;
          return `
            <article class="certification-card">
              <div class="certification-icon">
                <i class="fa-solid fa-certificate"></i>
              </div>
              <div class="certification-info">
                ${item.issue_date ? `<span class="cert-date">${escapeHTML(item.issue_date)}</span>` : ""}
                <h3>${escapeHTML(item.title)}</h3>
                ${item.issuer ? `<h4>${escapeHTML(item.issuer)}</h4>` : ""}
                ${item.credential_id ? `<small>ID: ${escapeHTML(item.credential_id)}</small>` : ""}
                ${item.description ? `<p>${escapeHTML(item.description)}</p>` : ""}
                ${link && link !== "#" ? `
                  <a href="${link}" target="_blank" rel="noopener noreferrer" class="cert-link">
                    View Credential <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                ` : ""}
              </div>
            </article>
          `;
        }).join("");
      }

      /* ======================================================
         LOAD WEBSITE
      ====================================================== */

      async function loadWebsite() {
        try {
          await loadProfile();

          const [
            experiences,
            education,
            research,
            publications,
            achievements,
            skills,
            certifications
          ] = await Promise.all([
            getCollection("experiences"),
            getCollection("education"),
            getCollection("research"),
            getCollection("publications"),
            getCollection("achievements"),
            getCollection("skills"),
            getCollection("certifications")
          ]);

          renderExperience(experiences);
          renderEducation(education);
          renderResearch(research);
          renderPublications(publications);
          renderAchievements(achievements);
          renderSkills(skills);
          renderCertifications(certifications);

          // Update dynamic publication counter if present
          if (publications.length > 0 && (!currentProfile || !currentProfile.stat_2_value)) {
            const stat2Val = document.getElementById("stat2Value");
            if (stat2Val) stat2Val.textContent = publications.length;
          }
        } catch (error) {
          console.error("loadWebsite execution notice:", error);
        }
      }

      /* ======================================================
         AUTHENTICATION & AUTHORIZATION
      ====================================================== */

      onAuthStateChanged(auth, async user => {
        currentUser = user || null;

        if (!user) {
          isOwner = false;
          if (ownerLoginBtn) {
            ownerLoginBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Owner Login';
          }
          return;
        }

        try {
          const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
          const adminData = adminSnapshot.exists() ? adminSnapshot.data() : null;

          if (
            adminData &&
            adminData.role === "owner" &&
            (adminData.active === undefined || adminData.active === true)
          ) {
            isOwner = true;
            if (ownerLoginBtn) {
              ownerLoginBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i> Owner Panel';
            }
          } else {
            isOwner = false;
            await signOut(auth);
            showToast("This account is not authorized as the profile owner.", "error");
          }
        } catch (error) {
          console.error("Owner authorization check error:", error);
          isOwner = false;
        }
      });

      /* ======================================================
         OWNER LOGIN BUTTON
      ====================================================== */

      if (ownerLoginBtn) {
        ownerLoginBtn.addEventListener("click", () => {
          if (isOwner) {
            openAdmin();
          } else {
            openModal(loginModal);
          }
        });
      }

      /* ======================================================
         LOGIN FORM
      ====================================================== */

      if (loginForm) {
        loginForm.addEventListener("submit", async event => {
          event.preventDefault();

          const emailInput = document.getElementById("loginEmail");
          const passwordInput = document.getElementById("loginPassword");
          const submit = document.getElementById("loginSubmit");

          if (!emailInput || !passwordInput || !submit) return;

          const email = emailInput.value.trim();
          const password = passwordInput.value;

          submit.disabled = true;
          submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user) {
              throw new Error("Authentication failed.");
            }

            const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
            const adminData = adminSnapshot.exists() ? adminSnapshot.data() : null;

            if (
              !adminData ||
              adminData.role !== "owner" ||
              adminData.active === false
            ) {
              await signOut(auth);
              throw new Error("You are not authorized as the profile owner.");
            }

            isOwner = true;
            closeModal(loginModal);
            loginForm.reset();
            showToast("Welcome back, profile owner.");
            openAdmin();
          } catch (error) {
            console.error("Login error:", error);
            showToast(getFirebaseError(error), "error");
          } finally {
            submit.disabled = false;
            submit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
          }
        });
      }

      /* ======================================================
         LOGOUT
      ====================================================== */

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
          try {
            await signOut(auth);
            isOwner = false;
            closeModal(adminModal);
            showToast("You have been logged out.");
          } catch (error) {
            showToast("Logout failed.", "error");
          }
        });
      }

      /* ======================================================
         OPEN ADMIN DASHBOARD
      ====================================================== */

      async function openAdmin() {
        if (!isOwner) {
          openModal(loginModal);
          return;
        }

        openModal(adminModal);
        await loadAdminProfile();
        switchAdminTab("profile");
      }

      /* ======================================================
         ADMIN TABS
      ====================================================== */

      document.querySelectorAll("[data-admin-tab]").forEach(button => {
        button.addEventListener("click", () => {
          switchAdminTab(button.dataset.adminTab);
        });
      });

      function switchAdminTab(tab) {
        document.querySelectorAll(".admin-tab").forEach(button => {
          button.classList.toggle("active", button.dataset.adminTab === tab);
        });

        document.querySelectorAll(".admin-section").forEach(section => {
          section.classList.remove("active");
        });

        if (tab === "profile") {
          const profileSec = document.getElementById("adminProfileSection");
          if (profileSec) profileSec.classList.add("active");
          return;
        }

        if (tab === "account") {
          const accountSec = document.getElementById("adminAccountSection");
          if (accountSec) accountSec.classList.add("active");
          const ownerEmailSpan = document.getElementById("ownerEmail");
          if (ownerEmailSpan) {
            ownerEmailSpan.textContent = currentUser?.email || "-";
          }
          return;
        }

        activeCollection = tab;
        const colSection = document.getElementById("adminCollectionSection");
        if (colSection) colSection.classList.add("active");
        renderAdminCollection(tab);
      }

      /* ======================================================
         LOAD ADMIN PROFILE
      ====================================================== */

      async function loadAdminProfile() {
        if (!profileForm) return;

        try {
          const snapshot = await getDoc(doc(db, "profile", "main"));
          if (!snapshot.exists()) {
            currentProfile = {};
            profileForm.reset();
            return;
          }

          currentProfile = snapshot.data();
          const fields = profileForm.querySelectorAll("[name]");
          fields.forEach(field => {
            field.value = currentProfile[field.name] || "";
          });

          if (adminImagePreview) {
            adminImagePreview.src = currentProfile.hero_image_url || "photo.jpg";
          }
        } catch (error) {
          console.warn("loadAdminProfile error:", error);
        }
      }

      /* ======================================================
         PROFILE IMAGE PREVIEW
      ====================================================== */

      if (profileImage && adminImagePreview) {
        profileImage.addEventListener("change", () => {
          const file = profileImage.files[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            showToast("Please select an image file.", "error");
            profileImage.value = "";
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            showToast("Image must be smaller than 5 MB.", "error");
            profileImage.value = "";
            return;
          }

          const reader = new FileReader();
          reader.onload = event => {
            adminImagePreview.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      /* ======================================================
         SAVE PROFILE
      ====================================================== */

      if (profileForm) {
        profileForm.addEventListener("submit", async event => {
          event.preventDefault();

          if (!isOwner) {
            showToast("Owner authorization required.", "error");
            return;
          }

          const submit = profileForm.querySelector(".save-btn");
          if (submit) {
            submit.disabled = true;
            submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
          }

          try {
            const formData = new FormData(profileForm);
            const data = {
              id: "main",
              full_name: formData.get("full_name") || "",
              short_name: formData.get("short_name") || "",
              role: formData.get("role") || "",
              role_line: formData.get("role_line") || "",
              department: formData.get("department") || "",
              institution: formData.get("institution") || "",
              location: formData.get("location") || "",
              phone: formData.get("phone") || "",
              linkedin_url: formData.get("linkedin_url") || "",
              hero_label: formData.get("hero_label") || "",
              description: formData.get("description") || "",
              about_title: formData.get("about_title") || "",
              about_text: formData.get("about_text") || "",
              stat_1_value: formData.get("stat_1_value") || "",
              stat_1_label: formData.get("stat_1_label") || "",
              stat_2_value: formData.get("stat_2_value") || "",
              stat_2_label: formData.get("stat_2_label") || "",
              stat_3_value: formData.get("stat_3_value") || "",
              stat_3_label: formData.get("stat_3_label") || ""
            };

            let imageURL = currentProfile?.hero_image_url || "photo.jpg";
            const file = profileImage?.files?.[0];

            if (file) {
              try {
                const extension = file.name.split(".").pop().toLowerCase();
                const fileName = `profile-${Date.now()}.${extension}`;
                const imageRef = ref(storage, `profile-images/${currentUser.uid}/${fileName}`);
                await uploadBytes(imageRef, file);
                imageURL = await getDownloadURL(imageRef);
              } catch (storageErr) {
                console.warn("Storage upload notice:", storageErr.message);
                showToast("Could not upload to Storage. Saving profile with previous image.", "error");
              }
            }

            data.hero_image_url = imageURL;

            await setDoc(doc(db, "profile", "main"), data, { merge: true });
            currentProfile = data;
            renderProfile(data);
            showToast("Profile updated successfully.");
          } catch (error) {
            console.error("Profile save error:", error);
            showToast(getFirebaseError(error), "error");
          } finally {
            if (submit) {
              submit.disabled = false;
              submit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Profile';
            }
          }
        });
      }

      /* ======================================================
         ADD COLLECTION BUTTON
      ====================================================== */

      if (addCollectionBtn) {
        addCollectionBtn.addEventListener("click", () => {
          if (!activeCollection) return;
          openEditor(activeCollection);
        });
      }

      /* ======================================================
         RENDER ADMIN COLLECTION
      ====================================================== */

      async function renderAdminCollection(collectionName) {
        const config = COLLECTIONS[collectionName];
        if (!config || !adminCollectionList) return;

        if (collectionTitle) collectionTitle.textContent = config.title;
        if (collectionEyebrow) collectionEyebrow.textContent = "CONTENT MANAGEMENT";

        adminCollectionList.innerHTML = `<div class="admin-item">Loading ${config.title}...</div>`;

        const items = await getCollection(collectionName);

        if (!items.length) {
          adminCollectionList.innerHTML = `
            <div class="admin-item">
              <div class="admin-item-info">
                <strong>No content yet</strong>
                <span>Click "Add New" to create your first item.</span>
              </div>
            </div>
          `;
          return;
        }

        adminCollectionList.innerHTML = items.map(item => {
          const title = item.title || item.name || item.degree || item.full_name || "Untitled";
          let subtitle = "";

          if (collectionName === "publications") {
            subtitle = `${item.year || "—"} · ${item.publication_type || "Publication"}`;
          } else if (collectionName === "experiences") {
            subtitle = `${item.organization || ""} · ${item.start_date || ""} - ${item.end_date || "Present"}`;
          } else if (collectionName === "education") {
            subtitle = `${item.institution || ""} · ${item.period || ""}`;
          } else if (collectionName === "skills") {
            subtitle = item.category || "Skill";
          } else if (collectionName === "certifications") {
            subtitle = `${item.issuer || "Certificate"} ${item.issue_date ? `· ${item.issue_date}` : ""}`;
          } else {
            subtitle = item.value || item.description || "";
          }

          return `
            <div class="admin-item">
              <div class="admin-item-info">
                <strong>${escapeHTML(title)}</strong>
                <span>${escapeHTML(subtitle)}</span>
              </div>
              <div class="admin-item-actions">
                <button class="edit-btn" data-action="edit" data-id="${item.id}" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" data-action="delete" data-id="${item.id}" title="Delete">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          `;
        }).join("");

        adminCollectionList.querySelectorAll("[data-action]").forEach(button => {
          button.addEventListener("click", async () => {
            const id = button.dataset.id;
            if (button.dataset.action === "edit") {
              await editCollectionItem(collectionName, id);
            }
            if (button.dataset.action === "delete") {
              await deleteCollectionItem(collectionName, id);
            }
          });
        });
      }

      /* ======================================================
         OPEN EDITOR MODAL
      ====================================================== */

      async function openEditor(collectionName, item = null) {
        const config = COLLECTIONS[collectionName];
        if (!config || !editorFields || !editorTitle) return;

        activeCollection = collectionName;
        editingDocumentId = item?.id || null;

        editorTitle.textContent = item ? `Edit ${config.title}` : `Add ${config.title}`;

        editorFields.innerHTML = config.fields.map(field => {
          const value = item?.[field.name] ?? "";
          const inputType = field.type === "number" ? "number" : field.type === "url" ? "url" : "text";

          if (field.type === "textarea") {
            return `
              <label class="${["description", "abstract", "title", "authors"].includes(field.name) ? "full-field" : ""}">
                ${escapeHTML(field.label)}
                <textarea
                  name="${escapeHTML(field.name)}"
                  rows="${field.name === "abstract" ? 6 : 4}"
                  ${field.required ? "required" : ""}
                >${escapeHTML(value)}</textarea>
              </label>
            `;
          }

          return `
            <label>
              ${escapeHTML(field.label)}
              <input
                type="${inputType}"
                name="${escapeHTML(field.name)}"
                value="${escapeHTML(value)}"
                ${field.required ? "required" : ""}
              >
            </label>
          `;
        }).join("");

        openModal(editorModal);
      }

      /* ======================================================
         EDIT ITEM
      ====================================================== */

      async function editCollectionItem(collectionName, id) {
        try {
          const snapshot = await getDoc(doc(db, collectionName, id));
          if (!snapshot.exists()) {
            showToast("Record not found.", "error");
            return;
          }
          openEditor(collectionName, { id, ...snapshot.data() });
        } catch (error) {
          console.error("Edit item load error:", error);
          showToast(getFirebaseError(error), "error");
        }
      }

      /* ======================================================
         SAVE ITEM
      ====================================================== */

      if (editorForm) {
        editorForm.addEventListener("submit", async event => {
          event.preventDefault();

          if (!isOwner) {
            showToast("Owner authorization required.", "error");
            return;
          }

          const config = COLLECTIONS[activeCollection];
          if (!config) return;

          const formData = new FormData(editorForm);
          const data = {};

          config.fields.forEach(field => {
            let value = formData.get(field.name);
            if (field.type === "number") {
              value = (value === "" || value === null) ? null : Number(value);
            } else if (field.type === "url" && value) {
              value = String(value).trim();
            } else if (typeof value === "string") {
              value = value.trim();
            }
            data[field.name] = value;
          });

          // Prevent accidental duplicate skill names
          if (activeCollection === "skills") {
            const existingSkills = await getCollection("skills");
            const newName = String(data.name || "").trim().toLowerCase();
            const duplicate = existingSkills.find(
              s => s.id !== editingDocumentId && String(s.name || "").trim().toLowerCase() === newName
            );
            if (duplicate) {
              showToast(`Skill "${data.name}" already exists.`, "error");
              return;
            }
          }

          const submit = editorForm.querySelector(".save-btn");
          if (submit) {
            submit.disabled = true;
            submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
          }

          try {
            if (editingDocumentId) {
              await updateDoc(doc(db, activeCollection, editingDocumentId), data);
              showToast("Updated successfully.");
            } else {
              await addDoc(collection(db, activeCollection), data);
              showToast("Added successfully.");
            }

            closeModal(editorModal);
            await renderAdminCollection(activeCollection);
            await loadWebsite();
          } catch (error) {
            console.error("Collection item save error:", error);
            showToast(getFirebaseError(error), "error");
          } finally {
            if (submit) {
              submit.disabled = false;
              submit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
            }
          }
        });
      }

      /* ======================================================
         DELETE ITEM
      ====================================================== */

      async function deleteCollectionItem(collectionName, id) {
        const confirmed = confirm("Are you sure you want to delete this record? This action cannot be undone.");
        if (!confirmed) return;

        try {
          await deleteDoc(doc(db, collectionName, id));
          showToast("Deleted successfully.");
          await renderAdminCollection(collectionName);
          await loadWebsite();
        } catch (error) {
          console.error("Delete error:", error);
          showToast(getFirebaseError(error), "error");
        }
      }

      /* ======================================================
         CHANGE PASSWORD
      ====================================================== */

      if (passwordForm) {
        passwordForm.addEventListener("submit", async event => {
          event.preventDefault();

          const password = document.getElementById("newPassword").value;
          const confirmPassword = document.getElementById("confirmPassword").value;

          if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
          }

          if (password.length < 6) {
            showToast("Password must contain at least 6 characters.", "error");
            return;
          }

          try {
            await updatePassword(currentUser, password);
            passwordForm.reset();
            showToast("Password changed successfully.");
          } catch (error) {
            console.error("Change password error:", error);
            if (error.code === "auth/requires-recent-login") {
              showToast("For security, please log out and log back in before changing your password.", "error");
            } else {
              showToast(getFirebaseError(error), "error");
            }
          }
        });
      }

      /* ======================================================
         1-CLICK PDF DATA IMPORT INTO FIRESTORE
      ====================================================== */

      if (btnImportPdfData) {
        btnImportPdfData.addEventListener("click", async () => {
          if (!isOwner) {
            showToast("Owner authorization required to import data.", "error");
            return;
          }

          const confirmed = confirm(
            "Import verified PDF portfolio data into Firestore?\n\n" +
            "This will populate Profile, Experience, Education, Skills, Certifications, Publications, and Research using deterministic IDs. It is safe to run multiple times without creating duplicates."
          );
          if (!confirmed) return;

          btnImportPdfData.disabled = true;
          btnImportPdfData.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Importing Data...';
          if (importStatus) {
            importStatus.style.display = "block";
            importStatus.style.color = "var(--navy)";
            importStatus.textContent = "Importing verified data into Firestore...";
          }

          try {
            let count = 0;

            // 1. Profile
            await setDoc(doc(db, "profile", "main"), VERIFIED_PDF_DATA.profile, { merge: true });
            count++;

            // 2. Experiences
            for (const exp of VERIFIED_PDF_DATA.experiences) {
              await setDoc(doc(db, "experiences", exp.id), exp, { merge: true });
              count++;
            }

            // 3. Education
            for (const edu of VERIFIED_PDF_DATA.education) {
              await setDoc(doc(db, "education", edu.id), edu, { merge: true });
              count++;
            }

            // 4. Skills
            for (const skill of VERIFIED_PDF_DATA.skills) {
              await setDoc(doc(db, "skills", skill.id), skill, { merge: true });
              count++;
            }

            // 5. Certifications
            for (const cert of VERIFIED_PDF_DATA.certifications) {
              await setDoc(doc(db, "certifications", cert.id), cert, { merge: true });
              count++;
            }

            // 6. Publications
            for (const pub of VERIFIED_PDF_DATA.publications) {
              await setDoc(doc(db, "publications", pub.id), pub, { merge: true });
              count++;
            }

            // 7. Research
            for (const res of VERIFIED_PDF_DATA.research) {
              await setDoc(doc(db, "research", res.id), res, { merge: true });
              count++;
            }

            if (importStatus) {
              importStatus.style.color = "var(--success)";
              importStatus.textContent = `✓ Successfully imported ${count} documents into Firestore.`;
            }

            showToast("Verified PDF portfolio data imported successfully!");
            await loadAdminProfile();
            await loadWebsite();
          } catch (err) {
            console.error("Import error:", err);
            if (importStatus) {
              importStatus.style.color = "var(--danger)";
              importStatus.textContent = `Import error: ${err.message}`;
            }
            showToast(getFirebaseError(err), "error");
          } finally {
            btnImportPdfData.disabled = false;
            btnImportPdfData.innerHTML = '<i class="fa-solid fa-file-import"></i> Re-import PDF Data';
          }
        });
      }

      /* ======================================================
         CLOSE MODALS
      ====================================================== */

      document.querySelectorAll("[data-close]").forEach(button => {
        button.addEventListener("click", () => {
          const id = button.dataset.close;
          closeModal(document.getElementById(id));
        });
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          closeModal(loginModal);
          closeModal(editorModal);
          closeModal(adminModal);
        }
      });

      /* ======================================================
         VIEW SITE BUTTON
      ====================================================== */

      const adminViewSite = document.getElementById("adminViewSite");
      if (adminViewSite) {
        adminViewSite.addEventListener("click", () => {
          closeModal(adminModal);
          showView("home");
        });
      }

      /* ======================================================
         FIREBASE ERROR MESSAGES
      ====================================================== */

      function getFirebaseError(error) {
        const code = error?.code || "";

        if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
          return "Invalid email or password.";
        }
        if (code.includes("auth/invalid-email")) {
          return "Please enter a valid email address.";
        }
        if (code.includes("auth/too-many-requests")) {
          return "Too many attempts. Please try again in a few moments.";
        }
        if (code.includes("permission-denied")) {
          return "Permission denied. Check Firestore security rules and owner permissions.";
        }
        if (code.includes("storage/unauthorized")) {
          return "You are not authorized to upload this image.";
        }
        if (code.includes("auth/requires-recent-login")) {
          return "Please log out and log back in before making this change.";
        }

        return error?.message || "An unexpected error occurred.";
      }

      /* ======================================================
         INITIAL LOAD
      ====================================================== */

      loadWebsite();

    };

    // Run initialization
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializePortfolioDOM, { once: true });
    } else {
      initializePortfolioDOM();
    }

  } catch (error) {
    console.error("Firebase module loading failed:", error);
  }
})();
