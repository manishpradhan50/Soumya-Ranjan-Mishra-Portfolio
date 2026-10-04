/**
 * Secure Firebase Admin SDK Import Script for Soumya Ranjan Mishra Academic Portfolio
 * 
 * Usage:
 *   node import-data-admin.js [path/to/serviceAccountKey.json] [--dry-run]
 * 
 * Example:
 *   node import-data-admin.js --dry-run
 *   node import-data-admin.js ./serviceAccountKey.json
 * 
 * Requirements for Live Import:
 *   npm install firebase-admin
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORTFOLIO_DATA } from './portfolio-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');
const keyPathArg = args.find(a => !a.startsWith('-'));

const keyPath = keyPathArg || process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('='.repeat(65));
console.log('  ACADEMIC PORTFOLIO FIRESTORE IMPORT SCRIPT');
console.log('  Target Project: soumya-ranjan-portfolio');
console.log(`  Mode: ${isDryRun ? 'DRY-RUN (Preview Only, No Database Writes)' : 'LIVE IMPORT (Writing to Firestore)'}`);
console.log('='.repeat(65));

if (!keyPath && !isDryRun) {
  console.log('\n[INFO] No serviceAccountKey.json provided.');
  console.log('To run live database import with administrative credentials:');
  console.log('  1. Go to Firebase Console -> Project Settings -> Service Accounts');
  console.log('  2. Click "Generate new private key"');
  console.log('  3. Save the file locally as "serviceAccountKey.json" (DO NOT commit to git!)');
  console.log('  4. Run: npm install firebase-admin');
  console.log('  5. Run: node import-data-admin.js ./serviceAccountKey.json\n');
  console.log('To preview the import data without writing to database:');
  console.log('  node import-data-admin.js --dry-run\n');
  process.exit(1);
}

let db = null;

async function initAdmin() {
  if (isDryRun) return;

  const resolvedKeyPath = path.resolve(process.cwd(), keyPath);
  if (!fs.existsSync(resolvedKeyPath)) {
    console.error(`\n[ERROR] Service account file not found at: ${resolvedKeyPath}`);
    process.exit(1);
  }

  try {
    const adminModule = await import('firebase-admin');
    const admin = adminModule.default;
    const serviceAccount = JSON.parse(fs.readFileSync(resolvedKeyPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'soumya-ranjan-portfolio'
    });

    db = admin.firestore();
    console.log(`\n[INFO] Connected to Firestore project: ${serviceAccount.project_id}`);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      console.error('\n[ERROR] "firebase-admin" package is not installed.');
      console.error('Run: npm install firebase-admin');
      console.error('Then run this script again.\n');
    } else {
      console.error('\n[ERROR] Failed to initialize Firebase Admin:', err.message);
    }
    process.exit(1);
  }
}

async function runImport() {
  await initAdmin();

  const summary = {
    profile: 0,
    experiences: 0,
    education: 0,
    skills: 0,
    certifications: 0,
    publications: 0,
    research: 0,
    achievements: 0,
    errors: 0
  };

  try {
    // 1. Profile
    console.log('\n--- 1. Profile ---');
    const profile = PORTFOLIO_DATA.profile;
    console.log(`  Target: profile/main (${profile.full_name}, ${profile.role})`);
    if (!isDryRun) {
      await db.collection('profile').doc('main').set(profile, { merge: true });
    }
    summary.profile++;
    console.log('  ✓ Profile queued/written successfully.');

    // 2. Experiences
    console.log(`\n--- 2. Professional Experiences (${PORTFOLIO_DATA.experiences.length} records) ---`);
    for (const exp of PORTFOLIO_DATA.experiences) {
      console.log(`  [experiences/${exp.id}] ${exp.title} at ${exp.organization} (${exp.start_date} - ${exp.end_date})`);
      if (!isDryRun) {
        await db.collection('experiences').doc(exp.id).set(exp, { merge: true });
      }
      summary.experiences++;
    }
    console.log(`  ✓ ${summary.experiences} experience records processed.`);

    // 3. Education
    console.log(`\n--- 3. Education (${PORTFOLIO_DATA.education.length} records) ---`);
    for (const edu of PORTFOLIO_DATA.education) {
      console.log(`  [education/${edu.id}] ${edu.degree} - ${edu.institution} (${edu.period})`);
      if (!isDryRun) {
        await db.collection('education').doc(edu.id).set(edu, { merge: true });
      }
      summary.education++;
    }
    console.log(`  ✓ ${summary.education} education records processed.`);

    // 4. Skills
    console.log(`\n--- 4. Skills (${PORTFOLIO_DATA.skills.length} records) ---`);
    for (const skill of PORTFOLIO_DATA.skills) {
      console.log(`  [skills/${skill.id}] ${skill.name} (${skill.category})`);
      if (!isDryRun) {
        await db.collection('skills').doc(skill.id).set(skill, { merge: true });
      }
      summary.skills++;
    }
    console.log(`  ✓ ${summary.skills} skills processed.`);

    // 5. Certifications
    console.log(`\n--- 5. Certifications (${PORTFOLIO_DATA.certifications.length} records) ---`);
    for (const cert of PORTFOLIO_DATA.certifications) {
      console.log(`  [certifications/${cert.id}] ${cert.title}`);
      if (!isDryRun) {
        await db.collection('certifications').doc(cert.id).set(cert, { merge: true });
      }
      summary.certifications++;
    }
    console.log(`  ✓ ${summary.certifications} certifications processed.`);

    // 6. Publications
    console.log(`\n--- 6. Publications (${PORTFOLIO_DATA.publications.length} records) ---`);
    for (const pub of PORTFOLIO_DATA.publications) {
      console.log(`  [publications/${pub.id}] "${pub.title}"`);
      if (!isDryRun) {
        await db.collection('publications').doc(pub.id).set(pub, { merge: true });
      }
      summary.publications++;
    }
    console.log(`  ✓ ${summary.publications} publications processed.`);

    // 7. Research
    console.log(`\n--- 7. Research Interests (${PORTFOLIO_DATA.research.length} records) ---`);
    for (const res of PORTFOLIO_DATA.research) {
      console.log(`  [research/${res.id}] ${res.title}`);
      if (!isDryRun) {
        await db.collection('research').doc(res.id).set(res, { merge: true });
      }
      summary.research++;
    }
    console.log(`  ✓ ${summary.research} research areas processed.`);

    // 8. Achievements
    console.log(`\n--- 8. Achievements (${PORTFOLIO_DATA.achievements.length} records) ---`);
    console.log('  (No achievements in PDF; section preserved empty and editable in dashboard)');

  } catch (error) {
    console.error('\n[FATAL ERROR during import]:', error);
    summary.errors++;
  }

  console.log('\n' + '='.repeat(65));
  console.log('  IMPORT SUMMARY:');
  console.log(`  - Profile:         ${summary.profile} doc`);
  console.log(`  - Experiences:     ${summary.experiences} docs`);
  console.log(`  - Education:       ${summary.education} docs`);
  console.log(`  - Skills:          ${summary.skills} docs`);
  console.log(`  - Certifications:  ${summary.certifications} docs`);
  console.log(`  - Publications:    ${summary.publications} docs`);
  console.log(`  - Research:        ${summary.research} docs`);
  console.log(`  - Total Processed: ${summary.profile + summary.experiences + summary.education + summary.skills + summary.certifications + summary.publications + summary.research} docs`);
  console.log(`  - Errors:          ${summary.errors}`);
  console.log(`  - Status:          ${isDryRun ? 'DRY-RUN COMPLETE (No DB changes)' : 'IMPORT FINISHED SUCCESSFULLY'}`);
  console.log('='.repeat(65) + '\n');
}

runImport();
