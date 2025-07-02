import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const criticality = searchParams.get("criticality")
    const companyId = searchParams.get("companyId") || "demo-corp" // Default for demo

    // Build Firestore query
    let assetsQuery = query(collection(db, "assets"), where("companyId", "==", companyId), orderBy("createdAt", "desc"))

    if (type) {
      assetsQuery = query(assetsQuery, where("type", "==", type))
    }

    if (criticality) {
      assetsQuery = query(assetsQuery, where("criticality", "==", criticality))
    }

    const querySnapshot = await getDocs(assetsQuery)
    const assets = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
      lastScan: doc.data().lastScan?.toDate?.()?.toISOString(),
    }))

    return NextResponse.json({
      assets,
      total: assets.length,
    })
  } catch (error) {
    console.error("Assets API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const assetData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "type", "criticality"]
    for (const field of requiredFields) {
      if (!assetData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new asset document
    const newAsset = {
      ...assetData,
      companyId: assetData.companyId || "demo-corp",
      status: "active",
      riskScore: 0,
      lastScan: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "assets"), newAsset)

    return NextResponse.json(
      {
        id: docRef.id,
        ...newAsset,
        createdAt: newAsset.createdAt.toISOString(),
        updatedAt: newAsset.updatedAt.toISOString(),
        lastScan: newAsset.lastScan.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create asset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
