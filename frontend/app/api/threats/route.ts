import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, addDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity")
    const status = searchParams.get("status")
    const threatType = searchParams.get("type")
    const companyId = searchParams.get("companyId") || "demo-corp"

    // Build Firestore query
    const threatsQuery = query(
      collection(db, "threatLogs"),
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc"),
      limit(50),
    )

    const querySnapshot = await getDocs(threatsQuery)
    let threats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
    }))

    // Apply client-side filters (Firestore has limitations on compound queries)
    if (severity) {
      threats = threats.filter((threat) => threat.severity === severity)
    }
    if (status) {
      threats = threats.filter((threat) => threat.status === status)
    }
    if (threatType) {
      threats = threats.filter((threat) => threat.threatType === threatType)
    }

    // Calculate summary statistics
    const summary = {
      critical: threats.filter((t) => t.severity === "critical").length,
      high: threats.filter((t) => t.severity === "high").length,
      medium: threats.filter((t) => t.severity === "medium").length,
      low: threats.filter((t) => t.severity === "low").length,
      open: threats.filter((t) => t.status === "open").length,
      investigating: threats.filter((t) => t.status === "investigating").length,
      resolved: threats.filter((t) => t.status === "resolved").length,
    }

    return NextResponse.json({
      threats,
      total: threats.length,
      summary,
    })
  } catch (error) {
    console.error("Threats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const threatData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "threatType", "severity", "assetId"]
    for (const field of requiredFields) {
      if (!threatData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new threat document
    const newThreat = {
      ...threatData,
      companyId: threatData.companyId || "demo-corp",
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "threatLogs"), newThreat)

    return NextResponse.json(
      {
        id: docRef.id,
        ...newThreat,
        createdAt: newThreat.createdAt.toISOString(),
        updatedAt: newThreat.updatedAt.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create threat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
