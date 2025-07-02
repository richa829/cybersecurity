import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "user" | "auditor"
  companyId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Demo mode fallback for when Firebase is not configured
const DEMO_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key"

const DEMO_USERS = [
  {
    email: "admin@demo.com",
    password: "admin123",
    profile: {
      uid: "demo-admin",
      email: "admin@demo.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const,
      companyId: "demo-corp",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
]

export const signIn = async (email: string, password: string) => {
  try {
    if (DEMO_MODE) {
      // Demo mode authentication
      const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)
      if (!demoUser) {
        throw new Error("Invalid credentials")
      }

      // Store demo user in localStorage
      localStorage.setItem("demoUser", JSON.stringify(demoUser.profile))

      return {
        user: { uid: demoUser.profile.uid, email: demoUser.profile.email } as User,
        profile: demoUser.profile,
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists()) {
      return { user, profile: userDoc.data() as UserProfile }
    } else {
      throw new Error("User profile not found")
    }
  } catch (error: any) {
    if (DEMO_MODE && error.message === "Invalid credentials") {
      throw { code: "auth/wrong-password", message: "Invalid credentials" }
    }
    throw error
  }
}

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  companyId: string,
  role = "user",
) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - simulate user creation
      const newProfile: UserProfile = {
        uid: `demo-${Date.now()}`,
        email,
        firstName,
        lastName,
        role: role as UserProfile["role"],
        companyId: companyId || "demo-corp",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Store demo user in localStorage
      localStorage.setItem("demoUser", JSON.stringify(newProfile))

      return {
        user: { uid: newProfile.uid, email: newProfile.email } as User,
        profile: newProfile,
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      role: role as UserProfile["role"],
      companyId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return { user, profile: userProfile }
  } catch (error) {
    throw error
  }
}

export const signOut = async () => {
  try {
    if (DEMO_MODE) {
      localStorage.removeItem("demoUser")
      return
    }
    await firebaseSignOut(auth)
  } catch (error) {
    throw error
  }
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (DEMO_MODE) {
      const demoUser = localStorage.getItem("demoUser")
      if (demoUser) {
        const profile = JSON.parse(demoUser)
        resolve({ uid: profile.uid, email: profile.email } as User)
      } else {
        resolve(null)
      }
      return
    }

    // Only set up auth listener if Firebase is properly configured
    if (
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo-project"
    ) {
      resolve(null)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    } catch (error) {
      console.error("Auth state change error:", error)
      resolve(null)
    }
  })
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (DEMO_MODE) {
      const demoUser = localStorage.getItem("demoUser")
      if (demoUser) {
        return JSON.parse(demoUser)
      }
      // Return demo admin profile if no user in localStorage
      return DEMO_USERS[0].profile
    }

    // Only try Firestore if we have a valid Firebase config
    if (
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo-project"
    ) {
      return null
    }

    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error: any) {
    console.error("Error getting user profile:", error)

    // If it's a permissions error and we're in demo mode, return demo profile
    if (error.code === "permission-denied" || error.message?.includes("permissions")) {
      const demoUser = localStorage.getItem("demoUser")
      if (demoUser) {
        return JSON.parse(demoUser)
      }
      return DEMO_USERS[0].profile
    }

    return null
  }
}
