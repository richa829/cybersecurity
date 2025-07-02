import { type NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const framework = searchParams.get("framework")
    const status = searchParams.get("status")
    const companyId = searchParams.get("companyId") || "demo-corp"

    // Get compliance assessments
    const assessmentsQuery = query(collection(db, "complianceAssessments"), where("companyId", "==", companyId))

    const assessmentsSnapshot = await getDocs(assessmentsQuery)
    let assessments = assessmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate?.()?.toISOString(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
    }))

    // Apply filters
    if (framework) {
      assessments = assessments.filter((a) => a.frameworkId?.toLowerCase() === framework.toLowerCase())
    }
    if (status) {
      assessments = assessments.filter((a) => a.status === status)
    }

    // Get frameworks
    const frameworksSnapshot = await getDocs(collection(db, "complianceFrameworks"))
    const frameworks = frameworksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Calculate summary statistics
    const summary = {
      total: assessments.length,
      compliant: assessments.filter((a) => a.status === "compliant").length,
      inProgress: assessments.filter((a) => a.status === "in_progress").length,
      notStarted: assessments.filter((a) => a.status === "not_started").length,
      nonCompliant: assessments.filter((a) => a.status === "non_compliant").length,
      overallProgress:
        assessments.length > 0
          ? Math.round(assessments.reduce((sum, a) => sum + (a.progress || 0), 0) / assessments.length)
          : 0,
    }

    return NextResponse.json({
      assessments,
      frameworks,
      summary,
    })
  } catch (error) {
    console.error("Compliance API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, evidence, notes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const assessmentRef = doc(db, "complianceAssessments", id)
    const assessmentDoc = await getDoc(assessmentRef)

    if (!assessmentDoc.exists()) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    // Update assessment
    const updateData = {
      status,
      evidence,
      notes,
      lastAssessment: new Date(),
      updatedAt: new Date(),
      progress: status === "compliant" ? 100 : status === "in_progress" ? 50 : 0,
    }

    await updateDoc(assessmentRef, updateData)

    const updatedDoc = await getDoc(assessmentRef)
    const updatedData = updatedDoc.data()

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedData,
      dueDate: updatedData?.dueDate?.toDate?.()?.toISOString(),
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString(),
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString(),
      lastAssessment: updatedData?.lastAssessment?.toDate?.()?.toISOString(),
    })
  } catch (error) {
    console.error("Update compliance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
