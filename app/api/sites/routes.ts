import { NextResponse } from "next/server"
import { getStorage } from "@/lib/storage"

// GET handler - Return all sites
export async function GET() {
  try {
    const storage = getStorage()
    const sites = await storage.getAllSites()

    return NextResponse.json(sites)
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}

// POST handler - Add a new site
export async function POST(request: Request) {
  try {
    const newSite = await request.json()
    const storage = getStorage()

    const site = await storage.addSite(newSite)
    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error("Error adding site:", error)
    return NextResponse.json({ error: "Failed to add site" }, { status: 500 })
  }
}

