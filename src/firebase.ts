import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqHIFgPRoJUY7EnoO9MWjQQKMXgcSqfg4",
  authDomain: "gen-lang-client-0815952933.firebaseapp.com",
  projectId: "gen-lang-client-0815952933",
  storageBucket: "gen-lang-client-0815952933.firebasestorage.app",
  messagingSenderId: "1040039299926",
  appId: "1:1040039299926:web:7074d2ce8be11bb75c64f7"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
