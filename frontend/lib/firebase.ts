import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Check if we're in demo mode
export const DEMO_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key" ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo-project"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Initialize Firebase
let app
let auth
let db

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

  if (!DEMO_MODE) {
    // Only initialize Firebase services if not in demo mode
    auth = getAuth(app)
    db = getFirestore(app)
  } else {
    // Create mock objects for demo mode
    auth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
    } as any
    db = {} as any
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create fallback objects
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  } as any
  db = {} as any
}

export { auth, db }
export default app
