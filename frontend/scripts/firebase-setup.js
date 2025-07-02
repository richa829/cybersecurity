// Firebase Firestore Database Setup Script
// Run this script to initialize your Firestore database with the required collections and sample data

import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, addDoc } from "firebase/firestore"

// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample data setup
async function setupFirestoreData() {
  try {
    console.log("Setting up Firestore collections...")

    // Create companies collection
    const companyRef = doc(db, "companies", "demo-corp")
    await setDoc(companyRef, {
      name: "Demo Corporation",
      industry: "Technology",
      size: "Medium (50-200)",
      subscriptionTier: "professional",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create users collection
    const userRef = doc(db, "users", "admin-user")
    await setDoc(userRef, {
      email: "admin@demo.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      companyId: "demo-corp",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create assets collection
    const assetsData = [
      {
        id: "web-server-01",
        companyId: "demo-corp",
        name: "Web Server 01",
        type: "server",
        category: "web_server",
        ipAddress: "192.168.1.10",
        operatingSystem: "Ubuntu 22.04",
        criticality: "critical",
        status: "active",
        riskScore: 75,
        lastScan: new Date(),
        ownerId: "admin-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "database-server",
        companyId: "demo-corp",
        name: "Database Server",
        type: "server",
        category: "database",
        ipAddress: "192.168.1.11",
        operatingSystem: "CentOS 8",
        criticality: "critical",
        status: "active",
        riskScore: 45,
        lastScan: new Date(),
        ownerId: "admin-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "employee-laptop",
        companyId: "demo-corp",
        name: "Employee Laptop",
        type: "workstation",
        category: "endpoint",
        ipAddress: "192.168.1.100",
        operatingSystem: "Windows 11",
        criticality: "medium",
        status: "active",
        riskScore: 30,
        lastScan: new Date(),
        ownerId: "admin-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const asset of assetsData) {
      await setDoc(doc(db, "assets", asset.id), asset)
    }

    // Create threat logs collection
    const threatsData = [
      {
        companyId: "demo-corp",
        assetId: "database-server",
        threatType: "intrusion",
        severity: "critical",
        status: "investigating",
        title: "Suspicious Database Access",
        description: "Multiple failed login attempts detected from unknown IP addresses",
        source: "IDS",
        sourceIp: "203.0.113.45",
        assignedTo: "admin-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        companyId: "demo-corp",
        assetId: "web-server-01",
        threatType: "vulnerability",
        severity: "high",
        status: "open",
        title: "Outdated SSL Certificate",
        description: "SSL certificate expires in 7 days, immediate renewal required",
        source: "automated_scan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const threat of threatsData) {
      await addDoc(collection(db, "threatLogs"), threat)
    }

    // Create compliance frameworks
    const frameworksData = [
      {
        id: "iso-27001",
        name: "ISO 27001",
        description: "Information Security Management System standard",
        version: "2013",
        createdAt: new Date(),
      },
      {
        id: "soc-2",
        name: "SOC 2",
        description: "Service Organization Control 2 for service providers",
        version: "Type II",
        createdAt: new Date(),
      },
      {
        id: "gdpr",
        name: "GDPR",
        description: "General Data Protection Regulation",
        version: "2018",
        createdAt: new Date(),
      },
    ]

    for (const framework of frameworksData) {
      await setDoc(doc(db, "complianceFrameworks", framework.id), framework)
    }

    // Create compliance assessments
    const assessmentsData = [
      {
        companyId: "demo-corp",
        frameworkId: "iso-27001",
        controlId: "A.5.1.1",
        title: "Information Security Policy",
        status: "compliant",
        progress: 100,
        dueDate: new Date("2024-12-31"),
        assessorId: "admin-user",
        evidence: "Policy document reviewed and approved",
        notes: "Annual review completed successfully",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        companyId: "demo-corp",
        frameworkId: "iso-27001",
        controlId: "A.6.1.1",
        title: "Information Security Roles",
        status: "in_progress",
        progress: 65,
        dueDate: new Date("2024-08-15"),
        assessorId: "admin-user",
        evidence: "Role definitions in progress",
        notes: "Waiting for management approval",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const assessment of assessmentsData) {
      await addDoc(collection(db, "complianceAssessments"), assessment)
    }

    console.log("Firestore setup completed successfully!")
  } catch (error) {
    console.error("Error setting up Firestore:", error)
  }
}

// Run the setup
setupFirestoreData()
