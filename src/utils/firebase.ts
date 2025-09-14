import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

// Firebase configuration for client SDK
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth();

export { firebase, auth };
export type { Auth };
