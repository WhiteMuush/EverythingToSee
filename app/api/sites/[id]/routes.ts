import { NextResponse } from "next/server"
import { getStorage } from "@/lib/storage"

// PUT handler - Update a site
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedSiteData = await request.json()

    const storage = getStorage()
    const site = await storage.updateSite(id, updatedSiteData)

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 })
  }
}

// DELETE handler - Delete a site
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const storage = getStorage()
    const success = await storage.deleteSite(id)

    if (!success) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}

