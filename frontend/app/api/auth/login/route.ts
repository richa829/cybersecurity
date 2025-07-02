import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const userProfile = userDoc.data()

    // Get Firebase ID token
    const idToken = await user.getIdToken()

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email,
        ...userProfile,
      },
      token: idToken,
    })
  } catch (error: any) {
    console.error("Login error:", error)

    // Handle Firebase Auth errors
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
