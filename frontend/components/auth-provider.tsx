"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserProfile, type UserProfile } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const DEMO_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (DEMO_MODE) {
          // Demo mode - check localStorage
          const demoUser = localStorage.getItem("demoUser")
          if (demoUser) {
            const userProfile = JSON.parse(demoUser)
            setUser({ uid: userProfile.uid, email: userProfile.email } as User)
            setProfile(userProfile)
          }
          setLoading(false)
          return
        }

        // Only set up Firebase auth if properly configured
        if (
          !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo-project"
        ) {
          setLoading(false)
          return
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user)

          if (user) {
            try {
              // Get user profile from Firestore
              const userProfile = await getUserProfile(user.uid)
              setProfile(userProfile)
            } catch (error) {
              console.error("Error loading user profile:", error)
              setProfile(null)
            }
          } else {
            setProfile(null)
          }

          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error("Auth initialization error:", error)
        setLoading(false)
      }
    }

    const cleanup = initializeAuth()

    return () => {
      if (cleanup && typeof cleanup.then === "function") {
        cleanup.then((unsubscribe) => {
          if (typeof unsubscribe === "function") {
            unsubscribe()
          }
        })
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
}
