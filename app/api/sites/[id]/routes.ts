import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Site } from "@/lib/types"

// Path to our JSON file that will act as a simple database
const DB_PATH = path.join(process.cwd(), "data", "sites.json")

// Get all sites
const getSites = (): Site[] => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading sites:", error)
    return []
  }
}

// Save sites to the database
const saveSites = (sites: Site[]) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(sites, null, 2))
    return true
  } catch (error) {
    console.error("Error saving sites:", error)
    return false
  }
}

// PUT handler - Update a site
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedSite = await request.json()
    const sites = getSites()

    // Find and update the site
    const index = sites.findIndex((site) => site.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    // Update the site while preserving its ID
    sites[index] = { ...updatedSite, id }
    saveSites(sites)

    return NextResponse.json(sites[index])
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 })
  }
}

// DELETE handler - Delete a site
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const sites = getSites()

    // Filter out the site to delete
    const updatedSites = sites.filter((site) => site.id !== id)

    if (sites.length === updatedSites.length) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    saveSites(updatedSites)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 })
  }
}

