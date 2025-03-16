import { kv } from "@vercel/kv"
import type { Site } from "./types"
import { initialSites } from "./data"

// Key for storing all sites in KV store
const SITES_KEY = "streamverse:sites"

// Initialize the KV store with initial sites if empty
export async function initializeKV() {
  const sites = await kv.get<Site[]>(SITES_KEY)

  if (!sites || sites.length === 0) {
    await kv.set(SITES_KEY, initialSites)
    return initialSites
  }

  return sites
}

// Get all sites from KV store
export async function getAllSites(): Promise<Site[]> {
  const sites = await kv.get<Site[]>(SITES_KEY)

  if (!sites) {
    return await initializeKV()
  }

  return sites
}

// Add a new site to KV store
export async function addSite(site: Omit<Site, "id">): Promise<Site> {
  const sites = await getAllSites()
  const newSite: Site = {
    ...site,
    id: Date.now().toString(),
  }

  sites.push(newSite)
  await kv.set(SITES_KEY, sites)

  return newSite
}

// Update an existing site in KV store
export async function updateSite(id: string, site: Omit<Site, "id">): Promise<Site | null> {
  const sites = await getAllSites()
  const index = sites.findIndex((s) => s.id === id)

  if (index === -1) {
    return null
  }

  const updatedSite: Site = {
    ...site,
    id,
  }

  sites[index] = updatedSite
  await kv.set(SITES_KEY, sites)

  return updatedSite
}

// Delete a site from KV store
export async function deleteSite(id: string): Promise<boolean> {
  const sites = await getAllSites()
  const filteredSites = sites.filter((site) => site.id !== id)

  if (filteredSites.length === sites.length) {
    return false
  }

  await kv.set(SITES_KEY, filteredSites)
  return true
}

