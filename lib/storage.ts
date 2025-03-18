import type { Site } from "./types"
import { initialSites } from "./data"

// Interface for storage operations
export interface StorageInterface {
  getAllSites: () => Promise<Site[]>
  addSite: (site: Omit<Site, "id">) => Promise<Site>
  updateSite: (id: string, site: Omit<Site, "id">) => Promise<Site | null>
  deleteSite: (id: string) => Promise<boolean>
}

// KV Storage implementation
export class KVStorage implements StorageInterface {
  private kv: any
  private SITES_KEY = "streamverse:sites"
  private isAvailable: boolean

  constructor() {
    try {
      // Dynamic import to avoid build errors if KV is not available
      this.isAvailable = process.env.KV_REST_API_URL !== undefined && process.env.KV_REST_API_TOKEN !== undefined

      if (this.isAvailable) {
        // We'll import kv dynamically when needed
        console.log("KV storage is available")
      } else {
        console.log("KV storage is not available - missing environment variables")
      }
    } catch (error) {
      console.error("Error initializing KV storage:", error)
      this.isAvailable = false
    }
  }

  private async getKV() {
    if (!this.kv && this.isAvailable) {
      try {
        const { kv } = await import("@vercel/kv")
        this.kv = kv
      } catch (error) {
        console.error("Error importing KV:", error)
        this.isAvailable = false
        throw new Error("Failed to initialize KV storage")
      }
    }
    return this.kv
  }

  async getAllSites(): Promise<Site[]> {
    try {
      if (!this.isAvailable) {
        throw new Error("KV storage is not available")
      }

      const kv = await this.getKV()
      let sites = await kv.get<Site[]>(this.SITES_KEY)

      if (!sites) {
        sites = initialSites
        await kv.set(this.SITES_KEY, initialSites)
      }

      return sites
    } catch (error) {
      console.error("Error getting sites from KV:", error)
      throw error
    }
  }

  async addSite(site: Omit<Site, "id">): Promise<Site> {
    try {
      if (!this.isAvailable) {
        throw new Error("KV storage is not available")
      }

      const kv = await this.getKV()
      const sites = (await kv.get<Site[]>(this.SITES_KEY)) || []

      const newSite: Site = {
        ...site,
        id: Date.now().toString(),
      }

      sites.push(newSite)
      await kv.set(this.SITES_KEY, sites)

      return newSite
    } catch (error) {
      console.error("Error adding site to KV:", error)
      throw error
    }
  }

  async updateSite(id: string, site: Omit<Site, "id">): Promise<Site | null> {
    try {
      if (!this.isAvailable) {
        throw new Error("KV storage is not available")
      }

      const kv = await this.getKV()
      const sites = (await kv.get<Site[]>(this.SITES_KEY)) || []

      const index = sites.findIndex((s) => s.id === id)
      if (index === -1) return null

      const updatedSite: Site = { ...site, id }
      sites[index] = updatedSite

      await kv.set(this.SITES_KEY, sites)
      return updatedSite
    } catch (error) {
      console.error("Error updating site in KV:", error)
      throw error
    }
  }

  async deleteSite(id: string): Promise<boolean> {
    try {
      if (!this.isAvailable) {
        throw new Error("KV storage is not available")
      }

      const kv = await this.getKV()
      const sites = (await kv.get<Site[]>(this.SITES_KEY)) || []

      const newSites = sites.filter((site) => site.id !== id)
      if (newSites.length === sites.length) return false

      await kv.set(this.SITES_KEY, newSites)
      return true
    } catch (error) {
      console.error("Error deleting site from KV:", error)
      throw error
    }
  }
}

// LocalStorage implementation (for client-side and fallback)
export class LocalStorage implements StorageInterface {
  private STORAGE_KEY = "streamverse-sites"

  private getFromStorage(): Site[] {
    if (typeof window === "undefined") return initialSites

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialSites
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return initialSites
    }
  }

  private saveToStorage(sites: Site[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sites))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  async getAllSites(): Promise<Site[]> {
    return this.getFromStorage()
  }

  async addSite(site: Omit<Site, "id">): Promise<Site> {
    const sites = this.getFromStorage()

    const newSite: Site = {
      ...site,
      id: Date.now().toString(),
    }

    sites.push(newSite)
    this.saveToStorage(sites)

    return newSite
  }

  async updateSite(id: string, site: Omit<Site, "id">): Promise<Site | null> {
    const sites = this.getFromStorage()

    const index = sites.findIndex((s) => s.id === id)
    if (index === -1) return null

    const updatedSite: Site = { ...site, id }
    sites[index] = updatedSite

    this.saveToStorage(sites)
    return updatedSite
  }

  async deleteSite(id: string): Promise<boolean> {
    const sites = this.getFromStorage()

    const newSites = sites.filter((site) => site.id !== id)
    if (newSites.length === sites.length) return false

    this.saveToStorage(newSites)
    return true
  }
}

// Factory function to get the appropriate storage implementation
export function getStorage(): StorageInterface {
  // For server components, try KV first, then fallback to localStorage
  if (typeof window === "undefined") {
    try {
      const kvStorage = new KVStorage()
      return kvStorage
    } catch (error) {
      console.error("Failed to initialize KV storage, falling back to localStorage:", error)
      return new LocalStorage()
    }
  }

  // For client components, always use localStorage
  return new LocalStorage()
}

