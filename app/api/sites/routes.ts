import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Site } from "@/lib/types"
import { initialSites } from "@/lib/data"

// Path to our JSON file that will act as a simple database
const DB_PATH = path.join(process.cwd(), "data", "sites.json")

// Ensure the data directory exists
const ensureDirectoryExists = () => {
  const dir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Initialize the database if it doesn't exist
const initializeDatabase = () => {
  ensureDirectoryExists()

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialSites, null, 2))
  }
}

// Get all sites
const getSites = (): Site[] => {
  initializeDatabase()

  try {
    const data = fs.readFileSync(DB_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading sites:", error)
    return initialSites
  }
}

// Save sites to the database
const saveSites = (sites: Site[]) => {
  ensureDirectoryExists()

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(sites, null, 2))
    return true
  } catch (error) {
    console.error("Error saving sites:", error)
    return false
  }
}

// GET handler - Return all sites
export async function GET() {
  const sites = getSites()
  return NextResponse.json(sites)
}

// POST handler - Add a new site
export async function POST(request: Request) {
  try {
    const newSite = await request.json()
    const sites = getSites()

    // Add ID if not provided
    if (!newSite.id) {
      newSite.id = Date.now().toString()
    }

    // Add the new site
    sites.push(newSite)
    saveSites(sites)

    return NextResponse.json(newSite, { status: 201 })
  } catch (error) {
    console.error("Error adding site:", error)
    return NextResponse.json({ error: "Failed to add site" }, { status: 500 })
  }
}

