import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load config from .env or src/firebase-applet-config.json
let firebaseConfig = {};

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index > -1) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY) {
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  };
} else {
  // Try reading json file
  const jsonPath = path.join(__dirname, 'src', 'firebase-applet-config.json');
  if (fs.existsSync(jsonPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Error: Could not find valid Firebase configuration in .env or src/firebase-applet-config.json");
  process.exit(1);
}

console.log("Initializing Firebase with project ID:", firebaseConfig.projectId);

// 2. Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Define users document data
const usersDocumentData = {
  userEmails: ["aliyusahmad2020@gmail.com"],
  superAdminEmails: ["aliyusahmad2020@gmail.com"],
  blockedEmails: [],
  users: [
    {
      email: "aliyusahmad2020@gmail.com",
      role: "super-admin",
      blocked: false,
      password: "Update@26"
    }
  ]
};

async function createConfigUsersDocument() {
  try {
    const configUsersDocRef = doc(db, 'config', 'users');
    await setDoc(configUsersDocRef, usersDocumentData);
    console.log("SUCCESS: Document '/config/users' successfully written to Firestore database!");
    process.exit(0);
  } catch (e) {
    console.error("FAIL: Error writing document to Firestore: ", e);
    process.exit(1);
  }
}

createConfigUsersDocument();
