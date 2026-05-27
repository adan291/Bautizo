import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8_H6VuNDpW-F-APQOwLGVCltjaPVL5OA",
  authDomain: "liambautizo-d4d42.firebaseapp.com",
  projectId: "liambautizo-d4d42",
  storageBucket: "liambautizo-d4d42.firebasestorage.app",
  messagingSenderId: "263988039159",
  appId: "1:263988039159:web:1f8051be13be20bfec32f2",
  measurementId: "G-J8RLBV63G6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
