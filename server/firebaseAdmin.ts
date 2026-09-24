import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const EXPECTED_FIREBASE_PROJECT_ID = 'team4aria-77f44';

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

function getFirebaseApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) {
    if (existingApp.options.projectId !== EXPECTED_FIREBASE_PROJECT_ID) {
      throw new Error('The initialized Firebase project does not match Team4 Aria.');
    }
    return existingApp;
  }

  const projectId = requiredEnvironmentValue('FIREBASE_PROJECT_ID');
  if (projectId !== EXPECTED_FIREBASE_PROJECT_ID) {
    throw new Error('The configured Firebase project does not match Team4 Aria.');
  }
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST?.trim();

  if (emulatorHost) return initializeApp({ projectId });

  const clientEmail = requiredEnvironmentValue('FIREBASE_CLIENT_EMAIL');
  const privateKey = requiredEnvironmentValue('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  if (!clientEmail.endsWith(`@${projectId}.iam.gserviceaccount.com`)) {
    throw new Error('The Firebase service account does not belong to the configured project.');
  }
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error('The Firebase private key is malformed.');
  }

  return initializeApp({
    projectId,
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
