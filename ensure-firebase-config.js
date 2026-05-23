import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.join(__dirname, 'src', 'firebase-applet-config.json');

if (!fs.existsSync(targetPath)) {
  console.log('Firebase applet config not found. Creating placeholder config for compilation...');
  const placeholderConfig = {
    apiKey: "mock-api-key",
    authDomain: "mock-auth-domain",
    projectId: "mock-applet",
    storageBucket: "mock-storage-bucket",
    messagingSenderId: "mock-messaging-sender-id",
    appId: "mock-app-id",
    firestoreDatabaseId: "(default)"
  };
  fs.writeFileSync(targetPath, JSON.stringify(placeholderConfig, null, 2), 'utf-8');
  console.log('Placeholder config created successfully.');
} else {
  console.log('Firebase applet config already exists.');
}
