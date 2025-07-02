import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, doc, updateDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"
    const type = searchParams.get("type")
    const userId = searchParams.get("userId") || "admin-user" // Default for demo
    const companyId = searchParams.get("companyId") || "demo-corp"

    // Build Firestore query
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc"),
      limit(50),
    )

    const querySnapshot = await getDocs(notificationsQuery)
    let notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString(),
    }))

    // Apply client-side filters
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.isRead)
    }
    if (type) {
      notifications = notifications.filter((n) => n.type === type)
    }

    const summary = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      high: notifications.filter((n) => n.priority === "high").length,
      medium: notifications.filter((n) => n.priority === "medium").length,
      low: notifications.filter((n) => n.priority === "low").length,
    }

    return NextResponse.json({
      notifications,
      summary,
    })
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, isRead } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const notificationRef = doc(db, "notifications", id)
    await updateDoc(notificationRef, {
      isRead,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
