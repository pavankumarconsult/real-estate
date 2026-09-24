import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase web configuration is intentionally public and scoped to browser
// authentication. Privileged service-account credentials remain server-only.
const firebaseConfig = {
  apiKey: 'AIzaSyAqdZxPVka7J25KIZMGS97WvQYvZhbSpdI',
  authDomain: 'team4aria-77f44.firebaseapp.com',
  projectId: 'team4aria-77f44',
  storageBucket: 'team4aria-77f44.firebasestorage.app',
  messagingSenderId: '504095085016',
  appId: '1:504095085016:web:fce6f3adea9036026ea2ad',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const adminAuth = getAuth(firebaseApp);
