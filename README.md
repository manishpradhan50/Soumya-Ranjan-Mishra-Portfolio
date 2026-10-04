# Academic Portfolio of Soumya Ranjan Mishra

A complete, responsive, dynamic academic portfolio website powered by **Firebase Cloud Firestore**, **Firebase Authentication**, **Firebase Storage**, and hosted on **Vercel**.

## 📌 Profile Overview
- **Name:** Mr. Soumya Ranjan Mishra
- **Designation:** Assistant Professor
- **Institution:** GIET University, Gunupur
- **Department:** Computer Applications
- **Location:** Berhampur & Gunupur, Odisha, India
- **Research Areas:** Machine Learning, Deep Learning, Artificial Intelligence, Healthcare Diagnostics

---

## 🚀 Key Features

1. **Fully Database-Driven Public Frontend:**
   - Profile information, professional experiences, education history, research interests, publications, skills, and certifications are dynamically retrieved from Cloud Firestore and rendered safely.
   - Clean empty-state handling if database collections are empty or loading.
   - XSS sanitization and URL validation for external links.

2. **Secure Profile Owner Dashboard:**
   - Owner authentication via Firebase Auth (Email/Password).
   - Strict authorization check against the Firestore `admins/{uid}` collection (`role: "owner"`).
   - Full CRUD (Create, Read, Update, Delete) management for:
     - Profile details & statistics
     - Professional Experiences
     - Education records
     - Research areas
     - Publications
     - Achievements
     - Skills (with duplicate name detection)
     - Certifications
     - Password change
   - Profile photo upload with Firebase Storage.

3. **Deterministic & Repeatable PDF Data Importer:**
   - Verified data extracted directly from `Profile.pdf`.
   - **Method A:** 1-Click Import directly inside the Owner Dashboard (under "Account" tab).
   - **Method B:** Standalone Web Utility at `import-data.html`.
   - **Method C:** Node.js Admin script (`import-data-admin.js`) using Firebase Admin SDK.
   - All imports use deterministic document IDs (`main`, `exp-1` to `exp-8`, `edu-1` to `edu-3`, `skill-1` to `skill-3`, `cert-1` to `cert-4`, `pub-1` to `pub-5`, `res-1`, `res-2`) ensuring **zero duplicate records** upon repeated executions.

---

## 🗄️ Firestore Database Schema

| Collection | Document ID | Key Fields |
| :--- | :--- | :--- |
| **`admins`** | `{owner_uid}` | `role: "owner"`, `active: true`, `email: string` |
| **`profile`** | `main` | `full_name`, `short_name`, `prefix`, `role`, `role_line`, `department`, `institution`, `location`, `phone`, `linkedin_url`, `hero_label`, `description`, `about_title`, `about_text`, `stat_1_value`, `stat_1_label`, `stat_2_value`, `stat_2_label`, `stat_3_value`, `stat_3_label`, `hero_image_url` |
| **`experiences`** | `exp-1` ... `exp-8` | `sort_order`, `title`, `organization`, `start_date`, `end_date`, `location`, `description`, `tags` |
| **`education`** | `edu-1` ... `edu-3` | `sort_order`, `degree`, `field`, `institution`, `period`, `location`, `description` |
| **`skills`** | `skill-1` ... `skill-3` | `sort_order`, `name`, `category` |
| **`certifications`**| `cert-1` ... `cert-4` | `sort_order`, `title`, `issuer`, `issue_date`, `credential_id`, `credential_url`, `description` |
| **`publications`** | `pub-1` ... `pub-5` | `sort_order`, `year`, `publication_type`, `title`, `authors`, `journal_or_book`, `volume_issue`, `pages`, `doi`, `url`, `abstract`, `tags` |
| **`research`** | `res-1`, `res-2` | `sort_order`, `title`, `icon`, `description` |
| **`achievements`** | auto/custom | `sort_order`, `title`, `value`, `description`, `link_url` |

---

## 🛡️ Security Rules

### Firestore Security Rules (`firestore.rules`)
- **Public Read (`allow read: if true`)**: All public portfolio collections (`profile`, `experiences`, `education`, `research`, `publications`, `achievements`, `skills`, `certifications`).
- **Owner Write (`allow write: if isOwner()`)**: Restricted to authenticated users whose UID exists in `/admins/{uid}` with `role: "owner"` and `active != false`.
- **Admin Collection Protection**: `/admins/{userId}` can only be read by the owner themselves (`request.auth.uid == userId`) and cannot be created, modified, or deleted by any client SDK.
- **Default Deny**: All other collections and paths default to `allow read, write: if false`.

### Firebase Storage Rules (`storage.rules`)
- **Public Read**: Anyone can read images under `/profile-images/**`.
- **Owner Write**: Only authenticated owners can upload images under `/profile-images/{userId}/**`, restricted to `< 5MB` and valid `image/*` MIME types.

---

## 📥 How to Import Verified PDF Data

### Option 1: One-Click from Owner Dashboard (Recommended)
1. Open the website and click **Owner Login**.
2. Sign in with your owner credentials.
3. In the sidebar, select **Account**.
4. Click **Import Verified PDF Data**.
5. All 26 documents will be imported into Firestore and reflected immediately across the site.

### Option 2: Browser Importer Tool (`import-data.html`)
1. Open `import-data.html` in your browser.
2. Enter your owner email and password and click **Authenticate**.
3. Review the preview table and click **Execute Live Import to Firestore**.

### Option 3: Local Node.js Script (`import-data-admin.js`)
1. Preview the import data without database writes:
   ```bash
   node import-data-admin.js --dry-run
   ```
2. For live administrative import:
   - Download `serviceAccountKey.json` from Firebase Console -> Project Settings -> Service Accounts.
   - Run:
     ```bash
     npm install firebase-admin
     node import-data-admin.js ./serviceAccountKey.json
     ```

---

## 🚢 Deployment to GitHub & Vercel

### Step 1: Commit and Push Changes to GitHub
```bash
git add .
git commit -m "feat: complete academic portfolio with Firestore CRUD, PDF import, and security rules"
git push origin main
```

### Step 2: Vercel Deployment
Vercel is already linked to your GitHub repository `origin/main`. Once pushed:
1. Vercel automatically deploys the updated static files.
2. Verify the live site URL provided by Vercel.
3. Ensure the Vercel domain (e.g. `*.vercel.app`) is added to **Firebase Authentication -> Settings -> Authorized domains**.

---

## ⚙️ Remaining Manual Steps in Firebase Console

1. **Deploy Firestore Rules:**
   - Open [Firebase Console](https://console.firebase.google.com/) -> Project `soumya-ranjan-portfolio`.
   - Go to **Firestore Database** -> **Rules**.
   - Paste the contents of `firestore.rules` and click **Publish**.

2. **Deploy Storage Rules (if using image uploads):**
   - Go to **Storage** -> **Rules**.
   - Paste the contents of `storage.rules` and click **Publish**.

3. **Verify Admin Document in Firestore:**
   - In **Firestore Database** -> **Data**, check the `admins` collection.
   - Ensure a document exists whose ID is the owner's Firebase Auth `UID`.
   - Document fields must contain:
     ```json
     {
       "role": "owner",
       "active": true
     }
     ```